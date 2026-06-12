import React, { useState, useEffect } from 'react';
import api from '../../../api/index.js';

export default function PrepMockTestsManager() {
  const [tests, setTests] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  
  // Random Generator State
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [genRules, setGenRules] = useState({
    category: '',
    subCategory: '',
    company: '',
    difficulty: 'all',
    count: 10
  });
  const [genLoading, setGenLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: 'Aptitude',
    duration: 30,
    questions: []
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/preparation/admin/mock-tests?page=${page}&limit=${limit}`);
      if (res.data?.success) {
        setTests(res.data.tests || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const startCreate = () => {
    setActiveTest(null);
    setForm({
      title: '',
      type: 'Aptitude',
      duration: 30,
      questions: []
    });
    setModalOpen(true);
  };

  const startEdit = (test) => {
    setActiveTest(test);
    setForm({
      title: test.title || '',
      type: test.type || 'Aptitude',
      duration: test.duration || 30,
      questions: Array.isArray(test.questions) ? [...test.questions] : []
    });
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (form.questions.length === 0) {
      alert('⚠️ Mock test must have at least 1 question!');
      return;
    }

    try {
      if (activeTest) {
        await api.put(`/preparation/admin/mock-tests/${activeTest._id}`, form);
      } else {
        await api.post('/preparation/admin/mock-tests', form);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this mock test?')) return;
    try {
      await api.delete(`/preparation/admin/mock-tests/${id}`);
      loadData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleGenSubmit = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    try {
      const qParams = new URLSearchParams({
        category: genRules.category || 'all',
        subCategory: genRules.subCategory || 'all',
        company: genRules.company || 'all',
        difficulty: genRules.difficulty,
        count: genRules.count
      });
      const res = await api.get(`/preparation/admin/questions/random?${qParams.toString()}`);
      if (res.data?.success) {
        const genQs = res.data.questions || [];
        if (genQs.length === 0) {
          alert('No questions matching these rules found in the question bank!');
        } else {
          setForm(prev => ({
            ...prev,
            questions: [...prev.questions, ...genQs]
          }));
          setGeneratorOpen(false);
          alert(`Successfully generated ${genQs.length} random questions!`);
        }
      }
    } catch (err) {
      alert('Random generation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenLoading(false);
    }
  };

  const addManualQuestion = () => {
    const newQ = {
      questionText: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: ''
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQ]
    }));
  };

  const removeQuestion = (idx) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const updateQField = (idx, field, val) => {
    const updatedQs = [...form.questions];
    updatedQs[idx] = {
      ...updatedQs[idx],
      [field]: val
    };
    setForm(prev => ({
      ...prev,
      questions: updatedQs
    }));
  };

  const updateQOption = (qIdx, optIdx, val) => {
    const updatedQs = [...form.questions];
    const newOpts = [...updatedQs[qIdx].options];
    newOpts[optIdx] = val;
    updatedQs[qIdx] = {
      ...updatedQs[qIdx],
      options: newOpts
    };
    setForm(prev => ({
      ...prev,
      questions: updatedQs
    }));
  };

  const addOptionToQ = (qIdx) => {
    const updatedQs = [...form.questions];
    updatedQs[qIdx] = {
      ...updatedQs[qIdx],
      options: [...updatedQs[qIdx].options, '']
    };
    setForm(prev => ({
      ...prev,
      questions: updatedQs
    }));
  };

  const removeOptionFromQ = (qIdx, optIdx) => {
    const updatedQs = [...form.questions];
    if (updatedQs[qIdx].options.length <= 2) return;
    const newOpts = updatedQs[qIdx].options.filter((_, i) => i !== optIdx);
    updatedQs[qIdx] = {
      ...updatedQs[qIdx],
      options: newOpts
    };
    setForm(prev => ({
      ...prev,
      questions: updatedQs
    }));
  };

  return (
    <div>
      {/* Header and Add Action */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#162c4a', margin: 0 }}>
            📝 Mock Tests ({total})
          </h2>
          <p className="text-muted mb-0 small">Create timed practice and assessment tests for candidates</p>
        </div>
        <button
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.5rem', fontWeight: 700, borderRadius: '8px', background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }}
          onClick={startCreate}
        >
          ➕ Create Mock Test
        </button>
      </div>

      {/* Tests list */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div className="p-5 text-center text-muted">⏳ Loading mock tests...</div>
        ) : tests.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <div style={{ fontSize: '2.5rem' }}>📭</div>
            <p className="mt-2 mb-0">No mock tests available. Create one to begin.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ paddingLeft: '1.25rem' }}>Test Title</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Questions Count</th>
                  <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ paddingLeft: '1.25rem', fontWeight: 600, color: '#162c4a' }}>{t.title}</td>
                    <td><span className="badge bg-light text-dark border">{t.type}</span></td>
                    <td>{t.duration} mins</td>
                    <td>{t.questions?.length || 0} questions</td>
                    <td style={{ textAlign: 'right', paddingRight: '1.25rem' }}>
                      <div className="d-flex gap-1 justify-content-end">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(t)}>✏️ Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(t._id)}>🗑️ Delete</button>
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

      {/* Mock Test Builder Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
          <div className="card border-0 shadow-lg" style={{ background: '#fff', borderRadius: '16px', maxWidth: '850px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', background: 'linear-gradient(90deg, #1677b6, #2a9df4)' }}>
              <h5 className="m-0" style={{ fontWeight: 800 }}>{activeTest ? '✏️ Edit Mock Test' : '✨ Create Mock Test'}</h5>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={save} className="card-body p-4">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 600 }}>Test Title *</label>
                  <input type="text" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. TCS NQT Aptitude Round 1" required />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label" style={{ fontWeight: 600 }}>Test Type *</label>
                  <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                    <option>Aptitude</option>
                    <option>Technical</option>
                    <option>Placement</option>
                    <option>Government</option>
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label" style={{ fontWeight: 600 }}>Duration (minutes) *</label>
                  <input type="number" className="form-control" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} min="5" max="180" required />
                </div>
              </div>

              {/* Questions Area */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <h6 style={{ fontWeight: 800, margin: 0, color: '#162c4a' }}>
                    Questions ({form.questions.length})
                  </h6>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setGeneratorOpen(true)}>
                      🤖 Generate Randomly
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={addManualQuestion}>
                      ➕ Add Question Manually
                    </button>
                  </div>
                </div>

                {form.questions.length === 0 ? (
                  <div className="p-4 text-center text-muted border border-dashed rounded-3" style={{ background: '#f8fafc' }}>
                    No questions added yet. Use the buttons above to populate.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '45vh', overflowY: 'auto', paddingRight: '6px' }}>
                    {form.questions.map((q, qIdx) => (
                      <div key={qIdx} className="card border p-3" style={{ borderRadius: '10px', background: '#fafbfc' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span style={{ fontWeight: 700, color: '#64748b' }}>Question {qIdx + 1}</span>
                          <button type="button" className="btn btn-sm btn-outline-danger" style={{ padding: '0.1rem 0.4rem' }} onClick={() => removeQuestion(qIdx)}>Remove</button>
                        </div>
                        <div className="row g-2 mb-3">
                          <div className="col-12">
                            <label className="form-label small mb-1" style={{ fontWeight: 600 }}>Question Text</label>
                            <input type="text" className="form-control form-control-sm" value={q.questionText} onChange={(e) => updateQField(qIdx, 'questionText', e.target.value)} required />
                          </div>
                        </div>

                        {/* Options */}
                        <div className="row g-2 mb-3">
                          <div className="col-12 d-flex justify-content-between align-items-center mb-1">
                            <span className="small" style={{ fontWeight: 600 }}>Options</span>
                            <button type="button" className="btn btn-xs btn-outline-secondary" style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem' }} onClick={() => addOptionToQ(qIdx)}>Add Option</button>
                          </div>
                          {q.options?.map((opt, optIdx) => (
                            <div key={optIdx} className="col-12 col-md-6 input-group input-group-sm">
                              <span className="input-group-text">{String.fromCharCode(65 + optIdx)}</span>
                              <input type="text" className="form-control" value={opt} onChange={(e) => updateQOption(qIdx, optIdx, e.target.value)} required />
                              {q.options.length > 2 && (
                                <button type="button" className="btn btn-outline-danger" onClick={() => removeOptionFromQ(qIdx, optIdx)}>✕</button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="row g-2">
                          <div className="col-12 col-md-6">
                            <label className="form-label small mb-1" style={{ fontWeight: 600 }}>Correct Answer Option</label>
                            <select className="form-select form-select-sm" value={q.answer} onChange={(e) => updateQField(qIdx, 'answer', e.target.value)} required>
                              <option value="" disabled>Select Answer...</option>
                              {q.options.filter(Boolean).map((opt, i) => (
                                <option key={i} value={opt}>{String.fromCharCode(65 + i)}: {opt}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-12 col-md-6">
                            <label className="form-label small mb-1" style={{ fontWeight: 600 }}>Explanation (Optional)</label>
                            <input type="text" className="form-control form-control-sm" value={q.explanation || ''} onChange={(e) => updateQField(qIdx, 'explanation', e.target.value)} placeholder="e.g. Formula: S = D / T" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 justify-content-end border-top pt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 2rem', borderRadius: '8px', background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }}>💾 Save Mock Test</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Random Generator Rules Modal */}
      {generatorOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setGeneratorOpen(false)}>
          <div className="card border-0 shadow-lg" style={{ background: '#fff', borderRadius: '16px', maxWidth: '500px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <h5 className="m-0" style={{ fontWeight: 800 }}>🤖 Random Question Generator</h5>
              <button onClick={() => setGeneratorOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleGenSubmit} className="card-body p-4">
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600 }}>Category *</label>
                <input type="text" className="form-control" value={genRules.category} onChange={(e) => setGenRules({ ...genRules, category: e.target.value })} placeholder="e.g. Aptitude, Reasoning, Technical" required />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600 }}>Sub Category / Topic (Optional)</label>
                <input type="text" className="form-control" value={genRules.subCategory} onChange={(e) => setGenRules({ ...genRules, subCategory: e.target.value })} placeholder="e.g. Percentage" />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600 }}>Company (Optional)</label>
                <input type="text" className="form-control" value={genRules.company} onChange={(e) => setGenRules({ ...genRules, company: e.target.value })} placeholder="e.g. TCS" />
              </div>
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="form-label" style={{ fontWeight: 600 }}>Difficulty</label>
                  <select className="form-select" value={genRules.difficulty} onChange={(e) => setGenRules({ ...genRules, difficulty: e.target.value })} required>
                    <option value="all">Any Difficulty</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label" style={{ fontWeight: 600 }}>Number of Qs *</label>
                  <input type="number" className="form-control" value={genRules.count} onChange={(e) => setGenRules({ ...genRules, count: Number(e.target.value) })} min="1" max="100" required />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setGeneratorOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={genLoading} style={{ background: 'linear-gradient(90deg, #1677b6, #2a9df4)', border: 'none' }}>
                  {genLoading ? 'Generating...' : '🤖 Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
