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
            <span style={{ fontSize:'15px', fontWeight:'800', letterSpacing:'0.15em', textTransform:'uppercase', color:'#fff', lineHeight:1 }}>Aegis</span>
          </a>
          <a href="/" style={{ fontSize:'13px', color:'#555', textDecoration:'none' }}>← Back</a>
        </nav>
        <main style={{ maxWidth:'760px', margin:'0 auto', padding:'80px 24px' }}>
          <h1 style={{ fontSize:'40px', fontWeight:'900', letterSpacing:'-0.03em', marginBottom:'8px' }}>Terms of Service</h1>
          <div style={{ fontSize:'14px', color:'#555', marginBottom:'56px' }}>Last updated: March 2026</div>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>1. Acceptance of Terms</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>By accessing or using Aegis, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>2. Use of Service</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis is a warranty tracking tool for personal and household use. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others. You may not attempt to gain unauthorized access to other users' data or to the underlying infrastructure.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>3. Your Account</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>You are responsible for maintaining the security of your account. Aegis does not handle or store your password. Authentication is managed by Google's cloud identity infrastructure, which handles all credential storage and verification. If you sign in with Google, your account security is governed by your Google account settings. You agree to notify us immediately at theaegisofficial@protonmail.com of any suspected unauthorized access to your account.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>4. Data and Privacy</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Your warranty data is stored in Google-operated cloud infrastructure, encrypted at rest and in transit, and accessible only to your authenticated account. Data is not shared with or sold to third parties. When you use AI features, relevant warranty details or receipt images are sent to an AI processing service solely to generate a response and are not retained. Please review our <a href="/privacy" style={{ color:'#888' }}>Privacy Policy</a> for full details.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>5. AI Features</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis provides AI-powered receipt scanning and a claim filing assistant. These features are provided as convenience tools only. AI-generated content, including claim letters or suggested next steps, may not be accurate or legally sufficient. You are solely responsible for verifying any AI-generated information and for any actions taken based on it. Aegis makes no warranty regarding the accuracy or effectiveness of AI-generated outputs.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>6. Limitation of Liability</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis is provided "as is" without warranty of any kind. We are not responsible for any warranty claims, missed expirations, or losses arising from use of the service. Aegis is a tracking and assistance tool only. Always consult original warranty documentation and the relevant manufacturer or retailer for legally binding coverage information.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>7. Changes to Terms</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>We reserve the right to update these terms at any time. Continued use of Aegis after changes constitutes your acceptance of the updated terms.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>8. Contact</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>For any questions regarding these terms, please contact us at <a href="mailto:theaegisofficial@protonmail.com" style={{ color:'#888', textDecoration:'none' }}>theaegisofficial@protonmail.com</a>.</p>
        </main>
        <footer style={{ textAlign:'center', padding:'40px 24px', borderTop:'1px solid #141414', fontSize:'12px', color:'#333' }}>
          &copy; 2026 Aegis. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
