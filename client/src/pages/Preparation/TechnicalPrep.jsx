import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import AITutor from '../../components/Preparation/AITutor.jsx';
import PrepLayout from '../../components/Preparation/PrepLayout.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const DIFF_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const TOPIC_ICONS = {
  JavaScript: '🟨', React: '⚛️', 'Node.js': '🟢', SQL: '🗄️',
  OS: '💾', Networks: '🌐', Python: '🐍', Java: '☕',
};

const TECH_SECTION_LABELS = {
  mcq: 'MCQs',
  interview: 'Interview Q&A'
};

const CheckedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ marginRight: 10, flexShrink: 0 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <polyline points="9 11 12 14 17 9" strokeWidth="3" />
  </svg>
);

const UncheckedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ marginRight: 10, flexShrink: 0 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);

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

export default function TechnicalPrep() {
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
  const [type, setType] = useState('');
  const [activeSection, setActiveSection] = useState('mcq');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});
  const [expanded, setExpanded] = useState({});
  const [aiQ, setAiQ] = useState(null);
  const token = localStorage.getItem('token');

  // Reset to MCQ tab when topic changes
  useEffect(() => {
    setActiveSection('mcq');
  }, [selectedTopic]);

  useEffect(() => {
    document.title = 'Technical MCQ | Preparation Hub';
    fetch(`${API}/api/preparation/technical/topics`)
      .then(r => r.json())
      .then(d => setTopics(d.topics || []));
  }, []);

  const loadQuestions = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 8 });
    if (selectedTopic) {
      params.set('topic', selectedTopic);
      params.set('type', activeSection === 'mcq' ? 'MCQ' : 'Interview');
    } else {
      if (type) params.set('type', type);
    }
    if (difficulty) params.set('difficulty', difficulty);
    fetch(`${API}/api/preparation/technical?${params}`)
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions || []);
        setTotalPages(d.pages || 1);
        setPage(p);
        setSelected({});
        setRevealed({});
        setExpanded({});
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQuestions(1); }, [selectedTopic, type, difficulty, activeSection]);

  const markSolved = async (q) => {
    if (!token) return;
    try {
      await fetch(`${API}/api/preparation/progress/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ questionId: q._id, category: 'Technical', topic: q.topic }),
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
      {/* Compact Header — single row style */}
      <div style={{ background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', padding: '0.7rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minHeight: 64 }}>
          
          {/* Left: icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 8px', lineHeight: 1 }}>💻</span>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
                Technical MCQ & Interview Q&A
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>
                JavaScript, React, SQL, OS, Networks, Java, Python & more
              </p>
            </div>
          </div>

          {/* Right: chips + filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            {/* Topic Chips */}
            <button onClick={() => setSearchParams({})}
              style={topicChip(selectedTopic === '')}>All Topics</button>
            {topics.map(t => (
              <button key={t} onClick={() => setSearchParams({ topic: t })}
                style={topicChip(selectedTopic === t)}>
                {TOPIC_ICONS[t] || '💡'} {t}
              </button>
            ))}

            {/* Filters */}
            <select value="/preparation/technical" onChange={handleCatChange} style={filterStyle}>
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

            {!selectedTopic && (
              <select value={type} onChange={e => setType(e.target.value)} style={filterStyle}>
                <option value="" style={optionStyle}>All Types</option>
                <option value="MCQ" style={optionStyle}>MCQ</option>
                <option value="Interview" style={optionStyle}>Interview Q&A</option>
              </select>
            )}
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={filterStyle}>
              <option value="" style={optionStyle}>All Levels</option>
              <option value="Easy" style={optionStyle}>Easy</option>
              <option value="Medium" style={optionStyle}>Medium</option>
              <option value="Hard" style={optionStyle}>Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: selectedTopic ? 1200 : 860, margin: '0 auto', padding: '1.5rem 1rem' }}>
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
              <Link to="/" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🏠</span> Home
              </Link>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <Link to="/preparation/technical" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>Technical MCQ</Link>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span onClick={() => setActiveSection('mcq')} style={{ color: '#0ea5e9', cursor: 'pointer', fontWeight: 600 }}>{selectedTopic}</span>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span style={{ fontWeight: 700, color: '#475569' }}>{TECH_SECTION_LABELS[activeSection]}</span>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* ── Left Sidebar ── */}
              <div style={{ flex: '0 0 220px', minWidth: 200 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Exercise Selection
                  </p>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                    {Object.entries(TECH_SECTION_LABELS).map(([id, label]) => {
                      const active = activeSection === id;
                      return (
                        <button key={id} onClick={() => setActiveSection(id)}
                          style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '11px 14px', background: active ? '#f0f9ff' : 'transparent', border: 'none', borderBottom: '1px solid #f1f5f9', textAlign: 'left', cursor: 'pointer', color: active ? '#0ea5e9' : '#475569', fontWeight: active ? 700 : 500, fontSize: '0.83rem', transition: 'all 0.15s' }}
                          onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                          {active ? <CheckedIcon /> : <UncheckedIcon />}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Right Content ── */}
              <div style={{ flex: 1, minWidth: 280 }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#0ea5e9' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
                    Loading questions...
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {questions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>No questions found.</div>
                    ) : (
                      questions.map((q, idx) => {
                        const isMCQ = q.type === 'MCQ';
                        const isRevealed = revealed[q._id];
                        const isExpanded = expanded[q._id];
                        const userChoice = selected[q._id];

                        return (
                          <div key={q._id} style={{
                            background: '#fff', borderRadius: 14, overflow: 'hidden',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
                          }}>
                            {/* Q Header */}
                            <div style={{
                              background: isMCQ ? '#f0f9ff' : '#faf5ff',
                              borderBottom: '1px solid #e2e8f0',
                              padding: '10px 16px',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <span style={{
                                  background: isMCQ ? '#0ea5e9' : '#8b5cf6',
                                  color: '#fff', borderRadius: 6,
                                  padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700,
                                }}>{isMCQ ? 'MCQ' : 'Interview'}</span>
                                <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600 }}>
                                  {TOPIC_ICONS[q.topic] || '💡'} {q.topic}
                                </span>
                                <span style={{
                                  background: `${DIFF_COLORS[q.difficulty]}15`,
                                  color: DIFF_COLORS[q.difficulty],
                                  borderRadius: 6, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700,
                                }}>{q.difficulty}</span>
                              </div>
                            </div>

                            <div style={{ padding: '1rem 1.25rem' }}>
                              <p style={{ margin: '0 0 14px', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                {q.question}
                              </p>

                              {isMCQ ? (
                                <>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>
                                    {q.options.map((opt, oi) => {
                                      let bg = '#f8fafc', border = '#e2e8f0', color = '#1e293b';
                                      if (isRevealed) {
                                        if (opt === q.answer) { bg = '#dcfce7'; border = '#10b981'; color = '#166534'; }
                                        else if (opt === userChoice) { bg = '#fee2e2'; border = '#ef4444'; color = '#991b1b'; }
                                      }
                                      return (
                                        <button key={oi} onClick={() => !isRevealed && handleSelect(q._id, opt, q)}
                                          disabled={isRevealed}
                                          style={{
                                            background: bg, border: `1.5px solid ${border}`,
                                            borderRadius: 10, padding: '9px 12px', textAlign: 'left',
                                            cursor: isRevealed ? 'default' : 'pointer',
                                            fontSize: '0.85rem', fontWeight: 500, color, transition: 'all 0.15s',
                                          }}
                                          onMouseEnter={e => { if (!isRevealed) e.currentTarget.style.borderColor = '#0ea5e9'; }}
                                          onMouseLeave={e => { if (!isRevealed) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                        >
                                          <span style={{ fontWeight: 700, marginRight: 6, color: '#0ea5e9' }}>
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
                                      <button onClick={() => setAiQ(q)} style={aiBtn}>🤖 Explain with AI Tutor</button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <button onClick={() => setExpanded(e => ({ ...e, [q._id]: !e[q._id] }))}
                                    style={{
                                      background: isExpanded ? '#f5f3ff' : '#faf5ff',
                                      border: '1.5px solid #c4b5fd',
                                      borderRadius: 10, padding: '10px 16px',
                                      cursor: 'pointer', width: '100%', textAlign: 'left',
                                      color: '#7c3aed', fontWeight: 700, fontSize: '0.85rem',
                                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    }}>
                                    <span>📖 View Model Answer</span>
                                    <span style={{ fontSize: '0.7rem' }}>{isExpanded ? '▲ Hide' : '▼ Show'}</span>
                                  </button>
                                  {isExpanded && (
                                    <div style={{ marginTop: 10, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '12px 14px' }}>
                                      <div style={{ fontWeight: 700, color: '#7c3aed', fontSize: '0.82rem', marginBottom: 6 }}>💡 Model Answer</div>
                                      <div style={{ color: '#4c1d95', fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{q.answer}</div>
                                      {q.explanation && (
                                        <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#7c3aed', fontStyle: 'italic' }}>
                                          💬 {q.explanation}
                                        </div>
                                      )}
                                      <button onClick={() => setAiQ(q)} style={aiBtn}>🤖 Explain with AI Tutor</button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Pagination */}
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
                                background: page === p ? '#0ea5e9' : '#fff',
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
            </div>
          </>
        ) : (
          // No topic selected -> show cards grid + general practice pool below
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
                  📖 Select a Topic to Practice
                </h2>
                <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Choose any topic below to access detailed multiple choice questions and interview preparation.
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                gap: 16 
              }}>
                {topics.map(topic => (
                  <Link 
                    key={topic} 
                    to={`/preparation/technical?topic=${encodeURIComponent(topic)}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                    className="topic-card-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          background: '#f0f2ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          fontWeight: 700
                        }}>
                          {TOPIC_ICONS[topic] || '💡'}
                        </div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem' }}>
                          {topic}
                        </div>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4, flex: 1, marginBottom: 12 }}>
                        Practice multiple choice questions and interview Q&A on {topic}.
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#4f46e5'
                      }}>
                        <span>Start Practice</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* General Practice Pool */}
            <div style={{ marginTop: 32 }}>
              <div style={{ 
                borderLeft: '4px solid #0ea5e9', 
                paddingLeft: '12px', 
                marginBottom: 20 
              }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                  🎯 General Practice Pool
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  A pool of questions from all technical topics combined.
                </p>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#0ea5e9' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>Loading questions…
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {questions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>No questions found.</div>
                  ) : (
                    questions.map((q, idx) => {
                      const isMCQ = q.type === 'MCQ';
                      const isRevealed = revealed[q._id];
                      const isExpanded = expanded[q._id];
                      const userChoice = selected[q._id];

                      return (
                        <div key={q._id} style={{
                          background: '#fff', borderRadius: 14, overflow: 'hidden',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
                        }}>
                          {/* Q Header */}
                          <div style={{
                            background: isMCQ ? '#f0f9ff' : '#faf5ff',
                            borderBottom: '1px solid #e2e8f0',
                            padding: '10px 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          }}>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <span style={{
                                background: isMCQ ? '#0ea5e9' : '#8b5cf6',
                                color: '#fff', borderRadius: 6,
                                padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700,
                              }}>{isMCQ ? 'MCQ' : 'Interview'}</span>
                              <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600 }}>
                                {TOPIC_ICONS[q.topic] || '💡'} {q.topic}
                              </span>
                              <span style={{
                                background: `${DIFF_COLORS[q.difficulty]}15`,
                                color: DIFF_COLORS[q.difficulty],
                                borderRadius: 6, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700,
                              }}>{q.difficulty}</span>
                            </div>
                          </div>

                          <div style={{ padding: '1rem 1.25rem' }}>
                            <p style={{ margin: '0 0 14px', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                              {q.question}
                            </p>

                            {isMCQ ? (
                              <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>
                                  {q.options.map((opt, oi) => {
                                    let bg = '#f8fafc', border = '#e2e8f0', color = '#1e293b';
                                    if (isRevealed) {
                                      if (opt === q.answer) { bg = '#dcfce7'; border = '#10b981'; color = '#166534'; }
                                      else if (opt === userChoice) { bg = '#fee2e2'; border = '#ef4444'; color = '#991b1b'; }
                                    }
                                    return (
                                      <button key={oi} onClick={() => !isRevealed && handleSelect(q._id, opt, q)}
                                        disabled={isRevealed}
                                        style={{
                                          background: bg, border: `1.5px solid ${border}`,
                                          borderRadius: 10, padding: '9px 12px', textAlign: 'left',
                                          cursor: isRevealed ? 'default' : 'pointer',
                                          fontSize: '0.85rem', fontWeight: 500, color, transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => { if (!isRevealed) e.currentTarget.style.borderColor = '#0ea5e9'; }}
                                        onMouseLeave={e => { if (!isRevealed) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                      >
                                        <span style={{ fontWeight: 700, marginRight: 6, color: '#0ea5e9' }}>
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
                                    <button onClick={() => setAiQ(q)} style={aiBtn}>🤖 Explain with AI Tutor</button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <button onClick={() => setExpanded(e => ({ ...e, [q._id]: !e[q._id] }))}
                                  style={{
                                    background: isExpanded ? '#f5f3ff' : '#faf5ff',
                                    border: '1.5px solid #c4b5fd',
                                    borderRadius: 10, padding: '10px 16px',
                                    cursor: 'pointer', width: '100%', textAlign: 'left',
                                    color: '#7c3aed', fontWeight: 700, fontSize: '0.85rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  }}>
                                  <span>📖 View Model Answer</span>
                                  <span style={{ fontSize: '0.7rem' }}>{isExpanded ? '▲ Hide' : '▼ Show'}</span>
                                </button>
                                {isExpanded && (
                                  <div style={{ marginTop: 10, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '12px 14px' }}>
                                    <div style={{ fontWeight: 700, color: '#7c3aed', fontSize: '0.82rem', marginBottom: 6 }}>💡 Model Answer</div>
                                    <div style={{ color: '#4c1d95', fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{q.answer}</div>
                                    {q.explanation && (
                                      <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#7c3aed', fontStyle: 'italic' }}>
                                        💬 {q.explanation}
                                      </div>
                                    )}
                                    <button onClick={() => setAiQ(q)} style={aiBtn}>🤖 Explain with AI Tutor</button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Pagination */}
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
                              background: page === p ? '#0ea5e9' : '#fff',
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
  color: active ? '#0ea5e9' : '#fff',
  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
  backdropFilter: 'blur(4px)',
});

const aiBtn = {
  marginTop: 10,
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  color: '#fff', border: 'none', borderRadius: 8,
  padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
};
