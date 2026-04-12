import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/index.js';
import RichTextEditor from '../components/RichTextEditor.jsx';

const initialForm = { title: '', company: '', location: '', type: 'Full-Time', experience: '', education: '', batch: '', jobDescription: '', description: '', responsibilities: '', requirements: '', skills: '', salary: '', applyLink: '', lastDate: '', image: '', whatsapp: 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ', telegram: 'https://t.me/nextjobpost', contact: '', metaTitle: '', metaDescription: '', aboutCompany: '', whyJoin: '', howToApply: '', finalThoughts: '', highlightText: '' };

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

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
  const [filterBy, setFilterBy] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [adLink, setAdLink] = useState(DEFAULT_AD_LINK);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  const loadSettings = async () => {
    try {
      const res = await api.get('/settings');
      const data = res.data?.data || {};
      if (data.adLink) {
        setAdLink(data.adLink);
      }
    } catch {
      // Use default if settings fail to load
    }
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    setSettingsMessage('');
    try {
      await api.put('/settings/adLink', { value: adLink });
      setSettingsMessage('✅ Settings saved successfully!');
      setTimeout(() => setSettingsMessage(''), 3000);
    } catch {
      setSettingsMessage('❌ Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

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
      const response = await api.get('/jobs?status=all&limit=1000');
      setJobs(response.data?.data || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    loadSettings();
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
      whyJoin: job.whyJoin || '',
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
      whatsapp: job.whatsapp || 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ',
      telegram: job.telegram || 'https://t.me/nextjobpost', 
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
    if (!confirm('Delete this job? This action cannot be undone.')) return;

    // Store the original jobs list for rollback if delete fails
    const originalJobs = jobs;

    // Optimistic update: remove job from UI immediately
    const jobToDelete = jobs.find(j => j._id === id);
    setJobs(jobs.filter(j => j._id !== id));

    try {
      const response = await api.delete(`/jobs/${id}`);

      if (response.data?.success) {
        // Delete succeeded - show success with job details
        const deletedJob = response.data?.deletedJob;
        const successMsg = deletedJob
          ? `✅ Job deleted from database: "${deletedJob.title}" at ${deletedJob.company}`
          : `✅ Job deleted from database successfully`;

        setSettingsMessage(successMsg);
        setError('');

        // Auto-clear success message after 4 seconds
        setTimeout(() => setSettingsMessage(''), 4000);
      } else {
        // Delete returned error response
        throw new Error(response.data?.message || 'Delete failed');
      }
    } catch (err) {
      // Delete failed, rollback the UI
      setJobs(originalJobs);

      // Show detailed error message
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete job. Please try again.';
      console.error('Delete job error:', errorMsg, err);

      setError(`❌ Delete failed: ${errorMsg}`);

      // Auto-clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Error/Success Messages */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#991b1b', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#991b1b' }}>✕</button>
        </div>
      )}

      {/* Header Section */}
      <div className="admin-header mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="h3 mb-1" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#162c4a' }}>
              📊 Admin Dashboard
            </h1>
            <p className="text-muted mb-0">Manage job postings and platform content</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', background: '#f0f4f8', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#465a6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin User</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#162c4a', marginTop: '0.25rem' }}>{username}</div>
            </div>
            <button className="btn btn-outline-secondary" style={{ borderRadius: '8px', padding: '0.6rem 1.25rem', fontWeight: 600 }} onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-4 g-3">
        <div className="col-12 col-md-6 col-lg-4">
          <div style={{ background: 'linear-gradient(135deg, #1677b6 0%, #2a9df4 100%)', color: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: filterBy === 'all' ? '0 8px 20px rgba(22,107,138,0.4)' : '0 8px 20px rgba(22,107,138,0.2)', cursor: 'pointer', transition: 'all 200ms ease', border: filterBy === 'all' ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent' }} onClick={() => setFilterBy('all')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.9, marginBottom: '0.5rem' }}>Total Jobs</div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{jobs.length}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <div style={{ background: 'linear-gradient(135deg, #19a974 0%, #36d37b 100%)', color: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: filterBy === 'active' ? '0 8px 20px rgba(25,169,116,0.4)' : '0 8px 20px rgba(25,169,116,0.2)', cursor: 'pointer', transition: 'all 200ms ease', border: filterBy === 'active' ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent' }} onClick={() => setFilterBy('active')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.9, marginBottom: '0.5rem' }}>Active Listings</div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{jobs.filter(j => j.isActive).length}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', color: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: filterBy === 'featured' ? '0 8px 20px rgba(245,158,11,0.4)' : '0 8px 20px rgba(245,158,11,0.2)', cursor: 'pointer', transition: 'all 200ms ease', border: filterBy === 'featured' ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent' }} onClick={() => setFilterBy('featured')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.9, marginBottom: '0.5rem' }}>Featured Jobs</div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{jobs.filter(j => j.isFeatured).length}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="admin-actions mb-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 700, background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }} onClick={startCreate}>
          ➕ Create New Job
        </button>
        <button className="btn btn-secondary" style={{ borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 700 }} onClick={() => setShowSettings(true)}>
          ⚙️ Settings
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowSettings(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>⚙️ Site Settings</h3>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                📢 Ad Link (Opens with Apply Now button)
              </label>
              <input 
                type="url" 
                className="form-control" 
                value={adLink} 
                onChange={(e) => setAdLink(e.target.value)} 
                placeholder="https://your-ad-link.com"
                style={{ padding: '0.75rem' }}
              />
              <small className="text-muted d-block mt-1">
                This link will open in a new tab when users click "Apply Now" button
              </small>
            </div>

            {settingsMessage && (
              <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', background: settingsMessage.includes('✅') ? '#d1fae5' : '#fee2e2' }}>
                {settingsMessage}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline-secondary" onClick={() => setShowSettings(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={saveSettings} 
                disabled={settingsSaving}
                style={{ background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }}
              >
                {settingsSaving ? 'Saving...' : '💾 Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #e0e7f1', borderTop: '4px solid #2a9df4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
          <p style={{ marginTop: '1rem', color: '#465a6b', fontWeight: 600 }}>Loading jobs...</p>
        </div>
      )}

      {editingId && (
        <div className="admin-form-card" style={{ marginBottom: '2rem', animation: 'slideDown 300ms ease' }}>
          <div className="admin-form-header" style={{ background: 'linear-gradient(135deg, #1677b6 0%, #2a9df4 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{editingId === 'new' ? '✨' : '📝'}</div>
              <div>
                <h3 className="admin-form-title" style={{ margin: 0, fontSize: '1.75rem' }}>
                  {editingId === 'new' ? 'Create New Job Posting' : 'Edit Job Listing'}
                </h3>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#991b1b' }}>
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          <div className="admin-form-tabs">
            <div className="form-tabs-nav" style={{ background: '#fafbfc', borderBottom: '2px solid #e0e7f1', padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderRadius: '0' }}>
              {['basic', 'description', 'media', 'contact'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className="form-tab-btn"
                  style={{
                    padding: '0.75rem 1.2rem',
                    border: '2px solid transparent',
                    background: activeTab === tab ? 'linear-gradient(135deg, #1677b6, #2a9df4)' : '#fff',
                    color: activeTab === tab ? '#fff' : '#465a6b',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    transition: 'all 200ms ease',
                    boxShadow: activeTab === tab ? '0 6px 20px rgba(22,107,138,0.2)' : 'none'
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'basic' && '📋 Basic Info'}
                  {tab === 'description' && '📝 Description & Content'}
                  {tab === 'media' && '🖼️ Media'}
                  {tab === 'contact' && '📱 Contact'}
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
                      <RichTextEditor value={form.jobDescription} onChange={(html) => setForm({ ...form, jobDescription: html })} placeholder="Full job description with company info and overview" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Highlight Text (bold on details page)</label>
                      <input className="form-control" value={form.highlightText} onChange={(e) => setForm({ ...form, highlightText: e.target.value })} placeholder="e.g., Join NextGen Soft as a graduate software engineer..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label">About Company</label>
                      <RichTextEditor value={form.aboutCompany} onChange={(html) => setForm({ ...form, aboutCompany: html })} placeholder="Information about the company, its mission, and background" />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>Displays as: 'About [Company Name] Off Campus Drive 2025'</small>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Why Join [Company]?</label>
                      <RichTextEditor value={form.whyJoin} onChange={(html) => setForm({ ...form, whyJoin: html })} placeholder="Benefits, learning opportunities, and reasons to join this company" />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>Highlight what makes this opportunity special</small>
                    </div>
                    <div className="col-12">
                      <label className="form-label">How to Apply</label>
                      <RichTextEditor value={form.howToApply} onChange={(html) => setForm({ ...form, howToApply: html })} placeholder="Step-by-step instructions for applying" />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>Displays as: 'How to Apply for [Company Name] Off Campus Drive [Year]'</small>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Final Thoughts</label>
                      <RichTextEditor value={form.finalThoughts} onChange={(html) => setForm({ ...form, finalThoughts: html })} placeholder="Final thoughts about the job" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Short Summary</label>
                      <RichTextEditor value={form.description} onChange={(html) => setForm({ ...form, description: html })} placeholder="Brief description shown in job listings and detail pages" />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>Add a rich, formatted summary of the job opportunity</small>
                    </div>

                    {/* Divider */}
                    <div className="col-12" style={{ borderTop: '2px solid #e0e7f1', paddingTop: '1.5rem', marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#162c4a', marginBottom: '1rem' }}>🎯 Roles & Responsibilities</h4>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Roles & Responsibilities</label>
                      <RichTextEditor value={form.responsibilities} onChange={(html) => setForm({ ...form, responsibilities: html })} placeholder="Use bullet list button to add responsibilities, or type each one on a new line" />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>Use the bullet list button in the toolbar to create a formatted list</small>
                    </div>

                    {/* Divider */}
                    <div className="col-12" style={{ borderTop: '2px solid #e0e7f1', paddingTop: '1.5rem', marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#162c4a', marginBottom: '1rem' }}>✅ Eligibility Criteria</h4>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Requirements/Eligibility</label>
                      <RichTextEditor value={form.requirements} onChange={(html) => setForm({ ...form, requirements: html })} placeholder="Use bullet list button to add requirements, or type each one on a new line" />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>Use the bullet list button in the toolbar to create a formatted list</small>
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
                  {/* Info Box */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(22,119,182,0.08), rgba(42,157,244,0.08))', border: '1px solid rgba(42,157,244,0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, color: '#1677b6', fontWeight: 600, fontSize: '0.95rem' }}>
                      💡 <strong>Tip:</strong> WhatsApp and Telegram are prefilled with community group links for all job postings. You can customize them per job if needed.
                    </p>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: 700, color: '#162c4a' }}>📱 Contact Phone (Optional)</label>
                      <input className="form-control" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="e.g., +91-9876543210 or company contact number" />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>Company's direct contact phone number</small>
                    </div>

                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: 700, color: '#162c4a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        💬 WhatsApp Group
                        <span style={{ fontSize: '0.75rem', background: '#e6f4ff', color: '#1677b6', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>PREFILLED</span>
                      </label>
                      <input
                        className="form-control"
                        value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                        placeholder="https://chat.whatsapp.com/..."
                        style={{ borderColor: '#2a9df4' }}
                      />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>
                        Default: https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ - Change if needed per job
                      </small>
                    </div>

                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: 700, color: '#162c4a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📲 Telegram Channel
                        <span style={{ fontSize: '0.75rem', background: '#e6f4ff', color: '#1677b6', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>PREFILLED</span>
                      </label>
                      <input
                        className="form-control"
                        value={form.telegram}
                        onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                        placeholder="https://t.me/..."
                        style={{ borderColor: '#2a9df4' }}
                      />
                      <small style={{ color: '#465a6b', marginTop: '0.4rem', display: 'block' }}>
                        Default: https://t.me/nextjobpost - Change if needed per job
                      </small>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions mt-4" style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '2px solid #f0f4f8' }}>
                <button
                  className="btn btn-lg"
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.9rem 2rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, #19a974, #36d37b)',
                    border: 'none',
                    color: '#fff',
                    boxShadow: '0 6px 20px rgba(25,169,116,0.15)',
                    transition: 'all 200ms ease',
                    cursor: 'pointer'
                  }}
                >
                  💾 Save Job
                </button>
                <button
                  className="btn btn-lg"
                  type="button"
                  onClick={cancelEdit}
                  style={{
                    flex: 1,
                    padding: '0.9rem 2rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    background: '#f5f7fa',
                    border: '2px solid #e0e7f1',
                    color: '#465a6b',
                    transition: 'all 200ms ease',
                    cursor: 'pointer'
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs List Section */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 6px 20px rgba(22,44,74,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f4f8', background: '#fafbfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="h5 mb-0" style={{ fontWeight: 800, color: '#162c4a' }}>
            📋 {filterBy === 'all' && 'All Job Listings'} {filterBy === 'active' && 'Active Listings'} {filterBy === 'featured' && 'Featured Jobs'} ({(() => {
              if (filterBy === 'all') return jobs.length;
              if (filterBy === 'active') return jobs.filter(j => j.isActive).length;
              if (filterBy === 'featured') return jobs.filter(j => j.isFeatured).length;
              return 0;
            })()})
          </h2>
          {filterBy !== 'all' && (
            <button style={{ background: '#f0f4f8', border: '1px solid #e0e7f1', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, color: '#1677b6' }} onClick={() => setFilterBy('all')}>
              ✕ Clear Filter
            </button>
          )}
        </div>

        {(() => {
          const filteredJobs = filterBy === 'all' ? jobs : filterBy === 'active' ? jobs.filter(j => j.isActive) : jobs.filter(j => j.isFeatured);
          return filteredJobs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#465a6b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{filterBy !== 'all' ? 'No matching jobs' : 'No jobs posted yet'}</p>
              <p style={{ marginBottom: '1.5rem' }}>{filterBy !== 'all' ? 'Try clearing the filter to see all jobs' : 'Start by creating your first job posting or loading sample data'}</p>
              <button className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.6rem 1.5rem', background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }} onClick={startCreate}>
                Create First Job
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e0e7f1' }}>
                  <tr>
                    <th style={{ padding: '1rem', fontWeight: 800, color: '#162c4a' }}>Job Title</th>
                    <th style={{ padding: '1rem', fontWeight: 800, color: '#162c4a' }}>Company</th>
                    <th style={{ padding: '1rem', fontWeight: 800, color: '#162c4a' }}>Location</th>
                    <th style={{ padding: '1rem', fontWeight: 800, color: '#162c4a' }}>Type</th>
                    <th style={{ padding: '1rem', fontWeight: 800, color: '#162c4a' }}>Status</th>
                    <th style={{ padding: '1rem', fontWeight: 800, color: '#162c4a', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((j) => (
                  <tr key={j._id} style={{ borderBottom: '1px solid #f0f4f8', transition: 'all 200ms ease' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#162c4a' }}>
                      {j.title.length > 30 ? j.title.substring(0, 30) + '...' : j.title}
                    </td>
                    <td style={{ padding: '1rem', color: '#465a6b' }}>{j.company}</td>
                    <td style={{ padding: '1rem', color: '#465a6b' }}>{j.location}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: j.type === 'Full-Time' ? 'rgba(22,119,182,0.1)' : j.type === 'Internship' ? 'rgba(245,158,11,0.1)' : 'rgba(108,117,125,0.1)',
                        color: j.type === 'Full-Time' ? '#1677b6' : j.type === 'Internship' ? '#f59e0b' : '#465a6b'
                      }}>
                        {j.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: j.isActive ? 'rgba(25,169,116,0.1)' : 'rgba(239,68,68,0.1)',
                        color: j.isActive ? '#19a974' : '#ef4444'
                      }}>
                        {j.isActive ? '✓ Active' : '◯ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-sm" style={{ borderRadius: '6px', padding: '0.4rem 0.8rem', fontWeight: 600, background: 'rgba(22,119,182,0.1)', color: '#1677b6', border: 'none', cursor: 'pointer' }} onClick={() => startEdit(j)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-sm" style={{ borderRadius: '6px', padding: '0.4rem 0.8rem', fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }} onClick={() => remove(j._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        table.table tbody tr:hover {
          background: linear-gradient(90deg, rgba(22,119,182,0.02), rgba(42,157,244,0.02));
        }
        .form-tab-btn:hover:not(.active) {
          background: linear-gradient(135deg, rgba(22,107,138,0.08), rgba(42,157,244,0.08));
        }
        .admin-header {
          animation: slideDown 400ms ease;
        }
      `}</style>
    </div>
  );
}
