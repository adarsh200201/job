import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const POPULAR_SEARCHES = [
  'Work from home',
  'Part-time',
  'Data Analyst',
  'Engineering',
  'IT',
  'Marketing',
  'Finance',
  'Software Developer',
  'Project Manager',
  'Sales',
];

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const loc = useLocation();

  const handleSearch = (e) => {
    e && e.preventDefault();
    const params = new URLSearchParams(loc.search);
    if (query.trim()) params.set('q', query.trim()); else params.delete('q');
    if (location.trim()) params.set('location', location.trim()); else params.delete('location');
    navigate(`/?${params.toString()}`);
  };

  const handlePopular = (term) => {
    const params = new URLSearchParams();
    params.set('q', term);
    navigate(`/?${params.toString()}`);
  };

  return (
    <section className="hero-search-section">
      <div className="hero-search-content">
        <h1 className="hero-headline">
          Find your <span className="hero-highlight">next job.</span>
        </h1>

        <form className="hero-search-bar" onSubmit={handleSearch} role="search">
          <div className="hero-input-group">
            <div className="hero-input-wrapper">
              <svg className="hero-input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                id="hero-job-search"
                type="text"
                className="hero-input"
                placeholder="Search jobs, keywords, companies"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search jobs"
              />
            </div>
            <div className="hero-input-divider" />
            <div className="hero-input-wrapper">
              <svg className="hero-input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                id="hero-location-search"
                type="text"
                className="hero-input"
                placeholder='Enter location or "remote"'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
              />
            </div>
          </div>
          <button className="hero-search-btn" type="submit" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </form>

        <div className="hero-popular">
          <span className="hero-popular-label">Popular Searches</span>
          <div className="hero-popular-tags">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                className="hero-popular-tag"
                onClick={() => handlePopular(term)}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
