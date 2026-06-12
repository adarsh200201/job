import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/index.js';
import { trackEvent } from '../utils/analytics.js';

export default function UserDashboard() {
  const { token, username, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [widgets, setWidgets] = useState({
    recommendedJobs: [],
    recommendedGovt: [],
    recommendedInternships: [],
    jobsNearYou: [],
    recentlyViewed: [],
    savedJobs: [],
    becauseYouApplied: []
  });
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended');

  // Load profile from backend
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mounted) setProfile(res.data.user);
      } catch {
        // profile not available
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [token]);

  // If onboarding not done → redirect
  useEffect(() => {
    if (profile && profile.onboardingCompleted === false) {
      navigate('/onboarding');
    }
  }, [profile]);

  // Load widgets data (Recommended, Govt, Internships, Near You, Recent Views, Saves, Because You Applied)
  useEffect(() => {
    let mounted = true;
    const fetchWidgets = async () => {
      setLoading(true);
      try {
        const res = await api.get('/recommendations/widgets');
        if (mounted && res.data?.success) {
          setWidgets(res.data.data);
          if (res.data.data.savedJobs) {
            setSavedJobs(res.data.data.savedJobs.map(j => j._id));
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard widgets:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/recommendations/notifications');
        if (mounted && res.data?.success) {
          setNotifications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    if (profile !== null) {
      fetchWidgets();
      fetchNotifications();
    }
    return () => { mounted = false; };
  }, [profile]);

  const matchScore = (job) => {
    if (job.matchScore) return job.matchScore;
    if (!profile) return null;
    let score = 40;
    const titleLower = (job.title || '').toLowerCase();
    const roleLower = (profile.preferredRole || '').toLowerCase();
    if (roleLower && titleLower.includes(roleLower.split(' ')[0])) score += 30;
    if (profile.experienceLevel) {
      const exp = (job.experience || '').toLowerCase();
      if (exp.includes('fresher') && profile.experienceLevel === 'Fresher') score += 20;
      else if (exp) score += 10;
    }
    if (profile.location && (job.location || '').toLowerCase().includes(profile.location.toLowerCase())) score += 10;
    return Math.min(score, 99);
  };

  const initials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem' }} className="animate-fade-in-up">

      {/* ── Hero Profile Header ───────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e0a3c 0%, #4c1d95 60%, #6d28d9 100%)',
        borderRadius: 20,
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 120, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '3px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 800, color: '#fff',
          flexShrink: 0,
        }}>
          {profile?.avatar
            ? <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} width="72" height="72" loading="lazy" />
            : initials(profile?.name || username)
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
            Welcome back, {(profile?.name || username || 'there').split(' ')[0]}! 👋
          </h1>
          {profile?.preferredRole && (
            <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0.3rem 0 0', fontSize: '0.95rem' }}>
              Looking for: <strong style={{ color: '#c4b5fd' }}>{profile.preferredRole}</strong>
              {profile.experienceLevel && <span style={{ marginLeft: '1rem' }}>· {profile.experienceLevel}</span>}
            </p>
          )}
          {profile?.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
              {profile.skills.slice(0, 6).map(s => (
                <span key={s} style={{
                  background: 'rgba(255,255,255,0.12)', color: '#e9d5ff',
                  padding: '0.2rem 0.65rem', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 600,
                }}>{s}</span>
              ))}
              {profile.skills.length > 6 && (
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', padding: '0.2rem 0.4rem' }}>
                  +{profile.skills.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Edit Profile button */}
        <Link to="/onboarding" 
          onClick={() => trackEvent('Dashboard Edit Profile Clicked')}
          style={{
            padding: '0.6rem 1.4rem', background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)', borderRadius: 9999,
            color: '#fff', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
            transition: 'background 0.15s ease', flexShrink: 0,
          }}
        >
          ✏️ Edit Profile
        </Link>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '🔥', label: 'Matched Jobs', value: (widgets.recommendedJobs?.length || 0) + (widgets.recommendedGovt?.length || 0) + (widgets.recommendedInternships?.length || 0), color: '#6d28d9' },
          { icon: '⭐', label: 'Saved Jobs', value: widgets.savedJobs?.length || 0, color: '#d97706' },
          { icon: '🎯', label: 'Profile Match', value: profile?.preferredRole ? 'Active' : 'Set Up →', color: '#059669' },
          { icon: '📍', label: 'Location', value: profile?.location || 'Not set', color: '#0ea5e9' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: 14, padding: '1.25rem 1.5rem',
            border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0', flexWrap: 'wrap' }}>
        {[
          { key: 'recommended', label: '🔥 Recommended Matches' },
          { key: 'saved', label: `⭐ Saved (${widgets.savedJobs?.length || 0})` },
          { key: 'recent', label: `🕒 Recently Viewed (${widgets.recentlyViewed?.length || 0})` },
          { key: 'notifications', label: `🔔 Alerts (${notifications.length})` },
          { key: 'interview', label: '🎤 Interview Prep' },
        ].map(tab => (
          <button key={tab.key} onClick={() => {
            setActiveTab(tab.key);
            trackEvent('Dashboard Tab Changed', { tab: tab.key });
          }} style={{
            padding: '0.6rem 1.25rem', border: 'none', background: 'none',
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            color: activeTab === tab.key ? '#6d28d9' : '#94a3b8',
            borderBottom: activeTab === tab.key ? '2.5px solid #6d28d9' : '2.5px solid transparent',
            marginBottom: '-2px', transition: 'all 0.15s ease',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* ── Interview Prep Tab ──────────────────────────────────── */}
      {activeTab === 'interview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '💡', title: 'Common HR Questions', desc: 'Tell me about yourself, strengths, weaknesses, 5-year plan…', link: 'https://www.naukri.com/blog/hr-interview-questions/' },
            { icon: '🧠', title: 'DSA & Coding', desc: 'Arrays, linked lists, trees, DP, system design patterns.', link: 'https://leetcode.com/' },
            { icon: '📄', title: 'Resume Tips', desc: 'ATS-optimised resume writing tips for 2025 freshers.', link: 'https://www.linkedin.com/interview-prep/' },
            { icon: '🏢', title: 'Company Research', desc: 'How to research a company before your interview.', link: 'https://www.glassdoor.co.in/' },
            { icon: '💬', title: 'Group Discussion Tips', desc: 'Campus GD tips — how to lead, initiate, and conclude.', link: 'https://www.javatpoint.com/group-discussion-topics' },
            { icon: '🤝', title: 'Salary Negotiation', desc: 'Scripts and tactics to negotiate your first offer confidently.', link: '/salaries' },
          ].map(card => (
            <a key={card.title} href={card.link} target={card.link.startsWith('http') ? '_blank' : '_self'}
              onClick={() => trackEvent('Interview Prep Clicked', { resourceTitle: card.title })}
              rel="noopener noreferrer"
              style={{
                display: 'block', background: '#fff', borderRadius: 14, padding: '1.5rem',
                border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                textDecoration: 'none', transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(109,40,217,0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{card.title}</div>
              <div style={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.5 }}>{card.desc}</div>
            </a>
          ))}
        </div>
      )}

      {/* ── Jobs Grid (Recommended / Saved) ─────────────────────── */}
      {activeTab !== 'interview' && activeTab !== 'notifications' && (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
              Loading your matched jobs…
            </div>
          ) : (
            <div>
              {/* 1. Recommended Tab Section */}
              {activeTab === 'recommended' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {/* Section A: Recommended Jobs */}
                  {widgets.recommendedJobs?.length > 0 && (
                    <WidgetSection title="Recommended Jobs For You" emoji="🎯">
                      {renderJobGrid(widgets.recommendedJobs)}
                    </WidgetSection>
                  )}

                  {/* Section B: Government Jobs For You */}
                  {widgets.recommendedGovt?.length > 0 && (
                    <WidgetSection title="Recommended Government Jobs" emoji="🏛️">
                      {renderJobGrid(widgets.recommendedGovt)}
                    </WidgetSection>
                  )}

                  {/* Section C: Recommended Internships */}
                  {widgets.recommendedInternships?.length > 0 && (
                    <WidgetSection title="Recommended Internships" emoji="🎓">
                      {renderJobGrid(widgets.recommendedInternships)}
                    </WidgetSection>
                  )}

                  {/* Section D: Jobs Near You */}
                  {widgets.jobsNearYou?.length > 0 && (
                    <WidgetSection title={`Jobs Near ${profile?.location || 'You'}`} emoji="📍">
                      {renderJobGrid(widgets.jobsNearYou)}
                    </WidgetSection>
                  )}

                  {/* Section E: Because You Applied To */}
                  {widgets.becauseYouApplied?.length > 0 && (
                    <WidgetSection title="Because You Applied to Similar Roles" emoji="🎯">
                      {renderJobGrid(widgets.becauseYouApplied)}
                    </WidgetSection>
                  )}
                </div>
              )}

              {/* 2. Saved Tab Section */}
              {activeTab === 'saved' && (
                <div>
                  {widgets.savedJobs?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 16 }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⭐</div>
                      <p style={{ color: '#64748b', fontWeight: 600 }}>You haven't saved any jobs yet. Bookmark jobs to see them here.</p>
                    </div>
                  ) : (
                    renderJobGrid(widgets.savedJobs)
                  )}
                </div>
              )}

              {/* 3. Recently Viewed Tab Section */}
              {activeTab === 'recent' && (
                <div>
                  {widgets.recentlyViewed?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 16 }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🕒</div>
                      <p style={{ color: '#64748b', fontWeight: 600 }}>Your recently viewed jobs will appear here.</p>
                    </div>
                  ) : (
                    renderJobGrid(widgets.recentlyViewed)
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Alerts/Notifications Tab ────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 16 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
              <p style={{ color: '#64748b', fontWeight: 600 }}>No matching job alerts at the moment. We will notify you when new matching roles are found!</p>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n._id} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                animation: 'fadeInUp 0.3s ease both'
              }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  🔔
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.94rem' }}>{n.title}</div>
                  <div style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '0.2rem' }}>{n.message}</div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  {new Date(n.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Quick Links ──────────────────────────────────────────── */}
      <div style={{
        marginTop: '2.5rem', background: '#f8fafc', borderRadius: 16,
        padding: '1.5rem', border: '1px solid #f1f5f9',
      }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
          🧭 Quick Links
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { to: '/', label: '🔍 Browse All Jobs' },
            { to: '/?type=Internship', label: '🎓 Internships' },
            { to: '/?type=Remote', label: '🏠 Work From Home' },
            { to: '/salaries', label: '💰 Salary Insights' },
            { to: '/student-career-center', label: '📚 Career Center' },
            { to: '/onboarding', label: '✏️ Update Profile' },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 9999, color: '#475569', fontSize: '0.86rem', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6d28d9'; e.currentTarget.style.color = '#6d28d9'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderJobGrid(jobList) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
      {jobList.map(job => {
        const score = job.matchScore || 70;
        return (
          <div key={job._id} style={{
            background: '#fff', borderRadius: 14, padding: '1.25rem 1.5rem',
            border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(109,40,217,0.09)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {job.company}
              </span>
              <span style={{
                fontSize: '0.75rem', fontWeight: 800,
                background: score >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#ffffff',
                padding: '0.2rem 0.55rem', borderRadius: 9999,
              }}>
                🎯 {score}% Match
              </span>
            </div>

            <Link to={`/${job.slug}`} style={{ fontWeight: 700, color: '#1e293b', textDecoration: 'none', fontSize: '0.97rem', lineHeight: 1.4 }}>
              {job.title}
            </Link>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
              {job.location && <Tag>📍 {job.location}</Tag>}
              {job.type && <Tag>{job.type}</Tag>}
              {job.salary && <Tag>💰 {job.salary}</Tag>}
            </div>

            <Link to={`/${job.slug}`} style={{
              marginTop: 'auto', paddingTop: '0.75rem',
              display: 'block', textAlign: 'center',
              padding: '0.5rem 1rem', background: '#6d28d9',
              color: '#fff', borderRadius: 9999, fontWeight: 700,
              fontSize: '0.84rem', textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#5b21b6'}
              onMouseLeave={e => e.currentTarget.style.background = '#6d28d9'}
            >
              View Job →
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function WidgetSection({ title, emoji, children }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      padding: '0.2rem 0.6rem', background: '#f1f5f9', borderRadius: 9999,
      fontSize: '0.76rem', color: '#475569', fontWeight: 600,
    }}>
      {children}
    </span>
  );
}
