import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import JoinUpdates from '../components/JoinUpdates.jsx';
import SidebarAd from '../components/SidebarAd.jsx';

// Static current affairs database 2026
const CURRENT_AFFAIRS_DATA = [
  {
    title: 'India successfully launches GSAT-20 Communications Satellite via SpaceX Falcon 9',
    category: 'Science & Tech',
    date: '2026-06-12',
    summary: 'ISRO successfully deployed the high-throughput GSAT-20 communication satellite using SpaceX\'s Falcon 9 launch vehicle, marking the first commercial launch collaboration between ISRO and SpaceX.',
    source: 'Space Commission India'
  },
  {
    title: 'Reserve Bank of India (RBI) holds repo rate steady at 6.5% for fifth consecutive session',
    category: 'Economy',
    date: '2026-06-10',
    summary: 'The Monetary Policy Committee (MPC) of the RBI voted unanimously to keep the policy repo rate unchanged, keeping focus on aligning inflation durably to the 4% target while supporting growth.',
    source: 'Reserve Bank of India'
  },
  {
    title: 'Dr. Soumya Swaminathan appointed as the Chairperson of National Health Commission',
    category: 'National',
    date: '2026-06-08',
    summary: 'The government of India announced the appointment of renowned medical researcher Dr. Soumya Swaminathan to lead the restructured National Health Commission to oversee health policy reforms.',
    source: 'Ministry of Health'
  },
  {
    title: 'G7 Summit 2026: World Leaders sign historic clean energy transmission pact in Italy',
    category: 'International',
    date: '2026-06-05',
    summary: 'The 52nd G7 Summit concluded with member countries signing a multilateral green energy infrastructure funding agreement aimed at accelerating clean energy exports to developing nations.',
    source: 'Global Summit Wire'
  },
  {
    title: 'India wins Gold at the World Archery Championship 2026 in Switzerland',
    category: 'Sports',
    date: '2026-06-03',
    summary: 'The Indian compound archery team defeated South Korea in a thrilling final match to claim the gold medal, registering India\'s best-ever performance at the international tournament.',
    source: 'Sports Authority of India'
  },
  {
    title: 'DRDO conducts successful flight test of new generation Agni-Prime ballistic missile',
    category: 'Science & Tech',
    date: '2026-05-30',
    summary: 'Defense Research and Development Organisation (DRDO) successfully test-fired the canisterized Agni-Prime missile off the coast of Odisha, demonstrating high-accuracy target destruction.',
    source: 'DRDO Press Release'
  }
];

export default function CurrentAffairsHub() {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'National', 'International', 'Economy', 'Science & Tech', 'Sports'];

  const filteredItems = activeTab === 'All'
    ? CURRENT_AFFAIRS_DATA
    : CURRENT_AFFAIRS_DATA.filter(item => item.category === activeTab);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="current-affairs-page">
      <Helmet>
        <title>Daily Current Affairs 2026 – GK Updates & News for Sarkari Exams</title>
        <meta name="description" content="Stay updated with daily current affairs and general knowledge (GK) updates for SSC, UPSC, Bank, and Railway exams. View categorized news and preparation summaries." />
        <link rel="canonical" href={`${window.location.origin}/current-affairs`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Daily Current Affairs 2026 – GK Updates & News for Sarkari Exams" />
        <meta property="og:description" content="Stay updated with daily current affairs and general knowledge (GK) updates for SSC, UPSC, Bank, and Railway exams." />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
      </Helmet>

      {/* Header Banner */}
      <div className="mb-4 text-center py-4 bg-light rounded shadow-sm px-3" style={{ borderLeft: '5px solid #ec4899' }}>
        <h1 className="h2 fw-bold text-dark mb-2">📰 Daily Current Affairs & GK 2026</h1>
        <p className="text-muted fs-6 max-width-600 mx-auto mb-0">
          Stay informed with daily national & international general knowledge updates curated specifically for competitive exams like UPSC, SSC, Banking, and State PSCs.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          
          {/* Navigation Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === cat ? '#ec4899' : '#f1f5f9',
                  color: activeTab === cat ? '#ffffff' : '#475569',
                  transition: 'all 150ms ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Current Affairs Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredItems.map((item, idx) => (
              <article
                key={idx}
                className="current-affairs-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#ec4899',
                      backgroundColor: '#fdf2f8',
                      padding: '4px 10px',
                      borderRadius: '12px'
                    }}
                  >
                    {item.category}
                  </span>
                  <time className="text-muted small" style={{ fontSize: '0.8rem' }}>
                    {formatDate(item.date)}
                  </time>
                </div>
                
                <h3 className="h5 fw-bold mb-2.5" style={{ color: '#1e293b', lineHeight: '1.35' }}>
                  {item.title}
                </h3>
                
                <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {item.summary}
                </p>

                <div className="d-flex align-items-center justify-content-between pt-2.5" style={{ borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <span>Source: {item.source}</span>
                  <a href="/preparation/gov" className="fw-bold" style={{ color: '#ec4899', textDecoration: 'none' }}>
                    Practice GK Questions →
                  </a>
                </div>
              </article>
            ))}
          </div>

        </div>

        <div className="col-12 col-lg-4 col-right">
          <JoinUpdates />
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}
export { CURRENT_AFFAIRS_DATA };
