import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import AITutor from '../../components/Preparation/AITutor.jsx';
import { getFormulasForTopic, getDSQuestionsForTopic } from './aptitudeData.js';
import PrepLayout from '../../components/Preparation/PrepLayout.jsx';
import api from '../../api/index.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const DIFF_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const SECTION_LABELS = {
  formulas: 'Formulas',
  general: 'General Questions',
  ds1: 'Data Sufficiency 1',
  ds2: 'Data Sufficiency 2',
  ds3: 'Data Sufficiency 3'
};

const filterStyle = {
  padding: '6px 12px', borderRadius: 8,
  border: '1.5px solid rgba(255,255,255,0.4)',
  background: 'rgba(255,255,255,0.15)',
  color: '#fff', fontSize: '0.82rem',
  cursor: 'pointer', fontWeight: 500,
  backdropFilter: 'blur(4px)',
  outline: 'none',
};

const optionStyle = {
  color: '#1e293b',
  background: '#ffffff'
};

const CAT_ICONS = {
  'Quantitative Aptitude': '🧮',
  'Data Interpretation': '📊',
  'Verbal Ability': '📖',
  'Logical Reasoning': '🧠',
  'Verbal Reasoning': '🔤',
  'Non Verbal Reasoning': '🧩',
  'General Knowledge': '📚',
  'Current Affairs Categories': '📰'
};

// ─── Checked & unchecked icons ──────────────────────────────────────
const CheckedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981"
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

// ─── Formula Sheet ───────────────────────────────────────────────────
function FormulaSheet({ topic }) {
  const sections = getFormulasForTopic(topic);
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '2rem 1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
        📖 {topic} – Formulas
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 20px 0' }}>
        Quick reference of key formulas and shortcuts for <strong>{topic}</strong>.
      </p>
      {sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: 24, background: '#fafbfd', borderRadius: 10, padding: '1.1rem', border: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 700, color: '#6366f1' }}>{sec.title}</h4>
          {sec.formulas.map((f, j) => (
            <div key={j} style={{ background: '#fff', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: '4px 8px 8px 4px', padding: '11px 15px', marginBottom: 10 }}>
              <div style={{ fontFamily: 'SFMono-Medium,Consolas,monospace', fontWeight: 700, color: '#1e293b', fontSize: '0.92rem', marginBottom: 4 }}>
                {f.exp}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── IndiaBIX Icons ───────────────────────────────────────────────
const BookIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? '#10b981' : 'none'} stroke={active ? '#10b981' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ChatIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? '#10b981' : 'none'} stroke={active ? '#10b981' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const WorkspaceIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? '#10b981' : 'none'} stroke={active ? '#10b981' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ReportIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? '#ef4444' : 'none'} stroke={active ? '#ef4444' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ─── Workspace / Scratchpad ──────────────────────────────────────────
// ─── Discussion Comments Component ──────────────────────────────────
function DiscussionSection({ questionId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem('comment_username');
    if (saved) return saved;
    return localStorage.getItem('username') || '';
  });
  const [replyingTo, setReplyingTo] = useState(null);
  
  const commentInputRef = useRef(null);

  const getGuestToken = () => {
    let gToken = localStorage.getItem('guest_token');
    if (!gToken) {
      gToken = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      localStorage.setItem('guest_token', gToken);
    }
    return gToken;
  };

  // Auth decoding
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  let currentUserId = null;
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      currentUserId = decoded.id || decoded.sub || null;
    } catch (e) {
      console.error(e);
    }
  }

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/preparation/comments/${questionId}`);
      if (res.data.success) {
        setComments(res.data.comments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questionId) {
      loadComments();
      setReplyingTo(null);
      setNewComment('');
    }
  }, [questionId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const activeName = username.trim();
      if (activeName) {
        localStorage.setItem('comment_username', activeName);
      } else {
        localStorage.removeItem('comment_username');
      }
      
      const payload = {
        questionId,
        comment: newComment,
        username: activeName || 'Anonymous',
        guestToken: getGuestToken()
      };
      if (replyingTo) {
        payload.parentId = replyingTo.commentId;
      }

      const res = await api.post('/preparation/comments', payload);
      if (res.data.success) {
        setNewComment('');
        setReplyingTo(null);
        
        // Save comment ID to local storage so author can delete it later
        const myComments = JSON.parse(localStorage.getItem('my_comments') || '[]');
        myComments.push(res.data.comment._id);
        localStorage.setItem('my_comments', JSON.stringify(myComments));
        
        loadComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['x-guest-token'] = getGuestToken();
      }
      const res = await api.delete(`/preparation/comments/${commentId}`, {
        headers,
        data: { guestToken: getGuestToken() }
      });
      if (res.data.success) {
        loadComments();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleStartReply = (c) => {
    const parentId = c.parentId || c._id;
    setReplyingTo({
      commentId: parentId,
      username: c.username
    });
    setNewComment(`@${c.username.replace(/\s+/g, '_')} `);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const canDelete = (c) => {
    if (isAdmin) return true;
    if (c.userId && currentUserId && c.userId === currentUserId) return true;
    if (!c.userId) {
      const myComments = JSON.parse(localStorage.getItem('my_comments') || '[]');
      if (myComments.includes(c._id)) return true;
    }
    return false;
  };

  const renderCommentText = (text) => {
    const parts = text.split(/(@[a-zA-Z0-9_\-\.]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        return <strong key={idx} style={{ color: '#4f46e5', fontWeight: 600 }}>{part}</strong>;
      }
      return part;
    });
  };

  // Group comments into top level and replies
  const topLevel = comments.filter(c => !c.parentId);
  const replies = comments.filter(c => c.parentId);

  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        💬 Discussion Forum ({comments.length})
      </div>

      <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #f1f5f9', borderRadius: 8, padding: 8, background: '#fafbfd' }}>
        {loading && comments.length === 0 ? (
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', padding: 8 }}>Loading discussion...</div>
        ) : comments.length === 0 ? (
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', padding: 8 }}>No comments yet. Start the discussion below!</div>
        ) : (
          topLevel.map(c => {
            const commentReplies = replies.filter(r => r.parentId === c._id);
            return (
              <div key={c._id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Top Level Comment */}
                <div style={{ background: '#fff', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', marginBottom: 2 }}>
                    <span>👤 {c.username}</span>
                    <span style={{ color: '#94a3b8', fontWeight: 400 }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {renderCommentText(c.comment)}
                  </p>
                  
                  {/* Actions Row */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleStartReply(c)}
                      style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Reply
                    </button>
                    {canDelete(c) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(c._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Nested Replies */}
                {commentReplies.length > 0 && (
                  <div style={{ marginLeft: 16, paddingLeft: 10, borderLeft: '2px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {commentReplies.map(r => (
                      <div key={r._id} style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', marginBottom: 2 }}>
                          <span>👤 {r.username}</span>
                          <span style={{ color: '#94a3b8', fontWeight: 400 }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#334155', lineHeight: 1.4, wordBreak: 'break-word' }}>
                          {renderCommentText(r.comment)}
                        </p>
                        
                        {/* Reply Actions */}
                        <div style={{ display: 'flex', gap: 12, marginTop: 4, alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleStartReply(r)}
                            style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                          >
                            Reply
                          </button>
                          {canDelete(r) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(r._id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {replyingTo && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e0e7ff', padding: '6px 10px', borderRadius: 6, fontSize: '0.72rem', marginBottom: 6, color: '#4338ca', fontWeight: 600 }}>
          <span>Replying to @{replyingTo.username}</span>
          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem' }}
          >
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={handlePostComment} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Your name..."
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '30%', border: '1px solid #cbd5e1', borderRadius: 6, padding: '4px 8px', fontSize: '0.75rem', outline: 'none' }}
          />
          <input
            ref={commentInputRef}
            type="text"
            placeholder={replyingTo ? "Write a reply..." : "Add a comment to this question..."}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            required
            style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: 6, padding: '4px 8px', fontSize: '0.75rem', outline: 'none' }}
          />
          <button
            type="submit"
            disabled={posting}
            style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {posting ? '...' : (replyingTo ? 'Reply' : 'Post')}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Workspace / Scratchpad ──────────────────────────────────────────
function Scratchpad({ questionId }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#475569');
  const [lineWidth] = useState(3);
  const [mode, setMode] = useState('draw'); // 'draw' or 'erase' or 'text'
  const [textToDraw, setTextToDraw] = useState('');
  const [activeTab, setActiveTab] = useState('discuss');

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    if (clientX === undefined || clientY === undefined) return null;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const coords = getCoordinates(e);
    if (!coords) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (mode === 'text') {
      if (!textToDraw.trim()) return;
      ctx.font = '16px Inter, sans-serif';
      ctx.fillStyle = color;
      ctx.fillText(textToDraw, coords.x, coords.y);
      saveDrawing();
      return;
    }
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (mode === 'text') return;
    const coords = getCoordinates(e);
    if (!coords) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = mode === 'erase' ? '#ffffff' : color;
    ctx.lineWidth = mode === 'erase' ? 20 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    if (e.cancelable) e.preventDefault();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveDrawing();
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    localStorage.setItem(`scratchpad_sketch_${questionId}`, canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem(`scratchpad_sketch_${questionId}`);
  };

  useEffect(() => {
    if (activeTab === 'sketch' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth || 500;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const saved = localStorage.getItem(`scratchpad_sketch_${questionId}`);
      if (saved) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = saved;
      }
    }
  }, [activeTab, questionId]);

  return (
    <div style={{ marginTop: 12, border: '1px solid #cbd5e1', borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #cbd5e1', padding: '0 8px' }}>
        <button type="button" onClick={() => setActiveTab('discuss')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'discuss' ? '2.5px solid #10b981' : '2.5px solid transparent', padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: activeTab === 'discuss' ? '#10b981' : '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}>
          💬 Discussion
        </button>
        <button type="button" onClick={() => setActiveTab('sketch')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'sketch' ? '2.5px solid #10b981' : '2.5px solid transparent', padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: activeTab === 'sketch' ? '#10b981' : '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}>
          ✏️ Sketchpad
        </button>
      </div>

      {activeTab === 'discuss' ? (
        <DiscussionSection questionId={questionId} />
      ) : (
        <div style={{ padding: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#475569', '#3b82f6', '#ef4444', '#10b981'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setColor(c); if(mode === 'erase') setMode('draw'); }}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: c,
                    border: color === c && mode !== 'erase' ? '2.5px solid #1e293b' : '1.5px solid #e2e8f0',
                    cursor: 'pointer',
                    padding: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'transform 0.1s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMode(mode === 'draw' ? 'erase' : 'draw')}
              style={{
                background: mode === 'erase' ? '#e2e8f0' : '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {mode === 'erase' ? '✏️ Draw Mode' : '🧽 Eraser'}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === 'text' ? 'draw' : 'text')}
              style={{
                background: mode === 'text' ? '#e2e8f0' : '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              🅰️ Text Mode
            </button>
            {mode === 'text' && (
              <input
                type="text"
                placeholder="Type text, then click canvas..."
                value={textToDraw}
                onChange={e => setTextToDraw(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.75rem',
                  outline: 'none',
                  color: '#1e293b',
                  background: '#fafbfd',
                  width: '180px'
                }}
              />
            )}
            <button
              type="button"
              onClick={clearCanvas}
              style={{
                background: '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#ef4444',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear Canvas
            </button>
          </div>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              width: '100%',
              height: 200,
              display: 'block',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              cursor: mode === 'erase' ? 'cell' : (mode === 'text' ? 'text' : 'crosshair'),
              touchAction: 'none'
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Report Form ─────────────────────────────────────────────────────
function ReportForm({ onSubmit }) {
  const [type, setType] = useState('Wrong Answer');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit) onSubmit({ type, comment });
  };

  if (submitted) {
    return (
      <div style={{ marginTop: 12, padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#166534', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
        🎉 Thank you! Your report has been submitted.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, padding: 12, border: '1px solid #fecaca', borderRadius: 8, background: '#fffafb' }}>
      <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.82rem', marginBottom: 6 }}>⚠️ Report an Issue with this Question</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #fca5a5', fontSize: '0.8rem', background: '#fff', outline: 'none', color: '#1e293b' }}>
          <option value="Wrong Answer">Wrong Answer</option>
          <option value="Formatting / Typo Issue">Formatting / Typo Issue</option>
          <option value="Missing Explanation">Missing Explanation</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Describe the issue briefly..."
          required
          style={{ width: '100%', height: 60, border: '1px solid #fca5a5', borderRadius: 6, padding: 8, fontSize: '0.8rem', outline: 'none', resize: 'vertical', color: '#1e293b' }}
        />
        <button type="submit" style={{ alignSelf: 'flex-end', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
          Submit Report
        </button>
      </div>
    </form>
  );
}

// ─── Single MCQ Card (reused for general & DS) ──────────────────────
function MCQCard({ questionId, category, qNum, questionText, statementBlock, options, answer, explanation, difficulty, topic, isDs, onAiQ }) {
  const [choice, setChoice] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [btnHover, setBtnHover] = useState({ answer: false, ai: false, workspace: false, report: false });

  const revealed = choice !== null || showAnswer;

  const buttonStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1.5px solid #10b981',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 0,
    boxShadow: '0 1px 3px rgba(16, 185, 129, 0.08)'
  };

  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          <span style={{ background: isDs ? '#10b98112' : '#6366f112', color: isDs ? '#10b981' : '#6366f1', borderRadius: 8, padding: '3px 8px', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>
            {isDs ? `DS Q${qNum}` : `Q${qNum}`}
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {questionText}
            </p>
            {statementBlock && (
              <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, padding: '10px 14px', marginBottom: 4 }}>
                {statementBlock.map((s, i) => (
                  <div key={i} style={{ fontSize: '0.88rem', color: '#334155', marginBottom: i < statementBlock.length - 1 ? 6 : 0 }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        {difficulty && (
          <span style={{ background: `${DIFF_COLORS[difficulty] || '#64748b'}15`, color: DIFF_COLORS[difficulty] || '#64748b', borderRadius: 20, padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, height: 'fit-content' }}>
            {difficulty}
          </span>
        )}
      </div>

      {/* Options */}
      <div style={{ display: isDs ? 'flex' : 'grid', flexDirection: isDs ? 'column' : undefined, gridTemplateColumns: isDs ? undefined : 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
        {options.map((opt, oi) => {
          let bg = '#f8fafc', border = '#e2e8f0', color = '#1e293b';
          if (revealed) {
            if (opt === answer) { bg = '#dcfce7'; border = '#10b981'; color = '#166534'; }
            else if (opt === choice) { bg = '#fee2e2'; border = '#ef4444'; color = '#991b1b'; }
          }
          return (
            <button key={oi} onClick={() => !revealed && setChoice(opt)} disabled={revealed}
              style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 10, padding: '9px 12px', textAlign: 'left', cursor: revealed ? 'default' : 'pointer', fontSize: '0.85rem', fontWeight: 500, color, transition: 'all 0.15s' }}
              onMouseEnter={e => { if (!revealed) e.currentTarget.style.borderColor = '#6366f1'; }}
              onMouseLeave={e => { if (!revealed) e.currentTarget.style.borderColor = border; }}>
              <span style={{ fontWeight: 700, marginRight: 6, color: revealed && opt === answer ? '#166534' : revealed && opt === choice ? '#991b1b' : '#6366f1' }}>
                {isDs ? opt.charAt(0) : String.fromCharCode(65 + oi)}.
              </span>
              {isDs ? opt.substring(2).trim() : opt}
            </button>
          );
        })}
      </div>

      {/* Utility Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
        <button
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          onMouseEnter={() => setBtnHover(prev => ({ ...prev, answer: true }))}
          onMouseLeave={() => setBtnHover(prev => ({ ...prev, answer: false }))}
          style={{
            ...buttonStyle,
            background: showAnswer ? '#e6fcf5' : (btnHover.answer ? '#f0fdf4' : '#ffffff'),
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          title="View Answer"
        >
          <BookIcon active={showAnswer} />
        </button>

        <button
          type="button"
          onClick={onAiQ}
          onMouseEnter={() => setBtnHover(prev => ({ ...prev, ai: true }))}
          onMouseLeave={() => setBtnHover(prev => ({ ...prev, ai: false }))}
          style={{
            ...buttonStyle,
            width: 'auto',
            padding: '0 12px',
            gap: 6,
            background: btnHover.ai ? '#f0fdf4' : '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            color: '#10b981',
            fontSize: '0.78rem',
            fontWeight: 700
          }}
          title="Check by AI Tutor"
        >
          <ChatIcon active={btnHover.ai} />
          <span>AI Tutor</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const nextVal = !showWorkspace;
            setShowWorkspace(nextVal);
            if (nextVal) setShowReport(false);
          }}
          onMouseEnter={() => setBtnHover(prev => ({ ...prev, workspace: true }))}
          onMouseLeave={() => setBtnHover(prev => ({ ...prev, workspace: false }))}
          style={{
            ...buttonStyle,
            background: showWorkspace ? '#e6fcf5' : (btnHover.workspace ? '#f0fdf4' : '#ffffff'),
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          title="Comment"
        >
          <WorkspaceIcon active={showWorkspace} />
        </button>

        <button
          type="button"
          onClick={() => {
            const nextVal = !showReport;
            setShowReport(nextVal);
            if (nextVal) setShowWorkspace(false);
          }}
          onMouseEnter={() => setBtnHover(prev => ({ ...prev, report: true }))}
          onMouseLeave={() => setBtnHover(prev => ({ ...prev, report: false }))}
          style={{
            ...buttonStyle,
            borderColor: showReport ? '#ef4444' : '#10b981',
            background: showReport ? '#fef2f2' : (btnHover.report ? '#fdf2f2' : '#ffffff'),
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          title="Report Issue"
        >
          <ReportIcon active={showReport} />
        </button>
      </div>

      {/* Answer reveal */}
      {revealed && (
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', border: '1.5px solid #10b981', borderRadius: 10, color: '#166534', fontWeight: 700, fontSize: '0.88rem' }}>
          Answer: Option {isDs ? answer.charAt(0) : String.fromCharCode(65 + options.indexOf(answer))}
        </div>
      )}

      {/* Expanded Tools */}
      {showWorkspace && <Scratchpad questionId={questionId} />}
      {showReport && (
        <ReportForm
          onSubmit={async (data) => {
            try {
              await api.post('/preparation/report', {
                questionId,
                questionText,
                category,
                topic,
                type: data.type,
                comment: data.comment
              });
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}
    </div>
  );
}

const getMappedCategory = (cat) => {
  if (!cat) return 'Quantitative Aptitude';
  if (cat === 'Aptitude') return 'Quantitative Aptitude';
  if (cat === 'Verbal') return 'Verbal Ability';
  if (cat === 'Reasoning') return 'Logical Reasoning';
  return cat;
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

// ─── Main Component ──────────────────────────────────────────────────
export default function AptitudePrep() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(getMappedCategory(searchParams.get('category')));
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || '');
  const sectionLabels = {
    formulas: 'Formulas',
    general: 'General Questions',
    ds1: 'Data Sufficiency 1',
    ds2: 'Data Sufficiency 2',
    ds3: 'Data Sufficiency 3'
  };

  const handleCatChange = (e) => {
    const val = e.target.value;
    if (val.startsWith('/preparation/')) {
      navigate(val);
    } else {
      const newParams = new URLSearchParams();
      if (val) {
        newParams.set('category', val);
      }
      setSearchParams(newParams);
    }
  };
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [aiQ, setAiQ] = useState(null);
  const [activeSection, setActiveSection] = useState('formulas');
  const [structure, setStructure] = useState([]);

  useEffect(() => {
    setSelectedCat(getMappedCategory(searchParams.get('category')));
    setSelectedTopic(searchParams.get('topic') || '');
  }, [searchParams]);

  // Reset to appropriate tab when topic changes
  useEffect(() => {
    setActiveSection('formulas');
  }, [selectedTopic]);

  useEffect(() => {
    document.title = 'Aptitude & Reasoning | NextJobPost';
    api.get('/preparation/aptitude/topics')
      .then(res => {
        const d = res.data;
        setTopics(d.topics || []);
        setCategories(d.categories || []);
      })
      .catch(err => console.error(err));

    api.get('/preparation/structure')
      .then(res => {
        const d = res.data;
        if (d.success) setStructure(d.categories || []);
      })
      .catch(err => console.error(err));
  }, []);

  const loadQuestions = (p = 1) => {
    setLoading(true);
    const params = {};
    params.page = p;
    params.limit = 8;
    if (selectedCat) params.category = selectedCat;
    if (selectedTopic) params.topic = selectedTopic;
    if (difficulty) params.difficulty = difficulty;

    api.get('/preparation/aptitude', { params })
      .then(res => {
        const d = res.data;
        setQuestions(d.questions || []);
        setTotalPages(d.pages || 1);
        setPage(p);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!selectedTopic || activeSection === 'general') {
      loadQuestions(1);
    }
  }, [selectedCat, selectedTopic, difficulty, activeSection]);

  const token = localStorage.getItem('token');
  const markSolved = async (q) => {
    if (!token) return;
    try {
      await api.post('/preparation/progress/solve', {
        questionId: q._id,
        category: q.category,
        topic: q.topic
      });
    } catch {}
  };

  const dsQuestions = (activeSection === 'ds1' || activeSection === 'ds2' || activeSection === 'ds3')
    ? getDSQuestionsForTopic(selectedTopic, activeSection)
    : [];

  const activeCategoryData = structure.find(cat => cat.name === selectedCat && cat.status === 'active');

  return (
    <PrepLayout>
      <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter,sans-serif' }}>
        <style>{`
          .sticky-prep-header {
            position: sticky;
            top: 0;
            z-index: 40;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
          }
          @media (max-width: 991.98px) {
            .sticky-prep-header {
              top: 70px;
            }
          }
        `}</style>

      {/* ── Header ── */}
      <div className="sticky-prep-header" style={{ 
        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', 
        padding: selectedTopic ? '0.65rem 1.5rem' : '1.5rem 1.5rem' 
      }}>
        <div style={{ maxWidth: selectedTopic ? 1200 : 860, padding: '0 1.5rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Left side: Icon + Title & Description */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{selectedCat ? (CAT_ICONS[selectedCat] || '🎓') : '🎓'}</span>
              <div>
                <h1 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.2 }}>
                  {selectedCat ? selectedCat : 'NextJobPost Practice Hub'}
                </h1>
                <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', lineHeight: 1.2 }}>
                  {selectedCat 
                    ? `Practice questions, concepts and formulas for ${selectedCat}` 
                    : 'Quantitative aptitude, logical reasoning & verbal ability'}
                </p>
              </div>
            </div>

            {/* Right side: Dropdown Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={selectedCat} onChange={handleCatChange} style={filterStyle}>
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
              <select value={selectedTopic} onChange={e => {
                const val = e.target.value;
                const newParams = new URLSearchParams(searchParams);
                if (val) {
                  newParams.set('topic', val);
                } else {
                  newParams.delete('topic');
                }
                setSearchParams(newParams);
              }} style={filterStyle}>
                <option value="" style={optionStyle}>All Topics</option>
                {topics.map(t => <option key={t} value={t} style={optionStyle}>{t}</option>)}
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
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: selectedTopic ? 1200 : 860, margin: '0 auto', padding: '1.5rem 1.5rem' }}>
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
              <Link to="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🏠</span> Home
              </Link>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('topic');
                setSearchParams(newParams);
              }} style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>{selectedCat || 'Aptitude'}</span>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span onClick={() => setActiveSection('formulas')} style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>{selectedTopic}</span>
              <>
                <span style={{ color: '#cbd5e1' }}>/</span>
                <span style={{ fontWeight: 700, color: '#475569' }}>{sectionLabels[activeSection]}</span>
              </>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* ── Left Sidebar ── */}
              <div style={{ flex: '0 0 220px', minWidth: 200 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Exercise Selection
                  </p>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                    {Object.entries(sectionLabels).map(([id, label]) => {
                      const active = activeSection === id;
                      return (
                        <button key={id} onClick={() => setActiveSection(id)}
                          style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '11px 14px', background: active ? '#f0fdf4' : 'transparent', border: 'none', borderBottom: '1px solid #f1f5f9', textAlign: 'left', cursor: 'pointer', color: active ? '#10b981' : '#475569', fontWeight: active ? 700 : 500, fontSize: '0.83rem', transition: 'all 0.15s' }}
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
                {/* Formulas */}
                {activeSection === 'formulas' && <FormulaSheet topic={selectedTopic} />}

                {/* General Questions */}
                {activeSection === 'general' && (
                  loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6366f1' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>Loading questions…
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {questions.length === 0
                          ? <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>No questions found.</div>
                          : questions.map((q, idx) => (
                            <MCQCard
                              key={q._id}
                              questionId={q._id}
                              category={q.category || selectedCat}
                              qNum={(page - 1) * 8 + idx + 1}
                              questionText={q.question}
                              options={q.options}
                              answer={q.answer}
                              explanation={q.explanation}
                              difficulty={q.difficulty}
                              topic={q.topic}
                              isDs={false}
                              onAiQ={() => setAiQ(q)}
                            />
                          ))
                        }
                      </div>
                      {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
                          <button disabled={page === 1} onClick={() => loadQuestions(page - 1)}
                            style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: page === 1 ? '#cbd5e1' : '#475569', fontWeight: 700, cursor: page === 1 ? 'default' : 'pointer' }}>
                            ‹ Prev
                          </button>
                          {getPageRange(page, totalPages).map((p, idx) => {
                            if (p === '...') {
                              return <span key={`ell1-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, color: '#94a3b8', fontWeight: 700 }}>...</span>;
                            }
                            return (
                              <button key={p} onClick={() => loadQuestions(p)}
                                style={{ width: 38, height: 38, borderRadius: 8, border: page === p ? 'none' : '1px solid #e2e8f0', background: page === p ? '#6366f1' : '#fff', color: page === p ? '#fff' : '#475569', fontWeight: 700, cursor: 'pointer' }}>
                                {p}
                              </button>
                            );
                          })}
                          <button disabled={page === totalPages} onClick={() => loadQuestions(page + 1)}
                            style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: page === totalPages ? '#cbd5e1' : '#475569', fontWeight: 700, cursor: page === totalPages ? 'default' : 'pointer' }}>
                            Next ›
                          </button>
                        </div>
                      )}
                    </>
                  )
                )}

                {/* Data Sufficiency */}
                {(activeSection === 'ds1' || activeSection === 'ds2' || activeSection === 'ds3') && (
                  <>
                    <div style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: 16 }}>
                      <h2 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                        🧩 Data Sufficiency – {SECTION_LABELS[activeSection]}
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                        Determine which statement(s) are sufficient to answer the question. ({dsQuestions.length} questions)
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {dsQuestions.map((q, idx) => (
                        <MCQCard
                          key={q.id}
                          questionId={q.id}
                          category={q.category || selectedCat || 'Data Sufficiency'}
                          qNum={idx + 1}
                          questionText={q.question}
                          statementBlock={q.statements}
                          options={q.options}
                          answer={q.answer}
                          explanation={q.explanation}
                          difficulty={q.difficulty}
                          topic={q.topic}
                          isDs={true}
                          onAiQ={() => setAiQ({
                            question: `${q.question}\n${q.statements.join('\n')}`,
                            options: q.options.map(o => o.substring(3).trim()),
                            answer: q.answer.substring(3).trim(),
                            explanation: q.explanation,
                            topic: q.topic,
                            category: q.category
                          })}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <style>{`
              .topic-card-hover {
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              }
              .topic-card-hover:hover {
                transform: translateY(-4px);
                border-color: #6366f1 !important;
                box-shadow: 0 12px 24px rgba(99, 102, 241, 0.1) !important;
              }
            `}</style>

            {activeCategoryData ? (
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
                    Master key concepts for <strong>{activeCategoryData.name}</strong>. Choose any topic below to access detailed formulas, solved questions, and Data Sufficiency tests.
                  </p>
                </div>

                {activeCategoryData.subCategories.map(sc => {
                  const activeTopics = sc.topics.filter(t => t.status === 'active');
                  if (activeTopics.length === 0) return null;
                  
                  return (
                    <div key={sc._id} style={{ marginBottom: 28 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#4f46e5', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <span style={{ fontSize: '1.1rem' }}>📁</span> {sc.name}
                      </h3>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                        gap: 16 
                      }}>
                        {activeTopics.map(topic => {
                          const urlCat = searchParams.get('category') || 'Aptitude';
                          return (
                            <Link 
                              key={topic._id} 
                              to={`/preparation/aptitude?category=${encodeURIComponent(urlCat)}&topic=${encodeURIComponent(topic.name)}`}
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
                                    fontSize: '1rem',
                                    fontWeight: 700
                                  }}>
                                    📝
                                  </div>
                                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem' }}>
                                    {topic.name}
                                  </div>
                                </div>
                                <div style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4, flex: 1, marginBottom: 12 }}>
                                  Practice formulas and multiple choice questions on {topic.name}.
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
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', borderRadius: 16, padding: '2rem', textAlign: 'center', border: '1px dashed #c7d2fe', marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#6366f1', fontWeight: 800 }}>💡 NextJobPost Practice Hub</h3>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  Select any <strong>topic</strong> from the filter above to access <strong>Formulas</strong>, <strong>General Questions</strong>, and <strong>Data Sufficiency</strong> exercises.
                </p>
              </div>
            )}

            {/* General Practice Pool */}
            <div style={{ marginTop: 32 }}>
              <div style={{ 
                borderLeft: '4px solid #4f46e5', 
                paddingLeft: '12px', 
                marginBottom: 20 
              }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                  🎯 General Practice Pool
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  A pool of questions from all topics in <strong>{selectedCat}</strong>.
                </p>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6366f1' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>Loading questions…
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {questions.length === 0
                      ? <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0' }}>No questions found.</div>
                      : questions.map((q, idx) => (
                        <MCQCard
                          key={q._id}
                          questionId={q._id}
                          category={q.category || selectedCat}
                          qNum={(page - 1) * 8 + idx + 1}
                          questionText={q.question}
                          options={q.options}
                          answer={q.answer}
                          explanation={q.explanation}
                          difficulty={q.difficulty}
                          topic={q.topic}
                          isDs={false}
                          onAiQ={() => setAiQ(q)}
                        />
                      ))
                    }
                  </div>
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
                      <button disabled={page === 1} onClick={() => loadQuestions(page - 1)}
                        style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: page === 1 ? '#cbd5e1' : '#475569', fontWeight: 700, cursor: page === 1 ? 'default' : 'pointer' }}>
                        ‹ Prev
                      </button>
                      {getPageRange(page, totalPages).map((p, idx) => {
                        if (p === '...') {
                          return <span key={`ell2-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, color: '#94a3b8', fontWeight: 700 }}>...</span>;
                        }
                        return (
                          <button key={p} onClick={() => loadQuestions(p)}
                            style={{ width: 38, height: 38, borderRadius: 8, border: page === p ? 'none' : '1px solid #e2e8f0', background: page === p ? '#6366f1' : '#fff', color: page === p ? '#fff' : '#475569', fontWeight: 700, cursor: 'pointer' }}>
                            {p}
                          </button>
                        );
                      })}
                      <button disabled={page === totalPages} onClick={() => loadQuestions(page + 1)}
                        style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: page === totalPages ? '#cbd5e1' : '#475569', fontWeight: 700, cursor: page === totalPages ? 'default' : 'pointer' }}>
                        Next ›
                      </button>
                    </div>
                  )}
                </>
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
