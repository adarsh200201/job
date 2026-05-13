import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, FALLBACK_IMAGE, getFallbackImage } from '../utils/imageUtils.js';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const PostCard = memo(({ job }) => {
  const ago = useMemo(() => timeAgo(job.createdAt), [job.createdAt]);

  return (
    <Link to={`/${job.slug}`} className="rj-card">
      <div className="rj-img-wrap">
        <img
          src={getImageUrl(job.image) || getFallbackImage(job.title)}
          alt={job.title}
          className="rj-img"
          loading="lazy"
          onError={(e) => { 
            const fb = getFallbackImage(job.title);
            if (e.target.src !== fb) e.target.src = fb; 
          }}
        />
      </div>
      <div className="rj-info">
        <span className="rj-title">{job.title}</span>
        <span className="rj-meta">
          {job.company && <span className="rj-company">{job.company}</span>}
          <span className="rj-ago">{ago}</span>
        </span>
      </div>
    </Link>
  );
});

const RecentJobs = memo(function RecentJobs({ jobs = [] }) {
  const recent = useMemo(() => jobs.slice(0, 8), [jobs]);

  return (
    <aside className="rj-container">
      <div className="rj-header">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        <span>Recent Posts</span>
      </div>
      {recent.length === 0 ? (
        <div className="rj-empty">No recent posts yet</div>
      ) : (
        <div className="rj-list">
          {recent.map((j) => <PostCard key={j._id} job={j} />)}
        </div>
      )}
    </aside>
  );
});

export default RecentJobs;
