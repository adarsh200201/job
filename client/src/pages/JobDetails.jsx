import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import RecentJobs from '../components/RecentJobs.jsx';
import RichTextDisplay from '../components/RichTextDisplay.jsx';
import { JobDetailsSkeleton } from '../components/SkeletonLoader.jsx';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUtils.js';

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

// Inline Component for "Also read ---" block
const AlsoReadCard = ({ relatedJob }) => {
  if (!relatedJob) return null;
  return (
    <div className="also-read-box my-4 p-3 rounded" style={{ border: '2px dashed #dc3545', position: 'relative' }}>
      <span style={{ position: 'absolute', top: '-11px', left: '15px', backgroundColor: '#fff', padding: '0 8px', color: '#dc3545', fontSize: '0.85rem' }}>Also read ---</span>
    <Link to={`/${relatedJob.slug}`} className="d-flex align-items-center gap-3 text-decoration-none text-dark">
        {relatedJob.image && (
          <img 
            src={getImageUrl(relatedJob.image)} 
            alt={relatedJob.title} 
            style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} 
            onError={(e) => { 
              if (e.target.src !== FALLBACK_IMAGE) {
                e.target.src = FALLBACK_IMAGE; 
              }
            }} 
          />
        )}
        <div>
          <span className="fw-bold" style={{ fontSize: '0.95rem', lineHeight: '1.2' }}>{relatedJob.title}</span>
        </div>
      </Link>
    </div>
  );
};

export default function JobDetails() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [adLink, setAdLink] = useState(DEFAULT_AD_LINK);
  const cache = useCache();

  const handleApply = (e, applyUrl) => {
    e.preventDefault();
    if (adLink) {
      window.open(adLink, '_blank', 'noopener,noreferrer');
    }
    window.location.href = applyUrl;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAdLink = async () => {
      try {
        const res = await api.get('/settings/adLink');
        if (isMounted && res.data?.data) {
          setAdLink(res.data.data);
        }
      } catch {
        // Use default ad link
      }
    };
    fetchAdLink();

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!slug) {
      setJob(null);
      setRecent([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        let jobRes;
        try {
          jobRes = await cache.get((url) => api.get(url), `/jobs/${slug}`);
        } catch (error) {
          const fallbackRes = await cache.get((url) => api.get(url), '/jobs?limit=100');
          const allJobs = fallbackRes.data?.data || fallbackRes.data || [];
          jobRes = { data: { data: allJobs.find((j) => j.slug === slug) || null } };
        }

        if (!isMounted) return;
        const currentJob = jobRes?.data?.data || jobRes?.data || null;

        if (!currentJob) {
          if (isMounted) { setJob(null); setLoading(false); }
          return;
        }

        if (isMounted) { setJob(currentJob); }

        const recentRes = await cache.get((url) => api.get(url), '/jobs?limit=10');
        const allJobs = recentRes.data?.data || recentRes.data || [];
        const otherJobs = Array.isArray(allJobs) ? allJobs.filter((j) => j.slug !== slug) : [];

        if (isMounted) {
          setRecent(otherJobs.slice(0, 5));
        }

      } catch (error) {
        if (isMounted) { setJob(null); setRecent([]); }
      } finally {
        if (isMounted) { setLoading(false); }
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) return <JobDetailsSkeleton />;
  if (!job) return <p className="text-center text-muted">Job not found.</p>;

  // Get up to 3 related jobs for interspersion
  const intersperseJobs = recent.slice(0, 3);

  // Helper function for rendering lists securely
  const renderList = (data) => {
    if (!data) return null;
    if (typeof data === 'string' && data.includes('<')) {
      return (
        <div className="rich-text-section ps-3">
          <RichTextDisplay content={data} />
        </div>
      );
    }
    const items = Array.isArray(data) ? data : data.split('\n');
    return (
      <ul className="capsule-list ps-4" style={{ lineHeight: '1.8' }}>
        {items.filter(item => item.trim()).map((item, idx) => (
          <li key={idx} style={{ marginBottom: '8px' }}>{item.replace(/^[✓→●\-*]\s*/, '').trim()}</li>
        ))}
      </ul>
    );
  };

  const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || '';

  const socialLinksBlock = (job.whatsapp || job.telegram) && (
    <div className="mb-4 d-flex flex-column gap-3">
      {/* WhatsApp Box */}
      <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ border: '1px solid #25D366' }}>
        <div className="d-flex align-items-center gap-2 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#25D366" width="24" height="24">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          <span className="fw-bold text-dark" style={{ fontSize: '1rem' }}>WhatsApp Group</span>
        </div>
        <a
          href={job.whatsapp ? (job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')) : 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn fw-bold px-3 py-1"
          style={{ backgroundColor: '#25D366', color: '#fff', borderRadius: '4px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16" className="me-2 mb-1">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          Join Now
        </a>
      </div>
      
      {/* Telegram Box */}
      <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ border: '1px solid #0088cc' }}>
        <div className="d-flex align-items-center gap-2 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0088cc" width="24" height="24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
          </svg>
          <span className="fw-bold text-dark" style={{ fontSize: '1rem' }}>Join Telegram</span>
        </div>
        <a
          href={job.telegram ? (job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')) : 'https://t.me/nextjobpost'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn fw-bold px-3 py-1"
          style={{ backgroundColor: '#0088cc', color: '#fff', borderRadius: '4px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="me-2 mb-1">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
          </svg>
          Join Now
        </a>
      </div>
    </div>
  );

  return (
    <div className="job-details container my-4">
      <div className="row g-4">
        <div className="col-12 col-lg-8">

          {/* Top Placement */}
          {socialLinksBlock}

          <div className="job-header-section mb-4 mt-2">
            <h1 className="fw-bold mb-2" style={{ fontSize: '1.75rem', lineHeight: '1.4' }}>{job.title}</h1>
            <div className="job-meta-info text-muted" style={{ fontSize: '0.95rem' }}>
              <span className="job-date-published">
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently Posted'}
              </span>
              <span className="mx-2">by</span>
              <span className="text-primary">NextJobPost</span>
            </div>
          </div>

          {job.image && (
            <div className="job-image-section mb-4">
              <img 
                src={getImageUrl(job.image)} 
                alt="job banner" 
                loading="lazy" 
                className="img-fluid rounded-4 shadow-sm w-100" 
                style={{ maxHeight: '400px', objectFit: 'cover' }}
                onError={(e) => { 
                  if (e.target.src !== FALLBACK_IMAGE) {
                    e.target.src = FALLBACK_IMAGE; 
                  }
                }}
              />
            </div>
          )}

          {/* Short Summary Intro */}
          {job.description && (
            <div className="mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#2d3748', borderLeft: '4px solid #5bc0de', paddingLeft: '1.5rem' }}>
              {typeof job.description === 'string' && job.description.includes('<') ? (
                <RichTextDisplay content={job.description} />
              ) : (
                <p className="mb-0"><strong>{job.company}</strong> {job.description.replace(new RegExp('^' + job.company + '?', 'i'), '')}</p>
              )}
            </div>
          )}

          {/* Structured Summary Cards Grid */}
          <div className="row g-3 mb-5">
            {[
              { label: 'Location', value: job.location, icon: '📍', color: '#eef2ff', textColor: '#4338ca' },
              { label: 'Qualification', value: job.education, icon: '🎓', color: '#fff7ed', textColor: '#c2410c' },
              { label: 'Batch', value: job.batch, icon: '📅', color: '#f0fdf4', textColor: '#15803d' },
              { label: 'Experience', value: job.experience, icon: '💼', color: '#fdf2f8', textColor: '#be185d' },
              { label: 'Salary', value: job.salary, icon: '💰', color: '#ecfdf5', textColor: '#047857' },
              { label: 'Last Date', value: job.lastDate ? new Date(job.lastDate).toLocaleDateString() : 'N/A', icon: '⏳', color: '#fff1f2', textColor: '#be123c' }
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-4">
                <div style={{ 
                  backgroundColor: item.color, 
                  padding: '1.25rem', 
                  borderRadius: '12px', 
                  height: '100%',
                  border: `1px solid ${item.textColor}20`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: item.textColor }}>{item.value || 'Not Specified'}</span>
                </div>
              </div>
            ))}
          </div>

          <AlsoReadCard relatedJob={intersperseJobs[0]} />

          {/* ABOUT COMPANY */}
          {job.aboutCompany && (
            <div className="mb-5 p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h2 className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>
                <span style={{ width: '8px', height: '24px', backgroundColor: '#5bc0de', borderRadius: '4px' }}></span>
                About {job.company}
              </h2>
              <div className="rich-text-content" style={{ color: '#475569', lineHeight: '1.7' }}>
                <RichTextDisplay content={job.aboutCompany} />
              </div>
            </div>
          )}

          {/* JOB DESCRIPTION / ROLE OVERVIEW */}
          {job.jobDescription && (
            <div className="mb-5">
              <h2 className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>
                <span style={{ width: '8px', height: '24px', backgroundColor: '#5bc0de', borderRadius: '4px' }}></span>
                Role Overview & Focus Areas
              </h2>
              <div className="rich-text-content ps-2" style={{ color: '#334155' }}>
                <RichTextDisplay content={job.jobDescription} />
              </div>
              
              <AlsoReadCard relatedJob={intersperseJobs[1]} />
            </div>
          )}

          {/* RESPONSIBILITIES */}
          {job.responsibilities && (
            <div className="mb-5">
              <h2 className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>
                <span style={{ width: '8px', height: '24px', backgroundColor: '#5bc0de', borderRadius: '4px' }}></span>
                Key Responsibilities
              </h2>
              <div className="ps-2">
                {renderList(job.responsibilities)}
              </div>
            </div>
          )}

          {/* ELIGIBILITY CRITERIA */}
          {job.requirements && (
            <div className="mb-5">
              <h2 className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>
                <span style={{ width: '8px', height: '24px', backgroundColor: '#ff9800', borderRadius: '4px' }}></span>
                Eligibility Criteria
              </h2>
              <div className="ps-2">
                {renderList(job.requirements)}
              </div>
            </div>
          )}

          {/* WHY JOIN SECTION */}
          {job.whyJoin && (
            <div className="mb-5 p-4 rounded-4" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
              <h2 className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#92400e' }}>
                🌟 Why Join {job.company}?
              </h2>
              <div className="ps-2">
                {renderList(job.whyJoin)}
              </div>
              
              <AlsoReadCard relatedJob={intersperseJobs[2]} />
            </div>
          )}

          {/* HOW TO APPLY */}
          {job.howToApply && (
            <div className="mb-5 alert alert-info border-0 rounded-4 p-4 shadow-sm" style={{ backgroundColor: '#f0f9ff' }}>
              <h2 className="mb-3" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0369a1' }}>
                🚀 How to Apply
              </h2>
              <div className="rich-text-content" style={{ color: '#0c4a6e' }}>
                <RichTextDisplay content={job.howToApply} />
              </div>
            </div>
          )}

          {/* APPLY BUTTON FOOTER */}
          <div className="my-5 py-5 text-center border-top border-bottom" style={{ backgroundColor: '#fafbfc', margin: '0 -15px' }}>
            <h4 className="mb-4 fw-bold">Ready to take the next step?</h4>
            <a 
              href={job.applyLink} 
              onClick={(e) => handleApply(e, job.applyLink)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-lg px-5 py-3 shadow-lg hover-up" 
              style={{ 
                backgroundColor: '#5bc0de', 
                color: '#fff', 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                borderRadius: '50px',
                border: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              Apply for this Position
            </a>
            <p className="mt-3 text-muted small">Application closing on: {job.lastDate ? new Date(job.lastDate).toLocaleDateString() : 'Soon'}</p>
          </div>

        </div>

        <div className="col-12 col-lg-4 col-right">
          <div className="sidebar-sticky">
            <RecentJobs jobs={recent} />
          </div>
        </div>
      </div>
    </div>
  );
}
