import React, { useRef } from 'react';
import AffiliateCard from './AffiliateCard.jsx';
import { track } from '../../services/analytics/index.js';

export default function AffiliateCarousel({ products = [], category = 'general', type = 'product', accentColor = '#2563eb' }) {
  const scrollRef = useRef(null);

  if (!products || products.length === 0) return null;

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
      try {
        track('Affiliate Carousel Scrolled', {
          direction: dir > 0 ? 'right' : 'left',
          category: category,
          product_type: type
        });
      } catch (err) {}
    }
  };

  return (
    <div style={{ position: 'relative', margin: '1rem 0' }}>
      {/* Scroll style overrides */}
      <style>{`
        .njp-aff-scroll::-webkit-scrollbar {
          height: 5px;
        }
        .njp-aff-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .njp-aff-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .njp-aff-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @media (max-width: 640px) {
          .njp-carousel-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Left button */}
      <button
        className="njp-carousel-btn"
        onClick={() => handleScroll(-1)}
        style={{
          position: 'absolute',
          left: '-16px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          color: '#475569',
          zIndex: 10,
          transition: 'all 150ms ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = accentColor;
          e.currentTarget.style.color = accentColor;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.color = '#475569';
        }}
      >
        ‹
      </button>

      {/* Scrollable Container */}
      <div
        className="njp-aff-scroll"
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '8px',
          scrollbarWidth: 'thin',
          scrollBehavior: 'smooth'
        }}
      >
        {products.map((product, idx) => (
          <div
            key={product.asin || idx}
            style={{
              flex: '0 0 240px',
              scrollSnapAlign: 'start'
            }}
          >
            <AffiliateCard
              product={product}
              category={category}
              type={type}
              accentColor={accentColor}
            />
          </div>
        ))}
      </div>

      {/* Right button */}
      <button
        className="njp-carousel-btn"
        onClick={() => handleScroll(1)}
        style={{
          position: 'absolute',
          right: '-16px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          color: '#475569',
          zIndex: 10,
          transition: 'all 150ms ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = accentColor;
          e.currentTarget.style.color = accentColor;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.color = '#475569';
        }}
      >
        ›
      </button>
    </div>
  );
}
