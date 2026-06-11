import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/index.js';

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
  'Fresher Jobs',
  'Internship',
  'Bank Jobs',
  'Railway Jobs',
  'SSC',
  'UPSC',
  'Teaching',
  'Defence',
  'Nursing',
  'Accountant',
];

const LOCATIONS = [
  'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai',
  'Pune', 'Kolkata', 'Gurgaon', 'Noida', 'Remote',
  'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Chandigarh',
];

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [allJobTitles, setAllJobTitles] = useState([]);

  // Location suggestions
  const [locSuggestions, setLocSuggestions] = useState([]);
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const [activeLocSuggestion, setActiveLocSuggestion] = useState(-1);

  const wrapperRef = useRef(null);
  const locWrapperRef = useRef(null);
  const navigate = useNavigate();
  const loc = useLocation();

  // Sync input values with URL params (e.g. when page loads or user navigates)
  useEffect(() => {
    const params = new URLSearchParams(loc.search);
    setQuery(params.get('q') || '');
    setLocation(params.get('location') || '');
  }, [loc.search]);

  const handleClearQuery = () => {
    setQuery('');
    setSuggestions([]);
    const params = new URLSearchParams(loc.search);
    params.delete('q');
    navigate(`/?${params.toString()}`);
    setTimeout(() => {
      document.getElementById('hero-job-search')?.focus();
    }, 0);
  };

  const handleClearLocation = () => {
    setLocation('');
    setLocSuggestions([]);
    const params = new URLSearchParams(loc.search);
    params.delete('location');
    navigate(`/?${params.toString()}`);
    setTimeout(() => {
      document.getElementById('hero-location-search')?.focus();
    }, 0);
  };

  // Fetch job titles once for suggestions
  useEffect(() => {
    api.get('/jobs?limit=200')
      .then(res => {
        const jobs = res.data?.data || res.data || [];
        const titles = [...new Set(jobs.map(j => j.title).filter(Boolean))];
        setAllJobTitles(titles);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
      if (locWrapperRef.current && !locWrapperRef.current.contains(e.target)) {
        setShowLocSuggestions(false);
        setActiveLocSuggestion(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute suggestions when query changes
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const lower = trimmed.toLowerCase();
    const fromPopular = POPULAR_SEARCHES.filter(s => s.toLowerCase().includes(lower));
    const fromTitles = allJobTitles.filter(t => t.toLowerCase().includes(lower));
    // Merge, deduplicate, limit to 8
    const merged = [...new Set([...fromPopular, ...fromTitles])].slice(0, 8);
    setSuggestions(merged);
    setShowSuggestions(merged.length > 0);
    setActiveSuggestion(-1);
  }, [query, allJobTitles]);

  // Location suggestions
  useEffect(() => {
    const trimmed = location.trim();
    if (trimmed.length < 2) {
      setLocSuggestions([]);
      setShowLocSuggestions(false);
      return;
    }
    const lower = trimmed.toLowerCase();
    const matched = LOCATIONS.filter(l => l.toLowerCase().includes(lower)).slice(0, 6);
    setLocSuggestions(matched);
    setShowLocSuggestions(matched.length > 0);
    setActiveLocSuggestion(-1);
  }, [location]);

  const handleSearch = (e) => {
    e && e.preventDefault();
    setShowSuggestions(false);
    setShowLocSuggestions(false);
    const params = new URLSearchParams(loc.search);
    if (query.trim()) params.set('q', query.trim()); else params.delete('q');
    if (location.trim()) params.set('location', location.trim()); else params.delete('location');
    navigate(`/?${params.toString()}`);
  };

  const handleSelectSuggestion = (term) => {
    setQuery(term);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    const params = new URLSearchParams();
    params.set('q', term);
    if (location.trim()) params.set('location', location.trim());
    navigate(`/?${params.toString()}`);
  };

  const handleSelectLocation = (locName) => {
    setLocation(locName);
    setShowLocSuggestions(false);
    setActiveLocSuggestion(-1);
    const params = new URLSearchParams(loc.search);
    if (locName.trim()) params.set('location', locName.trim()); else params.delete('location');
    if (query.trim()) params.set('q', query.trim());
    navigate(`/?${params.toString()}`);
  };

  const handleQueryKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleLocKeyDown = (e) => {
    if (!showLocSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveLocSuggestion(prev => Math.min(prev + 1, locSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveLocSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeLocSuggestion >= 0) {
      e.preventDefault();
      handleSelectLocation(locSuggestions[activeLocSuggestion]);
    } else if (e.key === 'Escape') {
      setShowLocSuggestions(false);
    }
  };

  const handlePopular = (term) => {
    const params = new URLSearchParams();
    params.set('q', term);
    navigate(`/?${params.toString()}`);
  };

  const highlightMatch = (text, query) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong style={{ color: '#7c3aed' }}>{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <section className="hero-search-section">
      <div className="hero-search-content">
        <h1 className="hero-headline">
          Find your <span className="hero-highlight">next job.</span>
        </h1>

        <form className="hero-search-bar" onSubmit={handleSearch} role="search">
          <div className="hero-input-group">
            {/* Job Search Input with Suggestions */}
            <div className="hero-input-wrapper" ref={wrapperRef}>
              <svg className="hero-input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="hero-job-search"
                type="text"
                className="hero-input"
                placeholder={isMobile ? "Search jobs" : "Search jobs, keywords, companies"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleQueryKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                aria-label="Search jobs"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="hero-input-clear-btn"
                  onClick={handleClearQuery}
                  aria-label="Clear search query"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <ul className="hero-suggestions-dropdown">
                  {suggestions.map((s, idx) => (
                    <li
                      key={s}
                      className={`hero-suggestion-item ${idx === activeSuggestion ? 'active' : ''}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(s); }}
                      onMouseEnter={() => setActiveSuggestion(idx)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: '#9ca3af' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <span>{highlightMatch(s, query)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="hero-input-divider" />

            {/* Location Input with Suggestions */}
            <div className="hero-input-wrapper" ref={locWrapperRef}>
              <svg className="hero-input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <input
                id="hero-location-search"
                type="text"
                className="hero-input"
                placeholder={isMobile ? "Enter location" : 'Enter location or "remote"'}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleLocKeyDown}
                onFocus={() => locSuggestions.length > 0 && setShowLocSuggestions(true)}
                aria-label="Location"
                autoComplete="off"
              />
              {location && (
                <button
                  type="button"
                  className="hero-input-clear-btn"
                  onClick={handleClearLocation}
                  aria-label="Clear location query"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              {showLocSuggestions && (
                <ul className="hero-suggestions-dropdown">
                  {locSuggestions.map((l, idx) => (
                    <li
                      key={l}
                      className={`hero-suggestion-item ${idx === activeLocSuggestion ? 'active' : ''}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectLocation(l); }}
                      onMouseEnter={() => setActiveLocSuggestion(idx)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: '#9ca3af' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{highlightMatch(l, location)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button className="hero-search-btn" type="submit" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
