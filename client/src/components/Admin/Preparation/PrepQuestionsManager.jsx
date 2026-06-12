import React, { useState, useEffect } from 'react';
import api from '../../../api/index.js';

export default function PrepQuestionsManager() {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [subCategory, setSubCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  const [company, setCompany] = useState('all');

  // Lists for filters
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Form State
  const [form, setForm] = useState({
    category: '',
    subCategory: '',
    topic: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'Medium',
    company: '',
    marks: 1,
    negativeMarks: 0,
    tags: '',
    status: 'active'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams({
        page,
        limit,
        category,
        subCategory,
        difficulty,
        status,
        company,
        q: search
      });

      const res = await api.get(`/preparation/admin/questions?${qParams.toString()}`);
      if (res.data?.success) {
        setQuestions(res.data.questions || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const res = await api.get('/preparation/structure');
      if (res.data?.success) {
        setCategories(res.data.categories || []);
        setCompanies(res.data.companies || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, category, subCategory, difficulty, status, company]);

  useEffect(() => {
    loadFilters();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(questions.map(q => q._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  // CRUD Actions
  const startCreate = () => {
    setActiveQuestion(null);
    setForm({
      category: '',
      subCategory: '',
      topic: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficulty: 'Medium',
      company: '',
      marks: 1,
      negativeMarks: 0,
      tags: '',
      status: 'active'
    });
    setModalOpen(true);
  };

  const startEdit = (q) => {
    setActiveQuestion(q);
    setForm({
      category: q.category || '',
      subCategory: q.subCategory || '',
      topic: q.topic || '',
      question: q.question || '',
      options: Array.isArray(q.options) ? [...q.options] : ['', '', '', ''],
      correctAnswer: q.correctAnswer || q.answer || '',
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'Medium',
      company: q.company || '',
      marks: q.marks !== undefined ? q.marks : 1,
      negativeMarks: q.negativeMarks !== undefined ? q.negativeMarks : 0,
      tags: Array.isArray(q.tags) ? q.tags.join(', ') : q.tags || '',
      status: q.status || 'active'
    });
    setModalOpen(true);
  };

  const startPreview = (q) => {
    setActiveQuestion(q);
    setPreviewOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.options.includes(form.correctAnswer)) {
      alert('⚠️ Correct answer must exactly match one of the options!');
      return;
    }

    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (activeQuestion) {
        await api.put(`/preparation/admin/questions/${activeQuestion._id}`, payload);
      } else {
        await api.post('/preparation/admin/questions', payload);
      }
      setModalOpen(false);
      loadData();
      loadFilters();
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/preparation/admin/questions/${id}`);
      loadData();
      loadFilters();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} questions?`)) return;
    try {
      await api.post('/preparation/admin/questions/bulk-delete', { ids: selectedIds });
      setSelectedIds([]);
      loadData();
      loadFilters();
    } catch (err) {
      alert('Bulk delete failed');
    }
  };

  const handleBulkStatus = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await api.post('/preparation/admin/questions/bulk-update', {
        ids: selectedIds,
        update: { status: newStatus }
      });
      setSelectedIds([]);
      loadData();
    } catch (err) {
      alert('Bulk status update failed');
    }
  };

  const handleBulkDifficulty = async (newDiff) => {
    if (selectedIds.length === 0) return;
    try {
      await api.post('/preparation/admin/questions/bulk-update', {
        ids: selectedIds,
        update: { difficulty: newDiff }
      });
      setSelectedIds([]);
      loadData();
    } catch (err) {
      alert('Bulk difficulty update failed');
    }
  };

  const handleOptionChange = (idx, val) => {
    const newOpts = [...form.options];
    newOpts[idx] = val;
    setForm({ ...form, options: newOpts });
  };

  const addOptionField = () => {
    setForm({ ...form, options: [...form.options, ''] });
  };

  const removeOptionField = (idx) => {
    if (form.options.length <= 2) return;
    const newOpts = form.options.filter((_, i) => i !== idx);
    setForm({ ...form, options: newOpts });
  };

  return (
    <div>
      {/* Header and Add Action */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#162c4a', margin: 0 }}>
            ❓ Question Bank ({total})
          </h2>
          <p className="text-muted mb-0 small">Manage all practice and test questions in the system</p>
        </div>
        <button
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.5rem', fontWeight: 700, borderRadius: '8px', background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }}
          onClick={startCreate}
        >
          ➕ Add Question
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-3">
          <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
            <div className="col-12 col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory('all'); setPage(1); }}>
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={subCategory} onChange={(e) => { setSubCategory(e.target.value); setPage(1); }}>
                <option value="all">All Sub Categories</option>
                {category === 'all'
                  ? categories.flatMap(c => c.subCategories || []).map((s, idx) => <option key={idx} value={s.name}>{s.name}</option>)
                  : (categories.find(c => c.name === category)?.subCategories || []).map((s, idx) => <option key={idx} value={s.name}>{s.name}</option>)
                }
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={company} onChange={(e) => { setCompany(e.target.value); setPage(1); }}>
                <option value="all">All Companies</option>
                {companies.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-dark w-100" style={{ fontWeight: 600 }}>Filter</button>
            </div>
          </form>
        </div>
      </div>

      {/* Bulk Actions Block */}
      {selectedIds.length > 0 && (
        <div className="alert alert-info py-2 px-3 mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2 animate-slide-down" style={{ borderRadius: '8px' }}>
          <span style={{ fontWeight: 700 }}>Selected: {selectedIds.length} items</span>
          <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-sm btn-danger" onClick={handleBulkDelete}>🗑️ Delete Selected</button>
            <select className="form-select form-select-sm w-auto" onChange={(e) => handleBulkStatus(e.target.value)} defaultValue="">
              <option value="" disabled>Change Status...</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select className="form-select form-select-sm w-auto" onChange={(e) => handleBulkDifficulty(e.target.value)} defaultValue="">
              <option value="" disabled>Change Difficulty...</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div className="p-5 text-center text-muted">⏳ Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <div style={{ fontSize: '2.5rem' }}>📭</div>
            <p className="mt-2 mb-0">No questions found matching the criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ width: '40px', paddingLeft: '1.25rem' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedIds.length === questions.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ minWidth: '250px' }}>Question</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedIds.includes(q._id)}
                        onChange={(e) => handleSelectOne(q._id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#162c4a', maxHeight: '42px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {q.question}
                      </div>
                      <div className="small text-muted mt-1">
                        {q.company && <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.4rem', borderRadius: '4px', marginRight: '6px', fontWeight: 700 }}>🏢 {q.company}</span>}
                        {q.marks !== undefined && <span className="me-2">Marks: {q.marks}</span>}
                      </div>
                    </td>
                    <td><span className="badge bg-light text-dark">{q.category}</span></td>
                    <td><span className="badge bg-light text-dark">{q.subCategory || q.topic || 'General'}</span></td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: q.difficulty === 'Easy' ? '#dcfce7' : q.difficulty === 'Hard' ? '#fee2e2' : '#fef3c7',
                        color: q.difficulty === 'Easy' ? '#166534' : q.difficulty === 'Hard' ? '#991b1b' : '#d97706'
                      }}>{q.difficulty}</span>
                    </td>
                    <td>
                      <span className={`badge ${q.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {q.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '1.25rem' }}>
                      <div className="d-flex gap-1 justify-content-end">
                        <button className="btn btn-sm btn-outline-dark" onClick={() => startPreview(q)}>👁️ Preview</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(q)}>✏️ Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(q._id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">Showing Page {page} of {pages}</span>
          <div className="d-flex gap-1">
            <button className="btn btn-outline-secondary btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <button className="btn btn-outline-secondary btn-sm" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && activeQuestion && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPreviewOpen(false)}>
          <div className="card border-0 shadow-lg" style={{ background: '#fff', borderRadius: '16px', maxWidth: '650px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <h5 className="m-0" style={{ fontWeight: 800 }}>🔍 Question Preview</h5>
              <button onClick={() => setPreviewOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="card-body p-4">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span className="badge bg-light text-dark border">📁 {activeQuestion.category}</span>
                <span className="badge bg-light text-dark border">🏷️ {activeQuestion.subCategory || activeQuestion.topic || 'General'}</span>
                <span className={`badge ${activeQuestion.difficulty === 'Easy' ? 'bg-success-subtle text-success' : activeQuestion.difficulty === 'Hard' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}`}>⚡ {activeQuestion.difficulty}</span>
                {activeQuestion.company && <span className="badge bg-info-subtle text-info border">🏢 {activeQuestion.company}</span>}
                <span className="badge bg-secondary-subtle text-secondary">Marks: {activeQuestion.marks || 1} | Neg: {activeQuestion.negativeMarks || 0}</span>
              </div>
              <h5 style={{ fontWeight: 700, color: '#162c4a', lineHeight: 1.5, marginBottom: '20px' }}>{activeQuestion.question}</h5>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {activeQuestion.options?.map((opt, i) => {
                  const isCorrect = opt === (activeQuestion.correctAnswer || activeQuestion.answer);
                  return (
                    <div key={i} style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: `1.5px solid ${isCorrect ? '#22c55e' : '#e2e8f0'}`, background: isCorrect ? '#f0fdf4' : '#fff', fontWeight: isCorrect ? 600 : 500, color: isCorrect ? '#166534' : '#475569' }}>
                      <span style={{ fontWeight: 800, marginRight: '8px' }}>{String.fromCharCode(65 + i)}.</span>
                      {opt} {isCorrect && '✅ (Correct Answer)'}
                    </div>
                  );
                })}
              </div>

              <div style={{ background: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 700, color: '#162c4a', fontSize: '0.9rem', marginBottom: '6px' }}>💡 Detailed Explanation:</div>
                <div style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6 }}>{activeQuestion.explanation || 'No explanation provided.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRUD Form Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
          <div className="card border-0 shadow-lg" style={{ background: '#fff', borderRadius: '16px', maxWidth: '750px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', background: 'linear-gradient(90deg, #1677b6, #2a9df4)' }}>
              <h5 className="m-0" style={{ fontWeight: 800 }}>{activeQuestion ? '✏️ Edit Question' : '✨ Add New Question'}</h5>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={save} className="card-body p-4">
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="form-label" style={{ fontWeight: 600 }}>Category *</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: '', topic: '' })}
                    required
                  >
                    <option value="" disabled>Select Category...</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label" style={{ fontWeight: 600 }}>Sub Category *</label>
                  <select
                    className="form-select"
                    value={form.subCategory}
                    onChange={(e) => setForm({ ...form, subCategory: e.target.value, topic: '' })}
                    disabled={!form.category}
                    required
                  >
                    <option value="" disabled>Select Sub Category...</option>
                    {(categories.find(c => c.name === form.category)?.subCategories || []).map((s, i) => (
                      <option key={i} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label" style={{ fontWeight: 600 }}>Topic *</label>
                  <select
                    className="form-select"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    disabled={!form.subCategory}
                    required
                  >
                    <option value="" disabled>Select Topic...</option>
                    {((categories.find(c => c.name === form.category)?.subCategories || []).find(s => s.name === form.subCategory)?.topics || []).map((t, i) => (
                      <option key={i} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600 }}>Question Text *</label>
                  <textarea rows="3" className="form-control" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Enter the complete question text..." required />
                </div>
              </div>

              {/* Options Section */}
              <div className="mb-4">
                <label className="form-label d-flex justify-content-between align-items-center" style={{ fontWeight: 600 }}>
                  <span>Answer Options *</span>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addOptionField}>➕ Add Option</button>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="input-group">
                      <span className="input-group-text">{String.fromCharCode(65 + idx)}</span>
                      <input type="text" className="form-control" value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + idx)}`} required />
                      {form.options.length > 2 && (
                        <button type="button" className="btn btn-outline-danger" onClick={() => removeOptionField(idx)}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer and Info fields */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 600 }}>Correct Answer *</label>
                  <select className="form-select" value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} required>
                    <option value="" disabled>Select Correct Option...</option>
                    {form.options.filter(Boolean).map((opt, i) => (
                      <option key={i} value={opt}>Option {String.fromCharCode(65 + i)}: {opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 600 }}>Difficulty *</label>
                  <select className="form-select" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} required>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label" style={{ fontWeight: 600 }}>Company (Optional)</label>
                  <select
                    className="form-select"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  >
                    <option value="">None (Generic)</option>
                    {companies.map(c => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label" style={{ fontWeight: 600 }}>Marks</label>
                  <input type="number" className="form-control" value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })} min="1" required />
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label" style={{ fontWeight: 600 }}>Negative Marks</label>
                  <input type="number" step="0.25" className="form-control" value={form.negativeMarks} onChange={(e) => setForm({ ...form, negativeMarks: Number(e.target.value) })} min="0" required />
                </div>
                <div className="col-12 col-md-8">
                  <label className="form-label" style={{ fontWeight: 600 }}>Tags (comma-separated)</label>
                  <input type="text" className="form-control" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. math, speed, time" />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label" style={{ fontWeight: 600 }}>Status</label>
                  <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600 }}>Explanation *</label>
                  <textarea rows="3" className="form-control" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} placeholder="Provide step-by-step logic, formula, or calculations..." required />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 2rem', borderRadius: '8px', background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }}>💾 Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
