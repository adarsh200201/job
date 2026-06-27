import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('njp_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
        requestAnimationFrame(() => setTimeout(() => setVisible(true), 20));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = (choice) => {
    setVisible(false);
    setTimeout(() => {
      localStorage.setItem('njp_cookie_consent', choice);
      setShowBanner(false);
    }, 380);
  };

  if (!showBanner) return null;

  return (
    <>
      <style>{`
        @keyframes njpCookieUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes njpCookieDown {
          from { transform: translateY(0);    opacity: 1; }
          to   { transform: translateY(100%); opacity: 0; }
        }
        .njp-cookie-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 99999;
          background: #ffffff;
          border-top: 3px solid transparent;
          border-image: linear-gradient(90deg, #2563eb, #7c3aed, #0ea5e9) 1;
          box-shadow: 0 -4px 32px rgba(0,0,0,0.10);
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          font-family: 'Inter', system-ui, sans-serif;
          animation: njpCookieUp 420ms cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .njp-cookie-bar.hiding {
          animation: njpCookieDown 360ms cubic-bezier(0.4,0,1,1) forwards;
        }
        .njp-cookie-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 260px;
        }
        .njp-cookie-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          flex-shrink: 0;
          border: 1px solid #bfdbfe;
        }
        .njp-cookie-text h5 {
          margin: 0 0 2px 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .njp-cookie-text p {
          margin: 0;
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.5;
        }
        .njp-cookie-text a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }
        .njp-cookie-text a:hover { text-decoration: underline; }
        .njp-cookie-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .njp-btn-reject {
          padding: 9px 18px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 150ms ease;
          white-space: nowrap;
        }
        .njp-btn-reject:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #334155;
        }
        .njp-btn-accept {
          padding: 9px 22px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 150ms ease;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(37,99,235,0.30);
          letter-spacing: 0.01em;
        }
        .njp-btn-accept:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37,99,235,0.38);
        }
        .njp-btn-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 1.1rem;
          padding: 4px 6px;
          border-radius: 6px;
          transition: all 150ms ease;
          line-height: 1;
          margin-left: 4px;
        }
        .njp-btn-close:hover { color: #475569; background: #f1f5f9; }
        @media (max-width: 600px) {
          .njp-cookie-bar { padding: 16px 16px; gap: 14px; }
          .njp-cookie-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>

      <div className={`njp-cookie-bar${!visible ? ' hiding' : ''}`} role="dialog" aria-label="Cookie consent">
        {/* Left: Icon + Text */}
        <div className="njp-cookie-left">
          <div className="njp-cookie-icon">🍪</div>
          <div className="njp-cookie-text">
            <h5>We use cookies</h5>
            <p>
              To personalize content, analyze traffic &amp; improve your experience.{' '}
              <Link to="/privacy" onClick={() => dismiss('accepted')}>Privacy Policy</Link>
            </p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="njp-cookie-actions">
          <button className="njp-btn-reject" onClick={() => dismiss('rejected')}>
            Decline
          </button>
          <button className="njp-btn-accept" onClick={() => dismiss('accepted')}>
            ✓ Accept All
          </button>
          <button className="njp-btn-close" onClick={() => dismiss('dismissed')} aria-label="Close">
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
