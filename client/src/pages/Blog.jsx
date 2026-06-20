import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesData } from '../data/articlesData.js';

export default function Blog() {
  const [activeArticle, setActiveArticle] = useState(null);


  if (activeArticle) {
    return (
      <section className="blog-page" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
          {/* Back Button & Category */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => {
                setActiveArticle(null);
                window.scrollTo(0, 0);
              }} 
              style={{
                background: 'none', border: '1.5px solid #0d6efd', color: '#0d6efd',
                borderRadius: '8px', padding: '6px 16px', fontWeight: '700', cursor: 'pointer',
                fontSize: '0.9rem', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0d6efd'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#0d6efd'; }}
            >
              ← Back to Blog
            </button>
            <span 
              style={{
                padding: '0.4rem 0.8rem', background: '#e3f2fd', color: '#1565c0',
                borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700'
              }}
            >
              {activeArticle.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ color: '#162c4a', fontWeight: '800', fontSize: '2rem', marginBottom: '1rem', lineHeight: '1.3' }}>
            {activeArticle.title}
          </h1>

          {/* Metadata */}
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            Published on: <strong>{activeArticle.date}</strong> | By: <strong>NextJobPost Career Team</strong>
          </div>

          {/* Render HTML content */}
          <div 
            className="article-body-content"
            style={{ color: '#334155', fontSize: '1.1rem', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: activeArticle.content }}
          />

          {/* Related Links / Job CTA */}
          <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderRadius: '12px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
            <h3 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.75rem' }}>💼 Looking for a job or internship opportunity?</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.25rem' }}>We list verified off-campus drives, fresher vacancies, and internships daily.</p>
            <Link 
              to="/" 
              onClick={() => {
                setActiveArticle(null);
                window.scrollTo(0, 0);
              }}
              className="btn btn-primary"
              style={{ padding: '8px 24px', fontWeight: '700', borderRadius: '8px' }}
            >
              Explore Job Listings 🚀
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div>
        
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#162c4a' }}>Career Blog</h1>
          <p className="lead text-muted">Tips, insights, and resources to help you launch your career</p>
        </div>

        {/* Articles Grid */}
        <div className="row g-4">
          {articlesData.map(article => (
            <div key={article.id} className="col-md-6 col-lg-4">
              <div 
                onClick={() => {
                  setActiveArticle(article);
                  window.scrollTo(0, 0);
                }}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid #e0e7f1',
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                {/* Icon/Header */}
                <div style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, #f0f7ff, #e6f4ff)', textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>{article.icon}</span>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="mb-2">
                    <span 
                      style={{
                        display: 'inline-block',
                        padding: '0.4rem 0.8rem',
                        background: '#e3f2fd',
                        color: '#1565c0',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      {article.category}
                    </span>
                  </div>

                  <h3 style={{ color: '#162c4a', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.1rem', lineHeight: '1.4' }}>
                    {article.title}
                  </h3>

                  <p style={{ color: '#465a6b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem', flex: 1 }}>
                    {article.excerpt}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e0e7f1', color: '#999', fontSize: '0.85rem' }}>
                    <span>{article.date}</span>
                    <span style={{ color: '#0d6efd', fontWeight: '600' }}>Read More →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 text-center p-4" style={{ background: 'linear-gradient(135deg, #f3e5f5, #ede7f6)', borderRadius: '12px', border: '2px solid #e1bee7' }}>
          <h3 style={{ color: '#4a148c', marginBottom: '1rem' }}>📚 Check back regularly for new articles</h3>
          <p style={{ color: '#465a6b', marginBottom: 0 }}>We publish career tips and insights every week to help freshers succeed in their job search.</p>
        </div>
      </div>
    </section>
  );
}
