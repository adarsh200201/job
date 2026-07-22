import React from 'react';
import { triggerAd } from '../utils/adUtils.js';

export default function JoinUpdates() {
  const whatsappLink = 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ';
  const telegramLink = 'https://t.me/nextjobpost';

  return (
    <div className="join-updates-card" style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 8px 24px rgba(22,44,74,0.06)',
      border: '1px solid #f0f4f8',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      width: '100%',
      position: 'relative',
      zIndex: 50
    }}>
      {/* Header with Underline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '800',
          color: '#162c4a',
          margin: 0,
          textAlign: 'left'
        }}>
          Join Us for Updates
        </h3>
        <div style={{
          width: '100%',
          height: '3px',
          background: '#f97316', // Orange line
          borderRadius: '2px'
        }} />
      </div>

      {/* Content text */}
      <p style={{
        fontSize: '1rem',
        color: '#465a6b',
        margin: 0,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        Get instant alerts on your phone!
      </p>

      {/* Buttons wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {/* WhatsApp Button */}
        <a 
          href={whatsappLink}
          onClick={triggerAd}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #128C7E, #25D366)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(37,211,102,0.2)',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,211,102,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,211,102,0.2)';
          }}
        >
          <span>📱</span> Join WhatsApp Channel
        </a>

        {/* Telegram Button */}
        <a 
          href={telegramLink}
          onClick={triggerAd}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #0088cc, #24A1DE)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(0,136,204,0.2)',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,136,204,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,136,204,0.2)';
          }}
        >
          <span>✈️</span> Join Telegram Channel
        </a>
      </div>
    </div>
  );
}
