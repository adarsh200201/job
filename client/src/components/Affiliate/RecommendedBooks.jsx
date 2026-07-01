import React, { useState } from 'react';
import { AFFILIATE_DATA } from '../../data/affiliateProducts.js';
import AffiliateGrid from './AffiliateGrid.jsx';
import AffiliateCarousel from './AffiliateCarousel.jsx';
import { track } from '../../services/analytics/index.js';

export default function RecommendedBooks({ initialCategory = 'dsa', viewType = 'grid' }) {
  const data = AFFILIATE_DATA.books;
  const [activeTab, setActiveTab] = useState(initialCategory);

  const handleTabChange = (key) => {
    setActiveTab(key);
    try {
      track('Affiliate Book Category Switched', {
        category_key: key,
        category_label: data.categories[key]?.label
      });
    } catch (err) {}
  };

  const categories = Object.keys(data.categories).map(key => ({
    key,
    ...data.categories[key]
  }));

  const activeCategoryData = data.categories[activeTab] || data.categories.dsa;

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📚</span> {data.title}
        </h3>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>{data.subtitle}</p>
      </div>

      {/* Tabs list */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '16px',
        borderBottom: '1px solid #f1f5f9',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => {
          const isActive = activeTab === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => handleTabChange(cat.key)}
              style={{
                whiteSpace: 'nowrap',
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: isActive ? '#2563eb' : '#f1f5f9',
                color: isActive ? '#ffffff' : '#475569',
                fontSize: '0.8rem',
                fontWeight: isActive ? '800' : '600',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Books listing */}
      <div>
        {viewType === 'grid' ? (
          <AffiliateGrid
            products={activeCategoryData.items}
            category={activeTab}
            type="books"
            accentColor="#2563eb"
          />
        ) : (
          <AffiliateCarousel
            products={activeCategoryData.items}
            category={activeTab}
            type="books"
            accentColor="#2563eb"
          />
        )}
      </div>

      {/* Policy compliance notice */}
      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '0.7rem',
        color: '#94a3b8',
        fontStyle: 'italic'
      }}>
        As an Amazon Associate, NextJobPost earns a qualifying commission from purchases.
      </div>
    </div>
  );
}
