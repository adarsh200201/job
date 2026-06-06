import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import PreFooterSections from './components/PreFooterSections.jsx';
import HeroSearch from './components/HeroSearch.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { startKeepAlive, stopKeepAlive } from './utils/keepAlive.js';
import { trackPageView, useScrollDepth } from './utils/analytics.js';
import ScrollToTop from './components/ScrollToTop.jsx';

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
        <span style={{ fontSize: '1rem' }}>👤</span>
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
            to={isAdmin ? '/admin' : '/dashboard'}
            onClick={() => setOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', textDecoration: 'none', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>🏠</span> {isAdmin ? 'Admin Panel' : 'My Profile'}
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
function NavDropdown({ label, items }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <li ref={ref} style={{ position: 'relative', listStyle: 'none' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0.45rem 1rem', borderRadius: '9999px',
          fontWeight: 600, fontSize: '0.92rem', color: '#475569',
          transition: 'all 200ms', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#1A3A6B'; e.currentTarget.style.background = 'rgba(26,58,107,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'none'; }}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', opacity: 0.6 }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          minWidth: '210px', zIndex: 9999, padding: '6px 0',
          animation: 'dropdownFade 0.15s ease',
        }}>
          {items.map((item, i) => (
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
          ))}
        </div>
      )}
    </li>
  );
}

// Admin-only protected route
function AdminRoute({ children }) {
  const { token, isAdmin } = useAuth();
  if (!token || !isAdmin) return <Navigate to="/admin/login" replace />;
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
  const isHome = location.pathname === '/';

  // Track scroll depth globally on all pages
  useScrollDepth(location.pathname);

  useEffect(() => {
    const staticPaths = [
      '/', '/student-career-center', '/salaries', '/about', '/contact',
      '/faq', '/blog', '/terms', '/disclaimer', '/login', '/signup',
      '/auth/callback', '/admin/login', '/admin', '/dashboard', '/onboarding', '/privacy'
    ];
    const isJobDetail = !staticPaths.includes(location.pathname);
    
    // Track Page View for core/static pages. JobDetails page view is tracked in its own component once loaded.
    if (!isJobDetail) {
      const params = new URLSearchParams(location.search);
      const category = params.get('type') || params.get('q') || 'General';
      
      trackPageView(location.pathname, {
        category: category
      });
    }

    // Prerender.io lifecycle signaling:
    if (staticPaths.includes(location.pathname) && location.pathname !== '/') {
      window.prerenderReady = true;
    } else {
      window.prerenderReady = false;
    }
  }, [location.pathname, location.search]);

  /* ── Nav dropdown link configs ── */
  const govtJobItems = [
    { label: '🏛️ All Govt Jobs',     to: '/?type=Full-Time' },
    { label: '📋 SSC Jobs',           to: '/?q=SSC' },
    { label: '🚂 Railway Jobs',       to: '/?q=Railway' },
    { label: '🏦 Banking Jobs',       to: '/?q=Banking' },
    { label: '⚔️ Defence Jobs',       to: '/?q=Defence' },
    { label: '👮 Police Jobs',        to: '/?q=Police' },
    { label: '📚 Teaching Jobs',      to: '/?q=Teacher' },
    { label: '🏥 Medical Jobs',       to: '/?q=Medical' },
    { label: '🔬 PSU Jobs',           to: '/?q=PSU' },
    { label: '⚙️ Engineering Jobs',   to: '/?q=Engineer' },
  ];

  const resultItems = [
    { label: '📢 Latest Results',   to: '/?q=Result' },
    { label: '🎓 Board Results',    to: '/?q=Board+Result' },
    { label: '📊 Exam Results',     to: '/?q=Exam+Result' },
    { label: '✅ Final Merit List', to: '/?q=Merit+List' },
  ];

  const admitCardItems = [
    { label: '🪪 All Admit Cards', to: '/?q=Admit+Card' },
    { label: '📄 Hall Ticket',     to: '/?q=Hall+Ticket' },
    { label: '🔑 Call Letter',     to: '/?q=Call+Letter' },
  ];

  const answerKeyItems = [
    { label: '🗝️ All Answer Keys',     to: '/?q=Answer+Key' },
    { label: '📝 Provisional Key',     to: '/?q=Provisional+Answer+Key' },
    { label: '✅ Final Answer Key',    to: '/?q=Final+Answer+Key' },
  ];

  const moreItems = [
    { label: '📅 Exam Calendar',   to: '/blog' },
    { label: '💰 Salary Search',   to: '/salaries' },
    { label: '📚 Career Advice',   to: '/blog' },
    { label: '🎓 Student Center',  to: '/student-career-center' },
    { label: '❓ FAQ',             to: '/faq' },
    { label: '📞 Contact Us',      to: '/contact' },
  ];

  return (
    <>
      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <ScrollToTop />
      <header className="site-header">
        {/* ── Row 1: Logo + Auth ── */}
        <div className="nav-top-bar">
          <div className="nav-top-inner">
            <Link to="/" className="nav-logo-link">
              <img src="/logo.png" alt="NextJobPost Logo" className="logo-img-nav" />
              <span className="nav-brand">
                <span className="nav-brand-next">Next</span>
                <span className="nav-brand-job">Job</span>
                <span className="nav-brand-post">Post</span>
              </span>
            </Link>
            <NavActions />
          </div>
        </div>

        {/* ── Row 2: Category Nav (govtjobsalert.in style) ── */}
        <nav className="nav-secondary-bar">
          <div className="nav-secondary-inner">
            <ul className="nav-links" style={{ flexWrap: 'nowrap', overflowX: 'auto', gap: '0', paddingBottom: '0' }}>
              <NavDropdown label="Govt Jobs" items={govtJobItems} />
              <NavDropdown label="Result"    items={resultItems} />
              <NavDropdown label="Admit Card" items={admitCardItems} />
              <NavDropdown label="Answer Key" items={answerKeyItems} />

              <li style={{ listStyle: 'none' }}>
                <NavLink className="nav-link" to="/?type=Internship">Internships</NavLink>
              </li>
              <li style={{ listStyle: 'none' }}>
                <NavLink className="nav-link" to="/?type=Remote">Work From Home</NavLink>
              </li>

              <NavDropdown label="More" items={moreItems} />
            </ul>
          </div>
        </nav>

        {isHome && <HeroSearch />}
      </header>

      <main className="container py-4">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
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
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin only */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Regular user only */}
            <Route path="/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
            <Route path="/onboarding" element={<UserRoute><Onboarding /></UserRoute>} />

            {/* Job detail catch-all */}
            <Route path="/:slug" element={<JobDetails />} />
          </Routes>
        </Suspense>
      </main>
      <PreFooterSections />
      <Footer />
    </>
  );
}
