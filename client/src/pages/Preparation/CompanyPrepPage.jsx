import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import AITutor from '../../components/Preparation/AITutor.jsx';
import PrepLayout from '../../components/Preparation/PrepLayout.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const DIFF_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const COMPANY_LOGOS = {
  TCS: '🔵', Infosys: '🟢', Wipro: '🟡', Accenture: '🟣',
  Amazon: '🟠', Google: '🔴', Microsoft: '🔷', IBM: '🔹',
};

export default function CompanyPrepPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get('company') || '');

  const handleCatChange = (e) => {
    const val = e.target.value;
    if (val.startsWith('/preparation/')) {
      navigate(val);
    } else {
      navigate(`/preparation/aptitude?category=${encodeURIComponent(val)}`);
    }
  };

  useEffect(() => {
    setSelectedCompany(searchParams.get('company') || '');
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
    document.title = 'Company Wise Prep | Preparation Hub';
    fetch(`${API}/api/preparation/company/list`)
      .then(r => r.json())
      .then(d => setCompanies(d.companies || []));
  }, []);

  const loadQuestions = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 20 });
    if (selectedCompany) params.set('company', selectedCompany);
    if (category) params.set('category', category);
    if (difficulty) params.set('difficulty', difficulty);
    fetch(`${API}/api/preparation/company?${params}`)
      .then(r => r.json())
      .then(d => { setQuestions(d.questions || []); setSelected({}); setRevealed({}); setExpanded({}); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQuestions(); }, [selectedCompany, category, difficulty]);

  const markSolved = async (q) => {
    if (!token) return;
    try {
      await fetch(`${API}/api/preparation/progress/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ questionId: q._id, category: 'Company', topic: q.company }),
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
      {/* Compact Header — single row style */}
      <div style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', padding: '0.7rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minHeight: 64 }}>

          {/* Left: icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 8px', lineHeight: 1 }}>🏢</span>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
                Company Wise Preparation
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>
                TCS, Infosys, Wipro, Amazon, Google & more — actual test patterns
              </p>
            </div>
          </div>

          {/* Right: company chips + filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            {/* Company Chips */}
            <button onClick={() => setSearchParams({})} style={chip(selectedCompany === '')}>All Companies</button>
            {companies.map(c => (
              <button key={c} onClick={() => setSearchParams({ company: c })} style={chip(selectedCompany === c)}>
                {COMPANY_LOGOS[c] || '🏢'} {c}
              </button>
            ))}

            {/* Filters */}
            <select value="/preparation/company" onChange={handleCatChange} style={filterStyle}>
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
              <option value="" style={optionStyle}>All Categories</option>
              <option value="Aptitude" style={optionStyle}>Aptitude</option>
              <option value="Coding" style={optionStyle}>Coding</option>
              <option value="Interview" style={optionStyle}>Interview</option>
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

      <div style={{ maxWidth: selectedCompany ? 1200 : 860, margin: '0 auto', padding: '1.5rem 1rem' }}>
        {selectedCompany ? (
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
              <Link to="/" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🏠</span> Home
              </Link>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span onClick={() => setSearchParams({})} style={{ color: '#f59e0b', cursor: 'pointer', fontWeight: 600 }}>Company Prep</span>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span style={{ fontWeight: 700, color: '#475569' }}>{selectedCompany}</span>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* ── Left Sidebar ── */}
              <div style={{ flex: '0 0 220px', minWidth: 200 }}>
                <div style={{
                  background: '#fff', borderRadius: 12, padding: '1.25rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
                  position: 'sticky', top: 20,
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Exercise Selection
                  </p>

                  {/* Practice Problems active */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                    <button style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '11px 14px', background: '#fffbeb', border: 'none', textAlign: 'left', cursor: 'default', color: '#f59e0b', fontWeight: 700, fontSize: '0.83rem' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ marginRight: 10, flexShrink: 0 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <polyline points="9 11 12 14 17 9" strokeWidth="3" />
                      </svg>
                      Practice Problems
                    </button>
                  </div>

                  {/* Category Filter */}
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Category
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                    {[
                      { val: '', label: 'All Types', icon: '📋' },
                      { val: 'Aptitude', label: 'Aptitude', icon: '🔢' },
                      { val: 'Coding', label: 'Coding', icon: '💻' },
                      { val: 'Interview', label: 'Interview', icon: '🎤' },
                    ].map(c => (
                      <button
                        key={c.val}
                        onClick={() => setCategory && setCategory(c.val)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 12px', borderRadius: 7, border: 'none',
                          background: 'transparent',
                          color: '#64748b',
                          fontWeight: 500,
                          fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'all 0.15s',
                          borderLeft: '3px solid transparent',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fffbeb'; e.currentTarget.style.color = '#d97706'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                        <span>{c.icon}</span>{c.label}
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
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 12px', borderRadius: 7, border: 'none',
                          background: 'transparent',
                          color: '#64748b',
                          fontWeight: 500,
                          fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fffbeb'; e.currentTarget.style.color = '#d97706'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
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

              {/* ── Right Content ── */}
              <div style={{ flex: 1, minWidth: 280 }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#f59e0b' }}>
                    <div style={{ fontSize: '2rem' }}>⏳</div> Loading...
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {questions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>No questions found for {selectedCompany}.</div>
                    ) : (
                      questions.map((q) => {
                        const isInterview = q.category === 'Interview';
                        const isRevealed = revealed[q._id];
                        const isExpanded = expanded[q._id];
                        const userChoice = selected[q._id];
                        return (
                          <div key={q._id} style={{
                            background: '#fff', borderRadius: 14,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0', overflow: 'hidden',
                          }}>
                            {/* Header */}
                            <div style={{
                              background: '#fffbeb', padding: '10px 16px',
                              borderBottom: '1px solid #fde68a',
                              display: 'flex', gap: 8, alignItems: 'center',
                            }}>
                              <span style={{
                                background: '#f59e0b', color: '#fff',
                                borderRadius: 6, padding: '2px 10px',
                                fontSize: '0.72rem', fontWeight: 800,
                              }}>{COMPANY_LOGOS[q.company] || '🏢'} {q.company}</span>
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
                              <p style={{ margin: '0 0 14px', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                {q.question}
                              </p>

                              {!isInterview && q.options && q.options.length > 0 ? (
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
                                            borderRadius: 10, padding: '9px 12px', textAlign: 'left',
                                            cursor: isRevealed ? 'default' : 'pointer',
                                            fontSize: '0.85rem', fontWeight: 500, color, transition: 'all 0.15s',
                                          }}>
                                          <span style={{ fontWeight: 700, marginRight: 6, color: '#f59e0b' }}>
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
                                    background: isExpanded ? '#fef3c7' : '#fffbeb',
                                    border: '1.5px solid #fbbf24', borderRadius: 10,
                                    padding: '9px 14px', cursor: 'pointer',
                                    color: '#92400e', fontWeight: 700, fontSize: '0.85rem',
                                    width: '100%', textAlign: 'left',
                                    display: 'flex', justifyContent: 'space-between',
                                  }}>
                                    <span>📖 View Expected Answer</span>
                                    <span>{isExpanded ? '▲' : '▼'}</span>
                                  </button>
                                  {isExpanded && (
                                    <div style={{ marginTop: 10, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px' }}>
                                      <div style={{ color: '#78350f', fontSize: '0.88rem', lineHeight: 1.7 }}>{q.answer}</div>
                                      {q.explanation && (
                                        <div style={{ marginTop: 8, color: '#92400e', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                          💬 {q.explanation}
                                        </div>
                                      )}
                                      <button onClick={() => setAiQ(q)} style={aiBtn}>🤖 AI Tutor</button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // No company selected -> show company cards grid
          <>
            {/* Company Selection Grid */}
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
                  🏢 Select a Company to Practice
                </h2>
                <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Choose any company below to access interview questions, aptitude problems, and coding challenges.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16
              }}>
                {companies.map(company => (
                  <div
                    key={company}
                    onClick={() => setSearchParams({ company })}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#f59e0b';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(245,158,11,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: '#fffbeb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      marginBottom: 10,
                    }}>
                      {COMPANY_LOGOS[company] || '🏢'}
                    </div>
                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem', marginBottom: 4 }}>{company}</div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: 10 }}>
                      Interview &amp; practice questions
                    </div>
                    <div style={{
                      background: '#fef3c7',
                      color: '#d97706',
                      borderRadius: 20,
                      padding: '3px 12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}>
                      Start Practice →
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Practice Pool */}
            <div>
              <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '12px', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                  🎯 General Practice Pool
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  A mix of questions from all companies combined.
                </p>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#f59e0b' }}>
                  <div style={{ fontSize: '2rem' }}>⏳</div> Loading...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {questions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      <div style={{ fontSize: '3rem' }}>🏢</div>
                      <div style={{ fontWeight: 600, marginTop: 8 }}>Select a company to view questions</div>
                    </div>
                  )}
                  {questions.map((q) => {
                    const isInterview = q.category === 'Interview';
                    const isRevealed = revealed[q._id];
                    const isExpanded = expanded[q._id];
                    const userChoice = selected[q._id];
                    return (
                      <div key={q._id} style={{
                        background: '#fff', borderRadius: 14,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0', overflow: 'hidden',
                      }}>
                        {/* Header */}
                        <div style={{
                          background: '#fffbeb', padding: '10px 16px',
                          borderBottom: '1px solid #fde68a',
                          display: 'flex', gap: 8, alignItems: 'center',
                        }}>
                          <span style={{
                            background: '#f59e0b', color: '#fff',
                            borderRadius: 6, padding: '2px 10px',
                            fontSize: '0.72rem', fontWeight: 800,
                          }}>{COMPANY_LOGOS[q.company] || '🏢'} {q.company}</span>
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
                          <p style={{ margin: '0 0 14px', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            {q.question}
                          </p>

                          {!isInterview && q.options && q.options.length > 0 ? (
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
                                        borderRadius: 10, padding: '9px 12px', textAlign: 'left',
                                        cursor: isRevealed ? 'default' : 'pointer',
                                        fontSize: '0.85rem', fontWeight: 500, color, transition: 'all 0.15s',
                                      }}>
                                      <span style={{ fontWeight: 700, marginRight: 6, color: '#f59e0b' }}>
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
                                background: isExpanded ? '#fef3c7' : '#fffbeb',
                                border: '1.5px solid #fbbf24', borderRadius: 10,
                                padding: '9px 14px', cursor: 'pointer',
                                color: '#92400e', fontWeight: 700, fontSize: '0.85rem',
                                width: '100%', textAlign: 'left',
                                display: 'flex', justifyContent: 'space-between',
                              }}>
                                <span>📖 View Expected Answer</span>
                                <span>{isExpanded ? '▲' : '▼'}</span>
                              </button>
                              {isExpanded && (
                                <div style={{ marginTop: 10, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px' }}>
                                  <div style={{ color: '#78350f', fontSize: '0.88rem', lineHeight: 1.7 }}>{q.answer}</div>
                                  {q.explanation && (
                                    <div style={{ marginTop: 8, color: '#92400e', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                      💬 {q.explanation}
                                    </div>
                                  )}
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

const chip = (active) => ({
  padding: '5px 14px', borderRadius: 20,
  border: active ? 'none' : '1.5px solid rgba(255,255,255,0.5)',
  background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
  color: active ? '#d97706' : '#fff',
  fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
});

const aiBtn = {
  marginTop: 10,
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  color: '#fff', border: 'none', borderRadius: 8,
  padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
};
