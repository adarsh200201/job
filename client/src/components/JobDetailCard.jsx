import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';
import RichTextDisplay from './RichTextDisplay.jsx';
import api from '../api/index.js';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUtils.js';

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

function excerpt(text, n = 300) {
  if (!text) return '';
  if (text.length <= n) return text;
  return `${text.slice(0, n).trim()}…`;
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
    e.preventDefault();
    // Open ad link in new tab
    if (adLink) {
      window.open(adLink, '_blank', 'noopener,noreferrer');
    }
    // Redirect current page to apply URL
    window.location.href = job.applyLink;
  };

  return (
    <article
      ref={elementRef}
      className="mb-4 pb-4 border-bottom job-card"
      style={{ transition: 'all 0.2s ease', borderBottom: '1px solid #eee' }}
    >
      <div className="row g-3">
        {/* Left Column: Image */}
        <div className="col-md-5 col-lg-4">
          <div style={{ overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <img
              src={getImageUrl(job.image) || FALLBACK_IMAGE}
              alt={job.title}
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== FALLBACK_IMAGE) {
                  e.target.src = FALLBACK_IMAGE;
                }
              }}
              className="img-fluid"
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="col-md-7 col-lg-8 d-flex flex-column">
          {/* Header Metadata */}
          <div className="mb-1">
            <span className="text-secondary fw-bold" style={{ fontSize: '0.9rem' }}>{job.company}</span>
            {job.location && <span className="text-muted" style={{ fontSize: '0.9rem' }}> • {job.location}</span>}
          </div>

          {/* Title */}
          <h2 className="h4 mb-3">
            <Link
              to={`/${job.slug}`}
              className="text-decoration-none text-dark fw-bold"
              style={{ fontSize: '1.5rem', display: 'block' }}
            >
              {job.title}
            </Link>
          </h2>

          {/* 3 Lines of Structured Text */}
          <div className="mb-4" style={{ flex: 1 }}>
            <div className="mb-2">
              <div className="fw-bold text-dark small" style={{ marginBottom: '2px' }}>Job Role</div>
              <div className="text-muted" style={{ fontSize: '0.95rem' }}>{job.title?.split('|')[0] || job.title}</div>
            </div>
            <div className="mb-2">
              <div className="fw-bold text-dark small" style={{ marginBottom: '2px' }}>Job Location</div>
              <div className="text-muted" style={{ fontSize: '0.95rem' }}>{job.location || 'Multiple Locations'}</div>
            </div>
            <div>
              <div className="fw-bold text-dark small" style={{ marginBottom: '2px' }}>Experience</div>
              <div className="text-muted" style={{ fontSize: '0.95rem' }}>{job.experience || 'Freshers / Graduates'}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 align-items-center mt-auto">
            <Link
              to={`/${job.slug}`}
              className="btn text-white px-4" 
              style={{ backgroundColor: '#17a2b8', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '600', padding: '10px 25px' }}
            >
              Read more
            </Link>
            {job.applyLink && (
              <a 
                className="btn btn-success px-4" 
                href={job.applyLink} 
                onClick={handleApply}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ borderRadius: '25px', backgroundColor: '#198754', fontSize: '0.9rem', fontWeight: '600', padding: '10px 25px' }}
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(JobDetailCard);
