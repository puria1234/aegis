export default function TermsPage() {
  return (
    <html>
      <head>
        <title>Terms of Service — Aegis</title>
      </head>
      <body>
        <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:'68px', borderBottom:'1px solid #141414' }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
            <img src="/favicon.png" width="24" height="24" alt="AEGIS" />
            <span style={{ fontSize:'18px', fontWeight:'900', letterSpacing:'-0.02em', color:'#fff' }}>Aegis</span>
          </a>
          <a href="/" style={{ fontSize:'13px', color:'#555', textDecoration:'none' }}>← Back</a>
        </nav>
        <main style={{ maxWidth:'760px', margin:'0 auto', padding:'80px 24px' }}>
          <h1 style={{ fontSize:'40px', fontWeight:'900', letterSpacing:'-0.03em', marginBottom:'8px' }}>Terms of Service</h1>
          <div style={{ fontSize:'14px', color:'#555', marginBottom:'56px' }}>Last updated: March 2026</div>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>1. Acceptance of Terms</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>By accessing or using Aegis, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>2. Use of Service</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis is a warranty tracking tool for personal and household use. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>3. Your Account</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>4. Data & Privacy</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Your warranty data is stored securely and is not shared with third parties. Please review our <a href="/privacy" style={{ color:'#888' }}>Privacy Policy</a> for full details on how we handle your information.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>5. Limitation of Liability</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis is provided "as is" without warranty of any kind. We are not responsible for any warranty claims, missed expirations, or losses arising from use of the service. Aegis is a tracking tool only — always consult original warranty documentation for legal coverage.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>6. Changes to Terms</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>We reserve the right to update these terms at any time. Continued use of Aegis after changes constitutes your acceptance of the new terms.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>7. Contact</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>For any questions regarding these terms, please contact us at <a href="mailto:theaegisofficial@protonmail.com" style={{ color:'#888', textDecoration:'none' }}>theaegisofficial@protonmail.com</a>.</p>
        </main>
        <footer style={{ textAlign:'center', padding:'40px 24px', borderTop:'1px solid #141414', fontSize:'12px', color:'#333' }}>
          &copy; 2026 Aegis. All rights reserved.
        </footer>
      </body>
    </html>
  );
}