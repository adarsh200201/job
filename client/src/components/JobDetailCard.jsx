import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';
import RichTextDisplay from './RichTextDisplay.jsx';
import api from '../api/index.js';
import { getImageUrl } from '../utils/imageUtils.js';

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

function excerpt(text, n = 160) {
  if (!text) return '';
  // Strip HTML tags for plain preview
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= n) return plain;
  return `${plain.slice(0, n).trim()}…`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function JobDetailCard({ job, adLink: propAdLink }) {
  const { elementRef, isVisible } = useIntersectionObserver();
  const [adLink, setAdLink] = useState(propAdLink || DEFAULT_AD_LINK);

  useEffect(() => {
    if (!propAdLink) {
      api.get('/settings/adLink').then(res => {
        if (res.data?.data) setAdLink(res.data.data);
      }).catch(() => {});
    }
  }, [propAdLink]);

  const handleApply = (e) => {
    // Ad popunder disabled for now
    /*
    e.preventDefault();
    if (adLink) window.open(adLink, '_blank', 'noopener,noreferrer');
    window.location.href = job.applyLink;
    */
  };

  const typeColor = {
    'Full-Time': { bg: '#ecfdf5', color: '#059669', dot: '#10b981' },
    'Part-Time': { bg: '#fef3c7', color: '#d97706', dot: '#f59e0b' },
    'Internship': { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
    'Remote': { bg: '#f5f3ff', color: '#7c3aed', dot: '#8b5cf6' },
  }[job.type] || { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' };

  return (
    <article ref={elementRef} className="jc-card">
      {/* Top row: image + meta */}
      <div className="jc-body">
        {/* Thumbnail */}
        <div className="jc-thumb-wrap">
          {job.image && (
            <img
              src={getImageUrl(job.image)}
              alt={job.title}
              loading="lazy"
              className="jc-thumb"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          {/* Hiring badge overlay */}
          <span className="jc-hiring-badge">🔥 Hiring Now</span>
        </div>

        {/* Content */}
        <div className="jc-content">
          {/* Title */}
          <h2 className="jc-title">
            <Link to={`/${job.slug}`} className="jc-title-link">{job.title}</Link>
          </h2>

          {/* Company + Location row */}
          <div className="jc-company-row">
            <span className="jc-company">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              {job.company || 'Company'}
            </span>
            {job.location && (
              <span className="jc-location">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {job.location}
              </span>
            )}
            <span className="jc-posted">{timeAgo(job.createdAt)}</span>
          </div>

          {/* Chips row */}
          <div className="jc-chips">
            {job.type && (
              <span className="jc-chip" style={{ background: typeColor.bg, color: typeColor.color }}>
                <span className="jc-chip-dot" style={{ background: typeColor.dot }} />
                {job.type}
              </span>
            )}
            {job.experience && (
              <span className="jc-chip jc-chip-gray">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                {job.experience}
              </span>
            )}
            {job.education && (
              <span className="jc-chip jc-chip-gray">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                {job.education}
              </span>
            )}
          </div>

          {/* Excerpt */}
          {(job.description || job.jobDescription) && (
            <p className="jc-excerpt">
              {excerpt(job.description || job.jobDescription, 130)}
            </p>
          )}

          {/* Actions */}
          <div className="jc-actions">
            <Link to={`/${job.slug}`} className="jc-btn-outline">
              View Details
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            {job.applyLink && (
              <a href={job.applyLink} onClick={handleApply} target="_blank" rel="noopener noreferrer" className="jc-btn-primary">
                Apply Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(JobDetailCard);
