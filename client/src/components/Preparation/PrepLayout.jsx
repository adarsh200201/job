import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PrepLayout({ children, headerContent }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const queryParams = new URLSearchParams(location.search);
  // Hide the PrepLayout left nav when user is in a detail view:
  // - aptitude with ?topic=
  // - DSA or Technical with ?topic=
  // - Company with ?company=
  // - Gov with ?exam=
  const hasTopic =
    queryParams.has('topic') ||
    queryParams.has('company') ||
    queryParams.has('exam');

  const getLinkClass = (path) => {
    if (path === '/preparation') {
      return location.pathname === '/preparation' && !location.search
        ? "sidebar-nav-item active"
        : "sidebar-nav-item";
    }

    try {
      const targetUrl = new URL(path, window.location.origin);
      const targetPathname = targetUrl.pathname;
      const targetCategory = targetUrl.searchParams.get('category');
      const targetTopic = targetUrl.searchParams.get('topic');

      const currentCategory = new URLSearchParams(location.search).get('category');
      const currentTopic = new URLSearchParams(location.search).get('topic');

      if (location.pathname === targetPathname) {
        if (targetPathname === '/preparation/aptitude' && !targetCategory) {
          if (!currentCategory || currentCategory === 'Aptitude' || currentCategory === 'Quantitative Aptitude') {
            return "sidebar-nav-item active";
          }
        }

        if (targetCategory) {
          const isCatMatch = 
            currentCategory === targetCategory ||
            (targetCategory === 'Aptitude' && (currentCategory === 'Aptitude' || currentCategory === 'Quantitative Aptitude')) ||
            (targetCategory === 'Verbal' && (currentCategory === 'Verbal' || currentCategory === 'Verbal Ability')) ||
            (targetCategory === 'Reasoning' && (currentCategory === 'Reasoning' || currentCategory === 'Logical Reasoning'));
          
          if (isCatMatch) return "sidebar-nav-item active";
        } else if (targetTopic) {
          if (currentTopic === targetTopic) return "sidebar-nav-item active";
        } else if (!currentCategory && !currentTopic) {
          return "sidebar-nav-item active";
        }
      }
    } catch (e) {
      // Fallback to exact path check
      return currentPath === path ? "sidebar-nav-item active" : "sidebar-nav-item";
    }

    return "sidebar-nav-item";
  };

  const renderSidebarLinks = () => (
    <>
      <Link to="/preparation" className={getLinkClass('/preparation')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">🏠</span>
        <span>Home</span>
      </Link>
      <div className="sidebar-divider" />
      
      <div className="sidebar-section-title">Aptitude & Reasoning</div>
      <Link to="/preparation/aptitude" className={getLinkClass('/preparation/aptitude')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">🧮</span>
        <span>Arithmetic Aptitude</span>
      </Link>
      <Link to="/preparation/aptitude?category=Data Interpretation" className={getLinkClass('/preparation/aptitude?category=Data Interpretation')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">📊</span>
        <span>Data Interpretation</span>
      </Link>
      <Link to="/preparation/aptitude?category=Verbal" className={getLinkClass('/preparation/aptitude?category=Verbal')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">📖</span>
        <span>Verbal Ability</span>
      </Link>
      <Link to="/preparation/aptitude?category=Reasoning" className={getLinkClass('/preparation/aptitude?category=Reasoning')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">🧠</span>
        <span>Logical Reasoning</span>
      </Link>
      <Link to="/preparation/aptitude?category=Verbal Reasoning" className={getLinkClass('/preparation/aptitude?category=Verbal Reasoning')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">🔤</span>
        <span>Verbal Reasoning</span>
      </Link>
      <Link to="/preparation/aptitude?category=Non Verbal Reasoning" className={getLinkClass('/preparation/aptitude?category=Non Verbal Reasoning')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">🧩</span>
        <span>Nonverbal Reasoning</span>
      </Link>

      <div className="sidebar-divider" />
      <div className="sidebar-section-title">General Awareness</div>
      <Link to="/preparation/aptitude?category=General Knowledge" className={getLinkClass('/preparation/aptitude?category=General Knowledge')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">📚</span>
        <span>General Knowledge</span>
      </Link>
      <Link to="/preparation/aptitude?category=Current Affairs Categories" className={getLinkClass('/preparation/aptitude?category=Current Affairs Categories')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">📰</span>
        <span>Current Affairs</span>
      </Link>

      <div className="sidebar-divider" />
      <div className="sidebar-section-title">Programming & Tech</div>
      <Link to="/preparation/technical" className={getLinkClass('/preparation/technical')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">💻</span>
        <span>Programming MCQs</span>
      </Link>
      <Link to="/preparation/dsa" className={getLinkClass('/preparation/dsa')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">🌲</span>
        <span>DSA Challenges</span>
      </Link>
      <Link to="/preparation/company" className={getLinkClass('/preparation/company')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">🏢</span>
        <span>Company Prep</span>
      </Link>
      <Link to="/preparation/gov" className={getLinkClass('/preparation/gov')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">🏛️</span>
        <span>Govt Exams Prep</span>
      </Link>
      <Link to="/preparation/mock-tests" className={getLinkClass('/preparation/mock-tests')} onClick={() => setMobileOpen(false)}>
        <span className="sidebar-icon">📝</span>
        <span>Mock Tests</span>
      </Link>
    </>
  );

  return (
    <div className="hub-outer-container">
      <style>{`
        .hub-outer-container {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── Left Sticky Sidebar (SaaS Light Theme) ── */
        .hub-left-sidebar {
          width: 270px;
          background-color: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: none;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 100;
          transition: all 0.3s ease;
        }
        @media (min-width: 992px) {
          .hub-left-sidebar {
            display: flex;
          }
        }
        .sidebar-logo-container {
          padding: 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-nav {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 20px 11px 24px;
          color: #475569;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .sidebar-nav-item:hover {
          color: #0f172a;
          background-color: #f8fafc;
        }
        .sidebar-nav-item.active {
          color: #4f46e5;
          background-color: #f0f2ff;
          font-weight: 700;
          border-left: 4px solid #4f46e5;
          padding-left: 20px;
        }
        .sidebar-icon {
          font-size: 1.15rem;
          width: 22px;
          text-align: center;
          display: inline-block;
        }
        .sidebar-divider {
          height: 1px;
          background-color: #f1f5f9;
          margin: 14px 24px;
        }
        .sidebar-section-title {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 8px 24px 6px;
        }

        /* ── Global Container Override for Prep Pages ── */
        main.container.is-prep-page {
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* ── Main Layout Container ── */
        .hub-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ── Top Header ── */
        .hub-top-header {
          height: 70px;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          align-items: center;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        @media (min-width: 992px) {
          .hub-top-header.desktop-hidden {
            display: none;
          }
        }
        .mobile-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 14px;
          color: #475569;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
          margin-right: 16px;
        }
        .mobile-menu-toggle:hover {
          background-color: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }
        @media (min-width: 992px) {
          .mobile-menu-toggle {
            display: none;
          }
        }

        /* Mobile Sidebar overlay */
        .mobile-sidebar-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
        }
        .mobile-sidebar-content {
          width: 280px;
          background-color: #ffffff;
          height: 100%;
          box-shadow: 15px 0 30px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          animation: slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          border-right: 1px solid #e2e8f0;
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* ── Left Sticky Sidebar (Desktop) ── */}
      {!hasTopic && (
        <aside className="hub-left-sidebar">

          <nav className="sidebar-nav">
            {renderSidebarLinks()}
          </nav>
        </aside>
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-sidebar-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '1.4rem' }}>🎓</span>
                <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem' }}>Prep Navigation</span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                ✕
              </button>
            </div>
            <nav className="sidebar-nav" style={{ padding: '12px' }}>
              {renderSidebarLinks()}
            </nav>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <main className="hub-main-content">
        <header className={`hub-top-header ${!headerContent ? 'desktop-hidden' : ''}`}>
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>Sections</span>
          </button>
          {headerContent}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
