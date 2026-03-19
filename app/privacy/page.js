export default function PrivacyPage() {
  return (
    <html>
      <head>
        <title>Privacy Policy — Aegis</title>
      </head>
      <body>
        <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:'68px', borderBottom:'1px solid #141414' }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
            <img src="/favicon.png" width="24" height="24" alt="AEGIS" />
            <span style={{ fontSize:'15px', fontWeight:'800', letterSpacing:'0.15em', textTransform:'uppercase', color:'#fff', lineHeight:1 }}>Aegis</span>
          </a>
          <a href="/" style={{ fontSize:'13px', color:'#555', textDecoration:'none' }}>← Back</a>
        </nav>
        <main style={{ maxWidth:'760px', margin:'0 auto', padding:'80px 24px' }}>
          <h1 style={{ fontSize:'40px', fontWeight:'900', letterSpacing:'-0.03em', marginBottom:'8px' }}>Privacy Policy</h1>
          <div style={{ fontSize:'14px', color:'#555', marginBottom:'56px' }}>Last updated: March 2026</div>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>1. Information We Collect</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>We collect the information you provide when creating an account (email address and password) and the warranty data you choose to enter (product names, dates, prices, retailers, and notes).</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>2. How We Use Your Information</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Your information is used solely to operate the Aegis warranty tracking service — to authenticate your account, store your warranty records, and send expiry notifications if you enable them. We do not use your data for advertising or sell it to third parties.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>3. Data Storage & Security</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>All data transmitted between your device and Aegis is encrypted in transit using TLS (Transport Layer Security). Account passwords are never stored in plain text — they are processed through a cryptographic one-way hashing algorithm with per-account salting before being written to storage, making them unrecoverable even in the event of unauthorized access. Session credentials are issued as cryptographically signed tokens with a fixed expiration window and are never stored server-side.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>4. Data Retention</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Your data is retained as long as your account exists. You may delete individual warranties at any time from within the app. To request full account deletion, email us at theaegisofficial@protonmail.com.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>5. Cookies & Local Storage</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis uses browser localStorage solely to store your authentication token so you remain signed in between sessions. No tracking cookies or third-party analytics are used.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>6. Third-Party Services</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis does not integrate with third-party advertising, analytics, or tracking services. No personal data is shared with or sold to any external parties.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>7. Changes to This Policy</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>8. Contact</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:theaegisofficial@protonmail.com" style={{ color:'#888', textDecoration:'none' }}>theaegisofficial@protonmail.com</a>.</p>
        </main>
        <footer style={{ textAlign:'center', padding:'40px 24px', borderTop:'1px solid #141414', fontSize:'12px', color:'#333' }}>
          &copy; 2026 Aegis. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
