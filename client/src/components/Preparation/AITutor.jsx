import React, { useState, useEffect, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function AITutor({ question, onClose }) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!question) return;
    setLoading(true);
    setExplanation('');
    fetch(`${API}/api/preparation/ai-tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.question || question.title || question.problemStatement,
        options: question.options || [],
        answer: question.answer || question.explanation,
        explanation: question.explanation,
        topic: question.topic,
      }),
    })
      .then(r => r.json())
      .then(d => {
        setExplanation(d.explanation || '');
        setSource(d.source || 'rule-based');
      })
      .catch(() => setExplanation('Failed to load explanation. Please try again.'))
      .finally(() => setLoading(false));
  }, [question]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Parse markdown-like formatting
  const formatText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:#f1f5f9;padding:1px 5px;border-radius:4px;font-family:monospace">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 10000,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed',
          bottom: 0, right: 0,
          width: 'min(460px, 100vw)',
          height: 'min(85vh, 100vh)',
          background: '#fff',
          borderRadius: '20px 0 0 0',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          @keyframes spin { to { transform: rotate(360deg); } }
          .ai-content::-webkit-scrollbar { width: 5px; }
          .ai-content::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        `}</style>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#1e1b4b,#312e81)',
          padding: '1.2rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
            }}>🤖</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>AI Tutor</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                {source === 'ai' ? '✨ Powered by Gemini AI' : '📚 Expert Explanation'}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: 10,
            width: 36, height: 36, cursor: 'pointer',
            color: '#fff', fontSize: '1rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >✕</button>
        </div>

        {/* Question context */}
        <div style={{
          background: '#f8faff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.9rem 1.5rem',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Question
          </div>
          <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.5 }}>
            {(question?.question || question?.title || question?.problemStatement || '').substring(0, 180)}
            {(question?.question || question?.title || '').length > 180 && '…'}
          </div>
        </div>

        {/* Content */}
        <div className="ai-content" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
        }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '4px solid #e2e8f0',
                borderTopColor: '#6366f1',
                animation: 'spin 0.8s linear infinite',
              }} />
              <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>
                Generating explanation…
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                AI is analyzing the question
              </div>
            </div>
          ) : (
            <div>
              {source === 'ai' && (
                <div style={{
                  background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)',
                  border: '1px solid #bfdbfe',
                  borderRadius: 12, padding: '10px 14px',
                  marginBottom: 16,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: '1rem' }}>✨</span>
                  <span style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: 600 }}>
                    AI-generated explanation using Gemini 1.5 Flash
                  </span>
                </div>
              )}
              <div
                style={{
                  fontSize: '0.88rem', color: '#334155',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                }}
                dangerouslySetInnerHTML={{ __html: formatText(explanation) }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.9rem 1.5rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8faff',
          flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            💡 Tip: Press <kbd style={{ background: '#e2e8f0', borderRadius: 4, padding: '1px 5px', fontSize: '0.7rem' }}>Esc</kbd> to close
          </span>
          <button onClick={onClose} style={{
            background: '#1e293b', color: '#fff',
            border: 'none', borderRadius: 8,
            padding: '7px 16px', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.8rem',
          }}>Got it ✓</button>
        </div>
      </div>
    </>
  );
}
