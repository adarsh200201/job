import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import RecentJobs from '../components/RecentJobs.jsx';
import RichTextDisplay from '../components/RichTextDisplay.jsx';
import { JobDetailsSkeleton } from '../components/SkeletonLoader.jsx';

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

export default function JobDetails() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [relatedJob, setRelatedJob] = useState(null);
  const [adLink, setAdLink] = useState(DEFAULT_AD_LINK);
  const cache = useCache();

  const handleApply = (e, applyUrl) => {
    e.preventDefault();
    // Open ad link in new tab
    if (adLink) {
      window.open(adLink, '_blank', 'noopener,noreferrer');
    }
    // Redirect current page to apply URL
    window.location.href = applyUrl;
  };

  useEffect(() => {
    let isMounted = true;

    // Fetch ad link from settings
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

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Don't fetch if slug is not available
    if (!slug) {
      setJob(null);
      setRecent([]);
      setRelatedJob(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch the specific job by slug
        let jobRes;
        try {
          jobRes = await cache.get(
            (url) => api.get(url),
            `/jobs/${slug}`
          );
        } catch (error) {
          // Fallback: fetch first 100 jobs and search client-side
          const fallbackRes = await cache.get(
            (url) => api.get(url),
            '/jobs?limit=100'
          );
          const allJobs = fallbackRes.data?.data || fallbackRes.data || [];
          jobRes = {
            data: {
              data: allJobs.find((j) => j.slug === slug) || null
            }
          };
        }

        if (!isMounted) return;

        const currentJob = jobRes?.data?.data || jobRes?.data || null;

        if (!currentJob) {
          if (isMounted) {
            setJob(null);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setJob(currentJob);
        }

        // Fetch recent jobs for the sidebar (without the current job)
        const recentRes = await cache.get(
          (url) => api.get(url),
          '/jobs?limit=10'
        );
        const allJobs = recentRes.data?.data || recentRes.data || [];
        const otherJobs = Array.isArray(allJobs)
          ? allJobs.filter((j) => j.slug !== slug)
          : [];

        if (isMounted) {
          setRecent(otherJobs.slice(0, 5));
          if (otherJobs.length > 0) {
            setRelatedJob(otherJobs[0]);
          }
        }

      } catch (error) {
        if (isMounted) {
          setJob(null);
          setRecent([]);
          setRelatedJob(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) return <JobDetailsSkeleton />;
  if (!job) return <p className="text-center text-muted">Job not found.</p>;

  return (
    <div className="job-details container">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {/* contact links */}
           {(job.whatsapp || job.telegram) && (
            <div className="my-4 social-group-container">
              {job.whatsapp && (
                <div className="social-group-box whatsapp-box">
                  <div className="social-group-icon-text">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#25D366" width="20" height="20">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    <span>WhatsApp Group</span>
                  </div>
                  <a
                    href={job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="20" height="20">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Join Now
                  </a>
                </div>
              )}
              {job.telegram && (
                <div className="social-group-box telegram-box">
                  <div className="social-group-icon-text">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0088cc" width="20" height="20">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                    </svg>
                    <span>Join Telegram</span>
                  </div>
                  <a
                    href={job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                    </svg>
                    Join Now
                  </a>
                </div>
              )}
            </div>
          )}


          <div className="job-header-section mb-4">
            <h1 className="job-title-large mb-3">{job.title}</h1>
            <div className="job-meta-info mb-3">
              <span className="job-date-published">
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently Posted'}
              </span>
              <span className="job-meta-sep">•</span>
              <span className="job-company"><strong>{job.company}</strong></span>
            </div>
          </div>

          {job.image && (
            <div className="job-image-section mb-4">
              <img src={job.image} alt="job" loading="lazy" className="img-fluid rounded-3" />
            </div>
          )}

          {job.lastDate && (
            <div className="alert alert-warning py-3 mb-4">
              <strong>⏰ Application Deadline:</strong> {new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          )}

          {/* Short Summary Section */}
          {job.description && (
            <div className="mb-4">
              <div className="job-summary-box">
                {typeof job.description === 'string' && job.description.includes('<') ? (
                  <RichTextDisplay content={job.description} />
                ) : (
                  <p>{job.description}</p>
                )}
              </div>
            </div>
          )}

          {/* About Company Section */}
          {job.aboutCompany && (
            <div className="mb-4">
              <h2 className="job-section-header">📋 About {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}</h2>
              <div className="rich-text-section">
                <RichTextDisplay content={job.aboutCompany} />
              </div>
            </div>
          )}

          {/* Job Description Section */}
          {job.jobDescription && (
            <div className="mb-4">
              <h2 className="job-section-header">📝 Job Description</h2>
              <div className="rich-text-section">
                <RichTextDisplay content={job.jobDescription} />
              </div>
                {job.highlightText && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <strong><RichTextDisplay content={job.highlightText} /></strong>
                  </div>
                )}
            </div>
          )}

          {(job.whatsapp || job.telegram) && (
            <div className="my-4 social-group-container">
              {job.whatsapp && (
                <div className="social-group-box whatsapp-box">
                  <div className="social-group-icon-text">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#25D366" width="20" height="20">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    <span>WhatsApp Group</span>
                  </div>
                  <a
                    href={job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="20" height="20">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Join Now
                  </a>
                </div>
              )}
              {job.telegram && (
                <div className="social-group-box telegram-box">
                  <div className="social-group-icon-text">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0088cc" width="20" height="20">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                    </svg>
                    <span>Join Telegram</span>
                  </div>
                  <a
                    href={job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                    </svg>
                    Join Now
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <h2 className="job-section-header">{job.title} - Overview</h2>
            <ul className="job-overview-list">
              {job.company && <li><span>●</span><strong>Company Name:</strong><span>{job.company}</span></li>}
              {job.type && <li><span>●</span><strong>Role:</strong><span>{job.type}</span></li>}
              {job.education && <li><span>●</span><strong>Qualification:</strong><span>{job.education}</span></li>}
              {job.experience && <li><span>●</span><strong>Experience:</strong><span>{job.experience}</span></li>}

              {relatedJob && (
                <li style={{ margin: '20px 0' }}>
                  <div className="related-job-card">
                    <p>Also read ---</p>
                    <Link to={`/${relatedJob.slug}`} className="related-job-card-link">
                      {relatedJob.image && (
                        <img src={relatedJob.image} alt={relatedJob.title} loading="lazy" className="related-job-image" />
                      )}
                      <div>
                        <h5 className="related-job-title">{relatedJob.title}</h5>
                        <p className="related-job-meta">{relatedJob.company} - {relatedJob.location}</p>
                      </div>
                    </Link>
                  </div>
                </li>
              )}

              {job.batch && <li><span>●</span><strong>Batch:</strong><span>{job.batch}</span></li>}
              {job.location && <li><span>●</span><strong>Location:</strong><span>{job.location}</span></li>}
              {job.salary && <li><span>●</span><strong>Salary:</strong><span>{job.salary}</span></li>}
              {job.lastDate && <li><span>●</span><strong>Application Deadline:</strong><span>{new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></li>}
            </ul>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mb-4">
              <h2 className="job-section-header">🎯 Roles & Responsibilities for {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}</h2>
              {typeof job.responsibilities === 'string' && job.responsibilities.includes('<') ? (
                <div className="rich-text-section">
                  <RichTextDisplay content={job.responsibilities} />
                </div>
              ) : Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && typeof job.responsibilities[0] === 'string' && job.responsibilities[0].includes('<') ? (
                <div className="rich-text-section">
                  <RichTextDisplay content={job.responsibilities[0]} />
                </div>
              ) : (
                <ul className="responsibilities-list">
                  {(Array.isArray(job.responsibilities) ? job.responsibilities : job.responsibilities.split('\n')).filter(r => r.trim()).map((resp, idx) => (
                    <li key={idx}>✓ {resp.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-4">
              <h2 className="job-section-header">✅ Eligibility Criteria for {job.company}</h2>
              {typeof job.requirements === 'string' && job.requirements.includes('<') ? (
                <div className="rich-text-section">
                  <RichTextDisplay content={job.requirements} />
                </div>
              ) : Array.isArray(job.requirements) && job.requirements.length > 0 && typeof job.requirements[0] === 'string' && job.requirements[0].includes('<') ? (
                <div className="rich-text-section">
                  <RichTextDisplay content={job.requirements[0]} />
                </div>
              ) : (
                <ul className="requirements-list">
                  {(Array.isArray(job.requirements) ? job.requirements : job.requirements.split('\n')).filter(r => r.trim()).map((req, idx) => (
                    <li key={idx}>→ {req.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Why Join Section */}
          {job.whyJoin && (
            <div className="mb-4">
              <h2 className="job-section-header">🌟 Why Join {job.company}?</h2>
              <div className="rich-text-section">
                <RichTextDisplay content={job.whyJoin} />
              </div>
            </div>
          )}

          {job.contact && (
            <div className="mb-4">
              <h2 className="job-section-header">☎️ Contact Information</h2>
              <p>{job.contact}</p>
            </div>
          )}

          {job.howToApply && (
            <div className="mb-4">
              <h2 className="job-section-header">📧 How to Apply for {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}</h2>
              <div className="rich-text-section">
                <RichTextDisplay content={job.howToApply} />
              </div>
            </div>
          )}

          <div className="mb-4">
            <p><strong>Apply Now: <a href={job.applyLink} onClick={(e) => handleApply(e, job.applyLink)} target="_blank" rel="noopener noreferrer">Click Here</a></strong></p>
          </div>

          {job.finalThoughts && (
            <div className="mb-4">
              <h2 className="job-section-header">💭 Final Thoughts</h2>
              <div className="rich-text-section">
                <RichTextDisplay content={job.finalThoughts} />
              </div>
            </div>
          )}

          <div className="mb-4">
            <a href={job.applyLink} onClick={(e) => handleApply(e, job.applyLink)} target="_blank" rel="noopener noreferrer" className="btn btn-success">Apply Now</a>
          </div>

          <div className="mb-4">
            <Link to="/" className="btn btn-outline-secondary btn-back">← Back to Job Listings</Link>
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
