import React, { useState, useEffect } from 'react';
import api from '../../../api/index.js';

export default function PrepCompanyManager() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState({ msg:'', type:'success' });
  const [modal, setModal]         = useState(null);
  const [formVal, setFormVal]     = useState('');
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');

  /* ── Load ──────────────────────────────────────────────── */
  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/preparation/admin/companies');
      if (r.data?.success) setCompanies(r.data.companies || []);
    } catch { showToast('Failed to load companies','error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  /* ── Toast ─────────────────────────────────────────────── */
  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'success' }), 3500);
  };

  /* ── Modal helpers ──────────────────────────────────────── */
  const openCreate = ()  => { setFormVal(''); setModal({ mode:'create', company:null }); };
  const openEdit   = (c) => { setFormVal(c.name); setModal({ mode:'edit', company:c }); };
  const closeModal = ()  => { setModal(null); setFormVal(''); };

  /* ── Save ───────────────────────────────────────────────── */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formVal.trim()) return;
    setSaving(true);
    try {
      if (modal.mode === 'edit') {
        const r = await api.put(`/preparation/admin/companies/${modal.company._id}`, { name:formVal.trim() });
        if (r.data?.success) { setCompanies(p=>p.map(c=>c._id===modal.company._id?r.data.company:c)); showToast(`Updated to "${formVal.trim()}"`); }
      } else {
        const order = companies.length ? Math.max(...companies.map(c=>c.order))+1 : 1;
        const r = await api.post('/preparation/admin/companies', { name:formVal.trim(), order, status:'active' });
        if (r.data?.success) { setCompanies(p=>[...p,r.data.company].sort((a,b)=>a.order-b.order)); showToast(`"${formVal.trim()}" added`); }
      }
      closeModal();
    } catch (err) { showToast(err.response?.data?.message||'Save failed','error'); }
    finally { setSaving(false); }
  };

  /* ── Delete ─────────────────────────────────────────────── */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? Cannot be undone.`)) return;
    try {
      const r = await api.delete(`/preparation/admin/companies/${id}`);
      if (r.data?.success) { setCompanies(p=>p.filter(c=>c._id!==id)); showToast('Deleted'); }
    } catch { showToast('Delete failed','error'); }
  };

  /* ── Toggle ─────────────────────────────────────────────── */
  const handleToggle = async (comp) => {
    const next = comp.status==='active'?'inactive':'active';
    try {
      const r = await api.put(`/preparation/admin/companies/${comp._id}`, { status:next });
      if (r.data?.success) { setCompanies(p=>p.map(c=>c._id===comp._id?r.data.company:c)); showToast(`Status → ${next}`); }
    } catch { showToast('Toggle failed','error'); }
  };

  /* ── Reorder ─────────────────────────────────────────────── */
  const handleReorder = async (idx, dir) => {
    const swp = dir==='up'?idx-1:idx+1;
    if (swp<0||swp>=companies.length) return;
    try {
      const tmp = companies[idx].order;
      companies[idx].order = companies[swp].order;
      companies[swp].order = tmp;
      await api.put(`/preparation/admin/companies/${companies[idx]._id}`, { order:companies[idx].order });
      await api.put(`/preparation/admin/companies/${companies[swp]._id}`, { order:companies[swp].order });
      load(); showToast('Reordered');
    } catch { showToast('Reorder failed','error'); }
  };

  /* ── Filtered list ──────────────────────────────────────── */
  const filtered     = companies.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  const activeCount  = companies.filter(c=>c.status==='active').length;
  const inactCount   = companies.length - activeCount;

  /* ── Avatar colors ──────────────────────────────────────── */
  const AVATAR_COLORS = ['#4f46e5','#9333ea','#ea580c','#ca8a04','#16a34a','#2563eb','#e11d48','#0891b2'];
  const avatarColor   = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  /* ── RENDER ─────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'4rem 0' }}>
      <div style={{ width:'40px', height:'40px', border:'4px solid #e5e7eb', borderTop:'4px solid #4f46e5', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'#6b7280', marginTop:'1rem', fontWeight:600 }}>Loading companies…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* Toast */}
      {toast.msg && (
        <div style={{ position:'fixed', top:'1rem', right:'1rem', zIndex:3000, padding:'0.65rem 1.2rem', borderRadius:'10px', fontWeight:600, fontSize:'0.875rem', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', ...(toast.type==='error' ? { background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca' } : { background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }) }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h2 style={{ fontSize:'1.2rem', fontWeight:800, color:'#111827', margin:0 }}>🏢 Company Mappings</h2>
          <p style={{ color:'#6b7280', fontSize:'0.85rem', margin:'0.25rem 0 0' }}>Manage recruiter filters and company names</p>
        </div>
        <button onClick={openCreate} style={{ padding:'0.6rem 1.25rem', borderRadius:'8px', border:'none', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(79,70,229,0.25)', flexShrink:0 }}>
          + Add Company
        </button>
      </div>

      {/* Stat chips */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {[
          { label:'Total',    value:companies.length, color:'#4f46e5', bg:'#eef2ff', border:'#c7d2fe', icon:'🏢' },
          { label:'Active',   value:activeCount,      color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', icon:'✅' },
          { label:'Inactive', value:inactCount,       color:'#6b7280', bg:'#f9fafb', border:'#e5e7eb', icon:'⏸️' },
        ].map(s=>(
          <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem 1rem', borderRadius:'10px', border:`1.5px solid ${s.border}`, background:s.bg }}>
            <span>{s.icon}</span>
            <span style={{ fontWeight:900, fontSize:'1.2rem', color:s.color }}>{s.value}</span>
            <span style={{ fontSize:'0.82rem', fontWeight:600, color:s.color }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:'1rem' }}>
        <span style={{ position:'absolute', left:'0.875rem', top:'50%', transform:'translateY(-50%)', fontSize:'0.9rem', pointerEvents:'none', color:'#9ca3af' }}>🔍</span>
        <input
          type="text"
          placeholder="Search companies…"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:'8px', padding:'0.6rem 2.5rem 0.6rem 2.5rem', fontSize:'0.9rem', outline:'none', color:'#111827', background:'#fff', fontFamily:'inherit' }}
          onFocus={e=>e.target.style.borderColor='#4f46e5'}
          onBlur={e=>e.target.style.borderColor='#e5e7eb'}
        />
        {search && (
          <button onClick={()=>setSearch('')} style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:'1rem', lineHeight:1 }}>✕</button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length===0 && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'3.5rem 2rem', background:'#fff', borderRadius:'14px', border:'2px dashed #e5e7eb', textAlign:'center' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>{search?'🔍':'🏢'}</div>
          <p style={{ color:'#6b7280', fontWeight:600 }}>
            {search ? `No companies matching "${search}"` : 'No companies yet. Click "Add Company".'}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ background:'#fff', borderRadius:'14px', border:'1px solid #e5e7eb', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f9fafb', borderBottom:'2px solid #f3f4f6' }}>
                <th style={TH}>#</th>
                <th style={TH}>Company</th>
                <th style={{ ...TH, textAlign:'center' }}>Status</th>
                <th style={{ ...TH, textAlign:'center', width:'80px' }}>Order</th>
                <th style={{ ...TH, textAlign:'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((comp, idx) => {
                const ac = avatarColor(comp.name);
                const realIdx = companies.findIndex(c=>c._id===comp._id);
                return (
                  <tr key={comp._id} style={{ borderBottom:'1px solid var(--border-light, #f9fafb)', background:'var(--card-bg, #fff)', transition:'background 120ms ease' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--table-row-hover, #fafafa)'}
                    onMouseLeave={e=>e.currentTarget.style.background='var(--card-bg, #fff)'}>
                    <td style={TD}>
                      <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'26px', height:'26px', borderRadius:'6px', background:'#eef2ff', color:'#4f46e5', fontSize:'0.75rem', fontWeight:800 }}>{idx+1}</span>
                    </td>
                    <td style={TD}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                        <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:`${ac}18`, border:`1.5px solid ${ac}30`, display:'flex', alignItems:'center', justifyContent:'center', color:ac, fontWeight:800, fontSize:'0.8rem', flexShrink:0 }}>
                          {comp.name.slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, color:'#111827', fontSize:'0.9rem' }}>{comp.name}</div>
                          <div style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Position #{comp.order}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...TD, textAlign:'center' }}>
                      <button onClick={()=>handleToggle(comp)}
                        style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.28rem 0.65rem', borderRadius:'6px', border:'1px solid', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', transition:'all 120ms ease',
                          ...(comp.status==='active' ? { background:'#f0fdf4', color:'#16a34a', borderColor:'#bbf7d0' } : { background:'#f9fafb', color:'#9ca3af', borderColor:'#e5e7eb' }) }}
                        title="Click to toggle status">
                        {comp.status==='active'?'● Active':'○ Inactive'}
                      </button>
                    </td>
                    <td style={{ ...TD, textAlign:'center' }}>
                      <div style={{ display:'flex', justifyContent:'center', gap:'3px' }}>
                        <button onClick={()=>handleReorder(realIdx,'up')} disabled={realIdx===0}
                          style={{ padding:'0.22rem 0.45rem', borderRadius:'5px', border:'1px solid #e5e7eb', background:'#fff', color:'#6b7280', fontSize:'0.8rem', cursor:'pointer', opacity:realIdx===0?0.35:1 }}>↑</button>
                        <button onClick={()=>handleReorder(realIdx,'down')} disabled={realIdx===companies.length-1}
                          style={{ padding:'0.22rem 0.45rem', borderRadius:'5px', border:'1px solid #e5e7eb', background:'#fff', color:'#6b7280', fontSize:'0.8rem', cursor:'pointer', opacity:realIdx===companies.length-1?0.35:1 }}>↓</button>
                      </div>
                    </td>
                    <td style={{ ...TD, textAlign:'right' }}>
                      <div style={{ display:'flex', gap:'0.4rem', justifyContent:'flex-end' }}>
                        <button onClick={()=>openEdit(comp)}
                          style={{ padding:'0.34rem 0.7rem', borderRadius:'6px', border:'1px solid #c7d2fe', background:'#eef2ff', color:'#4338ca', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>✏️ Edit</button>
                        <button onClick={()=>handleDelete(comp._id,comp.name)}
                          style={{ padding:'0.34rem 0.6rem', borderRadius:'6px', border:'1px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontSize:'0.85rem', fontWeight:700, cursor:'pointer' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding:'0.65rem 1.25rem', color:'#9ca3af', fontSize:'0.8rem', background:'#f9fafb', borderTop:'1px solid #f3f4f6' }}>
            Showing {filtered.length} of {companies.length} companies
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.45)', backdropFilter:'blur(4px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={closeModal}>
          <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e5e7eb', width:'440px', maxWidth:'95vw', boxShadow:'0 20px 60px rgba(0,0,0,0.18)', overflow:'hidden', animation:'slideUp 200ms ease' }}
            onClick={e=>e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'1.25rem', background:'linear-gradient(135deg,#eef2ff,#f5f3ff)', borderBottom:'1px solid #e5e7eb' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', flexShrink:0 }}>
                {modal.mode==='edit'?'✏️':'🏢'}
              </div>
              <div style={{flex:1}}>
                <h3 style={{ margin:0, color:'#111827', fontWeight:800, fontSize:'1.05rem' }}>
                  {modal.mode==='edit'?'Edit Company':'Add Company'}
                </h3>
                <p style={{ margin:'0.2rem 0 0', color:'#6b7280', fontSize:'0.82rem' }}>Manage recruitment company mapping</p>
              </div>
              <button onClick={closeModal} style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'7px', color:'#6b7280', cursor:'pointer', padding:'0.32rem 0.6rem', fontSize:'0.9rem', fontWeight:700 }}>✕</button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSave} style={{ padding:'1.25rem' }}>
              <label style={{ display:'block', marginBottom:'0.4rem', fontWeight:700, color:'#374151', fontSize:'0.82rem' }}>
                COMPANY / RECRUITER NAME
              </label>
              <input
                type="text" autoFocus required
                value={formVal}
                onChange={e=>setFormVal(e.target.value)}
                placeholder="e.g. TCS NQT, Wipro Elite, Accenture…"
                style={{ width:'100%', border:'1.5px solid #d1d5db', borderRadius:'8px', padding:'0.65rem 0.875rem', fontSize:'0.9rem', outline:'none', color:'#111827', fontFamily:'inherit', transition:'border-color 150ms ease' }}
                onFocus={e=>e.target.style.borderColor='#4f46e5'}
                onBlur={e=>e.target.style.borderColor='#d1d5db'}
              />
              <p style={{ color:'#9ca3af', fontSize:'0.8rem', marginTop:'0.4rem' }}>
                This will appear as a filter option for students on the preparation page.
              </p>
              <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.25rem' }}>
                <button type="button" onClick={closeModal}
                  style={{ flex:1, padding:'0.7rem', borderRadius:'8px', border:'1.5px solid #e5e7eb', background:'#fff', color:'#6b7280', fontWeight:700, fontSize:'0.9rem', cursor:'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ flex:2, padding:'0.7rem', borderRadius:'8px', border:'none', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(79,70,229,0.25)' }}>
                  {saving ? '⏳ Saving…' : modal.mode==='edit' ? '💾 Save Changes' : '+ Add Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}

const TH = { padding:'0.75rem 1rem', color:'#6b7280', fontWeight:700, fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.06em', textAlign:'left' };
const TD = { padding:'0.875rem 1rem', color:'#374151', fontSize:'0.875rem', verticalAlign:'middle' };
