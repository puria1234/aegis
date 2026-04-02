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
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>We collect the information you provide when creating an account — your email address — and the warranty data you choose to enter, including product names, brands, purchase and expiry dates, prices, retailers, serial numbers, and notes. If you sign in with Google, we receive only your email address and display name from Google's identity platform. If you use the AI receipt scanning feature, the receipt image you upload is temporarily processed to extract warranty information.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>2. How We Use Your Information</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Your information is used solely to operate the Aegis warranty tracking service — to authenticate your account, store your warranty records, and send expiry notifications if you enable them. Receipt images are processed only to extract warranty fields and are not retained after extraction. We do not use your data for advertising or sell it to any third parties.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>3. Data Storage and Security</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>All data transmitted between your device and our services is encrypted in transit using TLS (Transport Layer Security). Your warranty data is stored in a Google-operated cloud database and encrypted at rest using AES-256 encryption. Access to your data is governed by strict server-side security rules that ensure only your authenticated account can read or write your records — no other user can access your data.</p>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis does not handle, receive, or store your password in any form. All credential management — including secure password storage and verification — is performed entirely by Google's cloud identity infrastructure. Aegis never has access to your raw password at any point. If you sign in with Google, no password is involved at all; authentication is handled entirely via Google's OAuth 2.0 flow.</p>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Upon authentication, your session is represented by a short-lived, cryptographically signed identity token (valid for one hour) that is automatically refreshed by the authentication layer. These tokens are verified server-side on every request and cannot be forged or tampered with.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>4. AI Features and Data Processing</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis offers two AI-powered features: receipt scanning and a claim filing assistant. When you use receipt scanning, the receipt image is uploaded to a temporary image host and the resulting URL is sent to an AI model to extract warranty fields. When you use the claim assistant, your message history and the relevant warranty details (product name, brand, expiry date, retailer) are sent to an AI model to generate responses. Neither feature stores your data beyond the immediate processing request. No personally identifiable information beyond what is necessary to answer your query is sent to AI services.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>5. Data Retention</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Your data is retained as long as your account exists. You may delete individual warranties at any time from within the app.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>6. Cookies and Local Storage</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis uses browser-local storage mechanisms to persist your authentication session so you remain signed in between visits. This is managed by the underlying identity platform and stores only your session token — no personal data. No tracking cookies or third-party analytics scripts are used anywhere on Aegis.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>7. Third-Party Infrastructure</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>Aegis is built on Google's cloud platform for authentication and database storage. This infrastructure is subject to Google's own security certifications and compliance programs (including SOC 2, ISO 27001, and others). Receipt images are temporarily hosted via a third-party image service solely for AI processing and are not retained. AI features are powered via a managed API gateway using Mistral's language models. No personal data is shared with or sold to advertising platforms or data brokers.</p>

          <h2 style={{ fontSize:'18px', fontWeight:'700', margin:'40px 0 12px', color:'#ccc' }}>8. Changes to This Policy</h2>
          <p style={{ fontSize:'15px', color:'#666', lineHeight:'1.75', marginBottom:'16px' }}>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised date.</p>

        </main>
        <footer style={{ textAlign:'center', padding:'40px 24px', borderTop:'1px solid #141414', fontSize:'12px', color:'#333' }}>
          &copy; 2026 Aegis. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
