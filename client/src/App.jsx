import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import PreFooterSections from './components/PreFooterSections.jsx';
import HeroSearch from './components/HeroSearch.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { startKeepAlive, stopKeepAlive } from './utils/keepAlive.js';

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

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}

function NavActions() {
  const { token, username, logout } = useAuth();
  if (token) {
    return (
      <div className="nav-top-actions">
        <Link
          to="/admin"
          className="nav-user-name"
        >
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

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  useEffect(() => {
    // Start keep-alive mechanism when app loads
    startKeepAlive();

    // Clean up when component unmounts
    return () => {
      stopKeepAlive();
    };
  }, []);

  const scrollToSearch = () => {
    const el = document.getElementById('sidebar-search');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/?focus=search';
    }
  };

  return (
    <AuthProvider>
      <AppLayout scrollToSearch={scrollToSearch} />
    </AuthProvider>
  );
}

function AppLayout({ scrollToSearch }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {/* Monster.com-style two-row header */}
      <header className="site-header">
        {/* Top bar: white, logo left + auth buttons right */}
        <div className="nav-top-bar">
          <div className="nav-top-inner">
            <Link to="/" className="nav-logo-link">
              <img
                src="/logo.png"
                alt="NextJobPost Logo"
                className="logo-img-nav"
              />
              <span className="nav-brand">
                <span className="nav-brand-next">Next</span><span className="nav-brand-job">Job</span><span className="nav-brand-post">Post</span>
              </span>
            </Link>
            <NavActions />
          </div>
        </div>

        {/* Secondary bar: light gray with nav links */}
        <nav className="nav-secondary-bar">
          <div className="nav-secondary-inner">
            <ul className="nav-links">
              <li><Link className="nav-link" to="/">Find Jobs</Link></li>
              <li><Link className="nav-link" to="/?type=Internship">Internships</Link></li>
              <li><Link className="nav-link" to="/?type=Remote">Work From Home</Link></li>
              <li><Link className="nav-link" to="/about">About</Link></li>
              <li><Link className="nav-link" to="/blog">Career Advice</Link></li>
            </ul>
          </div>
        </nav>

        {/* Hero search - only on homepage */}
        {isHome && <HeroSearch />}
      </header>

      <main className="container py-4">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:slug" element={<JobDetails />} />
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
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <PreFooterSections />
      <Footer />
    </>
  );
}
