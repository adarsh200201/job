import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/index.js';

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

export default function JobCard({ job, adLink: propAdLink }) {
  const [adLink, setAdLink] = useState(propAdLink || DEFAULT_AD_LINK);

  useEffect(() => {
    if (!propAdLink) {
      api.get('/settings/adLink').then(res => {
        if (res.data?.data) setAdLink(res.data.data);
      }).catch(() => {});
    }
  }, [propAdLink]);

  const handleApply = (e) => {
    // Ad popunder disabled for now
    /*
    e.preventDefault();
    // Open ad link in new tab
    if (adLink) {
      window.open(adLink, '_blank', 'noopener,noreferrer');
    }
    // Redirect current page to apply URL
    window.location.href = job.applyLink;
    */
  };

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
          <Link to={`/job/${job.slug}`} className="btn btn-outline-secondary btn-sm">Details</Link>
          <a className="btn btn-primary btn-sm" href={job.applyLink} onClick={handleApply} target="_blank" rel="noopener noreferrer">Apply</a>
        </div>
      </div>
    </div>
  );
}
