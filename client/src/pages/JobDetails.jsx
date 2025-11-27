import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/index.js';
import RecentJobs from '../components/RecentJobs.jsx';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobRes, jobsRes] = await Promise.all([api.get(`/jobs/${id}`), api.get('/jobs')]);
        setJob(jobRes.data);
        setRecent(jobsRes.data.filter((j) => j._id !== id));
      } catch {
        setJob(null);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="job-details">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {/* contact links above title */}
          <div className="mb-3 contact-links">
            {job.whatsapp && (
              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2 19 19 0 0 1-3.2-.9 8 8 0 0 1-3.1-2.1 8 8 0 0 1-2.1-3.1A19 19 0 0 1 7 5a2 2 0 0 1 2-2h.1A2 2 0 0 1 11 3l.6 2.1a2 2 0 0 0 1.3 1.3L15 7a2 2 0 0 1 2 2v6z" />
                  </svg>
                </div>
                <div className="contact-meta">
                  <div className="contact-label">WhatsApp</div>
                  <a className="contact-value" href={job.whatsapp.startsWith('http') ? job.whatsapp : `https://wa.me/${job.whatsapp.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(job.title + ' - ' + job.applyLink)}`} target="_blank" rel="noopener noreferrer" aria-label="Contact via WhatsApp">Contact on WhatsApp</a>
                </div>
                <div className="contact-actions">
                  <a className="btn btn-success btn-sm join-now" href={job.whatsapp.startsWith('http') ? job.whatsapp : `https://wa.me/${job.whatsapp.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(job.title + ' - ' + job.applyLink)}`} target="_blank" rel="noopener noreferrer">Join Now</a>
                </div>
              </div>
            )}
            {job.telegram && (
              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2AABEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2l-7 20  -4-9-9-4 20-7z" />
                  </svg>
                </div>
                <div className="contact-meta">
                  <div className="contact-label">Telegram</div>
                  <a className="contact-value" href={job.telegram.startsWith('http') ? job.telegram : `https://t.me/${job.telegram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" aria-label="Open Telegram">Open on Telegram</a>
                </div>
                <div className="contact-actions">
                  <a className="btn btn-primary btn-sm join-now" href={job.telegram.startsWith('http') ? job.telegram : `https://t.me/${job.telegram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer">Join Now</a>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="job-title-large mb-0">{job.title}</h1>
            <div className="d-flex gap-2">
              <a className="btn btn-success btn-lg" href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
            </div>
          </div>

          <div className="text-muted mb-2">
            <span className="me-3">{job.company}</span>
            <span className="me-3">{job.location}</span>
            <span className="badge bg-info-subtle text-info-emphasis">{job.type}</span>
          </div>

          <article className="card p-3 mb-3">
            <h2 className="h6">Role description</h2>
            <p className="mb-0 text-prewrap">{job.description}</p>
          </article>

          {job.image && <img src={job.image} alt="job" className="img-fluid mb-3 rounded" />}

          {job.contact && (
            <div className="card p-3 mb-3">
              <h3 className="h6">Contact</h3>
              <p className="mb-0">{job.contact}</p>
            </div>
          )}

          <div className="mt-3">
            <Link to="/" className="btn btn-outline-secondary btn-sm">Back to listings</Link>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <RecentJobs jobs={recent} />
        </div>
      </div>
    </div>
  );
}
