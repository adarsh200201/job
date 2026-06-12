import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PrepLayout from '../../components/Preparation/PrepLayout.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TYPE_COLORS = {
  Aptitude: '#6366f1', Technical: '#0ea5e9',
  Placement: '#f59e0b', Government: '#ef4444',
};

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleCatChange = (e) => {
    const val = e.target.value;
    if (val.startsWith('/preparation/')) {
      navigate(val);
    } else {
      navigate(`/preparation/aptitude?category=${encodeURIComponent(val)}`);
    }
  };

  useEffect(() => {
    document.title = 'Mock Tests | Preparation Hub';
    fetch(`${API}/api/preparation/mock-tests`)
      .then(r => r.json())
      .then(d => setTests(d.tests || []))
      .finally(() => setLoading(false));
  }, []);

  const startTest = async (test) => {
    const resp = await fetch(`${API}/api/preparation/mock-tests/${test._id}`);
    const d = await resp.json();
    setTestData(d.test);
    setActiveTest(test);
    setAnswers({});
    setCurrentQ(0);
    setTimeLeft(d.test.duration * 60);
    setSubmitted(false);
    setResult(null);
  };

  // Timer countdown
  useEffect(() => {
    if (!testData || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [testData, submitted]);

  const handleSubmit = (autoSubmit = false) => {
    clearInterval(timerRef.current);
    const qs = testData?.questions || [];
    let correct = 0, wrong = 0;
    qs.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
      else if (answers[i]) wrong++;
    });
    const score = Math.round((correct / qs.length) * 100);
    const durationTaken = testData.duration * 60 - timeLeft;
    setResult({ correct, wrong, skipped: qs.length - correct - wrong, score, total: qs.length, durationTaken, questions: qs });
    setSubmitted(true);

    // Post progress if logged in
    if (token && testData) {
      fetch(`${API}/api/preparation/progress/submit-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          testId: testData._id,
          testTitle: testData.title,
          score, totalQuestions: qs.length,
          correctAnswers: correct, wrongAnswers: wrong, durationTaken,
        }),
      }).catch(() => {});
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Test List ──
  if (!activeTest) {
    return (
      <PrepLayout>
        <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter,sans-serif' }}>
        {/* Compact Header — single row style */}
        <div style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', padding: '0.7rem 1.5rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minHeight: 64 }}>
            
            {/* Left: icon + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: '1.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 8px', lineHeight: 1 }}>📝</span>
              <div>
                <h1 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
                  Mock Tests
                </h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>
                  Timed practice tests with detailed score report
                </p>
              </div>
            </div>

            {/* Right: category navigation dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
              <select value="/preparation/mock-tests" onChange={handleCatChange} style={filterStyle}>
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
            </div>

          </div>
        </div>

      <div style={{ maxWidth: 860, margin: '2rem auto', padding: '0 1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7c3aed' }}>
              <div style={{ fontSize: '2rem' }}>⏳</div> Loading tests...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {tests.map((t) => (
                <div key={t._id} style={{
                  background: '#fff', borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{
                    background: `linear-gradient(135deg,${TYPE_COLORS[t.type] || '#6366f1'},${TYPE_COLORS[t.type] || '#6366f1'}cc)`,
                    padding: '1.25rem',
                  }}>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>{t.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', marginTop: 4 }}>
                      ⏱️ {t.duration} minutes
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                      <span style={{
                        background: `${TYPE_COLORS[t.type] || '#6366f1'}15`,
                        color: TYPE_COLORS[t.type] || '#6366f1',
                        borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700,
                      }}>{t.type}</span>
                    </div>
                    <button onClick={() => startTest(t)} style={{
                      width: '100%',
                      background: TYPE_COLORS[t.type] || '#6366f1',
                      color: '#fff', border: 'none',
                      borderRadius: 10, padding: '10px',
                      fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                      transition: 'opacity 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      🚀 Start Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </PrepLayout>
    );
  }

  // ── Result Screen ──
  if (submitted && result) {
    const pct = result.score;
    const grade = pct >= 80 ? '🏆 Excellent' : pct >= 60 ? '✅ Good' : pct >= 40 ? '📈 Average' : '📚 Needs Work';
    const gradeColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#6366f1' : pct >= 40 ? '#f59e0b' : '#ef4444';
    return (
      <PrepLayout>
        <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter,sans-serif', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Score Card */}
          <div style={{
            background: '#fff', borderRadius: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden', marginBottom: 24,
          }}>
            <div style={{
              background: `linear-gradient(135deg,${gradeColor},${gradeColor}bb)`,
              padding: '2rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff' }}>{result.score}%</div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1.3rem', marginTop: 4 }}>{grade}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginTop: 4 }}>{activeTest.title}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
              {[
                { label: 'Correct', value: result.correct, color: '#10b981', bg: '#f0fdf4' },
                { label: 'Wrong', value: result.wrong, color: '#ef4444', bg: '#fef2f2' },
                { label: 'Skipped', value: result.skipped, color: '#f59e0b', bg: '#fffbeb' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.bg, padding: '1.2rem', textAlign: 'center',
                  borderTop: '1px solid #e2e8f0',
                  borderRight: i < 2 ? '1px solid #e2e8f0' : 'none',
                }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ color: s.color, fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Q Review */}
          <h2 style={{ fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>📋 Question Review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.questions.map((q, i) => {
              const ua = answers[i];
              const correct = ua === q.answer;
              return (
                <div key={i} style={{
                  background: '#fff', borderRadius: 14,
                  border: `2px solid ${correct ? '#10b981' : ua ? '#ef4444' : '#e2e8f0'}`,
                  padding: '1rem 1.25rem',
                }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.8rem' }}>Q{i + 1}</span>
                    {correct ? (
                      <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 700 }}>✅ Correct</span>
                    ) : ua ? (
                      <span style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700 }}>❌ Wrong</span>
                    ) : (
                      <span style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700 }}>⏭️ Skipped</span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {q.questionText}
                  </p>
                  <div style={{ fontSize: '0.82rem', color: '#166534', background: '#f0fdf4', borderRadius: 8, padding: '6px 10px', marginBottom: ua && !correct ? 4 : 0 }}>
                    ✓ Correct Answer: <strong>{q.answer}</strong>
                  </div>
                  {ua && !correct && (
                    <div style={{ fontSize: '0.82rem', color: '#991b1b', background: '#fef2f2', borderRadius: 8, padding: '6px 10px', marginTop: 4 }}>
                      ✗ Your Answer: <strong>{ua}</strong>
                    </div>
                  )}
                  {q.explanation && (
                    <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, fontStyle: 'italic' }}>
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={() => { setActiveTest(null); setTestData(null); }} style={{
              background: '#1e293b', color: '#fff', border: 'none',
              borderRadius: 12, padding: '12px 28px', fontWeight: 700,
              fontSize: '0.95rem', cursor: 'pointer',
            }}>← Back to Tests</button>
          </div>
        </div>
        </div>
      </PrepLayout>
    );
  }

  // ── Active Test ──
  const qs = testData?.questions || [];
  const q = qs[currentQ];
  const urgent = timeLeft <= 60;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: 'Inter,sans-serif', color: '#e2e8f0' }}>
      {/* Top Bar */}
      <div style={{
        background: '#1e293b',
        padding: '0.75rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #334155',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{testData?.title}</div>
        <div style={{
          background: urgent ? '#ef4444' : '#10b981',
          color: '#fff', fontWeight: 800, fontSize: '1.2rem',
          borderRadius: 10, padding: '4px 16px',
          transition: 'background 0.5s',
        }}>
          ⏱️ {formatTime(timeLeft)}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
          {currentQ + 1} / {qs.length}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
        {/* Progress bar */}
        <div style={{ height: 6, background: '#1e293b', borderRadius: 99, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((currentQ + 1) / qs.length) * 100}%`,
            background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
            transition: 'width 0.3s',
          }} />
        </div>

        {/* Question */}
        <div style={{
          background: '#1e293b', borderRadius: 18,
          padding: '2rem', marginBottom: 20,
          border: '1px solid #334155',
        }}>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: 12 }}>
            QUESTION {currentQ + 1}
          </div>
          <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.7, color: '#f1f5f9' }}>
            {q?.questionText}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {q?.options.map((opt, i) => {
            const chosen = answers[currentQ] === opt;
            return (
              <button key={i}
                onClick={() => setAnswers(a => ({ ...a, [currentQ]: opt }))}
                style={{
                  background: chosen ? 'rgba(99,102,241,0.2)' : '#1e293b',
                  border: `2px solid ${chosen ? '#6366f1' : '#334155'}`,
                  borderRadius: 14, padding: '14px 18px',
                  textAlign: 'left', cursor: 'pointer',
                  color: chosen ? '#a5b4fc' : '#e2e8f0',
                  fontSize: '0.92rem', fontWeight: chosen ? 700 : 400,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!chosen) e.currentTarget.style.borderColor = '#4f46e5'; }}
                onMouseLeave={e => { if (!chosen) e.currentTarget.style.borderColor = '#334155'; }}
              >
                <span style={{ fontWeight: 800, marginRight: 10, color: '#6366f1' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            style={{
              background: currentQ === 0 ? '#1e293b' : '#334155',
              color: currentQ === 0 ? '#475569' : '#e2e8f0',
              border: 'none', borderRadius: 10,
              padding: '10px 20px', cursor: currentQ === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: '0.85rem',
            }}>← Prev</button>

          {/* Q Navigator bubbles */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 300 }}>
            {qs.map((_, i) => (
              <button key={i} onClick={() => setCurrentQ(i)} style={{
                width: 32, height: 32, borderRadius: 8,
                border: i === currentQ ? '2px solid #6366f1' : 'none',
                background: answers[i] ? '#10b981' : i === currentQ ? '#1e3a5f' : '#1e293b',
                color: answers[i] ? '#fff' : '#94a3b8',
                fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer',
              }}>{i + 1}</button>
            ))}
          </div>

          {currentQ < qs.length - 1 ? (
            <button onClick={() => setCurrentQ(q => q + 1)} style={{
              background: '#6366f1', color: '#fff',
              border: 'none', borderRadius: 10,
              padding: '10px 20px', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem',
            }}>Next →</button>
          ) : (
            <button onClick={() => handleSubmit()} style={{
              background: '#10b981', color: '#fff',
              border: 'none', borderRadius: 10,
              padding: '10px 20px', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem',
            }}>Submit ✓</button>
          )}
        </div>
      </div>
    </div>
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
