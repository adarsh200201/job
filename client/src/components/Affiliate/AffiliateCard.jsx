import React, { useState } from 'react';
import { track } from '../../services/analytics/index.js';

export default function AffiliateCard({ product, category = 'general', type = 'product', accentColor = '#2563eb' }) {
  const [imgErr, setImgErr] = useState(false);
  const [fallbackTried, setFallbackTried] = useState(false);
  const [hovered, setHovered] = useState(false);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const amzLink = product.author
    ? `https://www.amazon.in/s?k=${encodeURIComponent(product.title + ' ' + product.author)}&tag=nextjobpost-21`
    : `https://www.amazon.in/dp/${product.asin}?tag=nextjobpost-21`;

  const handleClick = () => {
    try {
      track('Affiliate Link Clicked', {
        asin: product.asin,
        title: product.title,
        price: product.price,
        category: category,
        product_type: type,
        store_id: 'nextjobpost-21',
        url: amzLink
      });
    } catch (err) {
      console.error('[Analytics] Click tracking error:', err);
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span style={{ color: '#f59e0b', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  return (
    <a
      href={amzLink}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '12px',
        border: hovered ? `2px solid ${accentColor}` : '2.5px solid #f1f5f9',
        boxShadow: hovered ? `0 10px 24px ${accentColor}18` : '0 2px 8px rgba(0,0,0,0.04)',
        textDecoration: 'none',
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        fontFamily: "'Inter', sans-serif"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 3,
          background: '#16a34a', color: '#ffffff',
          fontWeight: '800', fontSize: '0.7rem',
          padding: '3px 8px', borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(22,163,74,0.3)',
        }}>
          ↓{discount}% OFF
        </div>
      )}

      {/* Top Badge */}
      {product.badge && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 3,
          background: accentColor, color: '#ffffff',
          fontWeight: '700', fontSize: '0.62rem',
          padding: '3px 8px', borderRadius: '8px',
          letterSpacing: '0.02em'
        }}>
          {product.badge}
        </div>
      )}

      {/* Image Container */}
      <div style={{
        background: `linear-gradient(135deg, ${accentColor}06, ${accentColor}12)`,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '190px',
        position: 'relative'
      }}>
        {imgErr ? (
          <div style={{ fontSize: '3rem' }}>📚</div>
        ) : (
          <img
            src={
              fallbackTried
                ? `https://books.google.com/books/content?vid=ISBN${product.asin}&printsec=frontcover&img=1&zoom=1`
                : `https://covers.openlibrary.org/b/isbn/${product.asin}-L.jpg?default=false`
            }
            alt={product.title}
            loading="lazy"
            onError={() => {
              if (!fallbackTried) {
                setFallbackTried(true);
              } else {
                setImgErr(true);
              }
            }}
            style={{
              maxHeight: '160px',
              maxWidth: '125px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '6px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              transition: 'transform 200ms ease',
              transform: hovered ? 'scale(1.05) rotate(1deg)' : 'none',
            }}
          />
        )}
      </div>

      {/* Body Details */}
      <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <div style={{
          fontWeight: '800',
          fontSize: '0.86rem',
          color: '#0f172a',
          lineHeight: '1.35',
          marginBottom: '4px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.2rem'
        }}>
          {product.title}
        </div>

        {/* Brand / Author */}
        {product.author && (
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '6px' }}>
            by {product.author}
          </div>
        )}

        {/* Description */}
        <div style={{
          fontSize: '0.72rem',
          color: '#475569',
          lineHeight: '1.4',
          marginBottom: '8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '1.9rem'
        }}>
          {product.desc}
        </div>

        {/* Rating Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          {renderStars(product.rating)}
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' }}>
            {product.rating} ({product.reviews.toLocaleString('en-IN')})
          </span>
        </div>

        {/* Pricing & CTA */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#b45309' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: '600', marginLeft: '2px' }}>
              (approx.)
            </span>
            {product.mrp > product.price && (
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ff9900',
            color: '#0f172a',
            fontWeight: '800',
            fontSize: '0.78rem',
            padding: '9px 0',
            borderRadius: '8px',
            transition: 'background 150ms ease',
            boxShadow: hovered ? '0 4px 12px rgba(255,153,0,0.35)' : 'none',
            gap: '6px',
            border: '1px solid #e68a00'
          }}>
            <span>🛒</span> Buy on Amazon
          </div>
        </div>
      </div>
    </a>
  );
}
