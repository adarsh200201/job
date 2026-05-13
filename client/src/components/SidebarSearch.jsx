import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QUICK_FILTERS = ['Full-Time', 'Internship', 'Remote', 'Part-Time'];

export default function SidebarSearch() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submit = (e) => {
    e && e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (term.trim()) params.set('q', term.trim()); else params.delete('q');
    navigate(`/?${params.toString()}`);
  };

  const setQuick = (type) => {
    const params = new URLSearchParams();
    params.set('type', type);
    navigate(`/?${params.toString()}`);
  };

  return (
    <div id="sidebar-search" className="sbs-card">
      {/* Header */}
      <div className="sbs-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Search Jobs</span>
      </div>

      <form onSubmit={submit} className="sbs-form">
        <div className="sbs-input-wrap">
          <svg className="sbs-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="sbs-input"
            placeholder="Role, company, keyword…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <button className="sbs-btn" type="submit">Search Jobs</button>
      </form>

      {/* Quick filters */}
      <div className="sbs-section">
        <p className="sbs-label">Quick Filters</p>
        <div className="sbs-quick-filters">
          {QUICK_FILTERS.map((f) => (
            <button key={f} className="sbs-filter-chip" onClick={() => setQuick(f)} type="button">
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
