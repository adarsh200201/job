import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SidebarSearch() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submit = (e) => {
    e && e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (term) params.set('q', term); else params.delete('q');
    navigate(`/?${params.toString()}`);
  };

  return (
    <div id="sidebar-search" className="card p-4 mb-3 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
      <h3 className="h6 mb-3 fw-bold">Search</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <input 
            className="form-control form-control-lg" 
            placeholder="Search" 
            value={term} 
            onChange={(e) => setTerm(e.target.value)}
            style={{ border: '1px solid #dee2e6', borderRadius: '0.375rem' }}
          />
        </div>
        <button 
          className="btn btn-info text-white w-100 rounded-pill" 
          type="submit"
          style={{ backgroundColor: '#17a2b8', padding: '0.5rem 1.5rem' }}
        >
          Search
        </button>
      </form>
    </div>
  );
}
