import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_IMG = 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F196590e2e83d4a159a955d16c0e8ebde?format=webp&width=800';

const PostCard = memo(({ job }) => {
  const src = job.image || FALLBACK_IMG;
  const date = useMemo(() => {
    return new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [job.createdAt]);

  return (
    <div className="recent-post-card">
      <div className="recent-post-image">
        <img src={src} alt={job.title} className="post-image-img" loading="lazy" />
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
