import React from 'react';
import { getJobUrl } from '../utils/urlHelper.js';
import { openDualTabs } from '../utils/adUtils.js';

export default function JobCard({ job }) {
  const targetUrl = getJobUrl(job);

  return (
    <div className="card h-100 shadow-sm job-card">
      <div className="card-body d-flex flex-column">
        <h3 className="h6 card-title mb-1">
          <a 
            href={targetUrl} 
            onClick={(e) => openDualTabs(targetUrl, e)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-decoration-none text-dark"
          >
            {job.title}
          </a>
        </h3>
        <div className="text-muted small mb-2">
          <span className="me-2">{job.company}</span>
          <span className="me-2">•</span>
          <span>{job.location}</span>
        </div>
        <span className="mb-3 align-self-start badge bg-info-subtle text-info-emphasis">{job.type}</span>
        <div className="mt-auto d-flex gap-2">
          <a 
            href={targetUrl} 
            onClick={(e) => openDualTabs(targetUrl, e)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline-secondary btn-sm"
          >
            Details
          </a>
          {job.applyLink && (
            <a 
              className="btn btn-primary btn-sm" 
              href={job.applyLink} 
              onClick={(e) => openDualTabs(job.applyLink, e)} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Apply
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
