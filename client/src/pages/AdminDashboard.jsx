import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/index.js';

const initialForm = { title: '', company: '', location: '', type: 'Full-Time', experience: '', description: '', applyLink: '', image: '', whatsapp: '', telegram: '', contact: '' };

export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const startCreate = () => {
    setEditingId('new');
    setForm(initialForm);
    setError('');
  };

  const startEdit = (job) => {
    setEditingId(job._id);
    setForm({ title: job.title, company: job.company, location: job.location, type: job.type, experience: job.experience, description: job.description, applyLink: job.applyLink, image: job.image || '', whatsapp: job.whatsapp || '', telegram: job.telegram || '', contact: job.contact || '' });
    setError('');
  };

  const cancelEdit = () => {
    setEditingId('');
    setForm(initialForm);
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId === 'new') {
        await api.post('/jobs', form);
      } else {
        await api.put(`/jobs/${editingId}`, form);
      }
      cancelEdit();
      await loadJobs();
    } catch (err) {
      setError('Save failed. Ensure all fields are filled and you are authorized.');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      await loadJobs();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Admin Dashboard</h1>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">{username}</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <h2 className="h6 mb-0">Jobs</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={startCreate}>Add Job</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={async () => {
            if (!confirm('Seed sample jobs?')) return;
            try {
              await api.post('/admin/seed');
              await loadJobs();
              alert('Seeded sample jobs');
            } catch (e) {
              alert('Seed failed');
            }
          }}>Seed Sample Data</button>
          <button className="btn btn-danger btn-sm" onClick={async () => {
            if (!confirm('Delete seeded/sample jobs? This will only remove known sample entries.') ) return;
            try {
              const { data } = await api.post('/admin/clear-seed');
              await loadJobs();
              alert(data.message || 'Deleted seeded jobs');
            } catch (e) {
              alert('Clear seed failed');
            }
          }}>Remove Seed Data</button>
        </div>
      </div>

      {loading && <p>Loading…</p>}

      {editingId && (
        <div className="card p-3 mb-3">
          <h3 className="h6">{editingId === 'new' ? 'Create Job' : 'Edit Job'}</h3>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form className="row g-3" onSubmit={save}>
            <div className="col-12 col-md-6">
              <label className="form-label">Title</label>
              <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Company</label>
              <input className="form-control" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Location</label>
              <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Experience</label>
              <input className="form-control" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Apply Link</label>
              <input className="form-control" type="url" value={form.applyLink} onChange={(e) => setForm({ ...form, applyLink: e.target.value })} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Image URL</label>
              <input className="form-control" type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Contact Phone</label>
              <input className="form-control" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">WhatsApp (phone or link)</label>
              <input className="form-control" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Telegram (link)</label>
              <input className="form-control" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} />
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-success" type="submit">Save</button>
              <button className="btn btn-outline-secondary" type="button" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Posted</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j._id}>
                <td>{j.title}</td>
                <td>{j.company}</td>
                <td>{j.location}</td>
                <td><span className="badge bg-secondary-subtle text-secondary-emphasis">{j.type}</span></td>
                <td>{new Date(j.createdAt).toLocaleDateString()}</td>
                <td className="text-end">
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(j)}>Edit</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => remove(j._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
