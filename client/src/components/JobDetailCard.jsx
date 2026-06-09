import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';
import RichTextDisplay from './RichTextDisplay.jsx';
import api from '../api/index.js';
import { getImageUrl } from '../utils/imageUtils.js';
import { trackApplyJobClicked } from '../utils/analytics.js';

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

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

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function JobDetailCard({ job, adLink: propAdLink }) {
  const { elementRef, isVisible } = useIntersectionObserver();
  const [adLink, setAdLink] = useState(propAdLink || DEFAULT_AD_LINK);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!propAdLink) {
      api.get('/settings/adLink').then(res => {
        if (res.data?.data) setAdLink(res.data.data);
      }).catch(() => {});
    }
  }, [propAdLink]);

  const handleApply = (e) => {
    // Track Apply Job Clicked
    trackApplyJobClicked(job);

    // Save apply state locally
    localStorage.setItem(`applied_${job._id}`, 'true');
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
    const postType = String(job.postType || 'Job Post').toUpperCase();
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
    <article ref={elementRef} className="jc-card" style={{ borderLeft: job.isGovernment ? '4px solid #ff9933' : '4px solid #7c3aed' }}>
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
                <Link to={`/${job.slug}`} target="_blank" rel="noopener noreferrer" className="jc-title-link">
                  {job.title}
                </Link>
              </h2>

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
              <div className="jc-chips" style={{ gap: '0.35rem', margin: '0.15rem 0' }}>
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
                    {job.salary && (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        💰 {job.salary}
                      </span>
                    )}
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
                    {job.salary && (
                      <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                        💰 {job.salary}
                      </span>
                    )}
                  </>
                )}
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
          <div className="jc-mobile-actions">
            {job.applyLink ? (
              <>
                <a 
                  href={job.applyLink} 
                  onClick={handleApply} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="jc-mobile-btn-apply"
                  style={{
                    color: '#1d4ed8',
                    background: '#eff6ff'
                  }}
                >
                  Apply Now
                </a>
                <Link 
                  to={`/${job.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="jc-mobile-btn-details"
                >
                  View Details
                </Link>
              </>
            ) : (
              <Link 
                to={`/${job.slug}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="jc-mobile-btn-details-full"
              >
                View Details
              </Link>
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
              <Link to={`/${job.slug}`} target="_blank" rel="noopener noreferrer" className="jc-title-link">
                {job.title}
              </Link>
            </h2>

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
            <div className="jc-chips" style={{ gap: '0.35rem', margin: '0.15rem 0' }}>
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
                  {job.salary && (
                    <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                      💰 {job.salary}
                    </span>
                  )}
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
                  {job.salary && (
                    <span className="jc-chip jc-chip-gray" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                      💰 {job.salary}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Excerpt */}
            {(job.description || job.jobDescription) && (
              <p className="jc-excerpt" style={{ margin: '0.1rem 0 0 0', fontSize: '0.88rem', lineClamp: 1, WebkitLineClamp: 1 }}>
                {excerpt(job.description || job.jobDescription, 120)}
              </p>
            )}

          </div>

          {/* Actions - stacked column on desktop */}
          <div className="jc-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flexShrink: 0, width: '130px', alignItems: 'stretch' }}>
            {job.applyLink && (
              <a href={job.applyLink} onClick={handleApply} target="_blank" rel="noopener noreferrer" className="jc-btn-primary" style={{ height: '42px', padding: '0 0.85rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem', border: 'none', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', boxShadow: '0 4px 12px rgba(29, 78, 216, 0.15)', textDecoration: 'none' }}>Apply Now</a>
            )}
            <Link to={`/${job.slug}`} target="_blank" rel="noopener noreferrer" className="jc-btn-outline" style={{ height: '42px', padding: '0 0.85rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem', border: '1.5px solid #d1d5db', color: '#374151', background: '#fff', textDecoration: 'none' }}>View Details</Link>
          </div>
        </div>
      )}
    </article>
  );
}

export default memo(JobDetailCard);
