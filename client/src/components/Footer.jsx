import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-nav">
        <div className="container">
          <nav className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/terms">Terms and Conditions</Link>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright-text">
            Copyright © {new Date().getFullYear()} NextJobPost | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
