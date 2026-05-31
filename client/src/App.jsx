import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import PreFooterSections from './components/PreFooterSections.jsx';
import HeroSearch from './components/HeroSearch.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { startKeepAlive, stopKeepAlive } from './utils/keepAlive.js';
import { trackPageView } from './utils/analytics.js';
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

// Header auth buttons
function NavActions() {
  const { token, username, logout, isAdmin } = useAuth();
  if (token) {
    return (
      <div className="nav-top-actions">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="nav-user-name">
          👋 {username}
        </Link>
        <button
          onClick={logout}
          className="btn-nav-login"
          style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
        >
          Log out
        </button>
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

  useEffect(() => {
    trackPageView(location.pathname);

    // List of predefined static pages that don't do async data fetching
    const staticPaths = [
      '/student-career-center',
      '/about',
      '/contact',
      '/faq',
      '/blog',
      '/terms',
      '/disclaimer',
      '/login',
      '/signup',
      '/auth/callback',
      '/admin/login',
      '/admin',
      '/dashboard',
      '/onboarding'
    ];

    if (staticPaths.includes(location.pathname)) {
      window.prerenderReady = true;
    } else {
      // Dynamic pages (Home, JobDetails, SalarySearch) fetch their own data
      // and will set window.prerenderReady to true when finished.
      window.prerenderReady = false;
    }
  }, [location.pathname, location.search]);

  return (
    <>
      <ScrollToTop />
      <header className="site-header">
        {/* Top bar */}
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

        {/* Secondary nav */}
        <nav className="nav-secondary-bar">
          <div className="nav-secondary-inner">
            <ul className="nav-links">
              <li><NavLink className="nav-link" to="/" end>Find Jobs</NavLink></li>
              <li><NavLink className="nav-link" to="/?type=Internship">Internships</NavLink></li>
              <li><NavLink className="nav-link" to="/?type=Remote">Work From Home</NavLink></li>
              <li><NavLink className="nav-link" to="/about">About</NavLink></li>
              <li><NavLink className="nav-link" to="/blog">Career Advice</NavLink></li>
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
