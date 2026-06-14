import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import JoinUpdates from '../components/JoinUpdates.jsx';
import SidebarAd from '../components/SidebarAd.jsx';

// Data for major exams in 2026
const CALENDAR_DATA = [
  {
    exam: 'SSC CGL 2026',
    board: 'SSC',
    notification: '2026-06-15',
    start: '2026-06-15',
    end: '2026-07-14',
    examDate: 'Sept - Oct 2026',
    status: 'Upcoming',
    link: '/ssc-syllabus'
  },
  {
    exam: 'SSC CHSL 2026',
    board: 'SSC',
    notification: '2026-04-02',
    start: '2026-04-02',
    end: '2026-05-07',
    examDate: 'July 2026',
    status: 'Closed',
    link: '/ssc-jobs'
  },
  {
    exam: 'SSC MTS 2026',
    board: 'SSC',
    notification: '2026-05-27',
    start: '2026-05-27',
    end: '2026-06-25',
    examDate: 'Aug - Sept 2026',
    status: 'Apply Now',
    link: '/ssc-jobs'
  },
  {
    exam: 'UPSC Civil Services (IAS) 2026',
    board: 'UPSC',
    notification: '2026-02-11',
    start: '2026-02-11',
    end: '2026-03-03',
    examDate: 'May 31, 2026',
    status: 'Closed',
    link: '/upsc-jobs'
  },
  {
    exam: 'UPSC NDA & NA (I) 2026',
    board: 'UPSC',
    notification: '2026-12-18',
    start: '2026-12-18',
    end: '2027-01-07',
    examDate: 'April 19, 2026',
    status: 'Closed',
    link: '/defence-jobs'
  },
  {
    exam: 'RRB NTPC 2026',
    board: 'Railway',
    notification: '2026-07-10',
    start: '2026-07-10',
    end: '2026-08-11',
    examDate: 'Nov - Dec 2026',
    status: 'Upcoming',
    link: '/railway-syllabus'
  },
  {
    exam: 'RRB ALP (Assistant Loco Pilot)',
    board: 'Railway',
    notification: '2026-01-20',
    start: '2026-01-20',
    end: '2026-02-19',
    examDate: 'June 2026',
    status: 'Closed',
    link: '/railway-jobs'
  },
  {
    exam: 'IBPS PO 2026',
    board: 'Banking',
    notification: '2026-08-01',
    start: '2026-08-01',
    end: '2026-08-21',
    examDate: 'Oct 2026',
    status: 'Upcoming',
    link: '/banking-jobs'
  },
  {
    exam: 'IBPS Clerk 2026',
    board: 'Banking',
    notification: '2026-07-01',
    start: '2026-07-01',
    end: '2026-07-21',
    examDate: 'Aug - Sept 2026',
    status: 'Upcoming',
    link: '/banking-jobs'
  },
  {
    exam: 'SBI PO Recruitment 2026',
    board: 'Banking',
    notification: '2026-09-15',
    start: '2026-09-15',
    end: '2026-10-05',
    examDate: 'Nov - Dec 2026',
    status: 'Upcoming',
    link: '/banking-jobs'
  }
];

export default function JobsCalendar({ type = 'all' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [boardFilter, setBoardFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'timeline'

  // Metadata Configuration
  const config = {
    all: {
      title: 'Government Jobs Calendar 2026 – Sarkari Exam Notification & Dates (Tentative)',
      description: 'Get the complete, updated calendar of state & central government jobs recruitment for 2026. View tentative notification release dates, expected application windows, and estimated exam schedules.',
      heading: '📅 Govt Jobs Calendar 2026 (Tentative)',
      subtitle: 'Estimated central & state recruitment notification dates, expected application schedules, and tentative exam windows. Verify all dates on official portals.',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
    },
    ssc: {
      title: 'SSC Calendar 2026-2027 PDF – Latest SSC Exam Schedules & Notification Dates (Expected)',
      description: 'Download the Staff Selection Commission (SSC) exam calendar for 2026-2027. Tracking expected dates for CGL, CHSL, MTS, Steno, and GD constable exams.',
      heading: '📋 SSC Exam Calendar 2026-27 (Expected)',
      subtitle: 'Expected Staff Selection Commission (SSC) recruitment notifications, tentative apply online start dates, and estimated exam dates.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)'
    },
    dates: {
      title: 'Sarkari Exam Dates 2026 – Timeline of All Major Govt & Competitive Exams (Expected)',
      description: 'Stay updated with major government competitive exam dates in 2026. Check expected timelines for civil services, railway, defence, banking, and state-level exams.',
      heading: '⏰ Expected Sarkari Exam Dates & Schedule 2026',
      subtitle: 'Estimated chronological timeline of major central and state-level recruitment exams in 2026. All schedules are tentative.',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #164e63 0%, #06b6d4 100%)'
    }
  }[type];

  const filteredData = CALENDAR_DATA.filter(item => {
    if (type === 'ssc' && item.board !== 'SSC') return false;
    const matchSearch = item.exam.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.board.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBoard = boardFilter === 'All' || item.board === boardFilter;
    return matchSearch && matchBoard;
  });

  const uniqueBoards = ['All', ...new Set(CALENDAR_DATA.map(i => i.board))];

  // Premium Pill Badge styles for Status with CSS dots (solves emoji scaling/wrap issues)
  const getStatusBadge = (status) => {
    let bg = '';
    let color = '';
    let dotColor = '';
    let pulseClass = '';
    
    switch (status) {
      case 'Apply Now':
        bg = '#ecfdf5';
        color = '#065f46';
        dotColor = '#10b981';
        pulseClass = 'dot-pulse';
        break;
      case 'Upcoming':
        bg = '#eff6ff';
        color = '#1e40af';
        dotColor = '#3b82f6';
        break;
      case 'Closed':
      default:
        bg = '#fef2f2';
        color = '#991b1b';
        dotColor = '#ef4444';
        break;
    }

    return (
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: bg,
          color: color,
          border: `1px solid ${bg === '#fef2f2' ? '#fecaca' : bg === '#eff6ff' ? '#bfdbfe' : '#a7f3d0'}`,
          whiteSpace: 'nowrap',
          lineHeight: '1.2',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <span 
          className={pulseClass}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            marginRight: '8px',
            display: 'inline-block',
            flexShrink: 0
          }}
        />
        <span>{status}</span>
      </div>
    );
  };

  // Custom Board Badge Colors
  const getBoardBadge = (board) => {
    let color = '#475569';
    let bgColor = '#f1f5f9';
    let borderColor = '#cbd5e1';

    if (board === 'SSC') {
      color = '#6d28d9';
      bgColor = '#f5f3ff';
      borderColor = '#ddd6fe';
    } else if (board === 'UPSC') {
      color = '#b45309';
      bgColor = '#fffbeb';
      borderColor = '#fde68a';
    } else if (board === 'Railway') {
      color = '#047857';
      bgColor = '#ecfdf5';
      borderColor = '#a7f3d0';
    } else if (board === 'Banking') {
      color = '#1d4ed8';
      bgColor = '#eff6ff';
      borderColor = '#bfdbfe';
    }

    return (
      <span 
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color,
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        {board}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr || isNaN(Date.parse(dateStr))) return dateStr;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="calendar-page">
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <link rel="canonical" href={`${window.location.origin}${type === 'all' ? '/govt-jobs-calendar' : type === 'ssc' ? '/ssc-calendar' : '/exam-dates'}`} />
      </Helmet>

      {/* Inject premium embedded styles directly to override any global/Bootstrap squishing issues */}
      <style>{`
        .premium-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);
          padding: 24px;
        }
        
        .premium-table-container {
          overflow-x: auto;
          margin-top: 8px;
        }

        .premium-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 750px;
        }

        .premium-table th {
          background-color: #f8fafc;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 14px 16px;
          border-bottom: 2px solid #cbd5e1;
        }

        .premium-table td {
          padding: 16px 16px;
          vertical-align: middle;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.88rem;
          color: #334155;
        }

        .premium-row {
          transition: background-color 150ms ease;
        }

        .premium-row:hover {
          background-color: #f8fafc;
        }

        .exam-link {
          font-weight: 700;
          color: #1e293b;
          text-decoration: none;
          transition: color 150ms ease;
        }

        .exam-link:hover {
          color: ${config.color};
          text-decoration: underline;
        }

        .dot-pulse {
          animation: dotPulseKeyframe 2s infinite;
        }

        @keyframes dotPulseKeyframe {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        .timeline-container {
          position: relative;
          padding-left: 28px;
          border-left: 3px solid #e2e8f0;
          margin: 20px 0 10px 10px;
        }

        .timeline-node {
          position: absolute;
          left: -37px;
          top: 6px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: #cbd5e1;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 2px #cbd5e1;
          transition: transform 150ms ease;
        }

        .timeline-node.apply {
          background-color: #10b981;
          box-shadow: 0 0 0 2px #10b981;
        }

        .timeline-node.upcoming {
          background-color: #3b82f6;
          box-shadow: 0 0 0 2px #3b82f6;
        }

        .timeline-node.closed {
          background-color: #ef4444;
          box-shadow: 0 0 0 2px #ef4444;
        }

        .timeline-item:hover .timeline-node {
          transform: scale(1.2);
        }
      `}</style>

      {/* Styled Premium Header Banner */}
      <div 
        className="mb-4 text-center py-5 rounded-4 shadow-sm px-4" 
        style={{ 
          background: config.gradient,
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="fw-bold text-white mb-2" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}>{config.heading}</h1>
          <p className="text-white text-opacity-95 fs-6 max-width-600 mx-auto mb-0" style={{ maxWidth: '620px', fontWeight: 500 }}>{config.subtitle}</p>
        </div>
        <div 
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            zIndex: 1
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '-40%',
            left: '5%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            zIndex: 1
          }}
        />
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          <div className="premium-card">
            
            {/* Tentative Disclaimer Notice */}
            <div 
              style={{
                backgroundColor: '#fffbeb',
                borderLeft: '4px solid #d97706',
                padding: '14px 18px',
                borderRadius: '10px',
                marginBottom: '24px',
                fontSize: '0.85rem',
                color: '#92400e',
                lineHeight: '1.6',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <span style={{ fontSize: '1.2rem', lineHeight: '1', marginTop: '-1px' }}>⚠️</span>
              <div>
                <strong>Estimated & Expected Schedules:</strong> All dates, notification releases, and application periods listed below are <strong>tentative estimates</strong> based on previous recruitment trends and draft calendars. These are NOT final dates. Official final schedules will be updated immediately upon release by respective commissions. Candidates should cross-verify details on official government portals.
              </div>
            </div>

            {/* Toolbar Filters & Switcher */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
              <div className="d-flex flex-wrap gap-2 flex-grow-1" style={{ maxWidth: '500px' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 14px 9px 36px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '0.88rem',
                      transition: 'all 0.15s ease',
                      backgroundColor: '#f8fafc'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = config.color;
                      e.target.style.boxShadow = `0 0 0 3px ${config.color}22`;
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                      e.target.style.backgroundColor = '#f8fafc';
                    }}
                  />
                </div>
                
                {type !== 'ssc' && (
                  <select
                    value={boardFilter}
                    onChange={(e) => setBoardFilter(e.target.value)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      backgroundColor: '#f8fafc',
                      fontSize: '0.88rem',
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = config.color}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    {uniqueBoards.map(b => (
                      <option key={b} value={b}>{b === 'All' ? 'All Boards' : b}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* View Switcher Toggle */}
              <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
                    color: viewMode === 'table' ? '#1e293b' : '#64748b',
                    boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  📊 Table
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  style={{
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    backgroundColor: viewMode === 'timeline' ? '#ffffff' : 'transparent',
                    color: viewMode === 'timeline' ? '#1e293b' : '#64748b',
                    boxShadow: viewMode === 'timeline' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  📈 Timeline
                </button>
              </div>
            </div>

            {/* View Render Conditional */}
            {viewMode === 'table' ? (
              <div className="premium-table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Exam Name</th>
                      {type !== 'ssc' && <th>Board</th>}
                      <th>Expected Notification</th>
                      <th>Expected Apply Window</th>
                      <th>Tentative Exam Date</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={type === 'ssc' ? 5 : 6} className="text-center py-5 text-muted">
                          No matches found. Check your search query.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, idx) => (
                        <tr key={idx} className="premium-row">
                          <td>
                            <Link to={item.link} className="exam-link">
                              {item.exam}
                            </Link>
                            <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>2026 Cycle (Expected)</div>
                          </td>
                          {type !== 'ssc' && (
                            <td>
                              {getBoardBadge(item.board)}
                            </td>
                          )}
                          <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                            <span style={{ marginRight: '6px' }}>🗓️</span>
                            {formatDate(item.notification)} (Est.)
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                              <span style={{ color: '#059669', marginRight: '4px' }}>▶</span>
                              Start: {formatDate(item.start)} (Est.)
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                              <span style={{ color: '#dc2626', marginRight: '4px' }}>■</span>
                              End: {formatDate(item.end)} (Est.)
                            </div>
                          </td>
                          <td style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
                            <span style={{ marginRight: '6px' }}>⚡</span>
                            {item.examDate} (Expected)
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {getStatusBadge(item.status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Timeline View mode */
              <div className="timeline-container">
                {filteredData.length === 0 ? (
                  <div className="text-center py-5 text-muted">No timeline items found.</div>
                ) : (
                  filteredData.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="timeline-item"
                      style={{ 
                        position: 'relative', 
                        marginBottom: '2rem'
                      }}
                    >
                      {/* Node Bullet */}
                      <span 
                        className={`timeline-node ${
                          item.status === 'Apply Now' ? 'apply' : item.status === 'Upcoming' ? 'upcoming' : 'closed'
                        }`}
                      />
                      
                      <div 
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                          e.currentTarget.style.borderColor = config.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                          <div>
                            <Link to={item.link} className="exam-link" style={{ fontSize: '1.05rem' }}>
                              {item.exam}
                            </Link>
                            <span style={{ marginLeft: '10px' }}>
                              {getBoardBadge(item.board)}
                            </span>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                        
                        <div className="row g-3" style={{ fontSize: '0.85rem', color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                          <div className="col-12 col-sm-4">
                            <strong>🗓️ Expected Notification:</strong>
                            <div style={{ marginTop: '4px', color: '#334155' }}>{formatDate(item.notification)} (Est.)</div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <strong>⌛ Expected Apply Window:</strong>
                            <div style={{ marginTop: '4px', color: '#334155' }}>
                              {formatDate(item.start)} to {formatDate(item.end)} (Est.)
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <strong>⚡ Tentative Exam Date:</strong>
                            <div style={{ marginTop: '4px', color: '#0284c7', fontWeight: 700 }}>
                              {item.examDate} (Expected)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

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
export { CALENDAR_DATA };
