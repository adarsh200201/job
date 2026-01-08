import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/index.js';

const initialForm = { title: '', company: '', location: '', type: 'Full-Time', experience: '', education: '', batch: '', jobDescription: '', description: '', responsibilities: '', requirements: '', skills: '', salary: '', applyLink: '', lastDate: '', image: '', whatsapp: '', telegram: '', contact: '', metaTitle: '', metaDescription: '', aboutCompany: '', howToApply: '', finalThoughts: '', highlightText: '' };

export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [imageError, setImageError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateImageUrl = (url) => {
    if (!url) {
      setImageError('');
      return true;
    }
    try {
      new URL(url);
      return true;
    } catch {
      setImageError('Invalid image URL format');
      return false;
    }
  };

  const checkImageUrl = async (url) => {
    if (!url) {
      setImageError('');
      setImageLoading(false);
      return;
    }

    if (!validateImageUrl(url)) return;

    setImageLoading(true);
    try {
      const img = new Image();
      img.onload = () => {
        setImageError('');
        setImageLoading(false);
      };
      img.onerror = () => {
        setImageError('Image URL is not accessible or invalid');
        setImageLoading(false);
      };
      img.src = url;
      setTimeout(() => {
        if (img.src) setImageLoading(false);
      }, 5000);
    } catch {
      setImageError('Error validating image');
      setImageLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError('File size exceeds 5MB limit');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Invalid file type. Please upload JPG, PNG, GIF, or WebP');
      return;
    }

    setImageLoading(true);
    setImageError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        setForm({ ...form, image: response.data.imageUrl });
        setImageError('');
        setUploadProgress(0);
      }
    } catch (err) {
      setImageError(err.response?.data?.message || 'Upload failed');
    } finally {
      setImageLoading(false);
      setUploadProgress(0);
    }
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      setJobs(response.data?.data || []);
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
    setActiveTab('basic');
    setImageError('');
    setImageLoading(false);
  };

  const startEdit = (job) => {
    setEditingId(job._id);
    setForm({ 
      title: job.title, 
      company: job.company, 
      location: job.location, 
      type: job.type, 
      experience: job.experience, 
      education: job.education || '',
      batch: job.batch || '',
      jobDescription: job.jobDescription || '', 
      description: job.description || '',
      aboutCompany: job.aboutCompany || '',
      howToApply: job.howToApply || '',
      finalThoughts: job.finalThoughts || '',
      highlightText: job.highlightText || '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : job.responsibilities || '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements || '',
      skills: Array.isArray(job.skills) ? job.skills.join('\n') : job.skills || '',
      salary: job.salary || '',
      applyLink: job.applyLink, 
      lastDate: job.lastDate ? job.lastDate.split('T')[0] : '',
      image: job.image || '', 
      whatsapp: job.whatsapp || '', 
      telegram: job.telegram || '', 
      contact: job.contact || '',
      metaTitle: job.metaTitle || '',
      metaDescription: job.metaDescription || ''
    });
    setError('');
  };

  const cancelEdit = () => {
    setEditingId('');
    setForm(initialForm);
    setActiveTab('basic');
    setImageError('');
    setImageLoading(false);
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
        <div className="admin-form-card">
          <div className="admin-form-header">
            <h3 className="admin-form-title">{editingId === 'new' ? '➕ Create New Job' : '✏️ Edit Job'}</h3>
          </div>

          {error && <div className="alert alert-danger py-3 mb-3">{error}</div>}

          <div className="admin-form-tabs">
            <div className="form-tabs-nav">
              {['basic', 'description', 'requirements', 'media', 'contact', 'seo'].map((tab) => (
                <button key={tab} type="button" className={`form-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'basic' && '📋 Basic'}
                  {tab === 'description' && '📝 Content'}
                  {tab === 'requirements' && '✓ Requirements'}
                  {tab === 'media' && '🖼️ Media'}
                  {tab === 'contact' && '📱 Contact'}
                  {tab === 'seo' && '🔍 SEO'}
                </button>
              ))}
            </div>

            <form className="admin-form-content" onSubmit={save}>
              {activeTab === 'basic' && (
                <div className="form-section">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Job Title</label>
                      <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Software Engineer" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Company Name</label>
                      <input className="form-control" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g., Tech Corp" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Location</label>
                      <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g., Bangalore, India" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Job Type</label>
                      <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                        <option>Remote</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Experience Required</label>
                      <input className="form-control" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g., 0-2 years" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Education Requirement</label>
                      <input className="form-control" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="e.g., B.Tech (CSE/IT), MCA" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Batch/Year</label>
                      <input className="form-control" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} placeholder="e.g., 2025 Batch" />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Salary (Optional)</label>
                      <input className="form-control" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="e.g., 6-12 LPA" />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Application Last Date</label>
                      <input className="form-control" type="date" value={form.lastDate} onChange={(e) => setForm({ ...form, lastDate: e.target.value })} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Apply Link</label>
                      <input className="form-control" type="url" value={form.applyLink} onChange={(e) => setForm({ ...form, applyLink: e.target.value })} placeholder="https://apply.example.com" required />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'description' && (
                <div className="form-section">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Job Description (Main Content)</label>
                      <textarea className="form-control" rows={5} value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} placeholder="Full job description with company info and overview" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Highlight Text (bold on details page)</label>
                      <input className="form-control" value={form.highlightText} onChange={(e) => setForm({ ...form, highlightText: e.target.value })} placeholder="e.g., Join NextGen Soft as a graduate software engineer..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label">About Company</label>
                      <textarea className="form-control" rows={4} value={form.aboutCompany} onChange={(e) => setForm({ ...form, aboutCompany: e.target.value })} placeholder="Information about the company" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">How to Apply</label>
                      <textarea className="form-control" rows={4} value={form.howToApply} onChange={(e) => setForm({ ...form, howToApply: e.target.value })} placeholder="How to apply for the job" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Final Thoughts</label>
                      <textarea className="form-control" rows={4} value={form.finalThoughts} onChange={(e) => setForm({ ...form, finalThoughts: e.target.value })} placeholder="Final thoughts about the job" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Short Summary</label>
                      <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description shown in job listings" required />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="form-section">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Roles & Responsibilities</label>
                      <textarea className="form-control" rows={4} value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} placeholder="One per line&#10;• Responsibility 1&#10;• Responsibility 2&#10;• Responsibility 3" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Requirements/Eligibility</label>
                      <textarea className="form-control" rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="One per line&#10;• Requirement 1&#10;• Requirement 2&#10;• Requirement 3" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Required Skills</label>
                      <textarea className="form-control" rows={3} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="One per line&#10;• Skill 1&#10;• Skill 2&#10;• Skill 3" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="form-section">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">🔗 Job Image URL</label>
                      <p className="text-muted small mb-2">Paste a direct link to an image (you can upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer">Imgur</a>, <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer">PostImages</a>, or use any image hosting service)</p>
                      <input
                        className="form-control"
                        type="url"
                        value={form.image}
                        onChange={(e) => {
                          setForm({ ...form, image: e.target.value });
                          checkImageUrl(e.target.value);
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                      {imageError && <div className="alert alert-warning py-2 mt-2">{imageError}</div>}
                      {imageLoading && <div className="text-muted small mt-1">⏳ Checking image...</div>}
                    </div>

                    {form.image && !imageError && (
                      <div className="col-12">
                        <label className="form-label">✓ Image Preview</label>
                        <div className="image-preview-container">
                          <img src={form.image} alt="Job preview" className="image-preview" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="form-section">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Contact Phone</label>
                      <input className="form-control" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+91-XXXXXXXXXX" />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">WhatsApp (phone or link)</label>
                      <input className="form-control" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+91XXXXXXXXXX or https://wa.me/..." />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Telegram (link)</label>
                      <input className="form-control" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="@username or https://t.me/..." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="form-section">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Meta Title</label>
                      <input className="form-control" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="For search engines" />
                      <small className="text-muted">Recommended: 50-60 characters</small>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Meta Description</label>
                      <input className="form-control" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="For search engines" />
                      <small className="text-muted">Recommended: 150-160 characters</small>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions mt-4">
                <button className="btn btn-success btn-lg" type="submit">💾 Save Job</button>
                <button className="btn btn-outline-secondary btn-lg" type="button" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
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
