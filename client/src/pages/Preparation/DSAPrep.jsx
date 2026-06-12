import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import AITutor from '../../components/Preparation/AITutor.jsx';
import PrepLayout from '../../components/Preparation/PrepLayout.jsx';
import api from '../../api/index.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const DIFF_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const DSA_TOPIC_ICONS = {
  Arrays: '📊', 'Linked List': '🔗', Stack: '📚', Queue: '🚶',
  'Binary Search': '🔍', Trees: '🌲', Graphs: '🕸️', 'Dynamic Programming': '🧩',
  Sorting: '↕️', Hashing: '🔑',
};

const getPageRange = (current, total) => {
  const range = [];
  const delta = 2;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  const result = [];
  let prev = null;
  for (const i of range) {
    if (prev !== null) {
      if (i - prev === 2) {
        result.push(prev + 1);
      } else if (i - prev > 2) {
        result.push('...');
      }
    }
    result.push(i);
    prev = i;
  }
  return result;
};

export default function DSAPrep() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || '');

  const handleCatChange = (e) => {
    const val = e.target.value;
    if (val.startsWith('/preparation/')) {
      navigate(val);
    } else {
      navigate(`/preparation/aptitude?category=${encodeURIComponent(val)}`);
    }
  };

  useEffect(() => {
    setSelectedTopic(searchParams.get('topic') || '');
  }, [searchParams]);
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [showCode, setShowCode] = useState({});
  const [solved, setSolved] = useState({});
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [aiQ, setAiQ] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      api.get('/preparation/progress')
        .then(res => {
          if (res.data && res.data.solvedQuestions) {
            const solvedMap = {};
            res.data.solvedQuestions.forEach(q => {
              if (q.category === 'DSA') {
                solvedMap[q.questionId] = true;
              }
            });
            setSolved(solvedMap);
          }
        })
        .catch(err => console.error('Error fetching progress:', err));
    }
  }, [token]);

  useEffect(() => {
    document.title = 'DSA Practice | Preparation Hub';
    fetch(`${API}/api/preparation/dsa/topics`)
      .then(r => r.json())
      .then(d => setTopics(d.topics || []));
  }, []);

  const loadQuestions = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 10 });
    if (selectedTopic) params.set('topic', selectedTopic);
    if (difficulty) params.set('difficulty', difficulty);
    fetch(`${API}/api/preparation/dsa?${params}`)
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions || []);
        setTotalPages(d.pages || 1);
        setPage(p);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQuestions(1); }, [selectedTopic, difficulty]);

  const markSolved = async (q) => {
    if (!token) return;
    setSolved(s => ({ ...s, [q._id]: true }));
    try {
      await api.post('/preparation/progress/solve', {
        questionId: q._id,
        category: 'DSA',
        topic: q.topic,
      });
    } catch (err) {
      console.error('Error marking question solved:', err);
    }
  };

  return (
    <PrepLayout>
      <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter,sans-serif' }}>
      {/* Compact Header */}
      <div style={{ background: 'linear-gradient(135deg,#10b981,#34d399)', padding: '0.7rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minHeight: 64 }}>

          {/* Left: icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 8px', lineHeight: 1 }}>🌲</span>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
                Data Structures & Algorithms
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>
                Array to DP — with code solutions, explanations & AI Tutor
              </p>
            </div>
          </div>

          {/* Right: topic chips + filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            <button onClick={() => setSearchParams({})} style={topicChip(selectedTopic === '')}>All Topics</button>
            {topics.map(t => (
              <button key={t} onClick={() => setSearchParams({ topic: t })} style={topicChip(selectedTopic === t)}>
                {DSA_TOPIC_ICONS[t] || '📌'} {t}
              </button>
            ))}
            <select value="/preparation/dsa" onChange={handleCatChange} style={filterStyle}>
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

            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={filterStyle}>
              <option value="" style={optionStyle}>All Levels</option>
              <option value="Easy" style={optionStyle}>Easy</option>
              <option value="Medium" style={optionStyle}>Medium</option>
              <option value="Hard" style={optionStyle}>Hard</option>
            </select>
          </div>

        </div>
      </div>

      <div style={{ maxWidth: selectedTopic ? 1200 : 900, margin: '0 auto', padding: '1.5rem 1rem' }}>
        {selectedTopic ? (
          <>
            {/* Breadcrumb */}
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
              <Link to="/" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🏠</span> Home
              </Link>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span onClick={() => setSearchParams({})} style={{ color: '#10b981', cursor: 'pointer', fontWeight: 600 }}>DSA Practice</span>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span style={{ fontWeight: 700, color: '#475569' }}>{selectedTopic}</span>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Left Sidebar */}
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
                    <button style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '11px 14px', background: '#f0fdf4', border: 'none', textAlign: 'left', cursor: 'default', color: '#10b981', fontWeight: 700, fontSize: '0.83rem' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, flexShrink: 0 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <polyline points="9 11 12 14 17 9" strokeWidth="3" />
                      </svg>
                      Practice Problems
                    </button>
                  </div>

                  {/* Difficulty Filter */}
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Difficulty
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                    {['', 'Easy', 'Medium', 'Hard'].map(d => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 12px', borderRadius: 7, border: 'none',
                          background: difficulty === d ? (d === 'Easy' ? '#dcfce7' : d === 'Medium' ? '#fef3c7' : d === 'Hard' ? '#fee2e2' : '#f0fdf4') : 'transparent',
                          color: difficulty === d ? (d === 'Easy' ? '#166534' : d === 'Medium' ? '#92400e' : d === 'Hard' ? '#991b1b' : '#10b981') : '#64748b',
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

                  {/* Topics Filter */}
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Topics
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {topics.map(t => (
                      <button
                        key={t}
                        onClick={() => setSearchParams({ topic: t })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 12px', borderRadius: 7, border: 'none',
                          background: selectedTopic === t ? '#f0fdf4' : 'transparent',
                          color: selectedTopic === t ? '#10b981' : '#475569',
                          fontWeight: selectedTopic === t ? 700 : 500,
                          fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'all 0.15s',
                          borderLeft: selectedTopic === t ? '3px solid #10b981' : '3px solid transparent',
                        }}>
                        <span>{DSA_TOPIC_ICONS[t] || '📌'}</span>
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Page indicator */}
                  {totalPages > 1 && (
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                      Page {page} of {totalPages}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Content */}
              <div style={{ flex: 1, minWidth: 280 }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#10b981' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>Loading...
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {questions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>No questions found.</div>
                    ) : questions.map((q) => (
                      <div key={q._id} style={{
                        background: '#fff', borderRadius: 14,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        border: `1.5px solid ${solved[q._id] ? '#10b981' : '#e2e8f0'}`,
                        overflow: 'hidden', transition: 'border-color 0.3s',
                      }}>
                        <div style={{
                          padding: '1rem 1.25rem',
                          background: solved[q._id] ? '#f0fdf4' : '#fff',
                          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
                          cursor: 'pointer',
                        }} onClick={() => setExpanded(e => ({ ...e, [q._id]: !e[q._id] }))}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                              <span style={{ background: `${DIFF_COLORS[q.difficulty]}15`, color: DIFF_COLORS[q.difficulty], borderRadius: 20, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700 }}>{q.difficulty}</span>
                              <span style={{ background: '#f0fdf4', color: '#10b981', borderRadius: 20, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 600 }}>{DSA_TOPIC_ICONS[q.topic] || '📌'} {q.topic}</span>
                            </div>
                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{q.title}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                            {solved[q._id] && <span style={{ background: '#10b981', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>✓ Solved</span>}
                            <span style={{ color: '#94a3b8', fontSize: '1rem' }}>{expanded[q._id] ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {expanded[q._id] && (
                          <div style={{ borderTop: '1px solid #e2e8f0', padding: '1.25rem' }}>
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', marginBottom: 6 }}>📋 PROBLEM</div>
                              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.7, border: '1px solid #e2e8f0' }}>{q.problemStatement}</div>
                            </div>
                            <div style={{ marginBottom: 14 }}>
                              <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', marginBottom: 6 }}>💡 EXPLANATION</div>
                              <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '12px 14px', color: '#166534', fontSize: '0.88rem', lineHeight: 1.7, border: '1px solid #bbf7d0' }}>{q.explanation}</div>
                            </div>
                            <button onClick={() => setShowCode(c => ({ ...c, [q._id]: !c[q._id] }))} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{'</>'}</span>
                              {showCode[q._id] ? 'Hide Code Solution' : 'View Code Solution'}
                            </button>
                            {showCode[q._id] && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 14 }}>
                                <div style={{ display: 'flex', background: '#1e293b', borderRadius: '12px 12px 0 0', padding: '6px 6px 0 6px', gap: 4, border: '1px solid #334155', borderBottom: 'none', overflowX: 'auto' }}>
                                  {[
                                    { id: 'javascript', label: 'JavaScript', icon: '🟨' },
                                    { id: 'cpp', label: 'C++', icon: '🟦' },
                                    { id: 'java', label: 'Java', icon: '☕' },
                                    { id: 'python', label: 'Python', icon: '🐍' }
                                  ].map(lang => {
                                    const isActive = selectedLang === lang.id;
                                    return (
                                      <button key={lang.id} onClick={() => setSelectedLang(lang.id)} style={{ background: isActive ? '#0f172a' : 'transparent', color: isActive ? '#10b981' : '#94a3b8', border: 'none', borderRadius: '8px 8px 0 0', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent', outline: 'none' }}
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#e2e8f0'; } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#94a3b8'; } }}>
                                        <span>{lang.icon}</span>{lang.label}
                                      </button>
                                    );
                                  })}
                                </div>
                                <pre style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: '0 0 12px 12px', padding: '1.2rem', fontSize: '0.82rem', lineHeight: 1.7, overflowX: 'auto', margin: 0, fontFamily: "'Fira Code', 'Cascadia Code', monospace", border: '1px solid #334155', borderTop: 'none' }}>
                                  <code>{selectedLang === 'cpp' && q.solutionCodeCpp ? q.solutionCodeCpp : selectedLang === 'java' && q.solutionCodeJava ? q.solutionCodeJava : selectedLang === 'python' && q.solutionCodePython ? q.solutionCodePython : q.solutionCode}</code>
                                </pre>
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {!solved[q._id] && (
                                <button onClick={() => markSolved(q)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>✓ Mark as Solved</button>
                              )}
                              <button onClick={() => setAiQ({ ...q, question: q.problemStatement, answer: q.explanation, topic: q.topic })} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>🤖 AI Tutor</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>

        ) : (
          // No topic selected -> show topic cards grid + general practice pool
          <>
            {/* Topic Selection Grid */}
            <div style={{ marginBottom: 36 }}>
              <div style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                marginBottom: 28
              }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                  🌲 Select a DSA Topic to Practice
                </h2>
                <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Choose any topic below to access detailed problem sets, code solutions, and AI tutor.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 16
              }}>
                {topics.map(topic => (
                  <div
                    key={topic}
                    onClick={() => setSearchParams({ topic })}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: '#f0fdf4',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                      }}>
                        {DSA_TOPIC_ICONS[topic] || '📌'}
                      </div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                        {topic}
                      </div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4, flex: 1, marginBottom: 12 }}>
                      Practice problems and algorithm challenges on {topic}.
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#10b981'
                    }}>
                      <span>Start Practicing</span>
                      <span>→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Practice Pool */}
            <div style={{ marginTop: 32 }}>
              <div style={{
                borderLeft: '4px solid #10b981',
                paddingLeft: '12px',
                marginBottom: 20
              }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                  🎯 General Practice Pool
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  A pool of problems from all DSA topics combined.
                </p>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#10b981' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>Loading...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {questions.map((q) => (
                <div key={q._id} style={{
                  background: '#fff', borderRadius: 14,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: `1.5px solid ${solved[q._id] ? '#10b981' : '#e2e8f0'}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.3s',
                }}>
                  {/* Problem Header */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    background: solved[q._id] ? '#f0fdf4' : '#fff',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
                    cursor: 'pointer',
                  }} onClick={() => setExpanded(e => ({ ...e, [q._id]: !e[q._id] }))}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          background: `${DIFF_COLORS[q.difficulty]}15`,
                          color: DIFF_COLORS[q.difficulty],
                          borderRadius: 20, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700,
                        }}>{q.difficulty}</span>
                        <span style={{
                          background: '#f0fdf4', color: '#10b981',
                          borderRadius: 20, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 600,
                        }}>{DSA_TOPIC_ICONS[q.topic] || '📌'} {q.topic}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>
                        {q.title}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      {solved[q._id] && (
                        <span style={{
                          background: '#10b981', color: '#fff',
                          borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700,
                        }}>✓ Solved</span>
                      )}
                      <span style={{ color: '#94a3b8', fontSize: '1rem' }}>
                        {expanded[q._id] ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expanded[q._id] && (
                    <div style={{ borderTop: '1px solid #e2e8f0', padding: '1.25rem' }}>
                      {/* Problem Statement */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', marginBottom: 6 }}>📋 PROBLEM</div>
                        <div style={{
                          background: '#f8fafc', borderRadius: 10,
                          padding: '12px 14px', color: '#1e293b',
                          fontSize: '0.9rem', lineHeight: 1.7,
                          border: '1px solid #e2e8f0',
                        }}>
                          {q.problemStatement}
                        </div>
                      </div>

                      {/* Explanation */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', marginBottom: 6 }}>💡 EXPLANATION</div>
                        <div style={{
                          background: '#f0fdf4', borderRadius: 10,
                          padding: '12px 14px', color: '#166534',
                          fontSize: '0.88rem', lineHeight: 1.7,
                          border: '1px solid #bbf7d0',
                        }}>
                          {q.explanation}
                        </div>
                      </div>

                      {/* Solution Code toggle */}
                      <button onClick={() => setShowCode(c => ({ ...c, [q._id]: !c[q._id] }))} style={{
                        background: showCode[q._id] ? '#1e293b' : '#0f172a',
                        color: '#fff', border: 'none', borderRadius: 10,
                        padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700,
                        cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <span>{'</>'}</span>
                        {showCode[q._id] ? 'Hide Code Solution' : 'View Code Solution'}
                      </button>

                      {showCode[q._id] && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 14 }}>
                          <div style={{
                            display: 'flex',
                            background: '#1e293b',
                            borderRadius: '12px 12px 0 0',
                            padding: '6px 6px 0 6px',
                            gap: 4,
                            border: '1px solid #334155',
                            borderBottom: 'none',
                            overflowX: 'auto',
                          }}>
                            {[
                              { id: 'javascript', label: 'JavaScript', icon: '🟨' },
                              { id: 'cpp', label: 'C++', icon: '🟦' },
                              { id: 'java', label: 'Java', icon: '☕' },
                              { id: 'python', label: 'Python', icon: '🐍' }
                            ].map(lang => {
                              const isActive = selectedLang === lang.id;
                              return (
                                <button
                                  key={lang.id}
                                  onClick={() => setSelectedLang(lang.id)}
                                  style={{
                                    background: isActive ? '#0f172a' : 'transparent',
                                    color: isActive ? '#10b981' : '#94a3b8',
                                    border: 'none',
                                    borderRadius: '8px 8px 0 0',
                                    padding: '8px 16px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    transition: 'all 0.2s ease',
                                    borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
                                    outline: 'none',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isActive) {
                                      e.currentTarget.style.color = '#e2e8f0';
                                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isActive) {
                                      e.currentTarget.style.color = '#94a3b8';
                                      e.currentTarget.style.background = 'transparent';
                                    }
                                  }}
                                >
                                  <span>{lang.icon}</span>
                                  {lang.label}
                                </button>
                              );
                            })}
                          </div>
                          <pre style={{
                            background: '#0f172a', color: '#e2e8f0',
                            borderRadius: '0 0 12px 12px', padding: '1.2rem',
                            fontSize: '0.82rem', lineHeight: 1.7,
                            overflowX: 'auto', margin: 0,
                            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                            border: '1px solid #334155',
                            borderTop: 'none',
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
                          }}>
                            <code>{
                              selectedLang === 'cpp' && q.solutionCodeCpp ? q.solutionCodeCpp :
                              selectedLang === 'java' && q.solutionCodeJava ? q.solutionCodeJava :
                              selectedLang === 'python' && q.solutionCodePython ? q.solutionCodePython :
                              q.solutionCode
                            }</code>
                          </pre>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {!solved[q._id] && (
                          <button onClick={() => markSolved(q)} style={{
                            background: '#10b981', color: '#fff',
                            border: 'none', borderRadius: 8,
                            padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                          }}>✓ Mark as Solved</button>
                        )}
                        <button onClick={() => setAiQ({ ...q, question: q.problemStatement, answer: q.explanation, topic: q.topic })} style={{
                          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                          color: '#fff', border: 'none', borderRadius: 8,
                          padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                        }}>🤖 AI Tutor</button>
                      </div>
                    </div>
                  )}
                </div>
                  ))}

                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <button disabled={page === 1} onClick={() => loadQuestions(page - 1)}
                        style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: page === 1 ? '#cbd5e1' : '#475569', fontWeight: 700, cursor: page === 1 ? 'default' : 'pointer' }}>
                        ‹ Prev
                      </button>
                      {getPageRange(page, totalPages).map((p, idx) => {
                        if (p === '...') {
                          return <span key={`ell-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, color: '#94a3b8', fontWeight: 700 }}>...</span>;
                        }
                        return (
                          <button key={p} onClick={() => loadQuestions(p)}
                            style={{
                              width: 38, height: 38, borderRadius: 8,
                              border: page === p ? 'none' : '1px solid #e2e8f0',
                              background: page === p ? '#10b981' : '#fff',
                              color: page === p ? '#fff' : '#475569',
                              fontWeight: 700, cursor: 'pointer',
                            }}>{p}</button>
                        );
                      })}
                      <button disabled={page === totalPages} onClick={() => loadQuestions(page + 1)}
                        style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: page === totalPages ? '#cbd5e1' : '#475569', fontWeight: 700, cursor: page === totalPages ? 'default' : 'pointer' }}>
                        Next ›
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
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
const topicChip = (active) => ({
  padding: '4px 12px', borderRadius: 20,
  border: active ? 'none' : '1.5px solid rgba(255,255,255,0.5)',
  background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
  color: active ? '#10b981' : '#fff',
  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
  backdropFilter: 'blur(4px)',
});
