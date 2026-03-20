import { NextResponse } from 'next/server';
import tls from 'tls';
import { adminDb } from '../../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const runtime = 'nodejs';

// ── SMTP (same config as send-notification-email) ────────────────────────────
const SMTP_HOST = process.env.AGENTMAIL_SMTP_HOST || 'smtp.agentmail.to';
const SMTP_PORT = Number(process.env.AGENTMAIL_SMTP_PORT || 465);
const SMTP_USER = process.env.AGENTMAIL_SMTP_USER || 'theaegis@agentmail.to';
const SMTP_PASS = process.env.AGENTMAIL_SMTP_PASS || '';
const SMTP_FROM = process.env.AGENTMAIL_FROM || SMTP_USER;
const APP_BASE_URL = process.env.APP_BASE_URL || '';

// ── Helpers ───────────────────────────────────────────────────────────────────
function escapeHtml(v = '') {
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function daysRemaining(expiryDateStr) {
  if (!expiryDateStr) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.round((new Date(expiryDateStr + 'T00:00:00') - today) / 86400000);
}

// ── SMTP low-level ────────────────────────────────────────────────────────────
function readSmtpResponse(socket, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const lines = [];
    const cleanup = () => { clearTimeout(timer); socket.off('data', onData); socket.off('error', onError); socket.off('close', onClose); };
    const maybeResolve = () => {
      if (!lines.length) return;
      const m = lines[0].match(/^(\d{3})([\s-])/);
      if (!m) return;
      if (!new RegExp(`^${m[1]} `).test(lines[lines.length-1])) return;
      cleanup(); resolve({ code: Number(m[1]), text: lines.join('\n') });
    };
    const onData = (chunk) => {
      buffer += chunk.toString('utf8');
      let i = buffer.indexOf('\r\n');
      while (i !== -1) { const l = buffer.slice(0,i); buffer = buffer.slice(i+2); if (l) lines.push(l); maybeResolve(); i = buffer.indexOf('\r\n'); }
    };
    const onError = (e) => { cleanup(); reject(e); };
    const onClose = () => { cleanup(); reject(new Error('SMTP closed')); };
    const timer = setTimeout(() => { cleanup(); reject(new Error('SMTP timeout')); }, timeoutMs);
    socket.on('data', onData); socket.on('error', onError); socket.on('close', onClose);
  });
}

async function smtpCommand(socket, cmd, ok) {
  socket.write(`${cmd}\r\n`);
  const r = await readSmtpResponse(socket);
  if (!ok.includes(r.code)) throw new Error(`SMTP error (${cmd}): ${r.text}`);
  return r;
}

async function sendEmail({ to, subject, html }) {
  const socket = tls.connect({ host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST });
  await new Promise((res, rej) => { socket.once('secureConnect', res); socket.once('error', rej); });
  try {
    const g = await readSmtpResponse(socket);
    if (g.code !== 220) throw new Error(`Greeting: ${g.text}`);
    await smtpCommand(socket, 'EHLO aegis.app', [250]);
    await smtpCommand(socket, 'AUTH LOGIN', [334]);
    await smtpCommand(socket, Buffer.from(SMTP_USER).toString('base64'), [334]);
    await smtpCommand(socket, Buffer.from(SMTP_PASS).toString('base64'), [235]);
    await smtpCommand(socket, `MAIL FROM:<${SMTP_FROM}>`, [250]);
    await smtpCommand(socket, `RCPT TO:<${to}>`, [250, 251]);
    await smtpCommand(socket, 'DATA', [354]);
    const payload = [`From: Aegis <${SMTP_FROM}>`, `To: ${to}`, `Subject: ${subject}`, 'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', html].join('\r\n');
    socket.write(`${payload}\r\n.\r\n`);
    const sr = await readSmtpResponse(socket);
    if (sr.code !== 250) throw new Error(`Send failed: ${sr.text}`);
    try { await smtpCommand(socket, 'QUIT', [221]); } catch { /* ok */ }
  } finally { socket.end(); }
}

// ── Email HTML builder ────────────────────────────────────────────────────────
function buildReminderEmail({ name, daysBefore, warranties, baseUrl, logoSrc }) {
  const safeName = escapeHtml(name || 'there');
  const safeDays = Number(daysBefore) || 30;

  function statusMeta(days) {
    if (days === null)    return { color: '#888', label: 'Unknown',  text: '—' };
    if (days < 0)         return { color: '#ef4444', label: 'Expired',  text: `${Math.abs(days)}d ago` };
    if (days <= safeDays) return { color: '#f59e0b', label: 'Expiring', text: `${days}d left` };
    return                       { color: '#4ade80', label: 'Active',   text: `${days}d left` };
  }

  const logoImg = logoSrc
    ? `<img src="${logoSrc}" width="44" height="44" alt="Aegis" style="display:block;margin:0 auto;width:44px;height:44px;border-radius:11px;" />`
    : `<div style="width:44px;height:44px;background:#333;border-radius:11px;margin:0 auto;text-align:center;line-height:44px;font-size:18px;font-weight:900;color:#fff;font-family:Inter,Arial,sans-serif;">A</div>`;

  const ctaBtn = baseUrl
    ? `<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
         <tr>
           <td align="center" bgcolor="#ffffff" style="background:#ffffff;border-radius:100px;padding:0;">
             <a href="${baseUrl}/app" style="display:inline-block;padding:14px 48px;font-size:14px;font-weight:700;color:#000;text-decoration:none;white-space:nowrap;font-family:Inter,Arial,sans-serif;">Open Aegis</a>
           </td>
         </tr>
       </table>`
    : '';

  const privacyHref = baseUrl ? `${baseUrl}/privacy` : '#';
  const termsHref   = baseUrl ? `${baseUrl}/terms`   : '#';

  const warrantyRows = warranties.length
    ? warranties.map(w => {
        const prod    = escapeHtml(w.productName || 'Unknown');
        const brand   = w.brand ? escapeHtml(w.brand) : '';
        const expires = escapeHtml(w.expiryDate || '—');
        const s       = statusMeta(w.daysRemaining);
        return `
          <tr>
            <td style="padding:0 0 8px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#2a2a2a;border-radius:10px;border-collapse:separate;">
                <tr>
                  <td style="padding:12px 14px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:13px;font-weight:700;color:#f0f0f0;font-family:Inter,Arial,sans-serif;">${prod}${brand ? `<span style="font-weight:400;color:#777;"> &middot; ${brand}</span>` : ''}</td>
                        <td style="text-align:right;white-space:nowrap;padding-left:8px;font-size:11px;font-weight:700;color:${s.color};font-family:Inter,Arial,sans-serif;">${s.text}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:4px;font-size:11px;color:#666;font-family:Inter,Arial,sans-serif;">Expires ${expires} &middot; <span style="color:${s.color};">${s.label}</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
      }).join('')
    : `<tr><td style="padding:0 0 8px 0;">
         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#2a2a2a;border-radius:10px;border-collapse:separate;">
           <tr><td style="padding:14px;font-size:13px;color:#666;text-align:center;font-family:Inter,Arial,sans-serif;">No warranties expiring in the next ${safeDays} days.</td></tr>
         </table>
       </td></tr>`;

  const count = warranties.length;
  const titleText = count > 0
    ? `${count} Warrant${count === 1 ? 'y' : 'ies'} Expiring Soon`
    : 'Warranty Check-In';

  const bodyText = count > 0
    ? `Hi <strong style="color:#ccc;font-weight:600;">${safeName}</strong> — you have <strong style="color:#f59e0b;font-weight:600;">${count} warrant${count === 1 ? 'y' : 'ies'}</strong> expiring within the next <strong style="color:#ccc;font-weight:600;">${safeDays} days</strong>. Don&rsquo;t let them slip by.`
    : `Hi <strong style="color:#ccc;font-weight:600;">${safeName}</strong> — your warranties are all clear. Nothing is expiring within the next <strong style="color:#ccc;font-weight:600;">${safeDays} days</strong>.`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light dark"/>
<meta name="supported-color-schemes" content="light dark"/>
<title>Aegis</title>
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  img{border:0;outline:none;text-decoration:none;display:block;}
  @media (prefers-color-scheme:light) {
    .outer-bg{background-color:#e8e8e8!important;}
    .card{background-color:#ffffff!important;}
    .title{color:#000000!important;}
    .body-p{color:#444444!important;}
    .small-p{color:#888888!important;}
    .w-row{background-color:#f0f0f0!important;}
    .footer-p{color:#aaaaaa!important;}
    .footer-a{color:#888888!important;}
    .divider{background-color:#e0e0e0!important;}
  }
  @media only screen and (max-width:580px){
    .card{width:100%!important;border-radius:0!important;}
    .padded{padding-left:24px!important;padding-right:24px!important;}
    .title{font-size:20px!important;}
  }
</style>
</head>
<body class="outer-bg" style="margin:0;padding:0;background-color:#000;font-family:Inter,Arial,Helvetica,sans-serif;" bgcolor="#000000">
<div style="display:none;max-height:0;overflow:hidden;color:#000;font-size:1px;">${count > 0 ? `${count} warrant${count===1?'y':'ies'} expiring within ${safeDays} days` : 'Your warranties are all clear'} — open Aegis to review.&#8203;&#8203;&#8203;&#8203;</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000;">
  <tr>
    <td align="center" style="padding:48px 16px 56px;">
      <table class="card" width="480" cellpadding="0" cellspacing="0" border="0" bgcolor="#1c1c1c" style="background-color:#1c1c1c;border-radius:18px;width:480px;">
        <tr>
          <td class="padded" align="center" style="padding:36px 40px 20px;">${logoImg}</td>
        </tr>
        <tr>
          <td class="padded" align="center" style="padding:0 40px 16px;">
            <div class="title" style="font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1.2;text-align:center;font-family:Inter,Arial,sans-serif;">${titleText}</div>
          </td>
        </tr>
        <tr>
          <td class="padded" align="center" style="padding:0 40px 24px;">
            <div class="body-p" style="font-size:14px;color:#888;line-height:1.6;font-family:Inter,Arial,sans-serif;text-align:center;">${bodyText}</div>
          </td>
        </tr>
        <tr>
          <td class="padded" style="padding:0 40px 20px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#444;margin-bottom:10px;font-family:Inter,Arial,sans-serif;">Expiring within ${safeDays} days</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">${warrantyRows}</table>
          </td>
        </tr>
        <tr>
          <td class="padded" align="center" style="padding:4px 40px 28px;">${ctaBtn}</td>
        </tr>
        <tr>
          <td class="divider" style="background-color:#2a2a2a;height:1px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td class="padded" align="center" style="padding:20px 40px 28px;">
            <div class="small-p" style="font-size:12px;color:#555;line-height:1.6;font-family:Inter,Arial,sans-serif;text-align:center;margin-bottom:10px;">
              You&rsquo;re receiving this because you enabled email reminders in Aegis.<br/>
              Manage reminders anytime in Aegis &rarr; Settings &rarr; Notifications.
            </div>
            <div class="footer-p" style="font-size:11px;color:#3a3a3a;font-family:Inter,Arial,sans-serif;text-align:center;">
              &copy; 2026 Aegis &nbsp;&middot;&nbsp;
              <a href="${privacyHref}" class="footer-a" style="color:#444;text-decoration:none;">Privacy</a>
              &nbsp;&middot;&nbsp;
              <a href="${termsHref}" class="footer-a" style="color:#444;text-decoration:none;">Terms</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(request) {
  // 1. Verify cron secret
  const secret = request.headers.get('x-cron-secret');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!SMTP_PASS) {
    return NextResponse.json({ error: 'SMTP not configured' }, { status: 500 });
  }

  const baseUrl  = APP_BASE_URL ? APP_BASE_URL.replace(/\/$/, '') : '';
  const logoSrc  = baseUrl ? `${baseUrl}/favicon.png` : '';
  const today    = new Date(); today.setHours(0,0,0,0);

  const results = { sent: 0, skipped: 0, errors: [] };

  try {
    // 2. Load all users with email notifications enabled
    const usersSnap = await adminDb
      .collection('users')
      .where('notificationPrefs.enabled', '==', true)
      .where('notificationPrefs.channel', '==', 'email')
      .get();

    if (usersSnap.empty) {
      return NextResponse.json({ message: 'No users with email reminders enabled.', ...results });
    }

    // 3. Process each user
    for (const userDoc of usersSnap.docs) {
      const uid      = userDoc.id;
      const profile  = userDoc.data();
      const email    = profile.email;
      const name     = profile.name || email?.split('@')[0] || 'there';
      const daysBefore = profile.notificationPrefs?.daysBefore || 30;

      if (!email) { results.skipped++; continue; }

      try {
        // 4. Fetch this user's warranties
        const warrantiesSnap = await adminDb
          .collection('warranties')
          .where('userId', '==', uid)
          .get();

        // 5. Filter to ones expiring within their window (and not already expired)
        const expiring = warrantiesSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .map(w => ({ ...w, daysRemaining: daysRemaining(w.expiryDate) }))
          .filter(w => w.daysRemaining !== null && w.daysRemaining >= 0 && w.daysRemaining <= daysBefore)
          .sort((a, b) => a.daysRemaining - b.daysRemaining)
          .slice(0, 10);

        // 6. Skip if nothing is expiring
        if (expiring.length === 0) { results.skipped++; continue; }

        // 7. Build and send the email
        const html = buildReminderEmail({ name, daysBefore, warranties: expiring, baseUrl, logoSrc });
        const count = expiring.length;
        const subject = `Aegis — ${count} warrant${count === 1 ? 'y' : 'ies'} expiring within ${daysBefore} days`;

        await sendEmail({ to: email, subject, html });
        results.sent++;

        // 8. Record last reminder sent timestamp
        await adminDb.collection('users').doc(uid).update({
          lastReminderSentAt: FieldValue.serverTimestamp(),
        });

      } catch (userErr) {
        results.errors.push({ uid, error: userErr.message });
      }
    }

    return NextResponse.json({
      message: `Done. Sent: ${results.sent}, Skipped (nothing expiring): ${results.skipped}, Errors: ${results.errors.length}`,
      ...results,
    });

  } catch (err) {
    console.error('Cron send-reminders error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
