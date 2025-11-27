import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="card h-100 shadow-sm job-card">
      <div className="card-body d-flex flex-column">
        <h3 className="h6 card-title mb-1">{job.title}</h3>
        <div className="text-muted small mb-2">
          <span className="me-2">{job.company}</span>
          <span className="me-2">•</span>
          <span>{job.location}</span>
        </div>
        <span className="mb-3 align-self-start badge bg-info-subtle text-info-emphasis">{job.type}</span>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/job/${job._id}`} className="btn btn-outline-secondary btn-sm">Details</Link>
          <a className="btn btn-primary btn-sm" href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply</a>
        </div>
      </div>
    </div>
  );
}
