'use client';

import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LandingPage() {
  const navRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // Nav scroll effect
    const onScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 40) {
        navRef.current.style.borderBottomColor = 'rgba(255,255,255,0.07)';
      } else {
        navRef.current.style.borderBottomColor = 'rgba(255,255,255,0.04)';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div>

      {/* NAV */}
      <nav id="navbar" ref={navRef}>
        <a href="/" className="nav-logo">
          <img src="/favicon.png" width="32" height="32" alt="AEGIS" />
          <span className="nav-logo-text">AEGIS</span>
        </a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href={user ? "/app" : "/login"} className="btn-cta" style={{ padding:'10px 24px', fontSize:'12px', borderRadius:'8px' }}>
            {user ? "Go to Dashboard" : "Open App"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg-number">W.</div>
        <div className="hero-grid-lines"></div>
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            <span style={{ fontSize:'11px', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase', color:'#888' }}>Free — No sign-in required</span>
          </div>

          <h1 className="headline-xl" style={{ maxWidth:'900px' }}>
            Every<br/>Warranty.<br/><span style={{ color:'#333' }}>Protected.</span>
          </h1>

          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:'48px', flexWrap:'wrap', gap:'32px' }}>
            <div style={{ maxWidth:'440px' }}>
              <p className="body-text" style={{ fontSize:'18px', marginBottom:'32px' }}>
                AEGIS is the premium warranty tracker built for people who buy things worth protecting. Add once, never lose coverage again.
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
                <a href={user ? "/app" : "/login"} className="btn-cta">
                  {user ? "Go to Dashboard" : "Start Tracking Free"}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="#features" className="btn-outline">Explore Features</a>
              </div>
            </div>

            {/* Mini UI Preview */}
            <div className="hide-sm" style={{ display:'flex', flexDirection:'column', gap:'10px', minWidth:'280px', maxWidth:'300px' }}>

              {/* Card 1: Active */}
              <div className="mock-card" style={{ animation:'float 4s ease-in-out infinite' }}>
                <div style={{ padding:'20px 20px 16px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'10px', marginBottom:'12px' }}>
                    <div style={{ minWidth:'0' }}>
                      <div className="mock-tag">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        Electronics
                      </div>
                      <div style={{ fontSize:'16px', fontWeight:'800', letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Sony XM5 Headphones</div>
                      <div style={{ fontSize:'12px', color:'#666', marginTop:'2px' }}>Sony</div>
                    </div>
                    <span className="status-active" style={{ fontSize:'11px', fontWeight:'700', whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'0.06em' }}>Active</span>
                  </div>
                  <div className="mock-bar"><div className="mock-bar-fill" style={{ width:'35%', background:'#4ade80' }}></div></div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontSize:'12px', color:'#666' }}>Nov 12, 2026</div>
                    <div style={{ fontSize:'12px', fontWeight:'700', color:'#4ade80' }}>240d left</div>
                  </div>
                </div>
                <div style={{ borderTop:'1px solid #1a1a1a', padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:'12px', color:'#555' }}>$349.00</div>
                  <div style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#666', padding:'5px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.04em' }}>Edit</div>
                </div>
              </div>

              {/* Card 2: Expiring */}
              <div className="mock-card" style={{ opacity:'0.65', animation:'float 4s ease-in-out 1.5s infinite' }}>
                <div style={{ padding:'20px 20px 16px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'10px', marginBottom:'12px' }}>
                    <div style={{ minWidth:'0' }}>
                      <div className="mock-tag">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Appliances
                      </div>
                      <div style={{ fontSize:'16px', fontWeight:'800', letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Dyson V15 Vacuum</div>
                      <div style={{ fontSize:'12px', color:'#666', marginTop:'2px' }}>Dyson</div>
                    </div>
                    <span className="status-expiring" style={{ fontSize:'11px', fontWeight:'700', whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'0.06em' }}>Expiring</span>
                  </div>
                  <div className="mock-bar"><div className="mock-bar-fill" style={{ width:'88%', background:'#f59e0b' }}></div></div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontSize:'12px', color:'#666' }}>Apr 2, 2026</div>
                    <div style={{ fontSize:'12px', fontWeight:'700', color:'#f59e0b' }}>16d left</div>
                  </div>
                </div>
                <div style={{ borderTop:'1px solid #1a1a1a', padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:'12px', color:'#555' }}>$699.00</div>
                  <div style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#666', padding:'5px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.04em' }}>Edit</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          <span className="ticker-item"><span className="ticker-dot"></span> Electronics</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Appliances</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Automotive</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Footwear</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Tools</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Furniture</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Clothing</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Sports Gear</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Cameras</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Computers</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Smartphones</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Wearables</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Electronics</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Appliances</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Automotive</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Footwear</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Tools</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Furniture</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Clothing</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Sports Gear</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Cameras</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Computers</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Smartphones</span>
          <span className="ticker-item"><span className="ticker-dot"></span> Wearables</span>
        </div>
      </div>

      {/* STAT BAND */}
      <div className="stat-band">
        <div style={{ maxWidth:'1280px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)' }}>
          <div className="stat-item reveal">
            <div className="stat-number">∞</div>
            <div className="stat-label">Warranties tracked</div>
          </div>
          <div className="stat-item reveal reveal-delay-1">
            <div className="stat-number">9</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item reveal reveal-delay-2">
            <div className="stat-number">30</div>
            <div className="stat-label">Day expiry alerts</div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features">
        <div className="reveal" style={{ marginBottom:'64px' }}>
          <div className="eyebrow" style={{ marginBottom:'16px' }}>Why AEGIS</div>
          <h2 className="headline-lg" style={{ maxWidth:'620px' }}>Built for every<br/>product you own.</h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>

          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 26" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v7c0 5 4.5 9.5 9 11 4.5-1.5 9-6 9-11V7L12 2z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div className="feature-title">Universal Tracking</div>
            <div className="feature-desc">Track warranties across every product category — from sneakers to refrigerators to cars. If you bought it, AEGIS protects it.</div>
          </div>

          <div className="feature-card reveal reveal-delay-1">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="feature-title">Expiry Countdown</div>
            <div className="feature-desc">Live countdowns show exactly how many days remain on every warranty. Color-coded alerts fire 30 days before expiry so you&apos;re never caught off guard.</div>
          </div>

          <div className="feature-card reveal reveal-delay-2">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <div className="feature-title">Coverage Progress</div>
            <div className="feature-desc">Visual progress bars show at a glance how much of your warranty coverage remains. Green to amber to red — know exactly where you stand.</div>
          </div>

          <div className="feature-card reveal reveal-delay-3">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div className="feature-title">Instant Search</div>
            <div className="feature-desc">Real-time search across product names, brands, retailers, and notes. Find any warranty in under a second no matter how many you&apos;re tracking.</div>
          </div>

          <div className="feature-card reveal reveal-delay-4">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="feature-title">Smart Filtering</div>
            <div className="feature-desc">Filter by status — active, expiring, or expired — or drill into a specific category. Combined with multi-field sorting for total control.</div>
          </div>

          <div className="feature-card reveal reveal-delay-5">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <div className="feature-title">CSV Export</div>
            <div className="feature-desc">Export your entire warranty database as a CSV file with one click. Take your data wherever you need it — no lock-in, ever.</div>
          </div>

        </div>
      </section>

      <hr className="divider" />

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="reveal" style={{ marginBottom:'80px', textAlign:'center' }}>
          <div className="eyebrow" style={{ marginBottom:'16px' }}>The Process</div>
          <h2 className="headline-lg">Up and running<br/>in three steps.</h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0', position:'relative' }} className="reveal">

          {/* Connecting line */}
          <div className="hide-sm" style={{ position:'absolute', top:'36px', left:'calc(16.66% + 20px)', right:'calc(16.66% + 20px)', height:'1px', background:'linear-gradient(to right, #222 0%, #444 50%, #222 100%)', zIndex:'0' }}></div>

          <div style={{ textAlign:'center', padding:'0 32px', position:'relative', zIndex:'1' }}>
            <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'#111', border:'1px solid #333', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <div className="step-number">01</div>
            <div style={{ fontSize:'18px', fontWeight:'800', letterSpacing:'-0.02em', marginBottom:'12px' }}>Add Your Product</div>
            <div className="feature-desc">Enter the product name, brand, purchase date, and category. Takes under 30 seconds.</div>
          </div>

          <div style={{ textAlign:'center', padding:'0 32px', position:'relative', zIndex:'1' }}>
            <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'#111', border:'1px solid #333', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="step-number">02</div>
            <div style={{ fontSize:'18px', fontWeight:'800', letterSpacing:'-0.02em', marginBottom:'12px' }}>Set the Duration</div>
            <div className="feature-desc">Use quick-duration buttons (1 yr, 2 yr, 5 yr) or pick a custom expiry date. AEGIS calculates everything.</div>
          </div>

          <div style={{ textAlign:'center', padding:'0 32px', position:'relative', zIndex:'1' }}>
            <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'#111', border:'1px solid #333', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px' }}>
              <svg width="28" height="28" viewBox="0 0 24 26" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v7c0 5 4.5 9.5 9 11 4.5-1.5 9-6 9-11V7L12 2z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div className="step-number">03</div>
            <div style={{ fontSize:'18px', fontWeight:'800', letterSpacing:'-0.02em', marginBottom:'12px' }}>Stay Protected</div>
            <div className="feature-desc">AEGIS tracks your coverage, alerts you when warranties are about to expire, and keeps your entire collection organized.</div>
          </div>

        </div>
      </section>

      <hr className="divider" />

      {/* CATEGORIES */}
      <section>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center' }} className="reveal">
          <div>
            <div className="eyebrow" style={{ marginBottom:'16px' }}>Everything, Organized</div>
            <h2 className="headline-lg" style={{ marginBottom:'24px' }}>Nine categories.<br/>One dashboard.</h2>
            <p className="body-text" style={{ marginBottom:'36px' }}>From AirPods to automobiles, AEGIS handles every type of purchase. Tap any category to instantly filter your view.</p>
            <a href="/login" className="btn-cta">Open AEGIS</a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>

            <div className="feature-card" style={{ padding:'20px', textAlign:'center', cursor:'default' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px' }}>
                <div className="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
              </div>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#666', letterSpacing:'0.06em', textTransform:'uppercase' }}>Electronics</div>
            </div>

            <div className="feature-card" style={{ padding:'20px', textAlign:'center', cursor:'default' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px' }}>
                <div className="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
              </div>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#666', letterSpacing:'0.06em', textTransform:'uppercase' }}>Appliances</div>
            </div>

            <div className="feature-card" style={{ padding:'20px', textAlign:'center', cursor:'default' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px' }}>
                <div className="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="9" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
              </div>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#666', letterSpacing:'0.06em', textTransform:'uppercase' }}>Automotive</div>
            </div>

            <div className="feature-card" style={{ padding:'20px', textAlign:'center', cursor:'default' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px' }}>
                <div className="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-1H3v1z"/><path d="M3 17V9c0-1.1.9-2 2-2h2l4-4 4 4h2a2 2 0 0 1 2 2v8"/></svg>
                </div>
              </div>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#666', letterSpacing:'0.06em', textTransform:'uppercase' }}>Footwear</div>
            </div>

            <div className="feature-card" style={{ padding:'20px', textAlign:'center', cursor:'default' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px' }}>
                <div className="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
              </div>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#666', letterSpacing:'0.06em', textTransform:'uppercase' }}>Tools</div>
            </div>

            <div className="feature-card" style={{ padding:'20px', textAlign:'center', cursor:'default' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px' }}>
                <div className="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
              </div>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#666', letterSpacing:'0.06em', textTransform:'uppercase' }}>&amp; More</div>
            </div>

          </div>
        </div>
      </section>

      {/* BIG STATEMENT */}
      <div style={{ background:'#0c0c0c', borderTop:'1px solid #141414', borderBottom:'1px solid #141414', padding:'100px 48px', textAlign:'center', overflow:'hidden' }} className="reveal">
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div className="eyebrow" style={{ marginBottom:'20px' }}>The AEGIS Philosophy</div>
          <p style={{ fontSize:'clamp(22px,4vw,42px)', fontWeight:'800', letterSpacing:'-0.03em', lineHeight:'1.15', color:'#fff' }}>
            The average household owns over<br/>
            <span style={{ color:'transparent', WebkitTextStroke:'1px #555' }}>40 products</span>
            {' '}with active warranties.<br/>
            Most people track{' '}
            <span style={{ position:'relative', display:'inline-block' }}>
              <span style={{ color:'#fff' }}>zero</span>
              <span style={{ position:'absolute', bottom:'4px', left:'0', right:'0', height:'2px', background:'#fff', borderRadius:'2px' }}></span>
            </span>
            {' '}of them.
          </p>
          <p className="body-text" style={{ marginTop:'24px', fontSize:'16px', maxWidth:'520px', marginLeft:'auto', marginRight:'auto' }}>
            AEGIS exists to change that. No excuses, no missed claims, no wasted money on extended warranties you already have.
          </p>
        </div>
      </div>

      {/* FINAL CTA */}
      <section>
        <div className="cta-section reveal">
          <div className="cta-bg-text">AEGIS</div>
          <div style={{ position:'relative', zIndex:'1' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'100px', padding:'6px 14px', marginBottom:'28px' }}>
              <svg width="12" height="12" viewBox="0 0 24 26" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L3 7v7c0 5 4.5 9.5 9 11 4.5-1.5 9-6 9-11V7L12 2z"/><path d="M9 12l2 2 4-4"/></svg>
              <span style={{ fontSize:'11px', fontWeight:'700', color:'#000', textTransform:'uppercase', letterSpacing:'0.12em' }}>Your warranty guardian</span>
            </div>
            <h2 className="headline-lg" style={{ color:'#000', marginBottom:'20px', maxWidth:'700px', marginLeft:'auto', marginRight:'auto' }}>
              Start protecting<br/>what you own.
            </h2>
            <p style={{ fontSize:'17px', color:'#777', marginBottom:'40px', maxWidth:'420px', marginLeft:'auto', marginRight:'auto', lineHeight:'1.6' }}>
              Free forever. No account needed. Just open it and start tracking.
            </p>
            <a href="/login" className="btn-cta-dark">
              Open AEGIS — It&apos;s Free
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ flexDirection:'column', gap:'0', padding:'0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px', padding:'20px 48px' }}>
          <div style={{ fontSize:'12px', color:'#333' }}>&copy; 2026 AEGIS. All rights reserved.</div>
          <div style={{ display:'flex', alignItems:'center', gap:'24px' }}>
            <a href="/terms" style={{ fontSize:'12px', color:'#444', textDecoration:'none', transition:'color 0.15s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#888'}
              onMouseOut={(e) => e.currentTarget.style.color = '#444'}>Terms of Service</a>
            <a href="/privacy" style={{ fontSize:'12px', color:'#444', textDecoration:'none', transition:'color 0.15s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#888'}
              onMouseOut={(e) => e.currentTarget.style.color = '#444'}>Privacy Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
