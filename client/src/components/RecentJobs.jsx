import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUtils.js';

const PostCard = memo(({ job }) => {
  const date = useMemo(() => {
    return new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [job.createdAt]);

  return (
    <div className="recent-post-card">
      <div className="recent-post-image">
        <img 
          src={getImageUrl(job.image) || FALLBACK_IMAGE} 
          alt={job.title} 
          className="post-image-img" 
          loading="lazy" 
          onError={(e) => { 
            if (e.target.src !== FALLBACK_IMAGE) {
              e.target.src = FALLBACK_IMAGE; 
            }
          }}
        />
      </div>
      <div className="recent-post-content">
        <Link to={`/${job.slug}`} className="recent-post-title">
          {job.title}
        </Link>
        <div className="recent-post-meta">
          <span className="post-author">by NextJobPost</span>
          <span className="post-date">{date}</span>
        </div>
      </div>
    </div>
  );
});

const RecentJobs = memo(function RecentJobs({ jobs = [] }) {
  const recent = useMemo(() => jobs.slice(0, 8), [jobs]);

  if (recent.length === 0) {
    return (
      <aside className="recent-jobs-container">
        <h3 className="recent-posts-title">Recent Posts</h3>
        <div className="text-muted text-center py-4">No recent posts</div>
      </aside>
    );
  }

  return (
    <aside className="recent-jobs-container">
      <h3 className="recent-posts-title">Recent Posts</h3>
      <div className="recent-posts-list">
        {recent.map((j) => (
          <PostCard key={j._id} job={j} />
        ))}
      </div>
    </aside>
  );
});

export default RecentJobs;
