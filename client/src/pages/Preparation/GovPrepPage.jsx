import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import AITutor from '../../components/Preparation/AITutor.jsx';
import PrepLayout from '../../components/Preparation/PrepLayout.jsx';
import api from '../../api/index.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const DIFF_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const EXAM_ICONS = {
  SSC: '📋', Banking: '🏦', Railway: '🚂', UPSC: '🏛️', Other: '📚'
};

export default function GovPrepPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(searchParams.get('exam') || '');

  const handleCatChange = (e) => {
    const val = e.target.value;
    if (val.startsWith('/preparation/')) {
      navigate(val);
    } else {
      navigate(`/preparation/aptitude?category=${encodeURIComponent(val)}`);
    }
  };

  useEffect(() => {
    setSelectedExam(searchParams.get('exam') || '');
  }, [searchParams]);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});
  const [expanded, setExpanded] = useState({});
  const [aiQ, setAiQ] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    document.title = 'Govt Exam Prep | Preparation Hub';
    api.get('/preparation/gov/exams')
      .then(res => setExams(res.data.exams || []))
      .catch(err => console.error(err));
  }, []);

  const loadQuestions = () => {
    setLoading(true);
    const params = { limit: 20 };
    if (selectedExam) params.exam = selectedExam;
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    
    api.get('/preparation/gov', { params })
      .then(res => {
        setQuestions(res.data.questions || []);
        setSelected({});
        setRevealed({});
        setExpanded({});
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQuestions(); }, [selectedExam, category, difficulty]);

  const markSolved = async (q) => {
    if (!token) return;
    try {
      await api.post('/preparation/progress/solve', {
        questionId: q._id,
        category: 'Government',
        topic: q.exam
      });
    } catch {}
  };

  const handleSelect = (qId, opt, q) => {
    setSelected(s => ({ ...s, [qId]: opt }));
    setRevealed(r => ({ ...r, [qId]: true }));
    if (opt === q.answer) markSolved(q);
  };

  return (
    <PrepLayout>
      <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter,sans-serif' }}>
      {/* Header */}
      {/* Compact Header */}
      <div style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)', padding: '0.7rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minHeight: 64 }}>

          {/* Left: icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 8px', lineHeight: 1 }}>🏛️</span>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
                Government Exam Preparation
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>
                SSC, Banking, Railway, UPSC — subject-wise practice & previous papers
              </p>
            </div>
          </div>

          {/* Right: exam chips + filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            <button onClick={() => setSearchParams({})} style={chip(selectedExam === '')}>All Exams</button>
            {exams.map(e => (
              <button key={e} onClick={() => setSearchParams({ exam: e })} style={chip(selectedExam === e)}>
                {EXAM_ICONS[e] || '📋'} {e}
              </button>
            ))}
            <select value="/preparation/gov" onChange={handleCatChange} style={filterStyle}>
              {[
                "Quantitative Aptitude",
                "Data Interpretation",
                "Verbal Ability",
                "Logical Reasoning",
                "Verbal Reasoning",
                "Non Verbal Reasoning",
                "Current Affairs Categories",
                "General Knowledge",
                "Company Wise Preparation"
              ].map(c => <option key={c} value={c} style={optionStyle}>{c}</option>)}
              <option disabled style={{ color: '#cbd5e1' }}>──────────────────</option>
              <option value="/preparation/technical" style={optionStyle}>💻 Programming MCQs</option>
              <option value="/preparation/dsa" style={optionStyle}>🌲 DSA Challenges</option>
              <option value="/preparation/company" style={optionStyle}>🏢 Company Prep</option>
              <option value="/preparation/gov" style={optionStyle}>🏛️ Govt Exams Prep</option>
              <option value="/preparation/mock-tests" style={optionStyle}>📝 Mock Tests</option>
            </select>

            <select value={category} onChange={e => setCategory(e.target.value)} style={filterStyle}>
              <option value="" style={optionStyle}>All Subjects</option>
              <option value="Aptitude" style={optionStyle}>Aptitude</option>
              <option value="Reasoning" style={optionStyle}>Reasoning</option>
              <option value="English" style={optionStyle}>English</option>
              <option value="Previous Papers" style={optionStyle}>Previous Papers</option>
            </select>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={filterStyle}>
              <option value="" style={optionStyle}>All Levels</option>
              <option value="Easy" style={optionStyle}>Easy</option>
              <option value="Medium" style={optionStyle}>Medium</option>
              <option value="Hard" style={optionStyle}>Hard</option>
            </select>
          </div>

        </div>
      </div>

      {/* Exam Info Cards */}
      {!selectedExam && (
        <div style={{ maxWidth: 860, margin: '1.5rem auto 0', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
            {[
              { name: 'SSC', icon: '📋', exams: 'CGL, CHSL, MTS', color: '#ef4444', desc: '~2L vacancies/year' },
              { name: 'Banking', icon: '🏦', exams: 'IBPS PO, SBI, RBI', color: '#3b82f6', desc: '~1L vacancies/year' },
              { name: 'Railway', icon: '🚂', exams: 'RRB NTPC, Group D', color: '#10b981', desc: '~50K vacancies/year' },
              { name: 'UPSC', icon: '🏛️', exams: 'IAS, IPS, IFS', color: '#8b5cf6', desc: 'Prestige & career' },
            ].map(ex => (
              <div key={ex.name}
                onClick={() => setSearchParams({ exam: ex.name })}
                style={{
                  background: '#fff', borderRadius: 14,
                  border: `2px solid ${ex.color}30`,
                  padding: '1.2rem', cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ex.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${ex.color}30`; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>{ex.icon}</div>
                <div style={{ fontWeight: 800, color: ex.color, fontSize: '1rem' }}>{ex.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>{ex.exams}</div>
                <div style={{
                  marginTop: 8,
                  background: `${ex.color}15`, color: ex.color,
                  borderRadius: 20, padding: '2px 8px',
                  fontSize: '0.68rem', fontWeight: 600,
                }}>{ex.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: selectedExam ? 1200 : 860, margin: '1.5rem auto 0', padding: '0 1rem 2rem' }}>
        {selectedExam && (
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            alignItems: 'center', 
            fontSize: '0.8rem', 
            color: '#64748b', 
            marginBottom: 24, 
            flexWrap: 'wrap',
            background: '#ffffff',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            width: 'fit-content',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            <Link to="/" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>🏠</span> Home
            </Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span onClick={() => setSearchParams({})} style={{ color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Gov Exams Prep</span>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ fontWeight: 700, color: '#475569' }}>{selectedExam}</span>
          </div>
        )}

        <div style={selectedExam ? { display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' } : {}}>
          {selectedExam && (
            <div style={{ flex: '0 0 220px', minWidth: 200 }}>
              <div style={{
                background: '#fff', borderRadius: 12, padding: '1.25rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
                position: 'sticky', top: 20,
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Exercise Selection
                </p>

                {/* Practice Problems active item */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                  <button style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '11px 14px', background: '#fef2f2', border: 'none', textAlign: 'left', cursor: 'default', color: '#ef4444', fontWeight: 700, fontSize: '0.83rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ marginRight: 10, flexShrink: 0 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <polyline points="9 11 12 14 17 9" strokeWidth="3" />
                    </svg>
                    Practice Problems
                  </button>
                </div>

                {/* Subject Filter */}
                <p style={{ margin: '0 0 8px 0', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Subject
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                  {[
                    { val: '', label: 'All Subjects', icon: '📚' },
                    { val: 'Aptitude', label: 'Aptitude', icon: '🔢' },
                    { val: 'Reasoning', label: 'Reasoning', icon: '🧠' },
                    { val: 'English', label: 'English', icon: '📝' },
                    { val: 'Previous Papers', label: 'Prev. Papers', icon: '📋' },
                  ].map(s => (
                    <button
                      key={s.val}
                      onClick={() => setCategory(s.val)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 12px', borderRadius: 7, border: 'none',
                        background: category === s.val ? '#fef2f2' : 'transparent',
                        color: category === s.val ? '#ef4444' : '#64748b',
                        fontWeight: category === s.val ? 700 : 500,
                        fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', width: '100%',
                        transition: 'all 0.15s',
                        borderLeft: category === s.val ? '3px solid #ef4444' : '3px solid transparent',
                      }}>
                      <span>{s.icon}</span>{s.label}
                    </button>
                  ))}
                </div>

                {/* Difficulty Filter */}
                <p style={{ margin: '0 0 8px 0', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Difficulty
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['', 'Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 12px', borderRadius: 7, border: 'none',
                        background: difficulty === d ? (d === 'Easy' ? '#dcfce7' : d === 'Medium' ? '#fef3c7' : d === 'Hard' ? '#fee2e2' : '#fef2f2') : 'transparent',
                        color: difficulty === d ? (d === 'Easy' ? '#166534' : d === 'Medium' ? '#92400e' : d === 'Hard' ? '#991b1b' : '#ef4444') : '#64748b',
                        fontWeight: difficulty === d ? 700 : 500,
                        fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', width: '100%',
                        transition: 'all 0.15s',
                      }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : d === 'Hard' ? '#ef4444' : '#94a3b8',
                      }} />
                      {d === '' ? 'All Levels' : d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={selectedExam ? { flex: 1, minWidth: 280 } : {}}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                <div style={{ fontSize: '2rem' }}>⏳</div> Loading...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {questions.map((q) => {
              const isInterview = q.category === 'Previous Papers' && !q.options?.length;
              const isRevealed = revealed[q._id];
              const isExpanded = expanded[q._id];
              const userChoice = selected[q._id];
              return (
                <div key={q._id} style={{
                  background: '#fff', borderRadius: 14,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0', overflow: 'hidden',
                }}>
                  <div style={{
                    background: '#fef2f2', padding: '8px 14px',
                    borderBottom: '1px solid #fecaca',
                    display: 'flex', gap: 8, alignItems: 'center',
                  }}>
                    <span style={{
                      background: '#ef4444', color: '#fff',
                      borderRadius: 6, padding: '2px 10px',
                      fontSize: '0.72rem', fontWeight: 800,
                    }}>{EXAM_ICONS[q.exam] || '📋'} {q.exam}</span>
                    <span style={{
                      background: '#f1f5f9', color: '#64748b',
                      borderRadius: 6, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600,
                    }}>{q.category}</span>
                    <span style={{
                      background: `${DIFF_COLORS[q.difficulty]}15`,
                      color: DIFF_COLORS[q.difficulty],
                      borderRadius: 6, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700,
                    }}>{q.difficulty}</span>
                  </div>

                  <div style={{ padding: '1rem 1.25rem' }}>
                    <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {q.question}
                    </p>

                    {q.options && q.options.length > 0 ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
                          {q.options.map((opt, oi) => {
                            let bg = '#f8fafc', border = '#e2e8f0', color = '#1e293b';
                            if (isRevealed) {
                              if (opt === q.answer) { bg = '#dcfce7'; border = '#10b981'; color = '#166534'; }
                              else if (opt === userChoice) { bg = '#fee2e2'; border = '#ef4444'; color = '#991b1b'; }
                            }
                            return (
                              <button key={oi}
                                onClick={() => !isRevealed && handleSelect(q._id, opt, q)}
                                disabled={isRevealed}
                                style={{
                                  background: bg, border: `1.5px solid ${border}`,
                                  borderRadius: 10, padding: '8px 12px',
                                  textAlign: 'left', cursor: isRevealed ? 'default' : 'pointer',
                                  fontSize: '0.85rem', fontWeight: 500, color, transition: 'all 0.15s',
                                }}>
                                <span style={{ fontWeight: 700, marginRight: 6, color: '#ef4444' }}>
                                  {String.fromCharCode(65 + oi)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {isRevealed && (
                          <div style={{ marginTop: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px' }}>
                            <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.82rem', marginBottom: 4 }}>✅ Explanation</div>
                            <div style={{ color: '#14532d', fontSize: '0.85rem', lineHeight: 1.6 }}>{q.explanation}</div>
                            <button onClick={() => setAiQ(q)} style={aiBtn}>🤖 AI Tutor</button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <button onClick={() => setExpanded(e => ({ ...e, [q._id]: !e[q._id] }))} style={{
                          background: isExpanded ? '#fef2f2' : '#fff5f5',
                          border: '1.5px solid #fca5a5', borderRadius: 10,
                          padding: '8px 14px', cursor: 'pointer',
                          color: '#991b1b', fontWeight: 700, fontSize: '0.85rem',
                          width: '100%', textAlign: 'left',
                          display: 'flex', justifyContent: 'space-between',
                        }}>
                          <span>📖 View Answer</span>
                          <span>{isExpanded ? '▲' : '▼'}</span>
                        </button>
                        {isExpanded && (
                          <div style={{ marginTop: 10, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px' }}>
                            <div style={{ color: '#7f1d1d', fontSize: '0.88rem', lineHeight: 1.7 }}>{q.answer}</div>
                            {q.explanation && <div style={{ marginTop: 8, color: '#b91c1c', fontSize: '0.8rem', fontStyle: 'italic' }}>💬 {q.explanation}</div>}
                            <button onClick={() => setAiQ(q)} style={aiBtn}>🤖 AI Tutor</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </div>
        </div>
      </div>

      {aiQ && <AITutor question={aiQ} onClose={() => setAiQ(null)} />}
      </div>
    </PrepLayout>
  );
}

const filterStyle = {
  padding: '6px 12px', borderRadius: 8,
  border: '1.5px solid rgba(255,255,255,0.4)',
  background: 'rgba(255,255,255,0.15)', color: '#fff',
  fontSize: '0.82rem', cursor: 'pointer', outline: 'none',
};

const optionStyle = {
  color: '#1e293b',
  background: '#ffffff'
};
const chip = (active) => ({
  padding: '5px 14px', borderRadius: 20,
  border: active ? 'none' : '1.5px solid rgba(255,255,255,0.5)',
  background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
  color: active ? '#dc2626' : '#fff',
  fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
});
const aiBtn = {
  marginTop: 10,
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  color: '#fff', border: 'none', borderRadius: 8,
  padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
};
