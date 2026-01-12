import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" style={{ background: 'linear-gradient(180deg, #162c4a 0%, #0d1b2a 100%)', color: '#fff', paddingTop: '3rem', paddingBottom: '1rem', marginTop: '4rem' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#36d37b', marginBottom: '1rem' }}>Job For Fresher</h5>
              <p style={{ color: '#b0c4de', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Your trusted source for fresher job opportunities, internships, and career guidance. We help fresh graduates find their dream jobs.
              </p>
              {/* Social Links */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(54, 211, 123, 0.1)', color: '#36d37b', border: '1px solid #36d37b', textDecoration: 'none', transition: 'all 200ms ease' }} onMouseEnter={(e) => { e.target.style.background = '#36d37b'; e.target.style.color = '#162c4a'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(54, 211, 123, 0.1)'; e.target.style.color = '#36d37b'; }}>
                  <span style={{ fontSize: '1.2rem' }}>f</span>
                </a>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(26, 161, 220, 0.1)', color: '#1aa1dc', border: '1px solid #1aa1dc', textDecoration: 'none', transition: 'all 200ms ease' }} onMouseEnter={(e) => { e.target.style.background = '#1aa1dc'; e.target.style.color = '#162c4a'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(26, 161, 220, 0.1)'; e.target.style.color = '#1aa1dc'; }}>
                  𝕏
                </a>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(233, 30, 99, 0.1)', color: '#e91e63', border: '1px solid #e91e63', textDecoration: 'none', transition: 'all 200ms ease' }} onMouseEnter={(e) => { e.target.style.background = '#e91e63'; e.target.style.color = '#fff'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(233, 30, 99, 0.1)'; e.target.style.color = '#e91e63'; }}>
                  📸
                </a>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(42, 157, 244, 0.1)', color: '#2a9df4', border: '1px solid #2a9df4', textDecoration: 'none', transition: 'all 200ms ease' }} onMouseEnter={(e) => { e.target.style.background = '#2a9df4'; e.target.style.color = '#fff'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(42, 157, 244, 0.1)'; e.target.style.color = '#2a9df4'; }}>
                  in
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: '#fff' }}>Quick Links</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Home</Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/?type=Full-Time" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Jobs</Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/?type=Internship" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Internship</Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/?type=Remote" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Work From Home</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: '#fff' }}>Resources</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/about" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>About Us</Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/contact" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Contact Us</Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/blog" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Blog</Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/faq" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: '#fff' }}>Legal</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/privacy-policy" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Privacy Policy</Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/terms" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Terms & Conditions</Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/disclaimer" style={{ color: '#b0c4de', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(176, 196, 222, 0.2)', marginBottom: '1.5rem' }} />

        {/* Bottom Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', color: '#b0c4de', fontSize: '0.9rem' }}>
          <div>
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} Job For Fresher. All Rights Reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy-policy" style={{ color: '#b0c4de', textDecoration: 'none', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Privacy</Link>
            <Link to="/terms" style={{ color: '#b0c4de', textDecoration: 'none', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Terms</Link>
            <Link to="/disclaimer" style={{ color: '#b0c4de', textDecoration: 'none', fontSize: '0.85rem' }} onMouseEnter={(e) => e.target.style.color = '#36d37b'} onMouseLeave={(e) => e.target.style.color = '#b0c4de'}>Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
