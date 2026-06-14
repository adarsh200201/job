import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarCareerHub({ contextTitle = '' }) {
  const normalizedTitle = contextTitle.toLowerCase();
  const isSsc = normalizedTitle.includes('ssc');
  const isRailway = normalizedTitle.includes('railway') || normalizedTitle.includes('rrb') || normalizedTitle.includes('rrc');

  if (!isSsc && !isRailway) return null;

  const hubConfig = isSsc ? {
    title: 'SSC Exam Hub 2026',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)',
    shadow: 'rgba(124, 58, 237, 0.15)',
    items: [
      { label: '📋 SSC Jobs & Vacancies', to: '/ssc-jobs' },
      { label: '📢 SSC Exam Results', to: '/ssc-results' },
      { label: '🪪 SSC Admit Cards', to: '/ssc-admit-cards' },
      { label: '🎓 SSC Exam Syllabus', to: '/ssc-syllabus' },
      { label: '📚 SSC Preparation Strategy', to: '/ssc-preparation' }
    ]
  } : {
    title: 'Railway Exam Hub 2026',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    shadow: 'rgba(5, 150, 105, 0.15)',
    items: [
      { label: '🚂 Railway Jobs & Openings', to: '/railway-jobs' },
      { label: '📢 RRB Exam Results', to: '/railway-results' },
      { label: '🪪 RRB Admit Cards', to: '/railway-admit-cards' },
      { label: '🎓 RRB Exam Syllabus', to: '/railway-syllabus' },
      { label: '📚 RRB Preparation Strategy', to: '/railway-preparation' }
    ]
  };

  return (
    <div
      className="sidebar-career-hub-card mb-4"
      style={{
        width: '100%',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'all 200ms ease'
      }}
    >
      {/* Card Header with brand gradient */}
      <div
        style={{
          background: hubConfig.gradient,
          padding: '1.25rem 1.5rem',
          color: '#ffffff',
          position: 'relative'
        }}
      >
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
          {hubConfig.title}
        </h4>
        <span
          style={{
            position: 'absolute',
            bottom: '-10px',
            right: '15px',
            fontSize: '3rem',
            opacity: 0.15,
            lineHeight: 1,
            pointerEvents: 'none'
          }}
        >
          {isSsc ? '📋' : '🚂'}
        </span>
      </div>

      {/* Hub Links */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.4' }}>
          Quick links to notifications, syllabus updates, exam results, and study resources:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {hubConfig.items.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.to}
                className="d-flex align-items-center"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#334155',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isSsc ? '#f5f3ff' : '#ecfdf5';
                  e.currentTarget.style.borderColor = isSsc ? '#c084fc' : '#34d399';
                  e.currentTarget.style.color = isSsc ? '#7c3aed' : '#059669';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#f1f5f9';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
