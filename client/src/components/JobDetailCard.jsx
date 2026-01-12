import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';
import RichTextDisplay from './RichTextDisplay.jsx';
import api from '../api/index.js';

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

function excerpt(text, n = 300) {
  if (!text) return '';
  if (text.length <= n) return text;
  return `${text.slice(0, n).trim()}…`;
}

function JobDetailCard({ job, adLink: propAdLink }) {
  const fallback = 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F196590e2e83d4a159a955d16c0e8ebde?format=webp&width=800';
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
      className="mb-4 pb-4 border-bottom"
      style={{ transition: 'all 0.2s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <h2 className="h4 mb-2">
        <Link
          to={`/${job.slug}`}
          className="text-decoration-none text-dark"
          style={{ transition: 'color 0.2s ease' }}
          onMouseEnter={(e) => e.target.style.color = '#17a2b8'}
          onMouseLeave={(e) => e.target.style.color = '#212529'}
        >
          {job.title}
        </Link>
      </h2>
      <div className="mb-3 small text-muted">
        {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} by <span className="text-primary">Job For Fresher</span>
      </div>
      
      <div className="row g-3">
        <div className="col-md-5 col-lg-4">
          <div style={{ overflow: 'hidden', borderRadius: '0.375rem' }}>
            <img
              src={job.image || fallback}
              alt={job.title}
              loading="lazy"
              className="img-fluid rounded"
              style={{
                width: '100%',
                height: 'auto',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>
        </div>
        <div className="col-md-7 col-lg-8">
          <div className="mb-3">
            <div className="mb-2">
              <strong className="text-dark">{job.company}</strong>
              {job.location && <span className="text-muted ms-2">• {job.location}</span>}
            </div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-primary">{job.type}</span>
              {job.experience && <span className="badge bg-secondary">{job.experience}</span>}
              {job.education && <span className="badge bg-info">{job.education}</span>}
              {job.batch && <span className="badge bg-success">{job.batch}</span>}
              {job.salary && <span className="badge bg-warning text-dark">{job.salary}</span>}
            </div>
          </div>

          {(job.description || job.jobDescription) && (
            <div className="mb-3 job-card-description">
              {typeof job.description === 'string' && job.description.includes('<') ? (
                <div style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                  <RichTextDisplay content={excerpt(job.description, 700)} />
                </div>
              ) : typeof job.jobDescription === 'string' && job.jobDescription.includes('<') ? (
                <div style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                  <RichTextDisplay content={excerpt(job.jobDescription, 700)} />
                </div>
              ) : (
                <p style={{ textAlign: 'justify', lineHeight: '1.8' }} className="mb-0">
                  {excerpt(job.description || job.jobDescription, 700)}
                </p>
              )}
            </div>
          )}

          <div className="d-flex gap-2">
            <Link
              to={`/${job.slug}`}
              className="btn btn-info text-white rounded-pill px-4 shadow-sm" 
              style={{ backgroundColor: '#17a2b8', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#138496'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#17a2b8'; }}
            >
              Read more
            </Link>
            {job.applyLink && (
              <a 
                className="btn btn-success rounded-pill px-4 shadow-sm" 
                href={job.applyLink} 
                onClick={handleApply}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
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
