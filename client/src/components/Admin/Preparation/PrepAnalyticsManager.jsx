import React, { useState, useEffect } from 'react';
import api from '../../../api/index.js';

export default function PrepAnalyticsManager() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/preparation/admin/analytics');
      if (statsRes.data?.success) setStats(statsRes.data.stats || null);

      const leadRes = await api.get('/preparation/admin/leaderboard');
      if (leadRes.data?.success) setLeaderboard(leadRes.data.leaderboard || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="p-5 text-center text-muted">⏳ Loading analytics & leaderboard...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#162c4a', margin: 0 }}>
          📊 Results Analytics & Leaderboard
        </h2>
        <p className="text-muted mb-0 small">Overview of user attempts, activity, and XP ranking</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Questions', value: stats.totalQuestions, bg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: '#fff' },
            { label: 'Mock Tests Created', value: stats.totalTests, bg: 'linear-gradient(135deg, #1e1b4b, #6366f1)', color: '#fff' },
            { label: 'Attempts Taken', value: stats.totalAttempts, bg: 'linear-gradient(135deg, #064e3b, #10b981)', color: '#fff' },
            { label: 'Average Score', value: `${stats.avgScore}%`, bg: 'linear-gradient(135deg, #78350f, #f59e0b)', color: '#fff' }
          ].map((stat, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-lg-3 animate-slide-down">
              <div className="card border-0 p-3 h-100 shadow-sm" style={{ background: stat.bg, color: stat.color, borderRadius: '12px' }}>
                <div className="small text-uppercase opacity-75" style={{ fontWeight: 700, letterSpacing: '0.5px' }}>{stat.label}</div>
                <div className="mt-2" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <div className="card-header bg-light border-bottom p-3">
          <h5 className="m-0" style={{ fontWeight: 800, color: '#162c4a' }}>🏆 User XP Leaderboard (Top 20)</h5>
        </div>
        {leaderboard.length === 0 ? (
          <div className="p-4 text-center text-muted">No leader stats available yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center', paddingLeft: '1.25rem' }}>Rank</th>
                  <th>Username</th>
                  <th>Total XP</th>
                  <th>Activity Streak</th>
                  <th>Badges Earned</th>
                  <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Tests Attempted</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user) => (
                  <tr key={user.rank} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ textAlign: 'center', paddingLeft: '1.25rem', fontWeight: 800, color: user.rank <= 3 ? '#d97706' : '#64748b' }}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                    </td>
                    <td style={{ fontWeight: 700, color: '#162c4a' }}>{user.username}</td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        ⭐ {user.xp} XP
                      </span>
                    </td>
                    <td>🔥 {user.streak} days</td>
                    <td>🏅 {user.badgesCount} badges</td>
                    <td style={{ textAlign: 'right', paddingRight: '1.25rem', fontWeight: 600 }}>{user.testsCount} tests</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
