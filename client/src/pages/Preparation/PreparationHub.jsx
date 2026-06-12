import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PrepLayout from '../../components/Preparation/PrepLayout.jsx';
import api from '../../api/index.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const BADGE_ICONS = {
  'Aptitude Starter': '🌱',
  'Aptitude Master': '🏆',
  'DSA Beginner': '🌲',
  'DSA Pro': '🚀',
  'Tech Wizard': '⚡',
  'Mock Champion': '🎯',
  'Streak Warrior': '🔥',
};

const mapCategoriesToSubjects = (backendCategories) => {
  return backendCategories.map((cat) => {
    let path = '/preparation/aptitude';
    let icon = '🧮';
    let themeColor = '#6366f1';
    let description = `Practice questions, concepts and formulas for ${cat.name}`;

    const nameLower = cat.name.toLowerCase();
    if (nameLower.includes('technical') || nameLower.includes('programming')) {
      path = '/preparation/technical';
      icon = '💻';
      themeColor = '#0ea5e9';
    } else if (nameLower.includes('dsa') || nameLower.includes('structure')) {
      path = '/preparation/dsa';
      icon = '🌲';
      themeColor = '#10b981';
    } else if (nameLower.includes('company') || nameLower.includes('recruiter')) {
      path = '/preparation/company';
      icon = '🏢';
      themeColor = '#f59e0b';
      description = 'Recruitment preparation and mock tests for top companies';
    } else if (nameLower.includes('gov') || nameLower.includes('exam')) {
      path = '/preparation/gov';
      icon = '🏛️';
      themeColor = '#ef4444';
    } else {
      // Map exact aptitude category paths and icons to match sidebar items
      if (cat.name === 'Quantitative Aptitude') {
        path = '/preparation/aptitude';
      } else if (cat.name === 'Data Interpretation') {
        path = '/preparation/aptitude?category=Data Interpretation';
        icon = '📊';
      } else if (cat.name === 'Verbal Ability') {
        path = '/preparation/aptitude?category=Verbal';
        icon = '📖';
      } else if (cat.name === 'Logical Reasoning') {
        path = '/preparation/aptitude?category=Reasoning';
        icon = '🧠';
      } else if (cat.name === 'Verbal Reasoning') {
        path = '/preparation/aptitude?category=Verbal Reasoning';
        icon = '🔤';
      } else if (cat.name === 'Non Verbal Reasoning') {
        path = '/preparation/aptitude?category=Non Verbal Reasoning';
        icon = '🧩';
      } else if (cat.name === 'General Knowledge') {
        path = '/preparation/aptitude?category=General Knowledge';
        icon = '📚';
      } else if (cat.name === 'Current Affairs Categories') {
        path = '/preparation/aptitude?category=Current Affairs Categories';
        icon = '📰';
      }
    }

    let totalTopics = 0;
    const subcategories = (cat.subCategories || [])
      .filter(sc => sc.status === 'active')
      .map(sc => {
        const activeTopics = (sc.topics || []).filter(t => t.status === 'active');
        totalTopics += activeTopics.length;
        const links = activeTopics.map(t => {
          let itemPath = `${path}?category=${encodeURIComponent(cat.name)}&topic=${encodeURIComponent(t.name)}`;
          if (path === '/preparation/company') {
            itemPath = `/preparation/company?company=${encodeURIComponent(t.name)}`;
          } else if (path === '/preparation/gov') {
            itemPath = `/preparation/gov?exam=${encodeURIComponent(t.name)}`;
          }
          return {
            name: t.name,
            path: itemPath
          };
        });

        return {
          name: sc.name,
          links
        };
      });

    return {
      title: cat.name,
      icon,
      themeColor,
      description,
      path,
      subcategories,
      totalTopics
    };
  });
};

export default function PreparationHub() {
  const [progress, setProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState({});

  const toggleSubcategory = (subjectTitle, catName) => {
    const key = `${subjectTitle}-${catName}`;
    setExpandedSubcategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const [subjects, setSubjects] = useState([]);
  const [searchItemsList, setSearchItemsList] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Placement Preparation Hub | NextJobPost';

    api.get('/preparation/structure')
      .then(res => {
        const d = res.data;
        if (d.success) {
          const mapped = mapCategoriesToSubjects(d.categories || []);
          setSubjects(mapped);
        }
      })
      .catch(() => {});

    if (token) {
      api.get('/preparation/progress')
        .then(res => setProgress(res.data))
        .catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    const items = [];
    subjects.forEach(sub => {
      sub.subcategories.forEach(cat => {
        cat.links.forEach(l => {
          items.push({
            name: l.name,
            path: l.path,
            subject: sub.title,
            icon: sub.icon
          });
        });
      });
    });
    setSearchItemsList(items);
  }, [subjects]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim() === '') {
      setSuggestions([]);
    } else {
      const filtered = searchItemsList.filter(item =>
        item.name.toLowerCase().includes(val.toLowerCase()) ||
        item.subject.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
    }
  };

  const headerContent = (
    <div className="top-search-container">
      <span style={{ fontSize: '1.1rem', color: '#64748b' }}>🔍</span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search topics (e.g. Percentage, React, TCS, SSC)..."
        className="top-search-input"
      />
      {searchQuery && (
        <button
          onClick={() => { setSearchQuery(''); setSuggestions([]); }}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 4px' }}
        >
          ✕
        </button>
      )}

      {suggestions.length > 0 && (
        <div className="top-search-suggestions">
          <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Suggested Links
          </div>
          {suggestions.map((sug, idx) => (
            <Link key={idx} to={sug.path} className="search-suggestion-item" onClick={() => { setSearchQuery(''); setSuggestions([]); }}>
              <span style={{ fontSize: '1.1rem' }}>{sug.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{sug.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>in {sug.subject}</div>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <PrepLayout headerContent={headerContent}>
      <style>{`
        .top-search-container {
          position: relative;
          flex: 1;
          max-width: 440px;
          display: flex;
          align-items: center;
          background-color: #f1f5f9;
          border-radius: 12px;
          padding: 4px 16px;
          border: 1.5px solid transparent;
          transition: all 0.25s ease;
        }
        .top-search-container:focus-within {
          background-color: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.06);
        }
        .top-search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          padding: 8px 0 8px 6px;
          color: #0f172a;
          font-size: 0.88rem;
          font-weight: 500;
        }
        .top-search-suggestions {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background-color: #ffffff;
          border-radius: 14px;
          box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
          border: 1px solid #e2e8f0;
          z-index: 110;
          overflow: hidden;
        }
        .search-suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          color: #475569;
          text-decoration: none;
          font-size: 0.82rem;
          transition: background 0.15s ease;
        }
        .search-suggestion-item:hover {
          background-color: #f8fafc;
          color: #0f172a;
        }

        .hub-page-content {
          padding: 32px 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1240px;
          width: 100%;
          margin: 0 auto;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        @media (min-width: 640px) {
          .subjects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .subjects-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .subject-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.08);
          border-color: var(--hover-border-color) !important;
        }
        .subject-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--theme-color);
        }
        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .card-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          background-color: var(--accent-light);
          border: 1px solid var(--accent-border);
        }
        .explore-link {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--theme-color);
          display: flex;
          align-items: center;
          gap: 4px;
          transition: transform 0.2s ease;
        }
        .subject-card:hover .explore-link span {
          transform: translateX(4px);
        }
        .card-title {
          margin: 0 0 8px 0;
          color: #0f172a;
          font-size: 1.12rem;
          font-weight: 800;
          line-height: 1.3;
        }
        .card-description {
          margin: 0 0 20px 0;
          color: #64748b;
          font-size: 0.82rem;
          line-height: 1.5;
          flex: 1;
        }
        .card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .meta-dot {
          color: #cbd5e1;
        }
        .hub-center-col {
          min-width: 0;
        }
        .welcome-banner {
          background: linear-gradient(135deg, #f5f3ff 0%, #edd8ff 100%);
          border-radius: 20px;
          border: 1px solid #e0e7ff;
          padding: 28px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.02);
        }
        .welcome-title {
          margin: 0 0 8px;
          color: #4f46e5;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.3px;
        }
        .welcome-desc {
          margin: 0;
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.65;
        }
      `}</style>

      <div className="hub-page-content">
        <div className="hub-center-col">
          <div className="welcome-banner">
            <h2 className="welcome-title">Welcome to NextJobPost Prep!</h2>
            <p className="welcome-desc">
              Quantitative aptitude, logical reasoning, and verbal ability questions with step-by-step solutions for placement preparation, competitive exams, and coding tests. Use the categories below or explore the sidebar to start practicing.
            </p>
          </div>

          {subjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#4f46e5' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
              <span>Loading tracks...</span>
            </div>
          ) : (
            <div className="subjects-grid">
              {subjects.map((sub, sIdx) => (
                <Link 
                  to={sub.path} 
                  key={sIdx} 
                  className="subject-card"
                  style={{
                    '--theme-color': sub.themeColor,
                    '--hover-border-color': sub.themeColor,
                    '--accent-light': `${sub.themeColor}10`,
                    '--accent-border': `${sub.themeColor}15`
                  }}
                >
                  <div className="card-top">
                    <div className="card-icon-wrapper">
                      {sub.icon}
                    </div>
                    <div className="explore-link">
                      Explore Track <span>→</span>
                    </div>
                  </div>
                  <h3 className="card-title">{sub.title}</h3>
                  <p className="card-description">{sub.description}</p>
                  <div className="card-meta">
                    <span>📁 {sub.subcategories.length} Sections</span>
                    <span className="meta-dot">•</span>
                    <span>📝 {sub.totalTopics} Topics</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          


        </div>
      </div>
    </PrepLayout>
  );
}
