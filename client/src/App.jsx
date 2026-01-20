import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';
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
      <header className="site-header">
        <div className="header-banner text-center">
          <div className="logo-banner-wrapper">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fc302f9de22234efc941990700131730c%2Fb10aab7ac8894017bd0806e41dd588ee?format=webp&width=800"
              alt="NextJobPost Logo"
              className="logo-img"
            />
            <h1 className="m-0 site-title"><span className="site-title-next">Next</span><span className="site-title-job">JobPost</span></h1>
          </div>
        </div>
        <nav className="main-nav navbar navbar-expand-lg py-2">
          <div className="container">
            <ul className="nav mx-auto">
              <li className="nav-item"><Link className="nav-link text-white" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/?type=Full-Time">Jobs</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/?type=Internship">Internship</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/?type=Remote">Work From Home</Link></li>
            </ul>
            {/* Search icon removed per request */}
          </div>
        </nav>
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
      <Footer />
    </AuthProvider>
  );
}
