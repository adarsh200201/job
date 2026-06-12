import React, { useEffect, useState } from 'react';
import api from '../../../api/index.js';

export default function PrepReportsManager() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/preparation/admin/reports');
      if (res.data.success) {
        setReports(res.data.reports || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/preparation/admin/reports/${id}`, { status: newStatus });
      if (res.data.success) {
        setReports(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reports.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = 
      (r.questionText || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.comment || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.topic || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>⚠️ Question Reports</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Manage and resolve student reports on prep questions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--input-bg)',
              color: 'var(--input-text)',
              fontSize: '0.8rem',
              outline: 'none',
              width: '180px'
            }}
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--input-bg)',
              color: 'var(--input-text)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Ignored">Ignored</option>
          </select>
          <button 
            type="button"
            onClick={loadReports} 
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          Loading reports...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
          📭 No reports found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--table-header-bg)' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Question / Details</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Topic & Category</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Student Comment</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr 
                  key={r._id} 
                  style={{ 
                    borderBottom: '1px solid var(--border)', 
                    background: r.status === 'Pending' ? 'rgba(239, 68, 68, 0.03)' : 'transparent' 
                  }}
                >
                  <td style={{ padding: '12px 16px', fontSize: '0.82rem', maxWidth: '300px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {r.questionText ? (r.questionText.length > 80 ? r.questionText.slice(0, 80) + '...' : r.questionText) : 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      ID: {r.questionId}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.topic || 'N/A'}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.category || 'N/A'}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.82rem' }}>
                    <span 
                      style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.72rem', 
                        fontWeight: 600,
                        background: r.type === 'Wrong Answer' ? '#fef2f2' : '#fffbeb',
                        color: r.type === 'Wrong Answer' ? '#ef4444' : '#d97706',
                        border: `1px solid ${r.type === 'Wrong Answer' ? '#fca5a5' : '#fcd34d'}`
                      }}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-sub)', maxWidth: '200px', wordWrap: 'break-word' }}>
                    {r.comment}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.82rem' }}>
                    <span 
                      style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.72rem', 
                        fontWeight: 700,
                        background: r.status === 'Pending' ? '#fef3c7' : r.status === 'Resolved' ? '#dcfce7' : '#f3f4f6',
                        color: r.status === 'Pending' ? '#d97706' : r.status === 'Resolved' ? '#15803d' : '#4b5563'
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.82rem', textAlign: 'right' }}>
                    <select
                      value={r.status}
                      onChange={e => handleUpdateStatus(r._id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Ignored">Ignored</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
