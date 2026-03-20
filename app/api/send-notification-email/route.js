import { NextResponse } from 'next/server';
import tls from 'tls';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const SMTP_HOST = process.env.AGENTMAIL_SMTP_HOST || 'smtp.agentmail.to';
const SMTP_PORT = Number(process.env.AGENTMAIL_SMTP_PORT || 465);
const SMTP_USER = process.env.AGENTMAIL_SMTP_USER || 'theaegis@agentmail.to';
const SMTP_PASS = process.env.AGENTMAIL_SMTP_PASS || '';
const SMTP_FROM = process.env.AGENTMAIL_FROM || SMTP_USER;
const APP_BASE_URL = process.env.APP_BASE_URL || '';

let logoDataUriPromise = null;

function escapeHtml(v = '') {
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

async function getEmbeddedLogoDataUri() {
  if (!logoDataUriPromise) {
    logoDataUriPromise = (async () => {
      try {
        const buf = await readFile(path.join(process.cwd(), 'public', 'favicon.png'));
        return `data:image/png;base64,${buf.toString('base64')}`;
      } catch { return ''; }
    })();
  }
  return logoDataUriPromise;
}

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

async function sendEmailViaAgentmail({ to, subject, html }) {
  const socket = tls.connect({ host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST });
  await new Promise((res, rej) => { socket.once('secureConnect', res); socket.once('error', rej); });
  try {
    const g = await readSmtpResponse(socket);
    if (g.code !== 220) throw new Error(`SMTP greeting: ${g.text}`);
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
    if (sr.code !== 250) throw new Error(`SMTP send: ${sr.text}`);
    try { await smtpCommand(socket, 'QUIT', [221]); } catch { /* ok */ }
  } finally { socket.end(); }
}

export async function POST(request) {
  try {
    const { to, name, daysBefore, warranties = [] } = await request.json();
    if (!to)        return NextResponse.json({ error: 'Missing recipient email.' }, { status: 400 });
    if (!SMTP_PASS) return NextResponse.json({ error: 'SMTP not configured.' },    { status: 500 });

    const safeName       = escapeHtml(name || 'there');
    const safeDays       = Number(daysBefore) || 30;
    const safeWarranties = Array.isArray(warranties) ? warranties.slice(0, 10) : [];
    const baseUrl        = APP_BASE_URL ? escapeHtml(APP_BASE_URL.replace(/\/$/, '')) : '';
    const logoSrc        = baseUrl ? `${baseUrl}/favicon.png` : await getEmbeddedLogoDataUri();

    // ── Status helper ────────────────────────────────────────────────────────────
    function statusMeta(days) {
      if (days === null)    return { color: '#888888', label: 'Unknown',  text: '—' };
      if (days < 0)         return { color: '#ef4444', label: 'Expired',  text: `${Math.abs(days)}d ago` };
      if (days <= safeDays) return { color: '#f59e0b', label: 'Expiring', text: `${days}d left` };
      return                       { color: '#4ade80', label: 'Active',   text: `${days}d left` };
    }

    // ── Warranty rows ────────────────────────────────────────────────────────────
    const warrantyRows = safeWarranties.length
      ? safeWarranties.map(w => {
          const prod    = escapeHtml(w.productName || 'Unknown product');
          const brand   = w.brand ? escapeHtml(w.brand) : '';
          const expires = escapeHtml(w.expiryDate || '—');
          const days    = Number.isFinite(w.daysRemaining) ? w.daysRemaining : null;
          const s       = statusMeta(days);
          return `
            <tr>
              <td style="padding:0 0 8px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#2a2a2a;border-radius:10px;border-collapse:separate;">
                  <tr>
                    <td style="padding:12px 14px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-size:13px;font-weight:700;color:#f0f0f0;font-family:Inter,Arial,sans-serif;">${prod}${brand ? `<span style="font-weight:400;color:#777;font-size:12px;"> &middot; ${brand}</span>` : ''}</td>
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

    // ── Logo markup ──────────────────────────────────────────────────────────────
    const logoImg = logoSrc
      ? `<img src="${logoSrc}" width="44" height="44" alt="Aegis" style="display:block;margin:0 auto;width:44px;height:44px;border-radius:11px;" />`
      : `<div style="width:44px;height:44px;background:#333;border-radius:11px;margin:0 auto;text-align:center;line-height:44px;font-size:18px;font-weight:900;color:#fff;font-family:Inter,Arial,sans-serif;">A</div>`;

    // ── CTA button ───────────────────────────────────────────────────────────────
    const ctaBtn = baseUrl
      ? `<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
           <tr>
             <td align="center" bgcolor="#ffffff" style="background:#ffffff;border-radius:100px;padding:0;">
               <a href="${baseUrl}/app" style="display:inline-block;padding:14px 48px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;white-space:nowrap;font-family:Inter,Arial,Helvetica,sans-serif;letter-spacing:0.01em;">Open Aegis</a>
             </td>
           </tr>
         </table>`
      : '';

    const subject = 'Aegis — Warranty reminders enabled';

    const html = `<!doctype html>
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

  /* Light mode overrides */
  @media (prefers-color-scheme:light) {
    .outer-bg   { background-color:#e8e8e8 !important; }
    .card       { background-color:#ffffff !important; }
    .title      { color:#000000 !important; }
    .body-p     { color:#444444 !important; }
    .small-p    { color:#888888 !important; }
    .w-row      { background-color:#f0f0f0 !important; }
    .w-name     { color:#111111 !important; }
    .w-sub      { color:#999999 !important; }
    .footer-p   { color:#aaaaaa !important; }
    .footer-a   { color:#888888 !important; }
    .divider    { background-color:#e0e0e0 !important; }
  }

  @media only screen and (max-width:580px) {
    .card   { width:100% !important; border-radius:0 !important; }
    .padded { padding-left:24px !important; padding-right:24px !important; }
    .title  { font-size:22px !important; }
  }
</style>
</head>
<body class="outer-bg" style="margin:0;padding:0;background-color:#000000;font-family:Inter,Arial,Helvetica,sans-serif;" bgcolor="#000000">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;color:#000;font-size:1px;">Aegis warranty reminders are now active. We&rsquo;ll alert you ${safeDays} days before anything expires.&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000;">
  <tr>
    <td align="center" style="padding:48px 16px 56px;">

      <!-- Card -->
      <table class="card" width="480" cellpadding="0" cellspacing="0" border="0" bgcolor="#1c1c1c" style="background-color:#1c1c1c;border-radius:18px;width:480px;">

        <!-- Logo -->
        <tr>
          <td class="padded" align="center" style="padding:36px 40px 20px;">
            ${logoImg}
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td class="padded" align="center" style="padding:0 40px 16px;">
            <div class="title" style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;line-height:1.2;text-align:center;font-family:Inter,Arial,sans-serif;">Warranty Reminders Enabled</div>
          </td>
        </tr>

        <!-- Body text -->
        <tr>
          <td class="padded" align="center" style="padding:0 40px 24px;">
            <div class="body-p" style="font-size:14px;color:#888888;line-height:1.6;font-family:Inter,Arial,sans-serif;text-align:center;">
              Hi ${safeName},<br/><br/>
              Your Aegis email reminders are now active. We&rsquo;ll send you an alert <strong style="color:#cccccc;font-weight:600;">${safeDays} days before</strong> any warranty is about to expire, so you&rsquo;re never caught off guard.
            </div>
          </td>
        </tr>

        <!-- Warranties (if any) -->
        ${safeWarranties.length ? `
        <tr>
          <td class="padded" style="padding:0 40px 20px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#444;margin-bottom:10px;font-family:Inter,Arial,sans-serif;">Expiring within ${safeDays} days</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${warrantyRows}
            </table>
          </td>
        </tr>` : ''}

        <!-- CTA button -->
        <tr>
          <td class="padded" align="center" style="padding:${safeWarranties.length ? '4px' : '0'} 40px 28px;">
            ${ctaBtn}
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td class="divider" style="background-color:#2a2a2a;height:1px;font-size:0;line-height:0;margin:0 40px;">&nbsp;</td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="padded" align="center" style="padding:20px 40px 28px;">
            <div class="small-p" style="font-size:12px;color:#555555;line-height:1.6;font-family:Inter,Arial,sans-serif;text-align:center;margin-bottom:10px;">
              If you didn&rsquo;t set this up, you can safely ignore this email.<br/>
              Manage reminders anytime in Aegis &rarr; Settings &rarr; Notifications.
            </div>
            <div class="footer-p" style="font-size:11px;color:#3a3a3a;font-family:Inter,Arial,sans-serif;text-align:center;">
              &copy; 2026 Aegis &nbsp;&middot;&nbsp;
              ${baseUrl ? `<a href="${baseUrl}/privacy" class="footer-a" style="color:#444;text-decoration:none;font-family:Inter,Arial,sans-serif;">Privacy</a>` : 'Privacy'}
              &nbsp;&middot;&nbsp;
              ${baseUrl ? `<a href="${baseUrl}/terms" class="footer-a" style="color:#444;text-decoration:none;font-family:Inter,Arial,sans-serif;">Terms</a>` : 'Terms'}
            </div>
          </td>
        </tr>

      </table><!-- /card -->
    </td>
  </tr>
</table>

</body>
</html>`;

    await sendEmailViaAgentmail({ to, subject, html });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('send-notification-email error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send email.' }, { status: 500 });
  }
}
