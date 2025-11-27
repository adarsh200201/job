import React from 'react';
import { Link } from 'react-router-dom';

function excerpt(text, n = 300) {
  if (!text) return '';
  if (text.length <= n) return text;
  return `${text.slice(0, n).trim()}…`;
}

export default function JobDetailCard({ job }) {
  return (
    <article className="card mb-3 job-detail-card">
      <div className="row g-0 align-items-center">
        <div className="col-auto p-3">
          <div className="job-thumb">
            {(() => {
              const fallback = 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F196590e2e83d4a159a955d16c0e8ebde?format=webp&width=800';
              const src = job.image || fallback;
              return <img src={src} alt="thumb" className="img-fluid rounded" />;
            })()}
          </div>
        </div>
        <div className="col">
          <div className="card-body d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h2 className="h5 mb-1">{job.title}</h2>
                <div className="small text-muted">{job.company} • {job.location}</div>
              </div>
              <div className="text-end">
                <span className="badge bg-info-subtle text-info-emphasis mb-2">{job.type}</span>
                <div className="small text-muted">{new Date(job.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <p className="mb-3 text-muted job-excerpt">{excerpt(job.description)}</p>

            <div className="mt-auto d-flex gap-2">
              <Link to={`/job/${job._id}`} className="btn btn-outline-secondary btn-sm">Read more</Link>
              <a className="btn btn-primary btn-sm" href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
