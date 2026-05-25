import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import RecentJobs from '../components/RecentJobs.jsx';
import RichTextDisplay from '../components/RichTextDisplay.jsx';
import { JobDetailsSkeleton } from '../components/SkeletonLoader.jsx';
import { getImageUrl } from '../utils/imageUtils.js';

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
            onError={(e) => { e.target.style.display = 'none'; }}
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
    // Ad popunder disabled for now
    /*
    e.preventDefault();
    if (adLink) {
      window.open(adLink, '_blank', 'noopener,noreferrer');
    }
    window.location.href = applyUrl;
    */
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
    <div className="mb-4 social-group-container">
      {/* WhatsApp Box */}
      <div className="social-group-box whatsapp-box">
        <div className="social-group-icon-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#25D366" width="24" height="24">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          <span>WhatsApp Group</span>
        </div>
        <a
          href={job.whatsapp ? (job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')) : 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ'}
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16" className="me-2 mb-1">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          Join Now
        </a>
      </div>

      {/* Telegram Box */}
      <div className="social-group-box telegram-box">
        <div className="social-group-icon-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0088cc" width="24" height="24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
          </svg>
          <span>Join Telegram</span>
        </div>
        <a
          href={job.telegram ? (job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')) : 'https://t.me/nextjobpost'}
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="me-2 mb-1">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
          </svg>
          Join Now
        </a>
      </div>
    </div>
  );

  const getEmploymentType = (type) => {
    if (!type) return "FULL_TIME";
    const t = type.toLowerCase();
    if (t.includes("intern")) return "INTERN";
    if (t.includes("contract")) return "CONTRACT";
    if (t.includes("part")) return "PART_TIME";
    return "FULL_TIME";
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.jobDescription || job.description,
    "datePosted": job.createdAt || new Date().toISOString(),
    "validThrough": job.lastDate || undefined,
    "employmentType": getEmploymentType(job.type),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "logo": `${window.location.origin}/logo.png`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Pan India",
        "addressCountry": "IN"
      }
    },
    "directApply": true,
    "jobLocationType": (job.location && job.location.toLowerCase().includes("remote")) ? "TELECOMMUTE" : undefined
  };

  return (
    <div className="job-details container my-4">
      <Helmet>
        <title>{job.metaTitle || `${job.title} at ${job.company} | NextJobPost`}</title>
        <meta name="description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}. Find eligibility criteria, responsibilities, and apply now.`} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={job.metaTitle || `${job.title} at ${job.company} | NextJobPost`} />
        <meta property="og:description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}.`} />
        <meta property="og:image" content={getImageUrl(job.image) || `${window.location.origin}/logo.png`} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={job.metaTitle || `${job.title} at ${job.company} | NextJobPost`} />
        <meta name="twitter:description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}.`} />
        <meta name="twitter:image" content={getImageUrl(job.image) || `${window.location.origin}/logo.png`} />

        {/* Structured Data (Google Jobs Schema) */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
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
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Short Summary Intro */}
          {job.description && (
            <div className="mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#333' }}>
              {typeof job.description === 'string' && job.description.includes('<') ? (
                <RichTextDisplay content={job.description} />
              ) : (
                <p><strong>{job.company}</strong> {job.description.replace(new RegExp('^' + job.company + '?', 'i'), '')}</p>
              )}
            </div>
          )}

          {/* Middle Placement */}
          {socialLinksBlock}

          {/* Removed Social Links block from here and moved it to top */}
          {job.lastDate && (
            <p className="mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#333' }}>
              If you are a <strong>Graduation - {job.education || 'Any Degree'}</strong> this is your chance to <strong>build your future with {job.company}</strong>. The detailed eligibility criteria, responsibilities, and application process for the {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''} are provided below.
            </p>
          )}

          {/* OVERVIEW SECTION */}
          <div className="mb-4">
            <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {capitalize(job.company)} Off Campus Recruitment {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''} – Overview
            </h2>
            <ul className="job-overview-list list-unstyled ps-4" style={{ lineHeight: '2' }}>
              {job.company && <li style={{listStyleType: 'disc'}}><strong>Company Name:</strong> {job.company}</li>}
              {job.type && <li style={{listStyleType: 'disc'}}><strong>Role:</strong> {job.type}</li>}
              {job.education && <li style={{listStyleType: 'disc'}}><strong>Qualification:</strong> {job.education}</li>}
              {job.experience && <li style={{listStyleType: 'disc'}}><strong>Experience:</strong> {job.experience}</li>}
              
              <AlsoReadCard relatedJob={intersperseJobs[0]} />

              {job.batch && <li style={{listStyleType: 'disc'}}><strong>Batch:</strong> {job.batch}</li>}
              {job.location && <li style={{listStyleType: 'disc'}}><strong>Location:</strong> {job.location}</li>}
              {job.salary && <li style={{listStyleType: 'disc'}}><strong>Salary:</strong> {job.salary}</li>}
              {job.lastDate && <li style={{listStyleType: 'disc'}}><strong>Application Deadline:</strong> {new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>}
            </ul>
          </div>

          {/* ABOUT COMPANY */}
          {job.aboutCompany && (
            <div className="mb-4 text-dark" style={{ lineHeight: '1.7' }}>
              <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                About {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.aboutCompany} />
              </div>
              
              <AlsoReadCard relatedJob={intersperseJobs[1]} />
            </div>
          )}

          {/* JOB DESCRIPTION */}
          {job.jobDescription && (
            <div className="mb-4 text-dark" style={{ lineHeight: '1.7' }}>
              <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Job Description
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.jobDescription} />
              </div>
            </div>
          )}

          {/* RESPONSIBILITIES */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Roles & Responsibilities for {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}
              </h2>
              {renderList(job.responsibilities)}
            </div>
          )}

          {/* ELIGIBILITY CRITERIA */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Eligibility Criteria
              </h2>
              {renderList(job.requirements)}
            </div>
          )}

          {/* WHY JOIN SECTION */}
          {job.whyJoin && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Why Join {job.company}?
              </h2>
              {renderList(job.whyJoin)}

              <AlsoReadCard relatedJob={intersperseJobs[2]} />
            </div>
          )}

          {job.contact && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Contact Information
              </h2>
              <p className="ps-2">{job.contact}</p>
            </div>
          )}

          {job.howToApply && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                How to Apply for {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.howToApply} />
              </div>
            </div>
          )}

          {job.finalThoughts && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={{ backgroundColor: '#5bc0de', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Final Thoughts
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.finalThoughts} />
              </div>
            </div>
          )}

          <div className="my-5 mb-5 ps-2">
            <h5 className="mb-3">Interested candidates can apply online using the following link.</h5>
            <a href={job.applyLink} onClick={(e) => handleApply(e, job.applyLink)} target="_blank" rel="noopener noreferrer" className="btn text-white fw-bold d-inline-block shadow" style={{ backgroundColor: '#5bc0de', padding: '12px 30px', fontSize: '1.1rem', borderRadius: '4px' }}>Apply Now</a>
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
