import React, { useEffect, useState } from 'react';
import api from '../api/index.js';
import { trackAdClicked } from '../utils/analytics.js';
import GoogleAd from './GoogleAd.jsx';

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

// ── Replace with your actual AdSense slot IDs from your AdSense dashboard ──
// Go to: https://adsense.google.com → Ads → By ad unit → Create new ad unit
const ADSENSE_SIDEBAR_SLOT    = '';  // e.g. '1234567890' — sidebar/vertical
const ADSENSE_INLINE_SLOT     = '';  // e.g. '0987654321' — between job cards

export { ADSENSE_INLINE_SLOT };

export default function SidebarAd() {
  const [adLink, setAdLink] = useState(DEFAULT_AD_LINK);

  useEffect(() => {
    api.get('/settings/adLink')
      .then(res => { if (res.data?.data) setAdLink(res.data.data); })
      .catch(() => {});
  }, []);

  const handleClick = () => {
    trackAdClicked('sidebar_banner');
    window.open(adLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Google AdSense unit (sidebar) ──────────────────────────── */}
      {ADSENSE_SIDEBAR_SLOT ? (
        <GoogleAd
          slot={ADSENSE_SIDEBAR_SLOT}
          format="auto"
          style={{ minHeight: 250, background: '#f9fafb', borderRadius: '12px', overflow: 'hidden' }}
        />
      ) : null}

      {/* ── Custom promo banner ────────────────────────────────────── */}
      <div
        className="sidebar-ad-card"
        onClick={handleClick}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(79,70,229,0.15)',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 15px 30px rgba(79,70,229,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(79,70,229,0.15)';
        }}
      >
        {/* Decorative blur */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-50%',
          width: '150%', height: '150%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-block', padding: '0.2rem 0.6rem',
          background: 'rgba(255,255,255,0.15)', borderRadius: '20px',
          fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.05em', marginBottom: '1rem', color: '#e0e7ff'
        }}>
          Sponsored Resource
        </div>

        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: '1.3' }}>
          Level Up Your Coding Career 🚀
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: '1.5', marginBottom: '1.25rem' }}>
          Prepare for technical coding interviews with next-level interactive roadmaps, mock tests, and real interviewer feedback.
        </p>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '0.88rem', fontWeight: 700, color: '#ffffff',
          borderBottom: '2px solid #ffffff', paddingBottom: '2px', transition: 'all 150ms ease'
        }}>
          Claim 20% Off Prep Tools →
        </div>
      </div>

    </div>
  );
}
