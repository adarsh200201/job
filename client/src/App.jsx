import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Footer from './components/Footer.jsx';
import PreFooterSections from './components/PreFooterSections.jsx';
import HeroSearch from './components/HeroSearch.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { startKeepAlive, stopKeepAlive } from './utils/keepAlive.js';
import { trackPageView, useScrollDepth } from './utils/analytics.js';
import { usePageTracking } from './hooks/usePageTracking.js';
import { useSessionTracking } from './hooks/useSessionTracking.js';
import ScrollToTop from './components/ScrollToTop.jsx';
import { MEGA_CATEGORIES } from './utils/categoryConfig.js';

// Lazy load page components for code splitting
const Home = React.lazy(() => import('./pages/Home.jsx'));
const JobDetails = React.lazy(() => import('./pages/JobDetails.jsx'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard.jsx'));
const About = React.lazy(() => import('./pages/About.jsx'));
const Contact = React.lazy(() => import('./pages/Contact.jsx'));
const FAQ = React.lazy(() => import('./pages/FAQ.jsx'));
const Blog = React.lazy(() => import('./pages/Blog.jsx'));
const Terms = React.lazy(() => import('./pages/Terms.jsx'));
const Disclaimer = React.lazy(() => import('./pages/Disclaimer.jsx'));
const Login = React.lazy(() => import('./pages/Login.jsx'));
const SignUp = React.lazy(() => import('./pages/SignUp.jsx'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback.jsx'));
const StudentCareerCenter = React.lazy(() => import('./pages/StudentCareerCenter.jsx'));
const SalarySearch = React.lazy(() => import('./pages/SalarySearch.jsx'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard.jsx'));
const Onboarding = React.lazy(() => import('./pages/Onboarding.jsx'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy.jsx'));
const GovtJobsCategory = React.lazy(() => import('./pages/GovtJobsCategory.jsx'));
const RootSlugHandler = React.lazy(() => import('./pages/RootSlugHandler.jsx'));
const PreparationHub = React.lazy(() => import('./pages/Preparation/PreparationHub.jsx'));
const AptitudePrep = React.lazy(() => import('./pages/Preparation/AptitudePrep.jsx'));
const TechnicalPrep = React.lazy(() => import('./pages/Preparation/TechnicalPrep.jsx'));
const DSAPrep = React.lazy(() => import('./pages/Preparation/DSAPrep.jsx'));
const CompanyPrepPage = React.lazy(() => import('./pages/Preparation/CompanyPrepPage.jsx'));
const GovPrepPage = React.lazy(() => import('./pages/Preparation/GovPrepPage.jsx'));
const MockTests = React.lazy(() => import('./pages/Preparation/MockTests.jsx'));
const ResumeBuilder = React.lazy(() => import('./pages/ResumeBuilder.jsx'));

// Loading fallback
function LoadingFallback() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROFILE DROPDOWN (logged-in users)
══════════════════════════════════════════════════════════ */
function ProfileDropdown({ username, isAdmin, logout }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: '1.5px solid #1A3A6B',
          borderRadius: '6px', padding: '5px 12px',
          cursor: 'pointer', fontWeight: 700, color: '#1A3A6B',
          fontSize: '0.9rem', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1A3A6B'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1A3A6B'; }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        {username}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: '180px', zIndex: 9999, overflow: 'hidden',
          animation: 'dropdownFade 0.15s ease',
        }}>
          {/* Profile / Admin */}
          <Link
            to={isAdmin ? '/control-center' : '/dashboard'}
            onClick={() => setOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', textDecoration: 'none', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>🏠</span> {isAdmin ? 'Control Center' : 'My Profile'}
          </Link>

          {/* Saved Jobs */}
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', textDecoration: 'none', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>🔖</span> Saved Jobs
          </Link>

          {/* Practice Tests */}
          <Link
            to="/student-career-center"
            onClick={() => setOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', textDecoration: 'none', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>📝</span> Practice Tests
          </Link>

          {/* Logout */}
          <button
            onClick={() => { setOpen(false); logout(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', width: '100%', background: 'none', border: 'none', textAlign: 'left', color: '#dc2626', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>🚪</span> Log Out
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NAV ACTIONS (top-right auth area)
══════════════════════════════════════════════════════════ */
function NavActions() {
  const { token, username, logout, isAdmin } = useAuth();
  if (token) {
    return (
      <div className="nav-top-actions">
        <ProfileDropdown username={username} isAdmin={isAdmin} logout={logout} />
      </div>
    );
  }
  return (
    <div className="nav-top-actions">
      <Link to="/signup" className="btn-nav-signup">Sign up</Link>
      <Link to="/login" className="btn-nav-login">Log in</Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MEGA NAV DROPDOWN (govtjobsalert.in style)
══════════════════════════════════════════════════════════ */
function NavDropdown({ label, items, to, showArrow = true, mega = false }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isChildActive = Array.isArray(items) && items.some(item => location.pathname === item.to);

  const col1 = mega ? items.slice(0, 13) : [];
  const col2 = mega ? items.slice(13, 26) : [];
  const col3 = mega ? items.slice(26, 39) : [];
  const col4 = mega ? items.slice(39, 52) : [];

  return (
    <li ref={ref} style={{ position: 'relative', listStyle: 'none' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink
        to={to}
        className={({ isActive }) => {
          const isReallyActive = (to && to !== '#' && to !== '') ? (isActive || isChildActive) : isChildActive;
          return `nav-link ${isReallyActive ? 'active' : ''}`;
        }}
        onClick={(e) => {
          if (to === '#') e.preventDefault();
          setOpen(o => !o);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          cursor: 'pointer'
        }}
      >
        {label}{showArrow && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', opacity: 0.6 }}>
            <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        )}
      </NavLink>

      {open && (
        <div style={mega ? {
          position: 'absolute', top: '100%', right: 0,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          width: '760px', zIndex: 9999, padding: '16px',
          display: 'flex', gap: '12px',
          animation: 'dropdownFade 0.15s ease',
        } : {
          position: 'absolute', top: '100%', left: 0,
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          minWidth: '210px', zIndex: 9999, padding: '6px 0',
          animation: 'dropdownFade 0.15s ease',
        }}>
          {mega ? (
            <>
              {[col1, col2, col3, col4].map((col, cIdx) => (
                <div key={cIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {col.map((item, i) => (
                    <NavLink
                      key={i}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'block',
                        padding: '4px 8px',
                        textDecoration: 'none',
                        color: '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        transition: 'all 0.15s',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(109, 40, 217, 0.08)';
                        e.currentTarget.style.color = '#6d28d9';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              ))}
            </>
          ) : (
            items.map((item, i) => (
              <NavLink
                key={i}
                to={item.to}
                onClick={() => setOpen(false)}
                style={{ display: 'block', padding: '9px 18px', textDecoration: 'none', color: '#1e293b', fontSize: '0.88rem', fontWeight: 500, transition: 'all 0.15s', borderBottom: i < items.length - 1 ? '1px solid #f8fafc' : 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#1A3A6B'; e.currentTarget.style.paddingLeft = '22px'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.paddingLeft = '18px'; }}
              >
                {item.label}
              </NavLink>
            ))
          )}
        </div>
      )}
    </li>
  );
}

// Admin-only protected route
function AdminRoute({ children }) {
  const { isAdmin, adminReady, adminRestoring } = useAuth();

  // While we're trying to restore the session from refresh-token cookie, show spinner
  if (adminRestoring) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0f172a', flexDirection: 'column', gap: '16px'
      }}>
        <div style={{
          width: '44px', height: '44px', border: '4px solid rgba(255,255,255,0.15)',
          borderTop: '4px solid #818cf8', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Restoring session…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAdmin || !adminReady) return <Navigate to="/control-center/login" replace />;
  return children;
}

// User-only protected route
function UserRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  useEffect(() => {
    startKeepAlive();
    return () => { stopKeepAlive(); };
  }, []);

  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isAdminPage = location.pathname === '/control-center';
  const isPrepPage = location.pathname.startsWith('/preparation');

  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileGovtOpen, setMobileGovtOpen] = React.useState(false);
  const [mobileExamOpen, setMobileExamOpen] = React.useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  const staticPaths = [
    '/', '/student-career-center', '/salaries', '/about', '/contact',
    '/faq', '/blog', '/terms', '/disclaimer', '/login', '/signup',
    '/auth/callback', '/control-center/login', '/control-center', '/dashboard', '/onboarding', '/privacy',
    '/govt-jobs', '/exam-updates', '/upsc-jobs', '/ssc-jobs', '/railway-jobs', '/banking-jobs', '/defence-jobs', '/other-govt-jobs', '/teaching-jobs', '/psu-jobs',
    '/results', '/admit-cards', '/answer-keys',
    '/preparation', '/preparation/aptitude', '/preparation/technical', '/preparation/dsa',
    '/preparation/company', '/preparation/gov', '/preparation/mock-tests',
    '/resume-builder',
    ...Object.keys(MEGA_CATEGORIES).map(k => `/${k}`)
  ];
  const isJobDetail = !staticPaths.includes(location.pathname);

  // Reactive mobile breakpoint detection
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll depth globally on all pages
  useScrollDepth(location.pathname);

  // ── Enterprise Analytics: auto page + session tracking ──
  usePageTracking();
  useSessionTracking();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileGovtOpen(false);
    setMobileExamOpen(false);
    setMobileMoreOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Track Page View for core/static pages. JobDetails page view is tracked in its own component once loaded.
    if (!isJobDetail) {
      const params = new URLSearchParams(location.search);
      const category = params.get('type') || params.get('q') || 'General';
      
      trackPageView(location.pathname, {
        category: category
      });
    }

    // Prerender.io lifecycle signaling:
    if (!isJobDetail && location.pathname !== '/') {
      window.prerenderReady = true;
    } else {
      window.prerenderReady = false;
    }
  }, [location.pathname, location.search, isJobDetail]);

  /* ── Nav dropdown link configs ── */
  const govtJobItems = [
    { label: 'Latest Govt Jobs',     to: '/govt-jobs' },
    { label: 'UPSC Jobs',           to: '/upsc-jobs' },
    { label: 'SSC Jobs',           to: '/ssc-jobs' },
    { label: 'Railway Jobs',       to: '/railway-jobs' },
    { label: 'Banking Jobs',       to: '/banking-jobs' },
    { label: 'Defence Jobs',       to: '/defence-jobs' },
    { label: 'Other Govt Jobs',     to: '/other-govt-jobs' },
    { label: 'Teaching Jobs',      to: '/teaching-jobs' },
    { label: 'PSU Jobs',           to: '/psu-jobs' },
  ];
  const examUpdatesItems = [
    { label: '📋 Results',     to: '/results' },
    { label: '🎫 Admit Cards', to: '/admit-cards' },
    { label: '🔑 Answer Keys', to: '/answer-keys' },
  ];



  const prepItems = [
    { label: '🧮 Aptitude & Reasoning', to: '/preparation/aptitude' },
    { label: '💻 Technical MCQ',        to: '/preparation/technical' },
    { label: '🌲 DSA Practice',          to: '/preparation/dsa' },
    { label: '🏢 Company Wise',          to: '/preparation/company' },
    { label: '🏛️ Govt Exam Prep',        to: '/preparation/gov' },
    { label: '📝 Mock Tests',            to: '/preparation/mock-tests' },
  ];


  const moreItems = Object.entries(MEGA_CATEGORIES).map(([key, config]) => ({
    label: config.label,
    to: `/${key}`
  }));

  // Control-center page: full-screen, no header/footer
  if (isAdminPage) {
    return (
      <>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/control-center" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </Suspense>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <ScrollToTop />
      {!(isMobile && isJobDetail) && (
        <header className="site-header">
          {/* ── Row 1: Logo, Nav Links, and Auth ── */}
          <div className="nav-top-bar">
            <div className="nav-top-inner" style={{ gap: '1.5rem' }}>
              <Link to="/" className="nav-logo-link">
                <picture>
                  <source srcSet="/logo.webp" type="image/webp" />
                  <img src="/logo.png" alt="NextJobPost Logo" className="logo-img-nav" width="34" height="34" />
                </picture>
                <span className="nav-brand">
                  <span className="nav-brand-next">Next</span>
                  <span className="nav-brand-job">Job</span>
                  <span className="nav-brand-post">Post</span>
                </span>
              </Link>

              <ul className="nav-links" style={{ flex: 1, display: isMobile ? 'none' : 'flex', justifyContent: 'flex-end', flexWrap: 'nowrap', gap: '0.5rem', overflow: 'visible' }}>
                <NavDropdown label="Govt Jobs" items={govtJobItems} to="/govt-jobs" />

                <NavDropdown label="Exam Updates" items={examUpdatesItems} to="/results" />

                <NavDropdown label="Preparation" items={prepItems} to="/preparation" />



                <NavDropdown label="More" items={moreItems} to="#" mega={true} />

                <li style={{ listStyle: 'none', display: 'flex', alignItems: 'center', position: 'relative', marginLeft: '6px' }}>
                  {showSearch && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                          navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                          setShowSearch(false);
                          setSearchQuery('');
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        animation: 'dropdownFade 0.2s ease',
                        marginRight: '8px'
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        style={{
                          padding: '0.4rem 1rem',
                          fontSize: '0.9rem',
                          borderRadius: '9999px',
                          border: '1.5px solid #d1d5db',
                          outline: 'none',
                          width: '150px',
                          transition: 'all 0.2s',
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            if (!searchQuery) setShowSearch(false);
                          }, 200);
                        }}
                      />
                    </form>
                  )}
                  <button
                    onClick={() => setShowSearch(prev => !prev)}
                    aria-label="Search jobs"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.45rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: showSearch ? '#6d28d9' : '#475569',
                      backgroundColor: showSearch ? 'rgba(109, 40, 217, 0.08)' : 'transparent',
                      transition: 'all 200ms',
                    }}
                    onMouseEnter={e => {
                      if (!showSearch) {
                        e.currentTarget.style.color = '#1A3A6B';
                        e.currentTarget.style.background = 'rgba(26,58,107,0.08)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!showSearch) {
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.background = 'none';
                      }
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </li>
              </ul>

              {/* ── Mobile Hamburger Button ── */}
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                aria-label="Open navigation menu"
                style={{ display: isMobile ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>

              <NavActions />
            </div>
          </div>

          {/* ── Mobile Slide-in Menu ── */}
          <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} />
          <nav className={`mobile-menu-drawer ${mobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-header">
              <Link to="/" className="nav-logo-link" onClick={() => setMobileMenuOpen(false)}>
                <picture>
                  <source srcSet="/logo.webp" type="image/webp" />
                  <img src="/logo.png" alt="NextJobPost Logo" style={{ width: 28, height: 28, borderRadius: 5 }} width="28" height="28" />
                </picture>
                <span className="nav-brand" style={{ fontSize: '1.1rem' }}>
                  <span className="nav-brand-next">Next</span>
                  <span className="nav-brand-job">Job</span>
                  <span className="nav-brand-post">Post</span>
                </span>
              </Link>
              <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mobile-menu-body">
              {/* Govt Jobs Accordion */}
              <div className="mobile-menu-group">
                <button className="mobile-menu-accordion" onClick={() => setMobileGovtOpen(o => !o)}>
                  <span>🏛️ Govt Jobs</span>
                  <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" style={{ transform: mobileGovtOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className={`mobile-menu-sub ${mobileGovtOpen ? 'open' : ''}`}>
                  {govtJobItems.map((item, i) => (
                    <NavLink key={i} to={item.to} className={({ isActive }) => `mobile-menu-sublink ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Exam Updates Accordion */}
              <div className="mobile-menu-group">
                <button className="mobile-menu-accordion" onClick={() => setMobileExamOpen(o => !o)}>
                  <span>📅 Exam Updates</span>
                  <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" style={{ transform: mobileExamOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className={`mobile-menu-sub ${mobileExamOpen ? 'open' : ''}`}>
                  {examUpdatesItems.map((item, i) => (
                    <NavLink key={i} to={item.to} className={({ isActive }) => `mobile-menu-sublink ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* More Categories Accordion */}
              <div className="mobile-menu-group">
                <button className="mobile-menu-accordion" onClick={() => setMobileMoreOpen(o => !o)}>
                  <span>📂 More Categories</span>
                  <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" style={{ transform: mobileMoreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className={`mobile-menu-sub ${mobileMoreOpen ? 'open' : ''}`}>
                  {moreItems.map((item, i) => (
                    <NavLink key={i} to={item.to} className={({ isActive }) => `mobile-menu-sublink ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="mobile-menu-divider" />

              <NavLink to="/student-career-center" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                📝 Practice Tests
              </NavLink>
              <NavLink to="/preparation" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                🎓 Preparation Hub
              </NavLink>

              <NavLink to="/about" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                ℹ️ About Us
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                📞 Contact
              </NavLink>
            </div>
          </nav>

          {isHome && <HeroSearch />}
        </header>
      )}

      <main className={isMobile && isJobDetail ? "container p-0" : isPrepPage ? "container p-0 is-prep-page" : "container py-4"}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            
            {/* Preparation Hub */}
            <Route path="/preparation" element={<PreparationHub />} />
            <Route path="/preparation/aptitude" element={<AptitudePrep />} />
            <Route path="/preparation/technical" element={<TechnicalPrep />} />
            <Route path="/preparation/dsa" element={<DSAPrep />} />
            <Route path="/preparation/company" element={<CompanyPrepPage />} />
            <Route path="/preparation/gov" element={<GovPrepPage />} />
            <Route path="/preparation/mock-tests" element={<MockTests />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/student-career-center" element={<StudentCareerCenter />} />
            <Route path="/salaries" element={<SalarySearch />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/control-center/login" element={<AdminLogin />} />
            {/* Block old /admin routes */}
            <Route path="/admin" element={<Navigate to="/control-center/login" replace />} />
            <Route path="/admin/login" element={<Navigate to="/control-center/login" replace />} />

            {/* Control center — handled above in isAdminPage branch, kept here as fallback */}
            <Route path="/control-center" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Regular user only */}
            <Route path="/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
            <Route path="/onboarding" element={<UserRoute><Onboarding /></UserRoute>} />

            {/* Job detail or category page catch-all */}
            <Route path="/:slug" element={<RootSlugHandler />} />
          </Routes>
        </Suspense>
      </main>
      <PreFooterSections />
      <Footer />
      <SpeedInsights />
    </>
  );
}
