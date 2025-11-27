import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import JobDetails from './pages/JobDetails.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <header className="site-header sticky-top">
        <div className="header-banner text-center py-3">
          <h1 className="m-0 site-title">Job For Fresher</h1>
        </div>
        <nav className="main-nav navbar navbar-expand-lg py-2">
          <div className="container">
            <ul className="nav mx-auto">
              <li className="nav-item"><Link className="nav-link text-white" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/?type=Full-Time">Jobs</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/?type=Internship">Internship</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/?type=Remote">Work From Home</Link></li>
            </ul>
            <div className="nav-actions ms-auto d-none d-lg-flex align-items-center">
              <button className="btn btn-outline-light btn-sm search-btn" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85v.001zm-5.242 1.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
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
      </main>
      <footer className="text-center text-muted py-4">
        <small>© {new Date().getFullYear()} JobForFreshers Clone</small>
      </footer>
    </AuthProvider>
  );
}
