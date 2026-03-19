'use client';

import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

function PreviewCategoryIcon({ category }) {
  const props = {
    width: 13,
    height: 13,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (category === 'Appliances') {
    return (
      <svg {...props}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export default function LandingPage() {
  const navRef = useRef(null);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ipadPopRef = useRef(null);
  const [showIpadPopup, setShowIpadPopup] = useState(false);

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

    const ipadObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowIpadPopup(true);
          ipadObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (ipadPopRef.current) ipadObserver.observe(ipadPopRef.current);

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
      ipadObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const previewStats = [
    { label: 'Total', value: '24', color: '#fff', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
    { label: 'Active', value: '18', color: '#4ade80', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
    { label: 'Expiring', value: '3', color: '#f59e0b', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
    { label: 'Expired', value: '3', color: '#ef4444', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg> },
  ];

  const previewFilters = [
    { label: 'All', count: '24', active: true },
    { label: 'Active', count: '18', active: false },
    { label: 'Expiring', count: '3', active: false },
    { label: 'Expired', count: '3', active: false },
  ];

  const previewStatusColor = { active: '#4ade80', expiring: '#f59e0b', expired: '#ef4444' };
  const previewStatusBg = { active: 'rgba(74,222,128,0.08)', expiring: 'rgba(245,158,11,0.08)', expired: 'rgba(239,68,68,0.08)' };

  const previewWarranties = [
    { id: '1', productName: 'Sony WH-1000XM5', brand: 'Sony', category: 'Electronics', expires: 'Nov 12, 2026', remaining: '240d', progress: 35, status: 'active', price: '$349.00' },
    { id: '2', productName: 'Dyson V15 Vacuum', brand: 'Dyson', category: 'Appliances', expires: 'Apr 2, 2026', remaining: '16d', progress: 88, status: 'expiring', price: '$699.00' },
    { id: '3', productName: 'MacBook Pro 14"', brand: 'Apple', category: 'Electronics', expires: 'Mar 17, 2027', remaining: '364d', progress: 12, status: 'active', price: '$1,999.00' },
  ];

  return (
    <div>

      {/* NAV */}
      <nav id="navbar" ref={navRef} style={{ position: 'fixed', width: '100%', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '68px', padding: '0 5vmin', background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'border-color 0.3s ease' }}>
        <a href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/favicon.png" width="28" height="28" alt="AEGIS" />
          <span className="nav-logo-text" style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}>Aegis</span>
        </a>
        
        {/* Desktop Links */}
        <div className="nav-links hide-sm" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#features" className="nav-link" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#888'}>Features</a>
          <a href="#how-it-works" className="nav-link" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#888'}>How It Works</a>
          <a href={user ? "/app" : "/login"} className="btn-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#000', padding: '10px 20px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', textDecoration: 'none', transition: 'all 0.2s' }}>
            {user ? "Go to Dashboard" : "Open App"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-menu-btn hide-desktop" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className="mobile-menu-overlay hide-desktop"
        style={{
          position: 'fixed',
          top: '68px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(8,8,8,0.98)',
          backdropFilter: 'blur(24px)',
          zIndex: 99,
          display: mobileMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          opacity: mobileMenuOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          visibility: mobileMenuOpen ? 'visible' : 'hidden'
        }}
      >
        <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}>Features</a>
        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}>How It Works</a>
        <a href={user ? "/app" : "/login"} onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', color: '#000', padding: '14px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', textDecoration: 'none', marginTop: '16px' }}>
          {user ? "Go to Dashboard" : "Open App"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg-number">W.</div>
        <div className="hero-grid-lines"></div>
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="hero-badge hide-sm">
            <div className="hero-badge-dot"></div>
            <span style={{ fontSize:'11px', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase', color:'#888' }}>Free — No sign-in required</span>
          </div>

          <h1 className="headline-xl" style={{ maxWidth:'900px' }}>
            Every<br/>Warranty.<br/><span style={{ color:'#333' }}>Protected.</span>
          </h1>

          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:'48px', flexWrap:'wrap', gap:'32px' }}>
            <div style={{ maxWidth:'440px' }}>
              <p className="body-text" style={{ fontSize:'18px', marginBottom:'32px' }}>
                Aegis is the premium warranty tracker built for people who buy things worth protecting. Add once, never lose coverage again.
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
        <div className="responsive-grid-3" style={{ maxWidth:'1280px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)' }}>
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

      {/* ── 3D IPAD DEMO ── */}
      <section style={{ padding:'100px 24px 130px', textAlign:'center', overflow:'hidden', position:'relative' }}>
        {/* ambient backdrop */}
        <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:'900px', height:'500px', background:'radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 65%)', pointerEvents:'none', zIndex:0 }} />
        <div className="reveal" style={{ marginBottom:'64px', position:'relative', zIndex:1 }}>
          <div className="eyebrow" style={{ marginBottom:'16px' }}>App Preview</div>
          <h2 className="headline-lg" style={{ marginBottom:'16px' }}>Your warranties,<br/>beautifully organized.</h2>
          <p className="body-text" style={{ maxWidth:'420px', margin:'0 auto' }}>Everything tracked in one clean dashboard. Always know what's covered and what's about to expire.</p>
        </div>

        {/* scene */}
        <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'center', alignItems:'center', padding:'10px 0 80px', userSelect:'none' }}>
          <div
            ref={ipadPopRef}
            style={{
              opacity: showIpadPopup ? 1 : 0,
              transform: showIpadPopup ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.9)',
              transition:'opacity 0.6s ease, transform 0.85s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="ipad-scale-wrapper" style={{ position:'relative', display:'inline-block', perspective:'2600px' }}>
            <div
              className="ipad-rotation-wrapper"
              style={{
                transform:'rotateX(11deg) rotateY(-15deg) rotateZ(1.2deg)',
                transformOrigin:'center center',
                transformStyle:'preserve-3d',
                position:'relative',
                willChange:'transform',
              }}
            >
              <div
                style={{
                  position:'absolute',
                  inset:'52px 40px -58px 40px',
                  background:'radial-gradient(ellipse at center, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,0) 76%)',
                  transform:'translateZ(-110px) rotateX(90deg)',
                  filter:'blur(12px)',
                  pointerEvents:'none',
                }}
              />
              <div style={{
                width:'920px',
                maxWidth:'92vw',
                height:'640px',
                marginTop:'-26px',
                border:'4px solid #6c6c6c',
                padding:'14px',
                background:'linear-gradient(165deg, #2a2a2a 0%, #232323 42%, #1c1c1c 100%)',
                borderRadius:'30px',
                boxShadow:[
                  '0 0 rgba(0,0,0,0.3)',
                  '0 9px 20px rgba(0,0,0,0.29)',
                  '0 37px 37px rgba(0,0,0,0.26)',
                  '0 84px 50px rgba(0,0,0,0.15)',
                  '0 149px 60px rgba(0,0,0,0.04)',
                  '0 233px 65px rgba(0,0,0,0.01)',
                ].join(','),
                position:'relative',
                transformStyle:'preserve-3d',
                overflow:'visible',
              }}>
                <div
                  style={{
                    position:'absolute',
                    top:'26px',
                    right:'-12px',
                    width:'12px',
                    height:'calc(100% - 52px)',
                    borderTopRightRadius:'12px',
                    borderBottomRightRadius:'12px',
                    background:'linear-gradient(180deg, #3a3a3a, #2a2a2a 42%, #171717)',
                    boxShadow:'inset -1px 0 0 rgba(255,255,255,0.15), inset 1px 0 0 rgba(0,0,0,0.45)',
                    transform:'rotateY(76deg) translateZ(-1px)',
                    transformOrigin:'left center',
                    pointerEvents:'none',
                  }}
                />
                <div
                  style={{
                    position:'absolute',
                    left:'30px',
                    right:'18px',
                    bottom:'-11px',
                    height:'11px',
                    borderBottomLeftRadius:'14px',
                    borderBottomRightRadius:'14px',
                    background:'linear-gradient(180deg, #2d2d2d 0%, #141414 100%)',
                    boxShadow:'0 9px 18px rgba(0,0,0,0.45)',
                    transform:'rotateX(-78deg)',
                    transformOrigin:'top center',
                    pointerEvents:'none',
                  }}
                />
                <div style={{ height:'100%', width:'100%', overflow:'hidden', borderRadius:'22px', background:'#080808', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 0 0 2px rgba(0,0,0,0.55)' }}>
                  <div style={{ width:'1200px', minHeight:'860px', transform:'scale(0.72)', transformOrigin:'top left', pointerEvents:'none', textAlign:'left', background:'#080808', color:'#fff', fontFamily:'Inter, sans-serif' }}>
                    <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:'56px', borderBottom:'1px solid #141414', background:'rgba(8,8,8,0.95)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <img src="/icon.png" width="28" height="28" alt="AEGIS" style={{ borderRadius:'6px' }} />
                        <span style={{ fontSize:'15px', fontWeight:'800', letterSpacing:'0.15em', textTransform:'uppercase', color:'#fff', lineHeight:1 }}>AEGIS</span>
                        <span style={{ fontSize:'12px', fontWeight:500, color:'#444', letterSpacing:'0.02em', marginLeft:'2px' }}>Warranty Tracker</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <button style={{ position:'relative', background:'none', border:'1px solid #1e1e1e', borderRadius:'8px', padding:'7px', color:'#666', lineHeight:0 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                          <span style={{ position:'absolute', top:'-4px', right:'-4px', background:'#f59e0b', color:'#000', fontSize:'9px', fontWeight:800, borderRadius:'10px', minWidth:'16px', height:'16px', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px', border:'2px solid #0a0a0a' }}>3</span>
                        </button>
                        <button style={{ display:'flex', alignItems:'center', gap:'8px', background:'#111', border:'1px solid #1e1e1e', borderRadius:'8px', padding:'6px 10px' }}>
                          <div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg, hsl(190,88%,42%), hsl(36,96%,56%))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:800, color:'#fff', flexShrink:0 }}>J</div>
                          <span style={{ fontSize:'13px', fontWeight:600, color:'#ccc' }}>John</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </button>
                      </div>
                    </nav>

                    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'24px 20px' }}>
                      <div style={{ background:'linear-gradient(135deg, #0f0f0f 0%, #111 50%, #0f0f0f 100%)', border:'1px solid #1a1a1a', borderRadius:'16px', padding:'28px 32px', marginBottom:'24px', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:0, right:0, width:'300px', height:'100%', background:'radial-gradient(ellipse at right center, rgba(255,255,255,0.02) 0%, transparent 70%)', pointerEvents:'none' }} />
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px' }}>
                          <div>
                            <div style={{ fontSize:'22px', fontWeight:900, letterSpacing:'-0.03em', marginBottom:'6px', textAlign:'left' }}>Welcome back, John</div>
                            <div style={{ fontSize:'13px', color:'#555' }}>You have 24 warranties tracked · 3 expiring soon.</div>
                          </div>
                          <button style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'#fff', color:'#000', fontWeight:700, letterSpacing:'0.05em', borderRadius:'8px', padding:'10px 20px', border:'none', textTransform:'uppercase', fontSize:'12px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Warranty
                          </button>
                        </div>
                      </div>

                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:'12px', marginBottom:'24px' }}>
                        {previewStats.map(({ label, value, color, icon }) => (
                          <div key={label} style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:'16px', padding:'20px' }}>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                              <div style={{ fontSize:'11px', fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</div>
                              <div style={{ color: label === 'Total' ? '#333' : color, opacity:0.7 }}>{icon}</div>
                            </div>
                            <div style={{ fontSize:'32px', fontWeight:900, color, letterSpacing:'-0.04em', lineHeight:1 }}>{value}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-start', gap:'12px', marginBottom:'18px', flexWrap:'wrap' }}>
                        <div style={{ flex:1, minWidth:'260px', position:'relative' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                          <div style={{ background:'#111', border:'1px solid #222', borderRadius:'10px', color:'#666', padding:'10px 16px 10px 36px', width:'100%', fontSize:'15px', textAlign:'left' }}>Search warranties…</div>
                        </div>
                        <div style={{ background:'#111', border:'1px solid #222', borderRadius:'10px', color:'#888', padding:'10px 14px', minWidth:'160px', fontSize:'14px', display:'flex', alignItems:'center', gap:'6px' }}>
                          Expiry (Soonest)
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                        <button style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'transparent', color:'#999', fontWeight:500, borderRadius:'8px', padding:'9px 16px', border:'1px solid #2a2a2a', fontSize:'13px' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                          Export
                        </button>
                        <div style={{ display:'flex', gap:'4px' }}>
                          {[true, false].map((active, idx) => (
                            <div key={idx} style={{ padding:'7px 10px', borderRadius:'6px', background:active ? '#fff' : 'transparent', border:`1px solid ${active ? '#fff' : '#2a2a2a'}`, color:active ? '#000' : '#666', lineHeight:1 }}>
                              {idx === 0 ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
                        {previewFilters.map(({ label, count, active }) => (
                          <div key={label} style={{ padding:'6px 16px', borderRadius:'100px', fontSize:'12px', fontWeight:600, border:`1px solid ${active ? '#fff' : '#2a2a2a'}`, background:active ? '#fff' : 'transparent', color:active ? '#000' : '#888', textTransform:'uppercase', letterSpacing:'0.06em', display:'inline-flex', alignItems:'center' }}>
                            {label}
                            <span style={{ background:active ? 'rgba(0,0,0,0.2)' : '#1a1a1a', borderRadius:'10px', padding:'1px 6px', fontSize:'10px', marginLeft:'4px' }}>{count}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'14px' }}>
                        {previewWarranties.map((w) => {
                          const color = previewStatusColor[w.status];
                          const bg = previewStatusBg[w.status];
                          return (
                            <div key={w.id} style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'18px' }}>
                              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'10px', flex:1, minWidth:0 }}>
                                  <div style={{ width:28, height:28, borderRadius:'7px', background:'#161616', border:'1px solid #252525', display:'flex', alignItems:'center', justifyContent:'center', color:'#888', flexShrink:0 }}>
                                    <PreviewCategoryIcon category={w.category} />
                                  </div>
                                  <div style={{ minWidth:0 }}>
                                    <div style={{ fontWeight:700, fontSize:'14px', color:'#f0f0f0', letterSpacing:'-0.02em' }}>{w.productName}</div>
                                    <div style={{ fontSize:'11px', color:'#555', marginTop:'1px' }}>{w.brand}</div>
                                  </div>
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:'6px', background:bg, border:`1px solid ${color}22`, borderRadius:'20px', padding:'3px 8px', flexShrink:0 }}>
                                  <div style={{ width:5, height:5, borderRadius:'50%', background:color }} />
                                  <span style={{ fontSize:'10px', fontWeight:700, color:color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{w.status}</span>
                                </div>
                              </div>
                              <div style={{ marginBottom:'12px' }}>
                                <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:600, background:'#1a1a1a', color:'#777', border:'1px solid #242424', textTransform:'uppercase', letterSpacing:'0.05em' }}>{w.category}</span>
                              </div>
                              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'14px' }}>
                                <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:'8px', padding:'8px' }}>
                                  <div style={{ fontSize:'10px', color:'#444', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'2px' }}>Expires</div>
                                  <div style={{ fontSize:'12px', color:'#ccc', fontWeight:600 }}>{w.expires}</div>
                                </div>
                                <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:'8px', padding:'8px' }}>
                                  <div style={{ fontSize:'10px', color:'#444', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'2px' }}>Remaining</div>
                                  <div style={{ fontSize:'12px', fontWeight:700, color:color }}>{w.remaining}</div>
                                </div>
                              </div>
                              <div style={{ marginBottom:'6px' }}>
                                <div style={{ height:'4px', borderRadius:'2px', background:'#1a1a1a', overflow:'hidden' }}>
                                  <div style={{ height:'100%', borderRadius:'2px', width:`${w.progress}%`, background:color }} />
                                </div>
                              </div>
                              <div style={{ marginTop:'12px', paddingTop:'12px', borderTop:'1px solid #161616', fontSize:'12px', color:'#555' }}>
                                <span style={{ color:'#333' }}>Value:</span> <span style={{ color:'#888', fontWeight:600 }}>{w.price}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .ipad-scale-wrapper { transform: scale(0.84); transform-origin: top center; margin-bottom: -88px; }
          }
          @media (max-width: 780px) {
            .ipad-scale-wrapper { transform: scale(0.56); transform-origin: top center; margin-bottom: -236px; }
          }
          @media (max-width: 500px) {
            .ipad-scale-wrapper { transform: scale(0.42); margin-bottom: -322px; }
          }
        `}</style>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="reveal" style={{ marginBottom:'64px' }}>
          <div className="eyebrow" style={{ marginBottom:'16px' }}>Why Aegis</div>
          <h2 className="headline-lg" style={{ maxWidth:'620px' }}>Built for every<br/>product you own.</h2>
        </div>

        <div className="responsive-features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>

          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 26" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v7c0 5 4.5 9.5 9 11 4.5-1.5 9-6 9-11V7L12 2z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div className="feature-title">Universal Tracking</div>
            <div className="feature-desc">Track warranties across every product category — from sneakers to refrigerators to cars. If you bought it, Aegis protects it.</div>
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

        <div className="responsive-grid-3 reveal" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0', position:'relative' }}>

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
            <div className="feature-desc">Use quick-duration buttons (1 yr, 2 yr, 5 yr) or pick a custom expiry date. Aegis calculates everything.</div>
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
            <div className="feature-desc">Aegis tracks your coverage, alerts you when warranties are about to expire, and keeps your entire collection organized.</div>
          </div>

        </div>
      </section>

      <hr className="divider" />

      {/* CATEGORIES */}
      <section>
        <div className="responsive-grid-2 reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom:'16px' }}>Everything, Organized</div>
            <h2 className="headline-lg" style={{ marginBottom:'24px' }}>Nine categories.<br/>One dashboard.</h2>
            <p className="body-text" style={{ marginBottom:'36px' }}>From AirPods to automobiles, Aegis handles every type of purchase. Tap any category to instantly filter your view.</p>
            <a href="/login" className="btn-cta">Open Aegis</a>
          </div>
          <div className="responsive-grid-cat" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>

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
          <div className="eyebrow" style={{ marginBottom:'20px' }}>The Aegis Philosophy</div>
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
            Aegis exists to change that. No excuses, no missed claims, no wasted money on extended warranties you already have.
          </p>
        </div>
      </div>

      {/* FINAL CTA */}
      <section>
        <div className="cta-section reveal">
          <div className="cta-bg-text">Aegis</div>
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
              Open Aegis — It&apos;s Free
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ flexDirection:'column', gap:'0', padding:'0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px', padding:'20px 48px' }}>
          <div style={{ fontSize:'12px', color:'#333' }}>&copy; 2026 Aegis. All rights reserved.</div>
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
