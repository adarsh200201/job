import React from 'react';
import AffiliateCard from './AffiliateCard.jsx';

export default function AffiliateGrid({ products = [], category = 'general', type = 'product', accentColor = '#2563eb' }) {
  if (!products || products.length === 0) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '16px',
      margin: '1rem 0'
    }}>
      {products.map((product, idx) => (
        <AffiliateCard
          key={product.asin || idx}
          product={product}
          category={category}
          type={type}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}
