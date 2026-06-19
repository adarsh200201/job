import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/index.js';
import RichTextEditor from '../components/RichTextEditor.jsx';
import { getImageUrl } from '../utils/imageUtils.js';

// Preparation subcomponents
import PrepQuestionsManager from '../components/Admin/Preparation/PrepQuestionsManager.jsx';
import PrepMockTestsManager from '../components/Admin/Preparation/PrepMockTestsManager.jsx';
import PrepImportManager from '../components/Admin/Preparation/PrepImportManager.jsx';
import PrepAnalyticsManager from '../components/Admin/Preparation/PrepAnalyticsManager.jsx';
import PrepCategoriesManager from '../components/Admin/Preparation/PrepCategoriesManager.jsx';
import PrepTopicManager from '../components/Admin/Preparation/PrepTopicManager.jsx';
import PrepCompanyManager from '../components/Admin/Preparation/PrepCompanyManager.jsx';
import PrepReportsManager from '../components/Admin/Preparation/PrepReportsManager.jsx';

const initialForm = { title: '', company: '', location: '', type: 'Full-Time', experience: '', education: '', batch: '', jobDescription: '', description: '', responsibilities: '', requirements: '', skills: '', salary: '', applyLink: '', lastDate: '', image: '', whatsapp: 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ', telegram: 'https://t.me/nextjobpost', contact: '', metaTitle: '', metaDescription: '', aboutCompany: '', whyJoin: '', howToApply: '', finalThoughts: '', highlightText: '', isActive: true, isGovernment: false, postType: 'Job', pdfLink: '', sourceUrl: '', sourceWebsite: '', importantDates: '', isFeatured: false, eligibility: '', vacancies: '' };

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

const JOB_MENU = [
  { id: 'list',     icon: '📋', label: 'Job Listings' },
  { id: 'create',   icon: '➕', label: 'Create Job' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];
const PREP_MENU = [
  { id: 'topics',    icon: '🌲', label: 'Topic Manager' },
  { id: 'companies', icon: '🏢', label: 'Company Maps' },
  { id: 'questions', icon: '❓', label: 'Questions' },
  { id: 'mocktests', icon: '📝', label: 'Mock Tests' },
  { id: 'reports',   icon: '⚠️', label: 'Reports' },
  { id: 'import',    icon: '📤', label: 'Import Data' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
];
const SEO_MENU = [
  { id: 'dashboard', icon: '📊', label: 'SEO Control'  },
  { id: 'status',    icon: '🔍', label: 'Index Status'  },
  { id: 'logs',      icon: '🤖', label: 'Daily Report'  }
];

const LIGHT = {
  pageBg: 'var(--page-bg)',
  sidebarBg: 'var(--sidebar-bg)',
  border: 'var(--border)',
  textPrimary: 'var(--text-primary)',
  textMuted: 'var(--text-muted)',
  textSub: 'var(--text-sub)',
  activeItemBg: 'var(--active-item-bg)',
  accent: 'var(--accent)',
  chipBg: 'var(--chip-bg)',
};
const DARK = LIGHT;

export default function AdminDashboard() {
  const { username, logout, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [adminModule, setAdminModule] = useState('jobs');
  const [jobSubPage, setJobSubPage]   = useState('list');
  const [prepSubmenu, setPrepSubmenu] = useState('questions');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode]       = useState(() => localStorage.getItem('adminTheme') === 'dark');

  // Persist theme
  useEffect(() => {
    localStorage.setItem('adminTheme', darkMode ? 'dark' : 'light');
    document.body.style.background = darkMode ? '#0f172a' : '#f1f5f9';
    return () => { document.body.style.background = ''; };
  }, [darkMode]);

  const T = darkMode ? DARK : LIGHT; // theme tokens

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
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [flashMsg, setFlashMsg] = useState({ text: '', type: '' });
  const [adLink, setAdLink] = useState(DEFAULT_AD_LINK);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // SEO Control Center state
  const [seoSubmenu, setSeoSubmenu] = useState('dashboard');
  const [seoStats, setSeoStats] = useState({ total: 0, indexed: 0, pending: 0, failed: 0, notIndexed: 0, topKeywords: [] });
  const [seoStatsLoading, setSeoStatsLoading] = useState(false);
  const [seoUrls, setSeoUrls] = useState([]);
  const [seoUrlsLoading, setSeoUrlsLoading] = useState(false);
  const [seoSearch, setSeoSearch] = useState('');
  const [seoStatusFilter, setSeoStatusFilter] = useState('');
  const [seoPage, setSeoPage] = useState(1);
  const [seoPages, setSeoPages] = useState(1);
  const [seoSyncing, setSeoSyncing] = useState(false);

  // SEO Daily Report / Automation Logs state
  const [seoLogs, setSeoLogs] = useState({ summary: [], recent: [] });
  const [seoLogsLoading, setSeoLogsLoading] = useState(false);

  const loadSeoLogs = useCallback(async () => {
    setSeoLogsLoading(true);
    try {
      const res = await api.get('/api/seo/automation-logs');
      if (res.data?.success) setSeoLogs(res.data.data);
    } catch (err) {
      console.error('Failed to load SEO automation logs:', err);
    } finally {
      setSeoLogsLoading(false);
    }
  }, []);


  const loadSeoStats = useCallback(async () => {
    setSeoStatsLoading(true);
    try {
      const res = await api.get('/api/seo/dashboard-stats');
      if (res.data?.success) {
        setSeoStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load SEO dashboard stats:', err);
    } finally {
      setSeoStatsLoading(false);
    }
  }, []);

  const loadSeoUrls = useCallback(async (pageVal = 1, statusVal = '', searchVal = '') => {
    setSeoUrlsLoading(true);
    try {
      const query = `page=${pageVal}&limit=30&status=${statusVal}&search=${encodeURIComponent(searchVal)}`;
      const res = await api.get(`/api/seo/index-status?${query}`);
      if (res.data?.success) {
        setSeoUrls(res.data.data);
        setSeoPage(res.data.page);
        setSeoPages(res.data.pages);
      }
    } catch (err) {
      console.error('Failed to load SEO URLs:', err);
    } finally {
      setSeoUrlsLoading(false);
    }
  }, []);

  // Fetch SEO status URLs whenever page, status filter, search query changes
  useEffect(() => {
    if (adminModule === 'seo' && seoSubmenu === 'status') {
      loadSeoUrls(seoPage, seoStatusFilter, seoSearch);
    }
  }, [adminModule, seoSubmenu, seoPage, seoStatusFilter, seoSearch, loadSeoUrls]);

  // Initial load when entering SEO module
  useEffect(() => {
    if (adminModule === 'seo') {
      loadSeoStats();
      if (seoSubmenu === 'status') {
        loadSeoUrls(1, seoStatusFilter, seoSearch);
      }
      if (seoSubmenu === 'logs') {
        loadSeoLogs();
      }
    }
  }, [adminModule, seoSubmenu, loadSeoStats, loadSeoUrls, loadSeoLogs, seoStatusFilter, seoSearch]);


  // Security module state
  const [securityLogs, setSecurityLogs]       = useState([]);
  const [logsLoading, setLogsLoading]         = useState(false);
  const [twoFAStatus, setTwoFAStatus]         = useState(null);  // null | { enabled: bool, qrCodeUrl, secret }
  const [twoFAInput, setTwoFAInput]           = useState('');
  const [twoFAMsg, setTwoFAMsg]               = useState({ text: '', type: '' });
  const [twoFAWorking, setTwoFAWorking]       = useState(false);

  const flash = useCallback((text, type = 'success') => {
    setFlashMsg({ text, type });
    setTimeout(() => setFlashMsg({ text: '', type: '' }), 3500);
  }, []);

  // ── Security helpers ──────────────────────────────────────────────────────
  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const r = await api.get('/control/logs');
      setSecurityLogs(r.data?.data || []);
    } catch { setSecurityLogs([]); }
    finally { setLogsLoading(false); }
  }, []);

  const setup2FA = async () => {
    setTwoFAWorking(true); setTwoFAMsg({ text: '', type: '' });
    try {
      const r = await api.post('/control/2fa/setup');
      setTwoFAStatus({ enabled: false, qrCodeUrl: r.data.qrCodeUrl, secret: r.data.secret });
    } catch (e) {
      setTwoFAMsg({ text: e.response?.data?.message || 'Setup failed', type: 'error' });
    } finally { setTwoFAWorking(false); }
  };

  const verify2FA = async () => {
    if (!twoFAInput || twoFAInput.length !== 6) return;
    setTwoFAWorking(true); setTwoFAMsg({ text: '', type: '' });
    try {
      await api.post('/control/2fa/verify', { token: twoFAInput });
      setTwoFAMsg({ text: '✅ 2FA enabled successfully!', type: 'success' });
      setTwoFAStatus(prev => ({ ...prev, enabled: true }));
      setTwoFAInput('');
    } catch (e) {
      setTwoFAMsg({ text: e.response?.data?.message || 'Invalid OTP', type: 'error' });
    } finally { setTwoFAWorking(false); }
  };

  const disable2FA = async () => {
    if (!window.confirm('Disable 2FA? This reduces account security.')) return;
    setTwoFAWorking(true); setTwoFAMsg({ text: '', type: '' });
    try {
      await api.post('/control/2fa/disable');
      setTwoFAMsg({ text: '2FA has been disabled.', type: 'info' });
      setTwoFAStatus(null);
    } catch (e) {
      setTwoFAMsg({ text: e.response?.data?.message || 'Disable failed', type: 'error' });
    } finally { setTwoFAWorking(false); }
  };

  const handleAdminLogout = async () => {
    if (adminLogout) { await adminLogout(); navigate('/control-center/login'); }
    else { logout(); }
  };

  const loadSettings = async () => {
    try { const res = await api.get('/settings'); const d = res.data?.data || {}; if (d.adLink) setAdLink(d.adLink); } catch {}
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    try { await api.put('/settings/adLink', { value: adLink }); flash('✅ Settings saved!'); }
    catch { flash('❌ Failed to save settings', 'error'); }
    finally { setSettingsSaving(false); }
  };

  const checkImageUrl = async (url) => {
    if (!url) { setImageError(''); setImageLoading(false); return; }
    try { new URL(url); } catch { setImageError('Invalid image URL'); return; }
    setImageLoading(true);
    const img = new Image();
    img.onload = () => { setImageError(''); setImageLoading(false); };
    img.onerror = () => { setImageError('Image URL not accessible'); setImageLoading(false); };
    img.src = url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setImageError('File size exceeds 5MB'); return; }
    const allowed = ['image/jpeg','image/png','image/gif','image/webp'];
    if (!allowed.includes(file.type)) { setImageError('Invalid file type'); return; }
    setImageLoading(true); setImageError(''); setUploadProgress(0);
    try {
      const fd = new FormData(); fd.append('image', file);
      const r = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: ev => setUploadProgress(Math.round((ev.loaded*100)/ev.total)) });
      if (r.data.success) { setForm(f => ({ ...f, image: r.data.imageUrl })); setImageError(''); setUploadProgress(0); }
    } catch (err) { setImageError(err.response?.data?.message || 'Upload failed'); }
    finally { setImageLoading(false); setUploadProgress(0); }
  };

  const loadJobs = async () => {
    setLoading(true);
    try { const r = await api.get('/jobs?status=all&limit=1000'); setJobs(r.data?.data || []); }
    catch { setJobs([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadJobs(); loadSettings(); }, []);

  const startCreate = () => { setEditingId('new'); setForm(initialForm); setError(''); setActiveTab('basic'); setImageError(''); setJobSubPage('create'); };
  const startEdit   = (job) => {
    setEditingId(job._id);
    setForm({ title: job.title, company: job.company, location: job.location||'', type: job.type||'Full-Time', experience: job.experience||'', education: job.education||'', batch: job.batch||'', eligibility: job.eligibility||'', vacancies: job.vacancies||'', jobDescription: job.jobDescription||'', description: job.description||'', aboutCompany: job.aboutCompany||'', whyJoin: job.whyJoin||'', howToApply: job.howToApply||'', finalThoughts: job.finalThoughts||'', highlightText: job.highlightText||'', responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : job.responsibilities||'', requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements||'', skills: Array.isArray(job.skills) ? job.skills.join('\n') : job.skills||'', salary: job.salary||'', applyLink: job.applyLink, lastDate: job.lastDate ? job.lastDate.split('T')[0] : '', image: job.image||'', whatsapp: job.whatsapp||'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ', telegram: job.telegram||'https://t.me/nextjobpost', contact: job.contact||'', metaTitle: job.metaTitle||'', metaDescription: job.metaDescription||'', isActive: job.isActive!==undefined?job.isActive:true, isGovernment: job.isGovernment!==undefined?job.isGovernment:false, postType: job.postType||'Job', pdfLink: job.pdfLink||'', sourceUrl: job.sourceUrl||'', sourceWebsite: job.sourceWebsite||'', importantDates: job.importantDates||'', isFeatured: job.isFeatured!==undefined?job.isFeatured:false });
    setError(''); setJobSubPage('create');
  };
  const cancelEdit = () => { setEditingId(''); setForm(initialForm); setActiveTab('basic'); setImageError(''); setImageLoading(false); setJobSubPage('list'); };

  const toggleJobStatus = async (jobId, cur) => {
    setJobs(p => p.map(j => j._id===jobId ? { ...j, isActive: !cur } : j));
    try { await api.put(`/jobs/${jobId}`, { isActive: !cur }); flash('Status updated!'); }
    catch { setJobs(p => p.map(j => j._id===jobId ? { ...j, isActive: cur } : j)); flash('Failed to update status','error'); }
  };

  const save = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editingId==='new') await api.post('/jobs', form);
      else await api.put(`/jobs/${editingId}`, form);
      flash('✅ Job saved successfully!'); cancelEdit(); await loadJobs();
    } catch { setError('Save failed. Check all required fields.'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this job? Cannot be undone.')) return;
    const orig = jobs; setJobs(jobs.filter(j => j._id!==id));
    try { const r = await api.delete(`/jobs/${id}`); if (r.data?.success) flash('✅ Job deleted'); else throw new Error(r.data?.message); }
    catch (err) { setJobs(orig); flash(`❌ ${err.response?.data?.message||'Delete failed'}`, 'error'); }
  };

  const triggerSeoSync = async () => {
    setSeoSyncing(true);
    try {
      await api.get('/api/health'); // Check health
      flash('✅ SEO Index Status Audit Triggered (runs in background)');
      await loadSeoStats();
    } catch {
      flash('❌ Failed to trigger SEO audit', 'error');
    } finally {
      setSeoSyncing(false);
    }
  };

  const renderSeoModule = () => {
    if (seoSubmenu === 'dashboard') {
      const ratio = seoStats.total ? Math.round((seoStats.indexed / seoStats.total) * 100) : 0;
      return (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800 }}>SEO Control Center Overview</h2>
            <button
              onClick={triggerSeoSync}
              disabled={seoSyncing || seoStatsLoading}
              className="btn btn-primary"
              style={{
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '10px 18px',
                backgroundColor: 'var(--accent)',
                borderColor: 'var(--accent)',
                color: '#fff',
                opacity: (seoSyncing || seoStatsLoading) ? 0.7 : 1
              }}
            >
              {seoSyncing ? '⏳ Syncing...' : '🔄 Run Index Audit'}
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total Pages', value: seoStats.total, color: '#4f46e5', bg: '#eef2ff', icon: '🔗' },
              { label: 'Indexed', value: seoStats.indexed, color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
              { label: 'Pending', value: seoStats.pending, color: '#2563eb', bg: '#eff6ff', icon: '⏳' },
              { label: 'Failed', value: seoStats.failed, color: '#dc2626', bg: '#fef2f2', icon: '❌' },
              { label: 'Not Indexed', value: seoStats.notIndexed, color: '#d97706', bg: '#fffbeb', icon: '⚠️' }
            ].map((card, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                <span style={{ fontSize: '1.8rem', background: card.bg, padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px' }}>{card.icon}</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{card.label}</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: card.color, marginTop: '2px' }}>{seoStatsLoading ? '...' : card.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Indexing Ratio Bar */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Google Indexing Coverage Ratio</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a' }}>{ratio}% Indexed</span>
            </div>
            <div style={{ height: '12px', background: darkMode ? '#334155' : '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #16a34a, #22c55e)', width: `${ratio}%`, borderRadius: '99px', transition: 'width 0.5s ease-out' }} />
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Out of {seoStats.total} total pages tracked, {seoStats.indexed} are indexed in Google search results. Higher ratios indicate better crawl health.
            </p>
          </div>

          {/* Keywords Trend Table */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: darkMode ? 'rgba(79,70,229,0.06)' : '#fcfcfd' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.98rem', fontWeight: 800 }}>📈 Search Console Keyword Performance</h3>
              <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>Top 20 keywords from daily Search Console tracking</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {seoStatsLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>⏳ Loading keywords...</div>
              ) : !seoStats.topKeywords || seoStats.topKeywords.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No keyword metric data found. Run crawler/indexer to sync.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--table-header-bg)' }}>
                      {['Keyword', 'Target Page Slug', 'Impressions', 'Clicks', 'CTR', 'Avg Position'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {seoStats.topKeywords.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.01)' : '#fcfcfd') }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-sub)' }}>{item.keyword}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          <a href={item.page} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                            {item.page ? item.page.replace(/https?:\/\/[^\/]+/, '') || '/' : '/'}
                          </a>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-sub)' }}>{item.impressions?.toLocaleString() || 0}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-sub)' }}>{item.clicks?.toLocaleString() || 0}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-sub)', fontWeight: 600 }}>{(item.ctr * 100).toFixed(1)}%</td>
                        <td style={{ padding: '10px 14px', color: item.position <= 5 ? '#16a34a' : item.position <= 10 ? '#d97706' : '#64748b', fontWeight: 700 }}>
                          #{item.position?.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (seoSubmenu === 'status') {
      return (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              className="form-control"
              value={seoSearch}
              onChange={e => { setSeoSearch(e.target.value); setSeoPage(1); }}
              placeholder="Search URL..."
              style={{ width: '280px', height: '40px' }}
            />
            <select
              className="form-select"
              value={seoStatusFilter}
              onChange={e => { setSeoStatusFilter(e.target.value); setSeoPage(1); }}
              style={{ width: '160px', height: '40px' }}
            >
              <option value="">All Statuses</option>
              <option value="Indexed">Indexed</option>
              <option value="Pending">Pending</option>
              <option value="Not Indexed">Not Indexed</option>
              <option value="Failed">Failed</option>
            </select>
            <button
              onClick={() => loadSeoUrls(seoPage, seoStatusFilter, seoSearch)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--chip-bg)', color: 'var(--text-sub)', fontWeight: 700, cursor: 'pointer', height: '40px' }}
            >
              🔄 Refresh List
            </button>
          </div>

          {/* URLs Table */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ overflowX: 'auto' }}>
              {seoUrlsLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>⏳ Loading URL list...</div>
              ) : seoUrls.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No tracked URLs found matching the criteria.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--table-header-bg)' }}>
                      {['URL', 'Status', 'Discovered', 'Last Submitted', 'Indexed At'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {seoUrls.map((item, i) => {
                      const getBadgeStyle = (status) => {
                        switch (status) {
                          case 'Indexed': return { bg: '#dcfce7', text: '#16a34a' };
                          case 'Pending': return { bg: '#eff6ff', text: '#2563eb' };
                          case 'Failed': return { bg: '#fef2f2', text: '#dc2626' };
                          default: return { bg: '#fef9c3', text: '#d97706' };
                        }
                      };
                      const badge = getBadgeStyle(item.status);
                      const displayUrl = item.url ? item.url.replace(/https?:\/\/[^\/]+/, '') || '/' : '/';
                      return (
                        <tr key={item._id || i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.01)' : '#fcfcfd') }}>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                              {displayUrl}
                            </a>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '99px', fontSize: '0.74rem', fontWeight: 700, backgroundColor: badge.bg, color: badge.text }}>
                              {item.status || 'Pending'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '—'}
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                            {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('en-IN') : 'Not Submitted'}
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                            {item.indexedAt ? new Date(item.indexedAt).toLocaleDateString('en-IN') : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination footer */}
            {seoPages > 1 && (
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--table-header-bg)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Page <strong>{seoPage}</strong> of <strong>{seoPages}</strong></span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={seoPage <= 1 || seoUrlsLoading}
                    onClick={() => setSeoPage(p => Math.max(1, p - 1))}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--chip-bg)', color: 'var(--text-sub)', fontWeight: 700, cursor: 'pointer', opacity: (seoPage <= 1 || seoUrlsLoading) ? 0.5 : 1 }}
                  >
                    Previous
                  </button>
                  <button
                    disabled={seoPage >= seoPages || seoUrlsLoading}
                    onClick={() => setSeoPage(p => Math.min(seoPages, p + 1))}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--chip-bg)', color: 'var(--text-sub)', fontWeight: 700, cursor: 'pointer', opacity: (seoPage >= seoPages || seoUrlsLoading) ? 0.5 : 1 }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ── Daily Automation Report ────────────────────────────────────────────────
    if (seoSubmenu === 'logs') {
      const TASK_META = {
        health_checker:   { label: 'SEO Health Check',          icon: '🏥', cadence: 'Every 30 min',  color: '#6366f1' },
        gsc_keyword_sync: { label: 'GSC Keyword Sync',          icon: '📈', cadence: 'Every 24 hrs',  color: '#0ea5e9' },
        index_tracker:    { label: 'Google Index Tracker',      icon: '🔍', cadence: 'Every 24 hrs',  color: '#8b5cf6' },
        auto_optimizer:   { label: 'Search Console Optimizer',  icon: '⚡', cadence: 'Every 24 hrs',  color: '#f59e0b' },
        content_refresh:  { label: 'Content Refresh Engine',    icon: '♻️', cadence: 'Every 24 hrs',  color: '#10b981' },
        keyword_gap_finder:{ label: 'Keyword Gap Finder',       icon: '🎯', cadence: 'Every 24 hrs',  color: '#ec4899' },
      };
      const STATUS_STYLE = {
        success: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', label: '✅ Success' },
        failed:  { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', label: '❌ Failed'  },
        skipped: { bg: '#f8fafc', border: '#cbd5e1', text: '#64748b', label: '⏭ Skipped' },
        running: { bg: '#eff6ff', border: '#93c5fd', text: '#2563eb', label: '⏳ Running' },
        never:   { bg: '#fafafa', border: '#e5e7eb', text: '#9ca3af', label: '⭕ Never Run'},
      };
      const fmtTime = (dt) => {
        if (!dt) return 'Never';
        const d = new Date(dt);
        return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
      };
      const fmtDur = (ms) => {
        if (!ms || ms < 1) return '—';
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${(ms/1000).toFixed(1)}s`;
        return `${Math.round(ms/60000)}m ${Math.round((ms%60000)/1000)}s`;
      };
      const timeAgo = (dt) => {
        if (!dt) return '';
        const diff = Date.now() - new Date(dt).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'just now';
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
      };

      const summary = seoLogs.summary || [];
      const recent  = seoLogs.recent  || [];
      const successCount = summary.filter(s => s.status === 'success').length;
      const failedCount  = summary.filter(s => s.status === 'failed').length;

      return (
        <div style={{ display: 'grid', gap: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                🤖 Daily SEO Automation Report
              </h2>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Live status of all 6 automation tasks. Tasks run continuously in the background.
              </p>
            </div>
            <button
              onClick={loadSeoLogs}
              disabled={seoLogsLoading}
              style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--chip-bg)', color: 'var(--text-sub)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              {seoLogsLoading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>

          {/* Quick health bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Total Tasks', value: 6,            icon: '🤖', color: '#6366f1' },
              { label: 'Successful',  value: successCount, icon: '✅', color: '#16a34a' },
              { label: 'Failed',      value: failedCount,  icon: '❌', color: '#dc2626' },
              { label: 'Log Entries', value: recent.length,icon: '📋', color: '#0ea5e9' },
            ].map((c, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: c.color }}>{seoLogsLoading ? '…' : c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Task Status Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {seoLogsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', height: '130px', opacity: 0.4 }} />
              ))
            ) : summary.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⏳</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>No automation logs yet</div>
                <div style={{ fontSize: '0.83rem', marginTop: '6px' }}>Tasks will appear here after the bot runs its first daily cycle.</div>
              </div>
            ) : (
              // Show all 6 tasks, merging summary data with TASK_META
              Object.entries(TASK_META).map(([taskKey, meta]) => {
                const log = summary.find(s => s.taskName === taskKey) || { taskName: taskKey, status: 'never', ranAt: null, message: 'Has not run yet', durationMs: 0 };
                const st = STATUS_STYLE[log.status] || STATUS_STYLE.never;
                const isDark = darkMode;
                return (
                  <div key={taskKey} style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                    border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                    borderLeft: `4px solid ${meta.color}`,
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{meta.icon}</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{meta.label}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>⏱ {meta.cadence}</div>
                        </div>
                      </div>
                      <span style={{
                        background: isDark ? 'rgba(255,255,255,0.07)' : st.bg,
                        border: `1px solid ${st.border}`,
                        color: st.text,
                        borderRadius: '20px',
                        padding: '3px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}>{st.label}</span>
                    </div>
                    {/* Message */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', borderRadius: '8px', padding: '8px 12px', minHeight: '32px' }}>
                      {log.message || 'No result message recorded.'}
                    </div>
                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>🕐 Last run: <strong>{fmtTime(log.ranAt)}</strong></span>
                      <span>⚡ {fmtDur(log.durationMs)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent Activity Feed */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', background: darkMode ? 'rgba(99,102,241,0.06)' : '#fcfcfd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>📋 Recent Activity Feed</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 20 task runs across all automation tasks</p>
              </div>
            </div>
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {seoLogsLoading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>⏳ Loading activity...</div>
              ) : recent.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No activity yet. Bot will log results here after first run.</div>
              ) : (
                recent.slice(0, 20).map((entry, i) => {
                  const meta  = TASK_META[entry.taskName] || { label: entry.taskName, icon: '🔧', color: '#64748b' };
                  const st    = STATUS_STYLE[entry.status] || STATUS_STYLE.never;
                  return (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '13px 22px',
                      borderBottom: '1px solid var(--border)',
                      background: i % 2 === 0 ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.01)' : '#fafafa')
                    }}>
                      {/* Icon dot */}
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                        {meta.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{meta.label}</span>
                          <span style={{ fontSize: '0.7rem', color: st.text, fontWeight: 700, whiteSpace: 'nowrap',
                            background: darkMode ? 'rgba(255,255,255,0.06)' : st.bg,
                            border: `1px solid ${st.border}`,
                            borderRadius: '20px', padding: '2px 8px'
                          }}>{st.label}</span>
                        </div>
                        <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.message || '—'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{timeAgo(entry.ranAt)}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{fmtDur(entry.durationMs)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      );
    }

    return null;
  };


  const totalJobs    = jobs.length;
  const activeJobs   = jobs.filter(j=>j.isActive).length;
  const featuredJobs = jobs.filter(j=>j.isFeatured).length;
  const draftJobs    = jobs.filter(j=>!j.isActive).length;

  const currentMenu    = adminModule==='jobs' ? JOB_MENU : (adminModule==='preparation' ? PREP_MENU : (adminModule==='seo' ? SEO_MENU : []));
  const currentSubPage = adminModule==='jobs' ? jobSubPage : (adminModule==='preparation' ? prepSubmenu : (adminModule==='seo' ? seoSubmenu : ''));

  return (
    <div
      className={darkMode ? 'admin-panel admin-dark' : 'admin-panel'}
      style={{
        ...S.root,
        background: T.pageBg,
        '--page-bg': darkMode ? '#0f172a' : '#f1f5f9',
        '--sidebar-bg': darkMode ? '#1e293b' : '#ffffff',
        '--border': darkMode ? '#334155' : '#e5e7eb',
        '--border-light': darkMode ? '#334155' : '#f3f4f6',
        '--text-primary': darkMode ? '#f8fafc' : '#111827',
        '--text-sub': darkMode ? '#cbd5e1' : '#374151',
        '--text-muted': darkMode ? '#94a3b8' : '#6b7280',
        '--active-item-bg': darkMode ? '#334155' : '#eef2ff',
        '--accent': darkMode ? '#818cf8' : '#4f46e5',
        '--chip-bg': darkMode ? '#1e293b' : '#ffffff',
        '--card-bg': darkMode ? '#1e293b' : '#ffffff',
        '--table-header-bg': darkMode ? '#1e293b' : '#f9fafb',
        '--table-row-hover': darkMode ? '#334155' : '#f9fafb',
        '--form-tab-bg': darkMode ? '#1e293b' : '#fafafa',
        '--form-head-bg': darkMode ? 'linear-gradient(135deg,#312e81,#1e1b4b)' : 'linear-gradient(135deg,#eef2ff,#f5f3ff)',
        '--input-bg': darkMode ? '#1e293b' : '#ffffff',
        '--input-text': darkMode ? '#f8fafc' : '#111827',
        '--input-border': darkMode ? '#475569' : '#d1d5db',
        '--govt-toggle-bg': darkMode ? '#1e293b' : '#fafafa',
      }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside style={{ ...S.sidebar, width: sidebarOpen ? '240px' : '68px', background: T.sidebarBg, borderRightColor: T.border }}>

        {/* Brand */}
        <div style={{ ...S.brand, borderBottomColor: T.border }}>
          <div style={S.brandLogo}>NJ</div>
          {sidebarOpen && <span style={{ ...S.brandText, color: T.textPrimary }}>NextJobPost</span>}
        </div>

        {/* Module switcher */}
        <div style={{ ...S.moduleArea, borderBottomColor: T.border }}>
          {sidebarOpen && <p style={{ ...S.sectionLabel, color: T.textMuted }}>MODULES</p>}
          <button onClick={() => { setAdminModule('jobs'); setJobSubPage('list'); }} style={{ ...S.moduleBtn, ...(adminModule==='jobs' ? { background: T.activeItemBg, color: T.accent } : { color: T.textSub }) }} title="Jobs Manager">
            <span style={S.mIcon}>💼</span>{sidebarOpen && <span>Jobs Manager</span>}
          </button>
          <button onClick={() => setAdminModule('preparation')} style={{ ...S.moduleBtn, ...(adminModule==='preparation' ? { background: T.activeItemBg, color: T.accent } : { color: T.textSub }) }} title="Preparation">
            <span style={S.mIcon}>🎓</span>{sidebarOpen && <span>Preparation</span>}
          </button>
          <button onClick={() => { setAdminModule('security'); loadLogs(); }} style={{ ...S.moduleBtn, ...(adminModule==='security' ? { background: 'rgba(239,68,68,0.12)', color: '#ef4444' } : { color: T.textSub }) }} title="Security">
            <span style={S.mIcon}>🛡️</span>{sidebarOpen && <span>Security</span>}
          </button>
          <button onClick={() => { setAdminModule('seo'); loadSeoStats(); }} style={{ ...S.moduleBtn, ...(adminModule==='seo' ? { background: 'rgba(99,102,241,0.12)', color: '#6366f1' } : { color: T.textSub }) }} title="SEO Control Center">
            <span style={S.mIcon}>🔥</span>{sidebarOpen && <span>SEO Center</span>}
          </button>
        </div>

        <div style={{ ...S.divider, background: T.border }} />

        {/* Nav items */}
        <nav style={S.nav}>
          {sidebarOpen && <p style={{ ...S.sectionLabel, color: T.textMuted }}>{adminModule==='jobs' ? 'JOB TOOLS' : (adminModule==='preparation' ? 'PREP TOOLS' : 'SEO TOOLS')}</p>}
          {currentMenu.map(item => (
            <button key={item.id}
              onClick={() => adminModule==='jobs' ? (item.id==='create' ? startCreate() : setJobSubPage(item.id)) : (adminModule==='preparation' ? setPrepSubmenu(item.id) : setSeoSubmenu(item.id))}
              style={{ ...S.navItem, color: T.textSub, ...(currentSubPage===item.id ? { background: T.activeItemBg, color: T.accent, fontWeight:700, borderLeft: `3px solid ${T.accent}`, paddingLeft: 'calc(0.75rem - 3px)' } : {}) }}
              title={item.label}
            >
              <span style={S.navIcon}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User block */}
        <div style={{ ...S.userBlock, borderTopColor: T.border }}>
          <div style={S.userAvatar}>{username?.[0]?.toUpperCase()||'A'}</div>
          {sidebarOpen && (
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ ...S.userName, color: T.textPrimary }}>{username}</div>
              <div style={{ ...S.userRole, color: T.textMuted }}>Administrator</div>
            </div>
          )}
          <button onClick={handleAdminLogout} style={{ ...S.logoutBtn, color: T.textMuted }} title="Logout">🚪</button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────── */}
      <main style={S.main}>

        {/* Topbar */}
        <header style={{ ...S.topbar, background: T.sidebarBg, borderBottomColor: T.border }}>
          <button onClick={() => setSidebarOpen(o=>!o)} style={S.hamburger}>
            <span style={{ ...S.hLine, background: T.textMuted }}/>
            <span style={{ ...S.hLine, background: T.textMuted }}/>
            <span style={{ ...S.hLine, background: T.textMuted }}/>
          </button>
          <div style={{ ...S.topbarTitle, color: T.textPrimary }}>
            {adminModule==='jobs'
              ? (jobSubPage==='list' ? '📋 Job Listings' : jobSubPage==='create' ? (editingId&&editingId!=='new'?'✏️ Edit Job':'➕ Create Job') : '⚙️ Settings')
              : adminModule==='preparation'
              ? `${PREP_MENU.find(m=>m.id===prepSubmenu)?.icon} ${PREP_MENU.find(m=>m.id===prepSubmenu)?.label}`
              : adminModule==='seo'
              ? `${SEO_MENU.find(m=>m.id===seoSubmenu)?.icon} ${SEO_MENU.find(m=>m.id===seoSubmenu)?.label}`
              : '🛡️ Security & Monitoring'}
          </div>
          <div style={S.topbarRight}>
            {flashMsg.text && (
              <div style={{ ...S.flash, ...(flashMsg.type==='error' ? { background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca' } : { background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }) }}>
                {flashMsg.text}
              </div>
            )}
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.4rem 0.75rem', borderRadius:'8px', border:`1px solid ${T.border}`, background: T.chipBg, color: T.textSub, fontWeight:700, fontSize:'0.82rem', cursor:'pointer', transition:'all 150ms ease', flexShrink:0 }}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        {/* ── JOBS MODULE ─────────────────────────────────── */}
        {adminModule==='jobs' && (
          <div style={S.page}>

            {jobSubPage==='list' && (
              <>
                {/* Stats */}
                <div style={S.statsGrid}>
                  {[
                    { label:'Total Jobs',      value:totalJobs,    color:'#4f46e5', bg:'#eef2ff', icon:'💼', filter:'all' },
                    { label:'Active Listings', value:activeJobs,   color:'#16a34a', bg:'#f0fdf4', icon:'✅', filter:'active' },
                    { label:'Featured Jobs',   value:featuredJobs, color:'#d97706', bg:'#fffbeb', icon:'⭐', filter:'featured' },
                    { label:'Draft / Hidden',  value:draftJobs,    color:'#6b7280', bg:'#f9fafb', icon:'📄', filter:'draft' },
                  ].map(s=>{
                    const cardBg = darkMode 
                      ? (s.filter === 'all' ? 'rgba(79, 70, 229, 0.15)' 
                        : s.filter === 'active' ? 'rgba(22, 163, 74, 0.15)' 
                        : s.filter === 'featured' ? 'rgba(217, 119, 6, 0.15)' 
                        : 'rgba(148, 163, 184, 0.15)')
                      : s.bg;
                    const cardColor = darkMode
                      ? (s.filter === 'all' ? '#818cf8'
                        : s.filter === 'active' ? '#4ade80'
                        : s.filter === 'featured' ? '#fbbf24'
                        : '#cbd5e1')
                      : s.color;
                    return (
                      <div key={s.filter} onClick={()=>setFilterBy(s.filter)}
                        style={{ ...S.statCard, background:cardBg, borderColor: filterBy===s.filter ? cardColor : 'var(--border)', boxShadow: filterBy===s.filter ? `0 0 0 2px ${cardColor}22` : '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ ...S.statIcon, background:`${cardColor}18`, color:cardColor }}>{s.icon}</div>
                        <div>
                          <div style={{ ...S.statVal, color:cardColor }}>{s.value}</div>
                          <div style={S.statLbl}>{s.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Toolbar */}
                <div style={S.toolbar}>
                  <div style={S.filterGroup}>
                    <span style={S.filterLbl}>Filter:</span>
                    {[{id:'all',label:'All'},{id:'govt',label:'🏛️ Govt'},{id:'admit',label:'🪪 Admit'},{id:'result',label:'📢 Results'},{id:'answer',label:'🗝️ Answer Keys'},{id:'corporate',label:'💼 Corporate'}].map(c=>(
                      <button key={c.id} onClick={()=>setCategoryFilter(c.id)}
                        style={{ ...S.chip, ...(categoryFilter===c.id ? S.chipActive : {}) }}>{c.label}</button>
                    ))}
                    {(filterBy!=='all'||categoryFilter!=='all') && (
                      <button onClick={()=>{setFilterBy('all');setCategoryFilter('all');}} style={S.chipClear}>✕ Clear</button>
                    )}
                  </div>
                  <button onClick={startCreate} style={S.btnPrimary}>➕ New Job</button>
                </div>

                {/* Table */}
                {loading ? (
                  <div style={S.loadBox}><div style={S.spinner}/><p style={{color:'var(--text-muted)',marginTop:'1rem',fontWeight:600}}>Loading jobs…</p></div>
                ) : (() => {
                  const filtered = jobs.filter(j=>{
                    if (filterBy==='active'&&!j.isActive) return false;
                    if (filterBy==='featured'&&!j.isFeatured) return false;
                    if (filterBy==='draft'&&j.isActive) return false;
                    if (categoryFilter==='govt'&&!j.isGovernment) return false;
                    if (categoryFilter==='admit'&&(!j.isGovernment||!String(j.postType||'').toLowerCase().includes('admit'))) return false;
                    if (categoryFilter==='result'&&(!j.isGovernment||!String(j.postType||'').toLowerCase().includes('result'))) return false;
                    if (categoryFilter==='answer'&&(!j.isGovernment||!String(j.postType||'').toLowerCase().includes('answer'))) return false;
                    if (categoryFilter==='corporate'&&j.isGovernment) return false;
                    return true;
                  });

                  return filtered.length===0 ? (
                    <div style={S.emptyState}>
                      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📭</div>
                      <h3 style={{fontWeight:700,color:'var(--text-primary)'}}>No jobs found</h3>
                      <p style={{color:'var(--text-muted)'}}>Try clearing filters or create a new listing.</p>
                      <button onClick={startCreate} style={{...S.btnPrimary,marginTop:'1.25rem'}}>Create First Job</button>
                    </div>
                  ) : (
                    <div style={S.tableCard}>
                      <div style={S.tableHeader}>
                        <span style={S.tableHeaderTitle}>
                          {filterBy==='all'?'All Jobs':filterBy==='active'?'Active Jobs':filterBy==='featured'?'Featured':filterBy==='draft'?'Drafts':''} ({filtered.length})
                        </span>
                      </div>
                      <div style={{overflowX:'auto'}}>
                        <table style={S.table}>
                          <thead><tr style={S.thead}>
                            <th style={S.th}>Job Title</th>
                            <th style={S.th}>Company</th>
                            <th style={S.th}>Type</th>
                            <th style={S.th}>Status</th>
                            <th style={{...S.th,textAlign:'right'}}>Actions</th>
                          </tr></thead>
                          <tbody>
                            {filtered.map(j=>(
                              <tr key={j._id} style={S.tr} onMouseEnter={e=>e.currentTarget.style.background='var(--table-row-hover)'} onMouseLeave={e=>e.currentTarget.style.background='var(--card-bg)'}>
                                <td style={S.td}>
                                  <div style={{fontWeight:700,color:'var(--text-primary)'}}>{j.title.length>44?j.title.slice(0,44)+'…':j.title}</div>
                                  <div style={{display:'flex',gap:'0.3rem',marginTop:'0.3rem',flexWrap:'wrap'}}>
                                    {j.isGovernment && <span style={{...S.badge,background:darkMode?'rgba(220,38,38,0.18)':'#fef2f2',color:darkMode?'#fca5a5':'#dc2626'}}>🏛️ Govt</span>}
                                    {j.isFeatured   && <span style={{...S.badge,background:darkMode?'rgba(217,119,6,0.18)':'#fffbeb',color:darkMode?'#fcd34d':'#d97706'}}>⭐ Featured</span>}
                                    {!j.isActive    && <span style={{...S.badge,background:darkMode?'rgba(148,163,184,0.18)':'#f3f4f6',color:darkMode?'#cbd5e1':'#6b7280'}}>📄 Draft</span>}
                                  </div>
                                </td>
                                <td style={{...S.td,color:'var(--text-muted)'}}>{j.company}</td>
                                <td style={S.td}>
                                  <span style={{
                                    ...S.badge, 
                                    background: j.type==='Full-Time' 
                                      ? (darkMode ? 'rgba(37, 99, 235, 0.18)' : '#eff6ff') 
                                      : j.type==='Internship' 
                                        ? (darkMode ? 'rgba(217, 119, 6, 0.18)' : '#fffbeb') 
                                        : (darkMode ? 'rgba(148, 163, 184, 0.18)' : '#f3f4f6'), 
                                    color: j.type==='Full-Time' 
                                      ? (darkMode ? '#93c5fd' : '#2563eb') 
                                      : j.type==='Internship' 
                                        ? (darkMode ? '#fcd34d' : '#d97706') 
                                        : (darkMode ? '#cbd5e1' : '#374151')
                                  }}>
                                    {j.type}
                                  </span>
                                </td>
                                <td style={S.td}>
                                  <button onClick={()=>toggleJobStatus(j._id,j.isActive)}
                                    style={{
                                      ...S.statusToggle, 
                                      background: j.isActive 
                                        ? (darkMode ? 'rgba(22, 163, 74, 0.18)' : '#f0fdf4') 
                                        : (darkMode ? 'rgba(220, 38, 38, 0.18)' : '#fef2f2'), 
                                      color: j.isActive 
                                        ? (darkMode ? '#86efac' : '#16a34a') 
                                        : (darkMode ? '#fca5a5' : '#dc2626'), 
                                      border: `1px solid ${j.isActive 
                                        ? (darkMode ? 'rgba(22, 163, 74, 0.3)' : '#bbf7d0') 
                                        : (darkMode ? 'rgba(220, 38, 38, 0.3)' : '#fecaca')}`
                                    }}>
                                    {j.isActive?'🟢 Active':'🔴 Inactive'} <span style={{fontSize:'0.7rem',opacity:0.6}}>🔁</span>
                                  </button>
                                </td>
                                <td style={{...S.td,textAlign:'right'}}>
                                  <div style={{display:'flex',gap:'0.4rem',justifyContent:'flex-end'}}>
                                    <button onClick={()=>startEdit(j)} style={S.editBtn}>✏️ Edit</button>
                                    <button onClick={()=>remove(j._id)} style={S.delBtn}>🗑️</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={S.tableFooter}>{filtered.length} record{filtered.length!==1?'s':''}</div>
                    </div>
                  );
                })()}
              </>
            )}

            {/* ── Create / Edit Form ─────────────────────── */}
            {jobSubPage==='create' && (
              <div style={S.formCard}>
                <div style={S.formHead}>
                  <div style={S.formHeadIcon}>{editingId==='new'?'✨':'✏️'}</div>
                  <div style={{flex:1}}>
                    <h2 style={S.formHeadTitle}>{editingId==='new'?'Create New Job Posting':'Edit Job Listing'}</h2>
                    <p style={S.formHeadSub}>Fill in the details to publish this opportunity</p>
                  </div>
                  <button onClick={cancelEdit} style={S.formClose}>✕ Cancel</button>
                </div>

                {error && <div style={S.errBanner}>⚠️ {error}</div>}

                <div style={S.formTabsBar}>
                  {['basic','description','media','contact'].map(tab=>(
                    <button key={tab} type="button" onClick={()=>setActiveTab(tab)}
                      style={{...S.fTab,...(activeTab===tab?S.fTabActive:{})}}>
                      {tab==='basic'&&'📋 Basic Info'}{tab==='description'&&'📝 Content'}{tab==='media'&&'🖼️ Media'}{tab==='contact'&&'📱 Contact'}
                    </button>
                  ))}
                </div>

                <form onSubmit={save} style={S.formBody}>
                  {activeTab==='basic' && (
                    <div className="row g-3">
                      <div className="col-12 col-md-6"><label style={S.lbl}>Job Title</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g., Software Engineer" required /></div>
                      <div className="col-12 col-md-6"><label style={S.lbl}>Company</label><input className="form-control" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="e.g., Tech Corp" required /></div>
                      {!form.isGovernment && (<>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Location</label><input className="form-control" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g., Bangalore" required={!form.isGovernment}/></div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Job Type</label>
                          <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                            {['Full-Time','Part-Time','Internship','Contract','Remote'].map(t=><option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Experience</label><input className="form-control" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} placeholder="e.g., 0-2 years"/></div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Education</label><input className="form-control" value={form.education} onChange={e=>setForm({...form,education:e.target.value})} placeholder="e.g., B.Tech (CSE)"/></div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Batch/Year</label><input className="form-control" value={form.batch} onChange={e=>setForm({...form,batch:e.target.value})} placeholder="e.g., 2025"/></div>
                      </>)}
                      <div className="col-12 col-md-6"><label style={S.lbl}>Salary</label><input className="form-control" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} placeholder="e.g., 6-12 LPA"/></div>
                      <div className="col-12 col-md-6"><label style={S.lbl}>Last Date</label><input className="form-control" type="date" value={form.lastDate} onChange={e=>setForm({...form,lastDate:e.target.value})}/></div>
                      <div className="col-12 col-md-6"><label style={S.lbl}>Apply Link</label><input className="form-control" type="url" value={form.applyLink} onChange={e=>setForm({...form,applyLink:e.target.value})} placeholder="https://apply.example.com" required/></div>
                      <div className="col-12 col-md-6"><label style={S.lbl}>Status</label>
                        <select className="form-select" value={String(form.isActive)} onChange={e=>setForm({...form,isActive:e.target.value==='true'})}>
                          <option value="true">Active (Published)</option><option value="false">Draft (Hidden)</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-6"><label style={S.lbl}>Featured?</label>
                        <select className="form-select" value={String(form.isFeatured)} onChange={e=>setForm({...form,isFeatured:e.target.value==='true'})}>
                          <option value="false">Standard</option><option value="true">Featured</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <div style={S.govtToggle}>
                          <input className="form-check-input" type="checkbox" id="isGovt" checked={form.isGovernment} onChange={e=>setForm({...form,isGovernment:e.target.checked})} style={{width:'2.2rem',height:'1.15rem',cursor:'pointer'}}/>
                          <label htmlFor="isGovt" style={{fontWeight:700,color:'var(--text-sub)',cursor:'pointer'}}>🏛️ Government Job Post?</label>
                        </div>
                      </div>
                      {form.isGovernment && (<>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Post Type</label>
                          <select className="form-select" value={form.postType} onChange={e=>setForm({...form,postType:e.target.value})}>
                            {['Job','Admit Card','Result','Answer Key'].map(t=><option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Eligibility</label><input className="form-control" value={form.eligibility} onChange={e=>setForm({...form,eligibility:e.target.value})} placeholder="e.g., Graduate" required={form.isGovernment}/></div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Vacancies</label><input className="form-control" value={form.vacancies} onChange={e=>setForm({...form,vacancies:e.target.value})} placeholder="e.g., 500 Posts" required={form.isGovernment}/></div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>PDF Link</label><input className="form-control" type="url" value={form.pdfLink} onChange={e=>setForm({...form,pdfLink:e.target.value})} placeholder="https://example.com/notif.pdf"/></div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Source Website</label><input className="form-control" value={form.sourceWebsite} onChange={e=>setForm({...form,sourceWebsite:e.target.value})} placeholder="e.g., UPSC, SSC"/></div>
                        <div className="col-12 col-md-6"><label style={S.lbl}>Source URL</label><input className="form-control" type="url" value={form.sourceUrl} onChange={e=>setForm({...form,sourceUrl:e.target.value})} placeholder="https://ssc.nic.in/apply"/></div>
                        <div className="col-12"><label style={S.lbl}>Important Dates</label><textarea className="form-control" rows="3" value={form.importantDates} onChange={e=>setForm({...form,importantDates:e.target.value})} placeholder="Application Start: 01/06/2026&#10;Last Date: 30/06/2026"/></div>
                      </>)}
                    </div>
                  )}

                  {activeTab==='description' && (
                    <div className="row g-3">
                      <div className="col-12"><label style={S.lbl}>Job Description</label><RichTextEditor value={form.jobDescription} onChange={html=>setForm({...form,jobDescription:html})} placeholder="Full job description..."/></div>
                      <div className="col-12"><label style={S.lbl}>Highlight Text</label><input className="form-control" value={form.highlightText} onChange={e=>setForm({...form,highlightText:e.target.value})} placeholder="Bold summary line on detail page"/></div>
                      <div className="col-12"><label style={S.lbl}>About Company</label><RichTextEditor value={form.aboutCompany} onChange={html=>setForm({...form,aboutCompany:html})} placeholder="Company background..."/></div>
                      <div className="col-12"><label style={S.lbl}>Why Join?</label><RichTextEditor value={form.whyJoin} onChange={html=>setForm({...form,whyJoin:html})} placeholder="Benefits and perks..."/></div>
                      <div className="col-12"><label style={S.lbl}>How to Apply</label><RichTextEditor value={form.howToApply} onChange={html=>setForm({...form,howToApply:html})} placeholder="Step-by-step guide..."/></div>
                      <div className="col-12"><label style={S.lbl}>Final Thoughts</label><RichTextEditor value={form.finalThoughts} onChange={html=>setForm({...form,finalThoughts:html})} placeholder="Closing remarks..."/></div>
                      <div className="col-12"><label style={S.lbl}>Short Summary</label><RichTextEditor value={form.description} onChange={html=>setForm({...form,description:html})} placeholder="Brief listing summary..."/></div>
                      <div className="col-12"><label style={S.lbl}>Responsibilities</label><RichTextEditor value={form.responsibilities} onChange={html=>setForm({...form,responsibilities:html})} placeholder="Key responsibilities..."/></div>
                      <div className="col-12"><label style={S.lbl}>Requirements</label><RichTextEditor value={form.requirements} onChange={html=>setForm({...form,requirements:html})} placeholder="Eligibility requirements..."/></div>
                    </div>
                  )}

                  {activeTab==='media' && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label style={S.lbl}>Image URL</label>
                        <input className="form-control" type="url" value={form.image} onChange={e=>{setForm({...form,image:e.target.value});checkImageUrl(e.target.value);}} placeholder="https://example.com/image.jpg"/>
                        {imageError && <div style={S.errBanner}>{imageError}</div>}
                        {imageLoading && <p style={{color:'var(--text-muted)',fontSize:'0.875rem',marginTop:'0.5rem'}}>⏳ Checking image…</p>}
                      </div>
                      {form.image && !imageError && (
                        <div className="col-12">
                          <label style={S.lbl}>Preview</label>
                          <img src={getImageUrl(form.image)} alt="preview" style={{maxWidth:'300px',borderRadius:'10px',border:'2px solid #e5e7eb'}}/>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab==='contact' && (
                    <div className="row g-3">
                      <div className="col-12 col-md-6"><label style={S.lbl}>Phone (Optional)</label><input className="form-control" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="+91-9876543210"/></div>
                      <div className="col-12"><label style={S.lbl}>WhatsApp Group <span style={S.prefillTag}>PREFILLED</span></label><input className="form-control" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="https://chat.whatsapp.com/..."/></div>
                      <div className="col-12"><label style={S.lbl}>Telegram Channel <span style={S.prefillTag}>PREFILLED</span></label><input className="form-control" value={form.telegram} onChange={e=>setForm({...form,telegram:e.target.value})} placeholder="https://t.me/..."/></div>
                    </div>
                  )}

                  <div style={S.formActions}>
                    <button type="submit" style={S.btnSave}>💾 Save Job Posting</button>
                    <button type="button" onClick={cancelEdit} style={S.btnCancel}>✕ Discard Changes</button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Settings ─────────────────────────────── */}
            {jobSubPage==='settings' && (
              <div style={{maxWidth:'580px'}}>
                <div style={S.settingsCard}>
                  <h3 style={{fontSize:'1.15rem',fontWeight:800,color:'var(--text-primary)',marginBottom:'0.25rem'}}>⚙️ Site Settings</h3>
                  <p style={{color:'var(--text-muted)',fontSize:'0.875rem',marginBottom:'1.5rem'}}>Manage ad links and global platform settings</p>
                  <label style={S.lbl}>📢 Ad Link (triggers with Apply Now button)</label>
                  <input className="form-control" type="url" value={adLink} onChange={e=>setAdLink(e.target.value)} placeholder={DEFAULT_AD_LINK}/>
                  <p style={{color:'#9ca3af',fontSize:'0.8rem',marginTop:'0.4rem'}}>Opens in a new tab when users click "Apply Now"</p>
                  <button onClick={saveSettings} disabled={settingsSaving} style={{...S.btnPrimary,marginTop:'1.25rem'}}>
                    {settingsSaving?'⏳ Saving…':'💾 Save Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PREPARATION MODULE ──────────────────────── */}
        {adminModule==='preparation' && (
          <div style={S.page}>
            {prepSubmenu==='topics'    && <PrepTopicManager />}
            {prepSubmenu==='companies' && <PrepCompanyManager />}
            {prepSubmenu==='questions' && <PrepQuestionsManager />}
            {prepSubmenu==='mocktests' && <PrepMockTestsManager />}
            {prepSubmenu==='reports'   && <PrepReportsManager />}
            {prepSubmenu==='import'    && <PrepImportManager />}
            {prepSubmenu==='analytics' && <PrepAnalyticsManager />}
          </div>
        )}

        {/* ── SECURITY MODULE ──────────────────────────────── */}
        {adminModule==='security' && (
          <div style={S.page}>
            <div style={{ display:'grid', gap:'24px', maxWidth:'900px' }}>

              {/* 2FA Card */}
              <div style={{ background:'var(--card-bg)', borderRadius:'16px', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', background: darkMode ? 'rgba(79,70,229,0.12)' : '#eef2ff', display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{ fontSize:'1.5rem' }}>🔐</span>
                  <div>
                    <h3 style={{ margin:0, color:'var(--text-primary)', fontSize:'1.05rem', fontWeight:800 }}>Two-Factor Authentication (2FA)</h3>
                    <p style={{ margin:'2px 0 0', color:'var(--text-muted)', fontSize:'0.82rem' }}>Add an extra layer of security using Google Authenticator or similar TOTP app</p>
                  </div>
                  {twoFAStatus?.enabled && <span style={{ marginLeft:'auto', background:'#dcfce7', color:'#16a34a', padding:'3px 10px', borderRadius:'99px', fontSize:'0.78rem', fontWeight:700 }}>ACTIVE</span>}
                </div>
                <div style={{ padding:'24px' }}>
                  {twoFAMsg.text && (
                    <div style={{ padding:'10px 14px', borderRadius:'8px', marginBottom:'16px', fontWeight:600, fontSize:'0.875rem',
                      background: twoFAMsg.type==='success' ? '#f0fdf4' : twoFAMsg.type==='error' ? '#fef2f2' : '#eff6ff',
                      color: twoFAMsg.type==='success' ? '#16a34a' : twoFAMsg.type==='error' ? '#dc2626' : '#1d4ed8',
                      border: `1px solid ${twoFAMsg.type==='success' ? '#bbf7d0' : twoFAMsg.type==='error' ? '#fecaca' : '#bfdbfe'}`,
                    }}>
                      {twoFAMsg.text}
                    </div>
                  )}

                  {!twoFAStatus && (
                    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                      <p style={{ color:'var(--text-sub)', fontSize:'0.9rem', margin:0 }}>2FA is currently <strong>disabled</strong>. Click below to set it up.</p>
                      <button onClick={setup2FA} disabled={twoFAWorking}
                        style={{ alignSelf:'flex-start', padding:'10px 20px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', opacity: twoFAWorking ? 0.7 : 1 }}>
                        {twoFAWorking ? '⏳ Setting up…' : '🔐 Setup 2FA'}
                      </button>
                    </div>
                  )}

                  {twoFAStatus && !twoFAStatus.enabled && twoFAStatus.qrCodeUrl && (
                    <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                      <div style={{ padding:'16px', background: darkMode ? '#1e293b' : '#f8fafc', borderRadius:'12px', border:'1px solid var(--border)' }}>
                        <p style={{ margin:'0 0 12px', fontWeight:700, color:'var(--text-primary)', fontSize:'0.9rem' }}>📱 Scan this QR code with your authenticator app:</p>
                        <img src={twoFAStatus.qrCodeUrl} alt="2FA QR Code" style={{ width:'180px', height:'180px', borderRadius:'8px', border:'3px solid #e5e7eb', display:'block' }} />
                        <p style={{ margin:'12px 0 0', fontSize:'0.8rem', color:'var(--text-muted)' }}>Or enter manually: <code style={{ background: darkMode ? '#334155' : '#e5e7eb', padding:'2px 6px', borderRadius:'4px', fontFamily:'monospace', fontSize:'0.78rem' }}>{twoFAStatus.secret}</code></p>
                      </div>
                      <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
                        <input
                          value={twoFAInput}
                          onChange={e => setTwoFAInput(e.target.value.replace(/\D/g,'').slice(0,6))}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          inputMode="numeric"
                          style={{ padding:'10px 14px', borderRadius:'8px', border:'1.5px solid var(--input-border)', background:'var(--input-bg)', color:'var(--input-text)', fontSize:'1.1rem', letterSpacing:'0.4rem', width:'180px', textAlign:'center', outline:'none' }}
                        />
                        <button onClick={verify2FA} disabled={twoFAWorking || twoFAInput.length !== 6}
                          style={{ padding:'10px 20px', borderRadius:'10px', border:'none', background:'#16a34a', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', opacity:(twoFAWorking||twoFAInput.length!==6)?0.6:1 }}>
                          {twoFAWorking ? '⏳ Verifying…' : '✅ Verify & Enable'}
                        </button>
                      </div>
                    </div>
                  )}

                  {twoFAStatus?.enabled && (
                    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                      <p style={{ color:'var(--text-sub)', fontSize:'0.9rem', margin:0 }}>✅ Two-factor authentication is <strong>active</strong> and protecting your account.</p>
                      <button onClick={disable2FA} disabled={twoFAWorking}
                        style={{ alignSelf:'flex-start', padding:'10px 20px', borderRadius:'10px', border:'1.5px solid #ef4444', background:'transparent', color:'#ef4444', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', opacity: twoFAWorking ? 0.7 : 1 }}>
                        {twoFAWorking ? '⏳ Disabling…' : '🔓 Disable 2FA'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Logs Card */}
              <div style={{ background:'var(--card-bg)', borderRadius:'16px', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', background: darkMode ? 'rgba(239,68,68,0.10)' : '#fff5f5', display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{ fontSize:'1.5rem' }}>📋</span>
                  <div style={{ flex:1 }}>
                    <h3 style={{ margin:0, color:'var(--text-primary)', fontSize:'1.05rem', fontWeight:800 }}>Audit Logs</h3>
                    <p style={{ margin:'2px 0 0', color:'var(--text-muted)', fontSize:'0.82rem' }}>Last 100 admin actions — login attempts, job changes, settings edits</p>
                  </div>
                  <button onClick={loadLogs} disabled={logsLoading}
                    style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--chip-bg)', color:'var(--text-sub)', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', flexShrink:0 }}>
                    {logsLoading ? '⏳' : '🔄 Refresh'}
                  </button>
                </div>
                <div style={{ overflowX:'auto', maxHeight:'500px', overflowY:'auto' }}>
                  {logsLoading ? (
                    <div style={{ padding:'40px', textAlign:'center', color:'var(--text-muted)' }}>⏳ Loading logs…</div>
                  ) : securityLogs.length === 0 ? (
                    <div style={{ padding:'40px', textAlign:'center', color:'var(--text-muted)' }}>No audit logs found.</div>
                  ) : (
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.82rem' }}>
                      <thead>
                        <tr style={{ background:'var(--table-header-bg)', position:'sticky', top:0 }}>
                          {['Timestamp','User','Action','IP','URL'].map(h => (
                            <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:700, color:'var(--text-muted)', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {securityLogs.map((log, i) => {
                          const isFailure = log.action?.toLowerCase().includes('fail');
                          const isLogin   = log.action?.toLowerCase().includes('login');
                          return (
                            <tr key={log._id || i} style={{ borderBottom:'1px solid var(--border)', background: i%2===0 ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa') }}>
                              <td style={{ padding:'9px 14px', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                                {new Date(log.createdAt).toLocaleString('en-IN', { dateStyle:'short', timeStyle:'short' })}
                              </td>
                              <td style={{ padding:'9px 14px', fontWeight:600, color:'var(--text-sub)' }}>{log.username || '—'}</td>
                              <td style={{ padding:'9px 14px' }}>
                                <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'2px 8px', borderRadius:'99px', fontSize:'0.75rem', fontWeight:700,
                                  background: isFailure ? '#fef2f2' : isLogin ? '#f0fdf4' : (darkMode ? '#334155' : '#f1f5f9'),
                                  color: isFailure ? '#dc2626' : isLogin ? '#16a34a' : 'var(--text-sub)',
                                }}>
                                  {isFailure ? '❌' : isLogin ? '✅' : '📝'} {log.action}
                                </span>
                              </td>
                              <td style={{ padding:'9px 14px', color:'var(--text-muted)', fontFamily:'monospace', fontSize:'0.78rem' }}>{log.ip || '—'}</td>
                              <td style={{ padding:'9px 14px', color:'var(--text-muted)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={log.requestUrl}>{log.requestUrl || '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Session Security Info */}
              <div style={{ background:'var(--card-bg)', borderRadius:'16px', border:'1px solid var(--border)', padding:'20px 24px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin:'0 0 16px', color:'var(--text-primary)', fontSize:'1.05rem', fontWeight:800 }}>🔒 Session Security</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'12px' }}>
                  {[
                    { icon:'⏱️', label:'Session Timeout',  value:'30 min inactivity', ok:true },
                    { icon:'🔑', label:'Token Lifespan',   value:'15 min (auto-refresh)', ok:true },
                    { icon:'🍪', label:'Refresh Token',    value:'HTTP-only cookie, 7d', ok:true },
                    { icon:'🛡️', label:'CSRF Protection',  value:'Double-submit cookie', ok:true },
                    { icon:'🚦', label:'Rate Limiting',    value:'10 req / 15 min per IP', ok:true },
                    { icon:'🧹', label:'NoSQL Sanitize',   value:'express-mongo-sanitize', ok:true },
                    { icon:'🔐', label:'XSS Protection',   value:'xss + Helmet headers', ok:true },
                    { icon:'📝', label:'Audit Logging',    value:'All actions logged to DB', ok:true },
                  ].map(item => (
                    <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px', background: darkMode ? '#1e293b' : '#f8fafc', borderRadius:'10px', border:'1px solid var(--border)' }}>
                      <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)' }}>{item.label}</div>
                        <div style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-sub)' }}>{item.value}</div>
                      </div>
                      <span style={{ marginLeft:'auto', color:'#16a34a', fontSize:'1rem', flexShrink:0 }}>✅</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── SEO CONTROL CENTER MODULE ───────────────────── */}
        {adminModule==='seo' && (
          <div style={S.page}>
            {renderSeoModule()}
          </div>
        )}

      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;}
        body{font-family:'Inter',system-ui,sans-serif!important;background:#f8fafc!important;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .form-control,.form-select{
          border:1.5px solid var(--input-border)!important;
          border-radius:8px!important;
          font-family:'Inter',system-ui,sans-serif!important;
          color:var(--input-text)!important;
          background:var(--input-bg)!important;
          font-size:0.9rem!important;
          padding:0.6rem 0.875rem!important;
        }
        .form-control:focus,.form-select:focus{
          border-color:var(--accent)!important;
          box-shadow:0 0 0 3px rgba(79,70,229,0.12)!important;
          outline:none!important;
        }
        .form-control::placeholder{color:var(--text-muted)!important;}
        .form-check-input:checked{background-color:var(--accent)!important;border-color:var(--accent)!important;}

        /* Admin Dark Mode Global Overrides */
        .admin-dark {
          background-color: #0f172a !important;
          color: #cbd5e1 !important;
        }
        .admin-dark * {
          border-color: #334155 !important;
        }
        .admin-dark h1, .admin-dark h2, .admin-dark h3, .admin-dark h4, .admin-dark h5, .admin-dark h6,
        .admin-dark th, .admin-dark strong, .admin-dark b {
          color: #f8fafc !important;
        }
        .admin-dark p, .admin-dark span, .admin-dark label {
          color: #cbd5e1 !important;
        }
        .admin-dark .text-muted, .admin-dark .small {
          color: #94a3b8 !important;
        }
        .admin-dark tr {
          background-color: #1e293b !important;
          border-bottom: 1px solid #334155 !important;
        }
        .admin-dark tr:hover, .admin-dark tr:hover td {
          background-color: #334155 !important;
        }
        .admin-dark td, .admin-dark th {
          color: #cbd5e1 !important;
          background-color: transparent !important;
          border-color: #334155 !important;
        }
        .admin-dark .card {
          background-color: #1e293b !important;
          border-color: #334155 !important;
          color: #cbd5e1 !important;
        }
        .admin-dark input, .admin-dark select, .admin-dark textarea,
        .admin-dark .form-control, .admin-dark .form-select {
          background-color: #1e293b !important;
          color: #f8fafc !important;
          border-color: #475569 !important;
        }
        .admin-dark .badge {
          background-color: #334155 !important;
          color: #f8fafc !important;
          border: 1px solid #475569 !important;
        }
        .admin-dark .modal-content,
        .admin-dark .modal-header,
        .admin-dark .modal-body,
        .admin-dark .modal-footer {
          background-color: #1e293b !important;
          color: #cbd5e1 !important;
          border-color: #334155 !important;
        }
        .admin-dark .btn-light {
          background-color: #334155 !important;
          color: #cbd5e1 !important;
          border-color: #475569 !important;
        }
        .admin-dark .ql-toolbar, .admin-dark .ql-container {
          background-color: #1e293b !important;
          border-color: #475569 !important;
          color: #cbd5e1 !important;
        }
        .admin-dark .ql-stroke {
          stroke: #cbd5e1 !important;
        }
        .admin-dark .ql-fill {
          fill: #cbd5e1 !important;
        }
        .admin-dark .ql-picker {
          color: #cbd5e1 !important;
        }
      `}</style>
    </div>
  );
}

/* ─── Style Tokens ────────────────────────────────────────────────── */
const S = {
  root: { display:'flex', minHeight:'100vh', background:'var(--page-bg)', fontFamily:"'Inter',system-ui,sans-serif" },

  /* Sidebar */
  sidebar: {
    background:'var(--sidebar-bg)',
    borderRight:'1px solid var(--border)',
    display:'flex', flexDirection:'column',
    transition:'width 250ms cubic-bezier(0.4,0,0.2,1)',
    overflow:'hidden', flexShrink:0,
    position:'sticky', top:0, height:'100vh',
    boxShadow:'2px 0 8px rgba(0,0,0,0.04)',
  },
  brand: {
    display:'flex', alignItems:'center', gap:'0.75rem',
    padding:'1.25rem 1rem', borderBottom:'1px solid var(--border-light)',
  },
  brandLogo: {
    width:'36px', height:'36px', borderRadius:'10px',
    background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
    display:'flex', alignItems:'center', justifyContent:'center',
    color:'#fff', fontWeight:900, fontSize:'0.85rem', flexShrink:0,
    boxShadow:'0 4px 12px rgba(79,70,229,0.3)',
  },
  brandText: { color:'var(--text-primary)', fontWeight:800, fontSize:'1rem', whiteSpace:'nowrap' },

  moduleArea: { padding:'0.75rem', borderBottom:'1px solid var(--border-light)' },
  sectionLabel: { fontSize:'0.65rem', fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:'0.4rem', marginLeft:'0.25rem', whiteSpace:'nowrap' },
  moduleBtn: {
    display:'flex', alignItems:'center', gap:'0.6rem',
    padding:'0.6rem 0.75rem', borderRadius:'8px', border:'none',
    background:'transparent', color:'var(--text-sub)',
    fontSize:'0.875rem', cursor:'pointer', width:'100%', textAlign:'left',
    transition:'all 150ms ease', whiteSpace:'nowrap', overflow:'hidden',
  },
  moduleBtnActive: { background:'var(--active-item-bg)', color:'var(--accent)' },
  mIcon: { fontSize:'1rem', flexShrink:0 },

  divider: { height:'1px', background:'var(--border-light)' },
  nav: { flex:1, padding:'0.75rem', display:'flex', flexDirection:'column', gap:'2px', overflowY:'auto' },
  navItem: {
    display:'flex', alignItems:'center', gap:'0.7rem',
    padding:'0.6rem 0.75rem', borderRadius:'8px', border:'none',
    background:'transparent', color:'var(--text-sub)',
    fontSize:'0.875rem', cursor:'pointer', textAlign:'left',
    transition:'all 150ms ease', whiteSpace:'nowrap', overflow:'hidden', width:'100%',
  },
  navItemActive: { background:'var(--active-item-bg)', color:'var(--accent)', fontWeight:700 },
  navIcon: { fontSize:'1rem', flexShrink:0, width:'20px', textAlign:'center' },

  userBlock: {
    display:'flex', alignItems:'center', gap:'0.6rem',
    padding:'0.875rem', borderTop:'1px solid var(--border-light)',
  },
  userAvatar: {
    width:'34px', height:'34px', borderRadius:'50%',
    background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
    display:'flex', alignItems:'center', justifyContent:'center',
    color:'#fff', fontWeight:700, fontSize:'0.875rem', flexShrink:0,
  },
  userName: { color:'var(--text-primary)', fontWeight:700, fontSize:'0.85rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  userRole: { color:'var(--text-muted)', fontSize:'0.72rem' },
  logoutBtn: { background:'transparent', border:'none', cursor:'pointer', fontSize:'1rem', marginLeft:'auto', padding:'0.25rem', flexShrink:0 },

  /* Topbar */
  main: { flex:1, display:'flex', flexDirection:'column', minWidth:0 },
  topbar: {
    display:'flex', alignItems:'center', gap:'1rem',
    padding:'0 1.5rem', height:'60px', background:'var(--sidebar-bg)',
    borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100,
    boxShadow:'0 1px 3px rgba(0,0,0,0.06)',
  },
  hamburger: { background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', gap:'5px', padding:'4px' },
  hLine: { display:'block', width:'20px', height:'2px', background:'var(--text-muted)', borderRadius:'2px' },
  topbarTitle: { fontWeight:800, fontSize:'1rem', color:'var(--text-primary)', whiteSpace:'nowrap' },
  topbarRight: { marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.75rem' },
  flash: { padding:'0.45rem 0.875rem', borderRadius:'8px', fontWeight:600, fontSize:'0.82rem', whiteSpace:'nowrap' },

  page: { padding:'1.75rem', flex:1, overflowY:'auto' },

  /* Stats */
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'1.5rem' },
  statCard: {
    display:'flex', alignItems:'center', gap:'1rem',
    padding:'1.25rem', borderRadius:'14px', border:'2px solid',
    cursor:'pointer', transition:'all 200ms ease',
  },
  statIcon: { width:'44px', height:'44px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 },
  statVal: { fontSize:'1.8rem', fontWeight:900, lineHeight:1 },
  statLbl: { fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600, marginTop:'0.2rem' },

  /* Toolbar */
  toolbar: {
    display:'flex', alignItems:'center', flexWrap:'wrap', gap:'0.75rem',
    padding:'0.75rem 1rem', background:'var(--sidebar-bg)', borderRadius:'10px',
    border:'1px solid var(--border)', marginBottom:'1.25rem',
    boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
  },
  filterGroup: { display:'flex', alignItems:'center', gap:'0.4rem', flex:1, flexWrap:'wrap' },
  filterLbl: { color:'var(--text-muted)', fontWeight:700, fontSize:'0.82rem', marginRight:'0.15rem' },
  chip: {
    padding:'0.3rem 0.7rem', borderRadius:'6px', border:'1px solid var(--border)',
    background:'var(--chip-bg)', color:'var(--text-sub)', fontWeight:600, fontSize:'0.8rem',
    cursor:'pointer', transition:'all 120ms ease',
  },
  chipActive: { background:'var(--active-item-bg)', borderColor:'var(--accent)', color:'var(--accent)' },
  chipClear: {
    padding:'0.3rem 0.7rem', borderRadius:'6px', border:'1px solid #fecaca',
    background:'#fef2f2', color:'#dc2626', fontWeight:600, fontSize:'0.8rem', cursor:'pointer',
  },

  /* Table */
  tableCard: { background:'var(--card-bg)', borderRadius:'14px', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' },
  tableHeader: { padding:'1rem 1.25rem', borderBottom:'1px solid var(--border-light)', display:'flex', alignItems:'center', justifyContent:'space-between' },
  tableHeaderTitle: { fontWeight:800, color:'var(--text-primary)', fontSize:'0.9rem' },
  table: { width:'100%', borderCollapse:'collapse' },
  thead: { background:'var(--table-header-bg)', borderBottom:'2px solid var(--border-light)' },
  th: { padding:'0.75rem 1rem', color:'var(--text-muted)', fontWeight:700, fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.06em', textAlign:'left' },
  tr: { borderBottom:'1px solid var(--border-light)', transition:'background 120ms ease', background:'var(--card-bg)' },
  td: { padding:'0.875rem 1rem', color:'var(--text-sub)', fontSize:'0.875rem', verticalAlign:'middle' },
  tableFooter: { padding:'0.65rem 1.25rem', color:'var(--text-muted)', background:'var(--table-header-bg)', borderTop:'1px solid var(--border-light)' },
  badge: { display:'inline-block', padding:'0.2rem 0.55rem', borderRadius:'5px', fontSize:'0.73rem', fontWeight:700 },
  statusToggle: {
    display:'inline-flex', alignItems:'center', gap:'0.35rem',
    padding:'0.32rem 0.7rem', borderRadius:'6px', fontSize:'0.8rem',
    fontWeight:700, cursor:'pointer', transition:'all 120ms ease',
  },
  editBtn: { padding:'0.36rem 0.7rem', borderRadius:'6px', border:'1px solid #c7d2fe', background:'#eef2ff', color:'#4338ca', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' },
  delBtn:  { padding:'0.36rem 0.6rem', borderRadius:'6px', border:'1px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontSize:'0.85rem', fontWeight:700, cursor:'pointer' },

  /* Buttons */
  btnPrimary: {
    padding:'0.6rem 1.35rem', borderRadius:'8px', border:'none',
    background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
    color:'#fff', fontWeight:700, fontSize:'0.875rem', cursor:'pointer',
    boxShadow:'0 4px 12px rgba(79,70,229,0.3)', flexShrink:0,
  },
  btnSave: {
    flex:1, padding:'0.8rem 2rem', borderRadius:'10px', border:'none',
    background:'linear-gradient(135deg,#16a34a,#22c55e)',
    color:'#fff', fontWeight:700, fontSize:'0.95rem', cursor:'pointer',
    boxShadow:'0 4px 14px rgba(22,163,74,0.2)',
  },
  btnCancel: {
    flex:1, padding:'0.8rem 2rem', borderRadius:'10px',
    border:'1.5px solid var(--border)', background:'var(--card-bg)',
    color:'var(--text-sub)', fontWeight:700, fontSize:'0.95rem', cursor:'pointer',
  },

  /* Loading / Empty */
  loadBox:   { display:'flex', flexDirection:'column', alignItems:'center', padding:'5rem 0' },
  spinner:   { width:'40px', height:'40px', border:'4px solid var(--border)', borderTop:'4px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' },
  emptyState:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'5rem 2rem', background:'var(--card-bg)', borderRadius:'14px', border:'2px dashed var(--border)', textAlign:'center' },

  /* Form */
  formCard: { background:'var(--card-bg)', borderRadius:'16px', border:'1px solid var(--border)', overflow:'hidden', marginBottom:'2rem', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' },
  formHead: {
    display:'flex', alignItems:'center', gap:'1rem', padding:'1.5rem',
    background:'var(--form-head-bg)',
    borderBottom:'1px solid var(--border)',
  },
  formHeadIcon: { fontSize:'2rem', flexShrink:0 },
  formHeadTitle:{ color:'var(--text-primary)', fontSize:'1.3rem', fontWeight:800, margin:0 },
  formHeadSub:  { color:'var(--text-muted)', fontSize:'0.875rem', margin:'0.2rem 0 0' },
  formClose: {
    marginLeft:'auto', padding:'0.4rem 0.875rem', borderRadius:'8px',
    border:'1.5px solid var(--border)', background:'var(--card-bg)', color:'var(--text-sub)',
    fontWeight:700, fontSize:'0.85rem', cursor:'pointer', flexShrink:0,
  },
  errBanner: {
    background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'8px',
    padding:'0.75rem 1rem', color:'#dc2626', fontWeight:600, fontSize:'0.875rem',
    margin:'0 1.5rem 0',
  },
  formTabsBar: { display:'flex', gap:'4px', padding:'0.75rem 1rem', borderBottom:'2px solid var(--border-light)', background:'var(--form-tab-bg)', flexWrap:'wrap' },
  fTab: {
    padding:'0.5rem 1rem', borderRadius:'7px', border:'none',
    background:'transparent', color:'var(--text-muted)', fontWeight:600,
    fontSize:'0.875rem', cursor:'pointer', transition:'all 150ms ease',
  },
  fTabActive: { background:'var(--active-item-bg)', color:'var(--accent)', fontWeight:700 },
  formBody: { padding:'1.5rem' },
  formActions: { display:'flex', gap:'1rem', paddingTop:'1.5rem', marginTop:'1.5rem', borderTop:'2px solid var(--border-light)' },
  lbl: { display:'block', marginBottom:'0.35rem', fontWeight:700, color:'var(--text-sub)', fontSize:'0.82rem' },
  govtToggle: { display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem', background:'var(--govt-toggle-bg)', borderRadius:'10px', border:'1px solid var(--border)' },
  prefillTag: { fontSize:'0.7rem', background:'#eef2ff', color:'#4338ca', padding:'0.15rem 0.45rem', borderRadius:'4px', fontWeight:700, marginLeft:'0.4rem' },

  /* Settings */
  settingsCard: { background:'var(--card-bg)', borderRadius:'14px', border:'1px solid var(--border)', padding:'1.75rem', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' },
};
