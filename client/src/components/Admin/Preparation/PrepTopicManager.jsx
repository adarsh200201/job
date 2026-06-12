import React, { useState, useEffect } from 'react';
import api from '../../../api/index.js';

/* ─── Color palette for categories ────────────────────────────────── */
const PALETTE = [
  { bg:'#eef2ff', accent:'#4f46e5', light:'#c7d2fe' },
  { bg:'#fdf4ff', accent:'#9333ea', light:'#e9d5ff' },
  { bg:'#fff7ed', accent:'#ea580c', light:'#fed7aa' },
  { bg:'#fef9c3', accent:'#ca8a04', light:'#fde68a' },
  { bg:'#f0fdf4', accent:'#16a34a', light:'#bbf7d0' },
  { bg:'#eff6ff', accent:'#2563eb', light:'#bfdbfe' },
  { bg:'#fff1f2', accent:'#e11d48', light:'#fecdd3' },
  { bg:'#ecfeff', accent:'#0891b2', light:'#a5f3fc' },
];
const getPalette = (idx, darkMode) => {
  const item = PALETTE[idx % PALETTE.length];
  if (darkMode) {
    return {
      bg: `${item.accent}24`,
      accent: item.accent,
      light: `${item.accent}40`
    };
  }
  return item;
};

/* ─── Inline input form ────────────────────────────────────────────── */
function InlineForm({ placeholder = 'Enter name…', initial = '', onSave, onCancel, accentColor = '#4f46e5' }) {
  const [val, setVal] = useState(initial);
  const submit = (e) => { e.preventDefault(); if (val.trim()) onSave(val.trim()); };
  return (
    <form onSubmit={submit} style={{ display:'flex', gap:'0.4rem', alignItems:'center', flex:1 }} onClick={e => e.stopPropagation()}>
      <input
        autoFocus value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        required
        style={{ flex:1, border:`1.5px solid ${accentColor}`, borderRadius:'6px', padding:'0.32rem 0.6rem', fontSize:'0.875rem', outline:'none', color:'var(--text-primary, #111827)', minWidth:0, background:'var(--input-bg, #fff)' }}
      />
      <button type="submit" style={{ padding:'0.32rem 0.75rem', borderRadius:'6px', border:'none', background:accentColor, color:'#fff', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', flexShrink:0 }}>Save</button>
      <button type="button" onClick={(e)=>{ e.stopPropagation(); onCancel(); }} style={{ padding:'0.32rem 0.6rem', borderRadius:'6px', border:'1.5px solid var(--border, #e5e7eb)', background:'var(--card-bg, #fff)', color:'var(--text-muted, #6b7280)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', flexShrink:0 }}>✕</button>
    </form>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function PrepTopicManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState({ msg:'', type:'success' });
  const darkMode = localStorage.getItem('adminTheme') === 'dark';

  const [expandedCats, setExpandedCats] = useState(new Set());
  const [expandedSubs, setExpandedSubs] = useState(new Set());
  const [addingNode,   setAddingNode]   = useState(null);
  const [editingNode,  setEditingNode]  = useState(null);

  /* ── Load ──────────────────────────────────────────────────── */
  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/preparation/admin/categories-tree');
      if (r.data?.success) setCategories(r.data.categories || []);
    } catch { showToast('Failed to load categories', 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  /* ── Toast ─────────────────────────────────────────────────── */
  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'success' }), 3500);
  };

  /* ── Expand ─────────────────────────────────────────────────── */
  const toggleCat = (id)  => setExpandedCats(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleSub = (key) => setExpandedSubs(s => { const n=new Set(s); n.has(key)?n.delete(key):n.add(key); return n; });

  /* ── ADD ────────────────────────────────────────────────────── */
  const handleAdd = async (name) => {
    try {
      if (addingNode.type === 'cat') {
        const order = categories.length ? Math.max(...categories.map(c=>c.order))+1 : 1;
        const r = await api.post('/preparation/admin/categories', { name, order, status:'active', subCategories:[] });
        if (r.data?.success) { setCategories(p=>[...p,r.data.category].sort((a,b)=>a.order-b.order)); showToast(`Category "${name}" created`); }
      } else if (addingNode.type === 'sub') {
        const cat = categories.find(c=>c._id===addingNode.catId); if (!cat) return;
        const order = cat.subCategories.length ? Math.max(...cat.subCategories.map(s=>s.order))+1 : 1;
        const subs = [...cat.subCategories, { name, order, status:'active', topics:[] }].sort((a,b)=>a.order-b.order);
        const r = await api.put(`/preparation/admin/categories/${cat._id}`, { subCategories:subs });
        if (r.data?.success) { setCategories(p=>p.map(c=>c._id===cat._id?r.data.category:c)); setExpandedCats(s=>new Set([...s,cat._id])); showToast(`Sub-category "${name}" added`); }
      } else {
        const cat = categories.find(c=>c._id===addingNode.catId); if (!cat) return;
        const sub = cat.subCategories[addingNode.subIdx]; if (!sub) return;
        const order = sub.topics.length ? Math.max(...sub.topics.map(t=>t.order))+1 : 1;
        const topics = [...sub.topics, { name, order, status:'active' }].sort((a,b)=>a.order-b.order);
        const subs = cat.subCategories.map((s,i)=>i===addingNode.subIdx?{...s,topics}:s);
        const r = await api.put(`/preparation/admin/categories/${cat._id}`, { subCategories:subs });
        if (r.data?.success) {
          setCategories(p=>p.map(c=>c._id===cat._id?r.data.category:c));
          setExpandedSubs(s=>new Set([...s,`${cat._id}-${sub.name}`]));
          showToast(`Topic "${name}" added`);
        }
      }
    } catch (e) { showToast(e.response?.data?.message||'Failed', 'error'); }
    finally { setAddingNode(null); }
  };

  /* ── RENAME ─────────────────────────────────────────────────── */
  const handleRename = async (name) => {
    try {
      const { type, catId, subIdx, topicIdx } = editingNode;
      const cat = categories.find(c=>c._id===catId); if (!cat) return;
      if (type==='cat') {
        const r = await api.put(`/preparation/admin/categories/${cat._id}`, { name });
        if (r.data?.success) { setCategories(p=>p.map(c=>c._id===cat._id?r.data.category:c)); showToast('Renamed'); }
      } else if (type==='sub') {
        const subs = cat.subCategories.map((s,i)=>i===subIdx?{...s,name}:s);
        const r = await api.put(`/preparation/admin/categories/${cat._id}`, { subCategories:subs });
        if (r.data?.success) { setCategories(p=>p.map(c=>c._id===cat._id?r.data.category:c)); showToast('Renamed'); }
      } else {
        const sub = cat.subCategories[subIdx];
        const topics = sub.topics.map((t,i)=>i===topicIdx?{...t,name}:t);
        const subs = cat.subCategories.map((s,i)=>i===subIdx?{...s,topics}:s);
        const r = await api.put(`/preparation/admin/categories/${cat._id}`, { subCategories:subs });
        if (r.data?.success) { setCategories(p=>p.map(c=>c._id===cat._id?r.data.category:c)); showToast('Renamed'); }
      }
    } catch (e) { showToast(e.response?.data?.message||'Rename failed', 'error'); }
    finally { setEditingNode(null); }
  };

  /* ── DELETE ─────────────────────────────────────────────────── */
  const handleDelete = async (type, catId, subIdx=null, topicIdx=null) => {
    const label = type==='cat'?'category':type==='sub'?'sub-category':'topic';
    if (!window.confirm(`Delete this ${label}? Cannot be undone.`)) return;
    try {
      const cat = categories.find(c=>c._id===catId); if (!cat) return;
      if (type==='cat') {
        const r = await api.delete(`/preparation/admin/categories/${catId}`);
        if (r.data?.success) { setCategories(p=>p.filter(c=>c._id!==catId)); showToast('Deleted'); }
      } else if (type==='sub') {
        const subs = cat.subCategories.filter((_,i)=>i!==subIdx);
        const r = await api.put(`/preparation/admin/categories/${catId}`, { subCategories:subs });
        if (r.data?.success) { setCategories(p=>p.map(c=>c._id===catId?r.data.category:c)); showToast('Deleted'); }
      } else {
        const sub = cat.subCategories[subIdx];
        const topics = sub.topics.filter((_,i)=>i!==topicIdx);
        const subs = cat.subCategories.map((s,i)=>i===subIdx?{...s,topics}:s);
        const r = await api.put(`/preparation/admin/categories/${catId}`, { subCategories:subs });
        if (r.data?.success) { setCategories(p=>p.map(c=>c._id===catId?r.data.category:c)); showToast('Deleted'); }
      }
    } catch (e) { showToast(e.response?.data?.message||'Delete failed', 'error'); }
  };

  /* ── TOGGLE STATUS ──────────────────────────────────────────── */
  const handleToggle = async (type, catId, subIdx=null, topicIdx=null, current) => {
    const next = current==='active'?'inactive':'active';
    try {
      const cat = categories.find(c=>c._id===catId); if (!cat) return;
      if (type==='cat') {
        const r = await api.put(`/preparation/admin/categories/${catId}`, { status:next });
        if (r.data?.success) setCategories(p=>p.map(c=>c._id===catId?r.data.category:c));
      } else if (type==='sub') {
        const subs = cat.subCategories.map((s,i)=>i===subIdx?{...s,status:next}:s);
        const r = await api.put(`/preparation/admin/categories/${catId}`, { subCategories:subs });
        if (r.data?.success) setCategories(p=>p.map(c=>c._id===catId?r.data.category:c));
      } else {
        const sub = cat.subCategories[subIdx];
        const topics = sub.topics.map((t,i)=>i===topicIdx?{...t,status:next}:t);
        const subs = cat.subCategories.map((s,i)=>i===subIdx?{...s,topics}:s);
        const r = await api.put(`/preparation/admin/categories/${catId}`, { subCategories:subs });
        if (r.data?.success) setCategories(p=>p.map(c=>c._id===catId?r.data.category:c));
      }
      showToast(`Status → ${next}`);
    } catch { showToast('Toggle failed','error'); }
  };

  /* ── REORDER ────────────────────────────────────────────────── */
  const handleReorder = async (type, catId, dir, subIdx=null, topicIdx=null) => {
    try {
      const cat = categories.find(c=>c._id===catId); if (!cat) return;
      if (type==='cat') {
        const idx = categories.findIndex(c=>c._id===catId);
        const swp = dir==='up'?idx-1:idx+1;
        if (swp<0||swp>=categories.length) return;
        const tmp = categories[idx].order; categories[idx].order=categories[swp].order; categories[swp].order=tmp;
        await api.put(`/preparation/admin/categories/${categories[idx]._id}`, { order:categories[idx].order });
        await api.put(`/preparation/admin/categories/${categories[swp]._id}`, { order:categories[swp].order });
        load(); showToast('Reordered');
      } else if (type==='sub') {
        const subs=[...cat.subCategories]; const swp=dir==='up'?subIdx-1:subIdx+1;
        if (swp<0||swp>=subs.length) return;
        const tmp=subs[subIdx].order; subs[subIdx].order=subs[swp].order; subs[swp].order=tmp;
        subs.sort((a,b)=>a.order-b.order);
        const r = await api.put(`/preparation/admin/categories/${catId}`, { subCategories:subs });
        if (r.data?.success) { setCategories(p=>p.map(c=>c._id===catId?r.data.category:c)); showToast('Reordered'); }
      } else {
        const sub=cat.subCategories[subIdx]; const topics=[...sub.topics]; const swp=dir==='up'?topicIdx-1:topicIdx+1;
        if (swp<0||swp>=topics.length) return;
        const tmp=topics[topicIdx].order; topics[topicIdx].order=topics[swp].order; topics[swp].order=tmp;
        topics.sort((a,b)=>a.order-b.order);
        const subs=cat.subCategories.map((s,i)=>i===subIdx?{...s,topics}:s);
        const r = await api.put(`/preparation/admin/categories/${catId}`, { subCategories:subs });
        if (r.data?.success) { setCategories(p=>p.map(c=>c._id===catId?r.data.category:c)); showToast('Reordered'); }
      }
    } catch { showToast('Reorder failed','error'); }
  };

  /* ── RENDER ─────────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'4rem 0' }}>
      <div style={{ width:'40px', height:'40px', border:'4px solid #e5e7eb', borderTop:'4px solid #4f46e5', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'#6b7280', marginTop:'1rem', fontWeight:600 }}>Loading topic tree…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  const totalTopics = categories.reduce((a,c)=>a+c.subCategories.reduce((b,s)=>b+(s.topics?.length||0),0),0);

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      {/* Toast */}
      {toast.msg && (
        <div style={{ position:'fixed', top:'1rem', right:'1rem', zIndex:3000, padding:'0.65rem 1.2rem', borderRadius:'10px', fontWeight:600, fontSize:'0.875rem', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', ...(toast.type==='error' ? { background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca' } : { background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }) }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h2 style={{ fontSize:'1.2rem', fontWeight:800, color:'#111827', margin:0 }}>🌲 Topic Management System</h2>
          <p style={{ color:'#6b7280', fontSize:'0.85rem', margin:'0.25rem 0 0' }}>
            {categories.length} categories · {totalTopics} topics total
          </p>
        </div>
        <button onClick={() => setAddingNode({ type:'cat' })} style={{ padding:'0.6rem 1.25rem', borderRadius:'8px', border:'none', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(79,70,229,0.25)' }}>
          + Add Category
        </button>
      </div>

      {/* Inline add category */}
      {addingNode?.type==='cat' && (
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 1rem', background:'#eef2ff', borderRadius:'10px', border:'2px dashed #c7d2fe', marginBottom:'1rem' }}>
          <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#4f46e5', flexShrink:0 }}>New Category:</span>
          <InlineForm placeholder="Category name…" onSave={handleAdd} onCancel={()=>setAddingNode(null)} accentColor="#4f46e5" />
        </div>
      )}

      {/* Empty */}
      {categories.length===0 && !addingNode && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'4rem 2rem', background:'#fff', borderRadius:'14px', border:'2px dashed #e5e7eb', textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>🌱</div>
          <p style={{ color:'#6b7280', fontWeight:600, fontSize:'0.95rem' }}>No categories yet. Click "Add Category" to get started.</p>
        </div>
      )}

      {/* Category list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
        {categories.map((cat, catIdx) => {
          const pal    = getPalette(catIdx, darkMode);
          const isOpen = expandedCats.has(cat._id);
          const isEditCat = editingNode?.type==='cat' && editingNode?.catId===cat._id;
          const totalTopicsInCat = cat.subCategories.reduce((a,s)=>a+(s.topics?.length||0),0);

          return (
            <div key={cat._id} style={{ background:'var(--card-bg, #fff)', borderRadius:'12px', border:'1px solid var(--border, #e5e7eb)', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', borderLeft:`4px solid ${pal.accent}` }}>

              {/* Category header */}
              <div
                style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.875rem 1rem', cursor:'pointer', background: isOpen ? pal.bg : 'var(--card-bg, #fff)', transition:'background 150ms ease' }}
                onClick={() => !isEditCat && toggleCat(cat._id)}
              >
                {/* Chevron */}
                <span style={{ color:pal.accent, fontSize:'1.1rem', fontWeight:900, transition:'transform 200ms ease', transform:isOpen?'rotate(90deg)':'none', userSelect:'none', flexShrink:0 }}>›</span>

                {/* Category color dot */}
                <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:pal.accent, flexShrink:0 }} />

                {/* Name or edit form */}
                {isEditCat ? (
                  <InlineForm initial={cat.name} onSave={handleRename} onCancel={()=>setEditingNode(null)} accentColor={pal.accent} />
                ) : (
                  <>
                    <span style={{ fontWeight:800, color:'var(--text-primary, #111827)', fontSize:'0.95rem', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cat.name}</span>
                    <span style={{ padding:'0.18rem 0.5rem', borderRadius:'4px', fontSize:'0.7rem', fontWeight:700, background: cat.status==='active'?'#f0fdf4':'#f9fafb', color: cat.status==='active'?'#16a34a':'#9ca3af', border:`1px solid ${cat.status==='active'?'#bbf7d0':'#e5e7eb'}`, flexShrink:0 }}>
                      {cat.status==='active'?'Active':'Inactive'}
                    </span>
                    <span style={{ color:'#9ca3af', fontSize:'0.78rem', whiteSpace:'nowrap', flexShrink:0 }}>{cat.subCategories?.length||0} subs · {totalTopicsInCat} topics</span>
                  </>
                )}

                {/* Actions */}
                {!isEditCat && (
                  <div style={{ display:'flex', gap:'4px', flexShrink:0, flexWrap:'wrap' }} onClick={e=>e.stopPropagation()}>
                    <ActionBtn onClick={()=>handleReorder('cat',cat._id,'up')}>↑</ActionBtn>
                    <ActionBtn onClick={()=>handleReorder('cat',cat._id,'down')}>↓</ActionBtn>
                    <ActionBtn color={pal.accent} lightBg={pal.bg} onClick={()=>setEditingNode({type:'cat',catId:cat._id})}>Rename</ActionBtn>
                    <ActionBtn color="#16a34a" lightBg="#f0fdf4" onClick={()=>{setAddingNode({type:'sub',catId:cat._id});setExpandedCats(s=>new Set([...s,cat._id]));}}> + Sub</ActionBtn>
                    <ActionBtn color={cat.status==='active'?'#d97706':'#16a34a'} lightBg={cat.status==='active'?'#fffbeb':'#f0fdf4'} onClick={()=>handleToggle('cat',cat._id,null,null,cat.status)}>{cat.status==='active'?'Disable':'Enable'}</ActionBtn>
                    <ActionBtn color="#dc2626" lightBg="#fef2f2" onClick={()=>handleDelete('cat',cat._id)}>Delete</ActionBtn>
                  </div>
                )}
              </div>

              {/* Sub-categories body */}
              {isOpen && (
                <div style={{ padding:'0.75rem 1rem', background:'var(--table-header-bg, #fafafa)', borderTop:'1px solid var(--border-light, #f3f4f6)', display:'flex', flexDirection:'column', gap:'0.5rem' }}>

                  {/* Inline add sub */}
                  {addingNode?.type==='sub' && addingNode?.catId===cat._id && (
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.6rem 0.875rem', background:pal.bg, borderRadius:'8px', border:`2px dashed ${pal.light}` }}>
                      <span style={{ fontSize:'0.8rem', fontWeight:700, color:pal.accent, flexShrink:0 }}>New Sub:</span>
                      <InlineForm placeholder="Sub-category name…" onSave={handleAdd} onCancel={()=>setAddingNode(null)} accentColor={pal.accent} />
                    </div>
                  )}

                  {cat.subCategories.length===0 && !(addingNode?.catId===cat._id) && (
                    <p style={{ color:'var(--text-muted, #9ca3af)', fontSize:'0.82rem', fontStyle:'italic', margin:'0.25rem 0' }}>No sub-categories yet. Click "+ Sub" to create one.</p>
                  )}

                  {cat.subCategories.map((sub, subIdx) => {
                    const subKey  = `${cat._id}-${sub.name}`;
                    const isSubOpen = expandedSubs.has(subKey);
                    const isEditSub = editingNode?.type==='sub' && editingNode?.catId===cat._id && editingNode?.subIdx===subIdx;

                    return (
                      <div key={subIdx} style={{ background:'var(--card-bg, #fff)', borderRadius:'9px', border:'1px solid var(--border, #e5e7eb)', overflow:'hidden' }}>

                        {/* Sub header */}
                        <div
                          style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.65rem 0.875rem', cursor:'pointer', transition:'background 120ms ease' }}
                          onClick={() => !isEditSub && toggleSub(subKey)}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--table-row-hover, #f9fafb)'}
                          onMouseLeave={e=>e.currentTarget.style.background=''}
                        >
                          <span style={{ color:'var(--text-muted, #9ca3af)', fontSize:'1rem', fontWeight:900, transition:'transform 150ms ease', transform:isSubOpen?'rotate(90deg)':'none', flexShrink:0 }}>›</span>
                          <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:pal.accent, opacity:0.55, flexShrink:0 }} />

                          {isEditSub ? (
                            <InlineForm initial={sub.name} onSave={handleRename} onCancel={()=>setEditingNode(null)} accentColor={pal.accent} />
                          ) : (
                            <>
                              <span style={{ fontWeight:700, color:'var(--text-sub, #374151)', fontSize:'0.875rem', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sub.name}</span>
                              <span style={{ padding:'0.12rem 0.4rem', borderRadius:'4px', fontSize:'0.67rem', fontWeight:700, background: sub.status==='active' ? (darkMode ? 'rgba(22, 163, 74, 0.18)' : '#f0fdf4') : (darkMode ? 'rgba(148, 163, 184, 0.18)' : '#f9fafb'), color: sub.status==='active' ? (darkMode ? '#86efac' : '#16a34a') : (darkMode ? '#cbd5e1' : '#9ca3af'), border:`1px solid ${sub.status==='active' ? (darkMode ? 'rgba(22, 163, 74, 0.3)' : '#bbf7d0') : (darkMode ? 'rgba(148, 163, 184, 0.3)' : '#e5e7eb')}`, flexShrink:0 }}>
                                {sub.status==='active'?'Active':'Off'}
                              </span>
                              <span style={{ color:'var(--text-muted, #9ca3af)', fontSize:'0.75rem', whiteSpace:'nowrap', flexShrink:0 }}>{sub.topics?.length||0} topics</span>
                            </>
                          )}

                          {!isEditSub && (
                            <div style={{ display:'flex', gap:'3px', flexShrink:0 }} onClick={e=>e.stopPropagation()}>
                              <ActionBtn onClick={()=>handleReorder('sub',cat._id,'up',subIdx)}>↑</ActionBtn>
                              <ActionBtn onClick={()=>handleReorder('sub',cat._id,'down',subIdx)}>↓</ActionBtn>
                              <ActionBtn color={pal.accent} lightBg={pal.bg} onClick={()=>setEditingNode({type:'sub',catId:cat._id,subIdx})}>Rename</ActionBtn>
                              <ActionBtn color="#16a34a" lightBg="#f0fdf4" onClick={()=>{setAddingNode({type:'topic',catId:cat._id,subIdx});setExpandedSubs(s=>new Set([...s,subKey]));}}> + Topic</ActionBtn>
                              <ActionBtn color={sub.status==='active'?'#d97706':'#16a34a'} lightBg={sub.status==='active'?'#fffbeb':'#f0fdf4'} onClick={()=>handleToggle('sub',cat._id,subIdx,null,sub.status)}>{sub.status==='active'?'Disable':'Enable'}</ActionBtn>
                              <ActionBtn color="#dc2626" lightBg="#fef2f2" onClick={()=>handleDelete('sub',cat._id,subIdx)}>Del</ActionBtn>
                            </div>
                          )}
                        </div>

                        {/* Topics */}
                        {isSubOpen && (
                          <div style={{ background:'var(--table-header-bg, #fafafa)', borderTop:'1px solid var(--border-light, #f3f4f6)', padding:'0.5rem 0.875rem 0.5rem 1.75rem', display:'flex', flexDirection:'column', gap:'0.3rem' }}>

                            {/* Inline add topic */}
                            {addingNode?.type==='topic' && addingNode?.catId===cat._id && addingNode?.subIdx===subIdx && (
                              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.4rem 0.6rem', background: darkMode ? 'rgba(22, 163, 74, 0.18)' : '#f0fdf4', borderRadius:'6px', border:'1.5px dashed var(--border, #bbf7d0)' }}>
                                <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#16a34a', flexShrink:0 }}>New:</span>
                                <InlineForm placeholder="Topic name…" onSave={handleAdd} onCancel={()=>setAddingNode(null)} accentColor="#16a34a" />
                              </div>
                            )}

                            {sub.topics.length===0 && !(addingNode?.catId===cat._id && addingNode?.subIdx===subIdx) && (
                              <p style={{ color:'var(--text-muted, #9ca3af)', fontSize:'0.78rem', fontStyle:'italic', margin:'0.1rem 0' }}>No topics. Click "+ Topic" to add one.</p>
                            )}

                            {sub.topics.map((topic, topicIdx) => {
                              const isEditTopic = editingNode?.type==='topic' && editingNode?.catId===cat._id && editingNode?.subIdx===subIdx && editingNode?.topicIdx===topicIdx;
                              return (
                                <div key={topicIdx} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.38rem 0.5rem', borderRadius:'6px', background:'var(--card-bg, #fff)', border:'1px solid var(--border-light, #f3f4f6)', transition:'border-color 120ms ease' }}
                                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border, #e5e7eb)'}
                                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-light, #f3f4f6)'}>
                                  <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:pal.accent, flexShrink:0, opacity:0.6 }} />
                                  {isEditTopic ? (
                                    <InlineForm initial={topic.name} onSave={handleRename} onCancel={()=>setEditingNode(null)} accentColor={pal.accent} />
                                  ) : (
                                    <>
                                      <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-sub, #374151)', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{topic.name}</span>
                                      <span style={{ fontSize:'0.65rem', fontWeight:700, color: topic.status==='active'?'#16a34a':'#9ca3af', flexShrink:0 }}>
                                        {topic.status==='active'?'●':'○'}
                                      </span>
                                      <div style={{ display:'flex', gap:'2px', flexShrink:0 }}>
                                        <ActionBtn onClick={()=>handleReorder('topic',cat._id,'up',subIdx,topicIdx)}>↑</ActionBtn>
                                        <ActionBtn onClick={()=>handleReorder('topic',cat._id,'down',subIdx,topicIdx)}>↓</ActionBtn>
                                        <ActionBtn color={pal.accent} lightBg={pal.bg} onClick={()=>setEditingNode({type:'topic',catId:cat._id,subIdx,topicIdx})}>Rename</ActionBtn>
                                        <ActionBtn color={topic.status==='active'?'#d97706':'#16a34a'} lightBg={topic.status==='active'?'#fffbeb':'#f0fdf4'} onClick={()=>handleToggle('topic',cat._id,subIdx,topicIdx,topic.status)}>{topic.status==='active'?'Off':'On'}</ActionBtn>
                                        <ActionBtn color="#dc2626" lightBg="#fef2f2" onClick={()=>handleDelete('topic',cat._id,subIdx,topicIdx)}>Del</ActionBtn>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

/* ─── Reusable small action button ────────────────────────────────── */
function ActionBtn({ children, onClick, color='#374151', lightBg='#f3f4f6' }) {
  const isDark = localStorage.getItem('adminTheme') === 'dark';
  
  let finalColor = color;
  let finalBg = lightBg;
  let finalBorder = lightBg==='#f3f4f6'?'#e5e7eb':lightBg;
  
  if (isDark) {
    if (color === '#374151') finalColor = 'var(--text-sub)';
    if (lightBg === '#f3f4f6') {
      finalBg = 'var(--active-item-bg)';
      finalBorder = 'var(--border)';
    } else {
      finalBg = `${color}28`;
      finalBorder = `${color}40`;
    }
  }

  return (
    <button
      onClick={onClick}
      style={{ padding:'0.2rem 0.45rem', borderRadius:'5px', border:`1px solid ${finalBorder}`, background:finalBg, color:finalColor, fontSize:'0.73rem', fontWeight:700, cursor:'pointer', transition:'all 120ms ease', whiteSpace:'nowrap' }}
      onMouseEnter={e=>{ e.currentTarget.style.opacity='0.8'; }}
      onMouseLeave={e=>{ e.currentTarget.style.opacity='1'; }}
    >
      {children}
    </button>
  );
}
