import React from 'react';
import { Link } from 'react-router-dom';

export default function RecentJobs({ jobs = [] }) {
  const recent = jobs.slice(0, 8);

  return (
    <aside className="card p-4 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
      <h3 className="h6 mb-3 fw-bold">Recent Posts</h3>
      <ul className="list-group list-group-flush">{recent.map((j) => (
          <li key={j._id} className="list-group-item d-flex gap-2 align-items-center bg-transparent border-bottom">
            <div className="recent-thumb me-2">
              {(() => {
                const fallback = 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F196590e2e83d4a159a955d16c0e8ebde?format=webp&width=800';
                const src = j.image || fallback;
                return <img src={src} alt="thumb" className="img-fluid rounded" />;
              })()}
            </div>
            <div className="flex-grow-1">
              <Link to={`/job/${j._id}`} className="stretched-link text-decoration-none fw-semibold text-dark small">{j.title}</Link>
              <div className="small text-muted">by Job For Fresher • {new Date(j.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </li>
        ))}
        {recent.length === 0 && <li className="list-group-item text-muted bg-transparent">No recent posts</li>}
      </ul>
    </aside>
  );
}
