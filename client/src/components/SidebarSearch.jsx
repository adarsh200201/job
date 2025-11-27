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
    <form className="card p-3 mb-3 search-card" onSubmit={submit}>
      <h3 className="h6 mb-3">Search</h3>
      <div className="d-flex gap-2">
        <input className="form-control" placeholder="Search" value={term} onChange={(e) => setTerm(e.target.value)} />
        <button className="btn btn-success" type="submit">Search</button>
      </div>
    </form>
  );
}
