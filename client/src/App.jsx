import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import JobDetails from './pages/JobDetails.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Footer from './components/Footer.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
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
            {/* Search icon removed per request */}
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
      <Footer />
    </AuthProvider>
  );
}
