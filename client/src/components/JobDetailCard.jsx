import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';
import { cleanJobBranding } from '../utils/textUtils.js';

import RichTextDisplay from './RichTextDisplay.jsx';
import api from '../api/index.js';
import { getImageUrl } from '../utils/imageUtils.js';
import { trackApplyJobClicked, trackJobImpression, trackJobCardClicked } from '../utils/analytics.js';
import { getJobUrl } from '../utils/urlHelper.js';


function excerpt(text, n = 160) {
  if (!text) return '';
  // Strip HTML tags for plain preview
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= n) return plain;
  return `${plain.slice(0, n).trim()}…`;
}

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function extractVacancy(title) {
  const match = title.match(/(\d[\d,]*)\s*(?:Vacancy|Vacancies|Post|Posts|Slot|Slots|LGC|Clerk|Trainee|Openings)/i);
  return match ? match[1] : 'As per notification';
}

// Generic salary patterns that should be replaced by real parsed values
const GENERIC_SALARY_RE = /best in industry|as per company|competitive|not disclosed|negotiable|market standard/i;

/**
 * Returns the best salary string to display.
 * Strategy: if DB salary is generic/missing, scan the raw description for
 * any currency/salary value pattern (₹X LPA, X LPA, etc.) — this works
 * even when Telegram uses Unicode math-bold for key labels like 𝗦𝗮𝗹𝗮𝗿𝘆.
 */
function getDisplaySalary(job) {
  const dbSalary = job.salary || '';
  // If DB value looks real (not generic), use it directly
  if (dbSalary && !GENERIC_SALARY_RE.test(dbSalary)) return dbSalary;

  // Scan raw description for a salary VALUE pattern (e.g. ₹4.5 LPA – ₹8 LPA (Expected))
  const rawText = job.jobDescription || job.description || '';

  // Match patterns like: ₹4.5 LPA – ₹8 LPA (Expected) | ₹50,000/month | 6 LPA | 60K/month
  const VALUE_RE = /₹[\d,.]+\s*(?:LPA|L|Lakh|lakhs?|K|\/month)?(?:\s*[-–—]\s*₹?[\d,.]+\s*(?:LPA|L|Lakh|lakhs?|K|\/month)?)?(?:\s*\([^)\n]{1,30}\))?/i;
  const mVal = rawText.match(VALUE_RE);
  if (mVal) return mVal[0].trim();

  // Fallback: try matching "X LPA" or "X Lakh" without ₹ symbol
  const LPA_RE = /\b(\d+(?:\.\d+)?)\s*(?:LPA|Lakh|lacs?)\b/i;
  const mLpa = rawText.match(LPA_RE);
  if (mLpa) return mLpa[0].trim();

  // Final fallback: return DB value (even if generic)
  return dbSalary;
}


function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function JobDetailCard({ job: rawJob }) {
  const job = cleanJobBranding(rawJob);
  const { elementRef, isVisible } = useIntersectionObserver();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fire Job Impression once when card enters viewport
  useEffect(() => {
    if (isVisible && job?._id) {
      trackJobImpression(job);
    }
  }, [isVisible]);

  const handleApply = (e) => {
    // Track Apply Job Clicked
    trackApplyJobClicked(job);
    // Save apply state locally
    localStorage.setItem(`applied_${job._id}`, 'true');
    // Trigger ad: synchronous window.open inside onClick = direct user gesture = NOT blocked by browser
    // Clickadilla popunder script (448008) intercepts this call and fills the tab with an ad
    try { window.open('about:blank', '_blank'); } catch (_) {}
  };

  const handleViewDetails = () => {
    // Trigger ad on View Details click (same mechanism)
    try { window.open('about:blank', '_blank'); } catch (_) {}
  };

  const typeColor = {
    'Full-Time': { bg: '#ecfdf5', color: '#059669', dot: '#10b981' },
    'Part-Time': { bg: '#fef3c7', color: '#d97706', dot: '#f59e0b' },
    'Internship': { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
    'Remote': { bg: '#f5f3ff', color: '#7c3aed', dot: '#8b5cf6' },
  }[job.type] || { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' };

  // Setup badge information
  let badgeText = '💼 Private Job';
  let badgeClass = 'jc-govt-badge-latest'; // default to slate/blue styling
  let formattedLastDate = job.lastDate ? formatDate(job.lastDate) : null;

  if (job.isGovernment) {
    let postType = String(job.postType || 'Job Post').toUpperCase();
    // Remap generic job types to the user-facing label "GOVERNMENT JOB"
    if (postType === 'JOB POST' || postType === 'JOB') {
      postType = 'GOVERNMENT JOB';
    }
    badgeText = `🏛️ ${postType}`;
    if (postType.includes('RESULT')) {
      badgeClass = 'jc-govt-badge-result';
    } else if (postType.includes('ADMIT')) {
      badgeClass = 'jc-govt-badge-admit';
    } else if (postType.includes('ANSWER')) {
      badgeClass = 'jc-govt-badge-answer';
    }
  } else {
    badgeText = '💼 Private Job';
    badgeClass = 'jc-govt-badge-latest';
  }

  return (
    <article ref={elementRef} className={`jc-card ${job.isGovernment ? 'govt-card' : ''} guide-card-animation`} style={{ borderLeft: job.isGovernment ? '4px solid #ff9933' : '4px solid #7c3aed' }}>
      <style>{`
        @keyframes fadeInUpCard {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .guide-card-animation {
          animation: fadeInUpCard 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease !important;
        }
        
        .guide-card-animation:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 24px -10px rgba(0, 0, 0, 0.08), 0 4px 12px -5px rgba(0, 0, 0, 0.03) !important;
          border-color: #6366f130 !important;
        }

        .jc-btn-view-details {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease !important;
        }
        .jc-btn-view-details:hover {
          transform: translateX(4px);
        }
      `}</style>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* Content area with padding */}
          <div style={{ padding: '1rem 1.1rem 0.9rem 1.1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div className="jc-content" style={{ flex: 1, width: '100%', gap: '0.25rem' }}>
              
              {/* Header Badge Row */}
              <div className="jc-govt-header" style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <div className="jc-govt-badge-group" style={{ gap: '0.4rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className={`jc-govt-badge ${badgeClass}`} style={{ padding: '3px 8px', fontSize: '0.78rem', fontWeight: '800' }}>
                    {badgeText}
                  </span>
                  {job.matchScore && window.location.pathname !== '/' && (
                    <span className="jc-govt-badge" style={{
                      padding: '3px 8px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      background: job.matchScore >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: '#ffffff',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}>
                      🎯 {job.matchScore}% Match
                    </span>
                  )}
                  {formattedLastDate && (
                    <span className="jc-govt-last-date" style={{ padding: '2px 6px', fontSize: '0.78rem' }}>
                      📅 Last Date: {formattedLastDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h2 className="jc-title" style={{ fontSize: '1.25rem', margin: '0.1rem 0', fontWeight: '700', lineHeight: '1.3' }}>
                <Link to={getJobUrl(job)} target="_blank" rel="noopener noreferrer" className="jc-title-link">
                  {job.title}
                </Link>
              </h2>

              {/* Company + Chips (2 rows on mobile, compactly styled) */}
              <div className="jc-meta-rows" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.4rem 0' }}>
                {/* Row 1: Company + Eligibility/Type */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Company / Org + Location Row */}
                  <span className="jc-chip jc-chip-gray" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minWidth: 0, margin: 0 }}>
                    💼 {job.company || (job.isGovernment ? 'Govt Org' : 'Company')}
                    {!job.isGovernment && job.location && (
                      <span style={{ marginLeft: '0.25rem', color: '#6b7280' }}>
                        • {job.location}
                      </span>
                    )}
                  </span>

                  {job.isGovernment ? (
                    job.eligibility && (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minWidth: 0 }}>
                        🎓 {job.eligibility}
                      </span>
                    )
                  ) : (
                    job.type && (
                      <span className="jc-chip" style={{ background: typeColor.bg, color: typeColor.color, padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minWidth: 0 }}>
                        <span className="jc-chip-dot" style={{ background: typeColor.dot }} />
                        {job.type}
                      </span>
                    )
                  )}
                </div>

                {/* Row 2: Vacancies/Experience + Salary/Education */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {job.isGovernment ? (
                    <>
                      {job.vacancies && (
                        <span className="jc-chip jc-chip-gray" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minWidth: 0 }}>
                          👥 {job.vacancies}
                        </span>
                      )}
                      {(() => { const s = getDisplaySalary(job); return s ? (
                        <span className="jc-chip jc-chip-gray" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minWidth: 0 }}>
                          💰 {s}
                        </span>
                      ) : null; })()}
                    </>
                  ) : (
                    <>
                      {job.experience && (
                        <span className="jc-chip jc-chip-gray" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minWidth: 0 }}>
                          💼 {job.experience}
                        </span>
                      )}
                      {job.education && (
                        <span className="jc-chip jc-chip-gray" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minWidth: 0 }}>
                          🎓 {job.education}
                        </span>
                      )}
                      {(() => { const s = getDisplaySalary(job); return s ? (
                        <span className="jc-chip jc-chip-gray" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minWidth: 0 }}>
                          💰 {s}
                        </span>
                      ) : null; })()}
                    </>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              {(job.description || job.jobDescription) && (
                <p className="jc-excerpt" style={{ margin: '0.1rem 0 0 0', fontSize: '0.88rem', lineClamp: 1, WebkitLineClamp: 1 }}>
                  {excerpt(job.description || job.jobDescription, 120)}
                </p>
              )}

            </div>
          </div>

          {/* Bottom Actions Row */}
          <div style={{ display: 'flex', gap: '0.75rem', padding: '0.25rem 1.1rem 1rem 1.1rem', width: '100%' }}>
            <Link 
              to={getJobUrl(job)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="jc-btn-view-details"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              View details
            </Link>
            {job.applyLink && (
              <a 
                href={job.applyLink} 
                onClick={handleApply} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="jc-btn-apply-pill"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Apply
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="jc-body" style={{ minHeight: '160px', padding: '1.5rem 1.75rem', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div className="jc-content" style={{ flex: 1, minWidth: '300px', gap: '0.25rem' }}>
            
            {/* Header Badge Row */}
            <div className="jc-govt-header" style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <div className="jc-govt-badge-group" style={{ gap: '0.4rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`jc-govt-badge ${badgeClass}`} style={{ padding: '3px 8px', fontSize: '0.78rem', fontWeight: '800' }}>
                  {badgeText}
                </span>
                {job.matchScore && window.location.pathname !== '/' && (
                  <span className="jc-govt-badge" style={{
                    padding: '3px 8px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    background: job.matchScore >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#ffffff',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}>
                    🎯 {job.matchScore}% Match
                  </span>
                )}
                {formattedLastDate && (
                  <span className="jc-govt-last-date" style={{ padding: '2px 6px', fontSize: '0.78rem' }}>
                    📅 Last Date: {formattedLastDate}
                  </span>
                )}
                <span className="jc-posted" style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500', marginLeft: '0.25rem' }}>
                  {timeAgo(job.createdAt)}
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="jc-title" style={{ fontSize: '1.25rem', margin: '0.1rem 0', fontWeight: '700', lineHeight: '1.3' }}>
              <Link to={getJobUrl(job)} target="_blank" rel="noopener noreferrer" className="jc-title-link">
                {job.title}
              </Link>
            </h2>

            {/* Company + Chips Wrapper */}
            <div className="jc-meta-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', margin: '0.25rem 0' }}>
              {/* Company / Org + Location Row */}
              <div className="jc-company-row" style={{ gap: '0.5rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center' }}>
                <span className="jc-company" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  {job.company || (job.isGovernment ? 'Govt Org' : 'Company')}
                </span>
                {!job.isGovernment && job.location && (
                  <span className="jc-location" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {job.location}
                  </span>
                )}
              </div>

              {/* Chips Row (unified details) */}
              <div className="jc-chips" style={{ gap: '0.35rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                {job.isGovernment ? (
                  <>
                    {job.eligibility && (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        🎓 {job.eligibility}
                      </span>
                    )}
                    {job.vacancies && (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        👥 {job.vacancies}
                      </span>
                    )}
                    {(() => { const s = getDisplaySalary(job); return s ? (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        💰 {s}
                      </span>
                    ) : null; })()}
                  </>
                ) : (
                  <>
                    {job.type && (
                      <span className="jc-chip" style={{ background: typeColor.bg, color: typeColor.color, padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        <span className="jc-chip-dot" style={{ background: typeColor.dot }} />
                        {job.type}
                      </span>
                    )}
                    {job.experience && (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        💼 {job.experience}
                      </span>
                    )}
                    {job.education && (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        🎓 {job.education}
                      </span>
                    )}
                    {(() => { const s = getDisplaySalary(job); return s ? (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        💰 {s}
                      </span>
                    ) : null; })()}</>
                )}
              </div>
            </div>

            {/* Excerpt */}
            {(job.description || job.jobDescription) && (
              <p className="jc-excerpt" style={{ margin: '0.1rem 0 0 0', fontSize: '0.88rem', lineClamp: 1, WebkitLineClamp: 1 }}>
                {excerpt(job.description || job.jobDescription, 120)}
              </p>
            )}

          </div>

          {/* Actions - stacked vertically on desktop */}
          <div className="jc-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0, alignItems: 'stretch', minWidth: '130px' }}>
            {job.applyLink && (
              <a href={job.applyLink} onClick={handleApply} target="_blank" rel="noopener noreferrer" className="jc-btn-apply-pill" style={{ width: '100%', justifyContent: 'center' }}>Apply</a>
            )}
            <Link to={getJobUrl(job)} onClick={handleViewDetails} target="_blank" rel="noopener noreferrer" className="jc-btn-view-details" style={{ width: '100%', justifyContent: 'center' }}>View details</Link>
          </div>
        </div>
      )}
    </article>
  );
}

export default memo(JobDetailCard);
