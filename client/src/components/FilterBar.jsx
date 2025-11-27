import React, { useState } from 'react';

export default function FilterBar({ value, onChange }) {
  const [local, setLocal] = useState(value);

  const submit = (e) => {
    e.preventDefault();
    onChange(local);
  };

  const update = (patch) => setLocal({ ...local, ...patch });

  return (
    <form className="card p-3 mb-3" onSubmit={submit}>
      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Search</label>
          <input className="form-control" placeholder="Role, company…" value={local.q} onChange={(e) => update({ q: e.target.value })} />
        </div>
        <div className="col-6 col-lg-3">
          <label className="form-label">Location</label>
          <input className="form-control" placeholder="City or Remote" value={local.location} onChange={(e) => update({ location: e.target.value })} />
        </div>
        <div className="col-6 col-lg-3">
          <label className="form-label">Type</label>
          <select className="form-select" value={local.type} onChange={(e) => update({ type: e.target.value })}>
            <option value="">Any</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Internship</option>
            <option>Contract</option>
            <option>Remote</option>
          </select>
        </div>
        <div className="col-12 col-lg-2 d-grid">
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </div>
    </form>
  );
}
