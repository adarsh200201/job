import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { articlesData } from '../data/articlesData.js';
import AffiliateBooks from '../components/AffiliateBooks.jsx';

function getRelatedArticles(currentArticle, all) {
  return all
    .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
    .slice(0, 3);
}

export default function Blog() {
  const [activeArticle, setActiveArticle] = useState(null);

  const openArticle = (article) => {
    setActiveArticle(article);
    window.scrollTo(0, 0);
  };

  const closeArticle = () => {
    setActiveArticle(null);
    window.scrollTo(0, 0);
  };

  if (activeArticle) {
    const relatedArticles = getRelatedArticles(activeArticle, articlesData);

    return (
      <section className="blog-page" style={{ paddingTop: '2rem', paddingBottom: '4rem', background: '#f8fafc' }}>
        <Helmet>
          <title>{activeArticle.title} | NextJobPost Career Blog</title>
          <meta name="description" content={activeArticle.excerpt} />
        </Helmet>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Article Card */}
          <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

            {/* Article Header Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #0d6efd)', padding: '3rem 2.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>{activeArticle.icon}</span>
              <div style={{ display: 'inline-block', padding: '0.35rem 0.9rem', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.85rem', color: '#dbeafe', fontWeight: '600', marginBottom: '1rem' }}>
                {activeArticle.category}
              </div>
              <h1 style={{ color: '#fff', fontWeight: '800', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: '1.3', marginBottom: 0 }}>
                {activeArticle.title}
              </h1>
            </div>

            {/* Article Body */}
            <div style={{ padding: '2.5rem' }}>
              {/* Back & Metadata row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', gap: '0.75rem' }}>
                <button
                  onClick={closeArticle}
                  style={{
                    background: 'none', border: '1.5px solid #0d6efd', color: '#0d6efd',
                    borderRadius: '8px', padding: '6px 16px', fontWeight: '700', cursor: 'pointer',
                    fontSize: '0.88rem', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0d6efd'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#0d6efd'; }}
                >
                  ← Back to Blog
                </button>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.88rem', alignItems: 'center' }}>
                  <span>✍️ <strong style={{ color: '#334155' }}>{activeArticle.author || 'NextJobPost Editorial Team'}</strong></span>
                  <span>📅 <strong style={{ color: '#334155' }}>{activeArticle.date}</strong></span>
                  {activeArticle.readTime && (
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.7rem', borderRadius: '12px', fontWeight: '600' }}>
                      ⏱️ {activeArticle.readTime}
                    </span>
                  )}
                </div>
              </div>

              {/* Article excerpt as intro callout */}
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '2rem', color: '#0369a1', fontSize: '1rem', lineHeight: '1.7', fontStyle: 'italic' }}>
                {activeArticle.excerpt}
              </div>

              {/* Content */}
              <div
                className="article-body-content"
                style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.85' }}
                dangerouslySetInnerHTML={{ __html: activeArticle.content }}
              />

              {/* Job CTA */}
              <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '14px', border: '1px solid #86efac', textAlign: 'center' }}>
                <h3 style={{ color: '#15803d', fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.6rem' }}>💼 Ready to apply for jobs?</h3>
                <p style={{ color: '#166534', fontSize: '0.95rem', marginBottom: '1.25rem' }}>Browse verified government and private job listings updated daily on NextJobPost.</p>
                <Link
                  to="/"
                  onClick={closeArticle}
                  className="btn"
                  style={{ background: '#16a34a', color: '#fff', padding: '10px 28px', fontWeight: '700', borderRadius: '10px', textDecoration: 'none', display: 'inline-block' }}
                >
                  Explore Job Listings 🚀
                </Link>
              </div>

              {/* Affiliate Book Recommendations */}
              <AffiliateBooks
                category={
                  activeArticle.category === 'Exam Strategy' || activeArticle.category === 'Government Jobs' ? 'ssc'
                  : activeArticle.category === 'Banking' ? 'banking'
                  : activeArticle.category === 'Railway' ? 'railway'
                  : activeArticle.category === 'Resume Writing' ? 'resume'
                  : 'general'
                }
                title="📚 Books Our Readers Love — Affiliate Picks"
              />

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                  <h3 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.15rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid #e2e8f0' }}>
                    📖 Related Articles in {activeArticle.category}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {relatedArticles.map(article => (
                      <div
                        key={article.id}
                        onClick={() => openArticle(article)}
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      >
                        <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{article.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{article.title}</div>
                          <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{article.date} · {article.readTime || '5 min read'}</div>
                        </div>
                        <span style={{ color: '#0d6efd', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0 }}>Read →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Helmet>
        <title>Career Blog — Job Search Tips, Interview Guides & Exam Strategies | NextJobPost</title>
        <meta name="description" content="Read expert career articles on government exam preparation, resume writing, interview strategies, salary negotiation, and job search tips for freshers and experienced candidates in India." />
      </Helmet>
      <div>
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#162c4a' }}>Career Blog</h1>
          <p className="lead text-muted">Expert tips, exam strategies, and career insights — written by our editorial team for job seekers across India</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {['Resume Writing', 'Interview Prep', 'Exam Strategy', 'Career Guidance', 'Career Tips'].map(cat => (
              <span key={cat} style={{ padding: '0.3rem 0.9rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="row g-4">
          {articlesData.map(article => (
            <div key={article.id} className="col-md-6 col-lg-4">
              <div
                onClick={() => openArticle(article)}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.07)',
                  border: '1px solid #e0e7f1',
                  transition: 'all 220ms ease',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px rgba(0,0,0,0.11)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.07)';
                }}
              >
                {/* Icon/Header */}
                <div style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)', textAlign: 'center' }}>
                  <span style={{ fontSize: '2.8rem' }}>{article.icon}</span>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{
                      display: 'inline-block', padding: '0.3rem 0.75rem',
                      background: '#e3f2fd', color: '#1565c0', borderRadius: '6px',
                      fontSize: '0.78rem', fontWeight: '700'
                    }}>
                      {article.category}
                    </span>
                    {article.readTime && (
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' }}>⏱️ {article.readTime}</span>
                    )}
                  </div>

                  <h3 style={{ color: '#162c4a', fontWeight: '700', marginBottom: '0.6rem', fontSize: '1.05rem', lineHeight: '1.45' }}>
                    {article.title}
                  </h3>

                  <p style={{ color: '#465a6b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', flex: 1 }}>
                    {article.excerpt}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.9rem', borderTop: '1px solid #e0e7f1', color: '#94a3b8', fontSize: '0.82rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#475569', fontSize: '0.8rem' }}>{article.author || 'Editorial Team'}</div>
                      <div>{article.date}</div>
                    </div>
                    <span style={{ color: '#0d6efd', fontWeight: '700', fontSize: '0.85rem' }}>Read Article →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial commitment CTA */}
        <div className="mt-5 p-4 text-center" style={{ background: 'linear-gradient(135deg, #f8f0ff, #ede7f6)', borderRadius: '14px', border: '1px solid #d8b4fe' }}>
          <h3 style={{ color: '#4a148c', marginBottom: '0.75rem', fontWeight: '700' }}>📚 New Articles Every Week</h3>
          <p style={{ color: '#465a6b', marginBottom: '0.5rem' }}>Our editorial team publishes original, research-backed career guides covering government exams, private sector preparation, and resume writing strategies.</p>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: 0 }}>
            ✍️ Written by the NextJobPost Editorial Team · Fact-checked before publication · Updated regularly
          </p>
        </div>
      </div>
    </section>
  );
}
