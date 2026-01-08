import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/index.js';
import RecentJobs from '../components/RecentJobs.jsx';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [relatedJob, setRelatedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobRes, jobsRes] = await Promise.all([api.get(`/jobs/`+id), api.get('/jobs?limit=100')]);
        const currentJob = jobRes.data?.data || jobRes.data;
        setJob(currentJob);
        
        const allJobs = jobsRes.data?.data || jobsRes.data;
        const otherJobs = allJobs.filter((j) => j._id !== id);
        
        setRecent(otherJobs.slice(0, 5));
        if (otherJobs.length > 0) {
          setRelatedJob(otherJobs[0]);
        }

      } catch {
        setJob(null);
        setRecent([]);
        setRelatedJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!job) return <p>Job not found.</p>;

  const sectionStyle = {
    backgroundColor: '#32c5d2',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '15px'
  };  return (
    <div className="job-details container">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {/* contact links */}
          {(job.whatsapp || job.telegram) && (
            <div className="mb-4 contact-links">
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
          )}

          <div className="job-header-section mb-4">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div className="flex-grow-1">
                <h1 className="job-title-large mb-2">{job.title}</h1>
                <div className="job-meta-info">
                  <span className="job-company"><strong>{job.company}</strong></span>
                  <span className="job-meta-sep">•</span>
                  <span className="job-location">📍 {job.location}</span>
                  <span className="job-meta-sep">•</span>
                  <span className="job-type">💼 {job.type}</span>
                </div>
              </div>
              <a className="btn btn-success btn-apply-sticky" href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
            </div>

            <div className="job-tags">
              {job.batch && <span className="badge badge-modern badge-info">{job.batch}</span>}
              {job.experience && <span className="badge badge-modern badge-secondary">{job.experience}</span>}
              {job.salary && <span className="badge badge-modern badge-success">💰 {job.salary}</span>}
            </div>

            {job.lastDate && (
              <div className="alert alert-warning py-3 mt-3 mb-0">
                <strong>⏰ Application Deadline:</strong> {new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>

          {job.image && (
            <div className="job-image-section mb-4">
              <img src={job.image} alt="job" className="img-fluid rounded-3" />
            </div>
          )}

          {job.jobDescription && (
            <div className="mb-4">
              <p style={{ color: '#444', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{job.jobDescription}</p>
                {job.highlightText && (
                  <p style={{ color: '#222', marginTop: '0.75rem' }}>
                    <strong>{job.highlightText}</strong>
                  </p>
                )}
            </div>
          )}

          {(job.whatsapp || job.telegram) && (
            <div className="my-4">
              {job.whatsapp && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  border: '1px solid #25D366',
                  backgroundColor: '#e6f8ec'
                }}>
                  <span><strong>WhatsApp Group</strong></span>
                  <a 
                    href={job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      padding: '5px 15px',
                      borderRadius: '5px',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      backgroundColor: '#25D366'
                    }}
                  >
                    Join Now
                  </a>
                </div>
              )}
              {job.telegram && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  border: '1px solid #0088cc',
                  backgroundColor: '#e6f3fa'
                }}>
                  <span><strong>Join Telegram</strong></span>
                  <a 
                    href={job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      padding: '5px 15px',
                      borderRadius: '5px',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      backgroundColor: '#0088cc'
                    }}
                  >
                    Join Now
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <h2 style={sectionStyle}>{job.title} - Overview</h2>
            <ul style={{
              listStyle: 'none',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              {job.company && <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px', color: 'black' }}>●</span><strong>Company Name:</strong><span style={{ marginLeft: '8px' }}>{job.company}</span></li>}
              {job.type && <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px', color: 'black' }}>●</span><strong>Role:</strong><span style={{ marginLeft: '8px' }}>{job.type}</span></li>}
              {job.education && <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px', color: 'black' }}>●</span><strong>Qualification:</strong><span style={{ marginLeft: '8px' }}>{job.education}</span></li>}
              {job.experience && <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px', color: 'black' }}>●</span><strong>Experience:</strong><span style={{ marginLeft: '8px' }}>{job.experience}</span></li>}
              
              {relatedJob && (
                <li style={{ margin: '20px 0' }}>
                  <div style={{ 
                    border: '1px dashed #d9534f', 
                    padding: '15px', 
                    borderRadius: '8px',
                    backgroundColor: '#fffaf0'
                  }}>
                    <p style={{ margin: 0, color: '#d9534f', fontWeight: 'bold' }}>Also read ---</p>
                    <Link to={`/job/${relatedJob._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        {relatedJob.image && (
                          <img src={relatedJob.image} alt={relatedJob.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }} />
                        )}
                        <div>
                          <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{relatedJob.title}</h5>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>{relatedJob.company} - {relatedJob.location}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </li>
              )}

              {job.batch && <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px', color: 'black' }}>●</span><strong>Batch:</strong><span style={{ marginLeft: '8px' }}>{job.batch}</span></li>}
              {job.location && <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px', color: 'black' }}>●</span><strong>Location:</strong><span style={{ marginLeft: '8px' }}>{job.location}</span></li>}
              {job.salary && <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px', color: 'black' }}>●</span><strong>Salary:</strong><span style={{ marginLeft: '8px' }}>{job.salary}</span></li>}
              {job.lastDate && <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px', color: 'black' }}>●</span><strong>Application Deadline:</strong><span style={{ marginLeft: '8px' }}>{new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></li>}
            </ul>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mb-4">
              <h2 style={sectionStyle}>🎯 Roles & Responsibilities</h2>
              <ul style={{ listStyle: 'none', paddingLeft: 0, color: '#444', lineHeight: '1.8' }}>
                {(Array.isArray(job.responsibilities) ? job.responsibilities : job.responsibilities.split('\n')).filter(r => r.trim()).map((resp, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>✓ {resp.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-4">
              <h2 style={sectionStyle}>✅ Eligibility Criteria</h2>
              <ul style={{ listStyle: 'none', paddingLeft: 0, color: '#444', lineHeight: '1.8' }}>
                {(Array.isArray(job.requirements) ? job.requirements : job.requirements.split('\n')).filter(r => r.trim()).map((req, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>→ {req.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="mb-4">
              <h2 style={sectionStyle}>🛠️ Required Skills</h2>
              <ul style={{ listStyle: 'none', paddingLeft: 0, color: '#444', lineHeight: '1.8' }}>
                {(Array.isArray(job.skills) ? job.skills : job.skills.split('\n')).filter(s => s.trim()).map((skill, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>🛠️ {skill.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {job.description && (
            <div className="mb-4">
              <h2 style={sectionStyle}>Additional Information</h2>
              <p style={{ color: '#444', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{job.description}</p>
            </div>
          )}

          {job.contact && (
            <div className="mb-4">
              <h2 style={sectionStyle}>☎️ Contact Information</h2>
              <p style={{ color: '#444' }}>{job.contact}</p>
            </div>
          )}

          {job.howToApply && (
            <div className="mb-4">
              <h2 style={sectionStyle}>How to Apply for {job.company} Off Campus Drive {job.batch}</h2>
              <p style={{ color: '#444', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{job.howToApply}</p>
            </div>
          )}

          <div className="mb-4">
            <p><strong>Apply Now: <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Click Here</a></strong></p>
          </div>

          {job.finalThoughts && (
            <div className="mb-4">
              <h2 style={sectionStyle}>Final Thoughts</h2>
              <p style={{ color: '#444', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{job.finalThoughts}</p>
            </div>
          )}

          <div className="mb-4">
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-success">Apply Now</a>
          </div>

          <div className="mb-4">
            <Link to="/" className="btn btn-outline-secondary btn-back">← Back to Job Listings</Link>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div style={{ position: 'sticky', top: '20px' }}>
            <RecentJobs jobs={recent} />
          </div>
        </div>
      </div>
    </div>
  );
}
