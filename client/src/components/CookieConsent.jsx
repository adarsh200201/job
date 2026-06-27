import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('njp_cookie_consent');
    if (!consent) {
      // Small delay for smooth entry after page loads
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('njp_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('njp_cookie_consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        maxWidth: '420px',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        color: '#f8fafc',
        animation: 'slideIn 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateY(100px) scale(0.95);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
          @media (max-width: 480px) {
            .cookie-banner {
              bottom: 12px !important;
              right: 12px !important;
              left: 12px !important;
              max-width: calc(100% - 24px) !important;
            }
          }
        `}
      </style>
      <div className="cookie-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🍪</span>
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Cookie Consent</h4>
        </div>
        <p style={{ fontSize: '0.82rem', lineHeight: '1.5', color: '#cbd5e1', margin: '0 0 16px 0' }}>
          NextJobPost uses cookies to personalize ads, analyze site traffic, and optimize your preparation experience. Read our{' '}
          <Link to="/privacy" style={{ color: '#60a5fa', textDecoration: 'underline', fontWeight: '600' }}>
            Privacy Policy
          </Link>{' '}
          to learn more.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleReject}
            style={{
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#94a3b8',
              backgroundColor: 'transparent',
              border: '1px solid #475569',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.borderColor = '#64748b';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = '#475569';
            }}
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            style={{
              padding: '8px 20px',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#ffffff',
              backgroundColor: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
