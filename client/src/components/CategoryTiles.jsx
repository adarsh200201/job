import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'part-time', title: 'Part-time jobs', query: 'type=Part-Time' },
  { id: 'full-time', title: 'Full-time job', query: 'type=Full-Time' },
  { id: 'work-from-home', title: 'Work from home', query: 'type=Remote' },
  { id: 'no-experience', title: 'Jobs without experience', query: 'q=no experience' },
];

export default function CategoryTiles() {
  return (
    <div className="category-tiles mb-4">
      <div className="row g-3">
        {categories.map((c) => (
          <div key={c.id} className="col-6 col-md-3">
            <Link to={`/?${encodeURI(c.query)}`} className="card p-3 text-center category-tile text-decoration-none">
              <div className="fw-semibold text-dark">{c.title}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
