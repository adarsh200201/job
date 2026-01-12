import React from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const articles = [
    {
      id: 1,
      title: '5 Tips to Write an Impressive Fresher Resume',
      excerpt: 'Learn how to highlight your academic projects, internships, and skills to create a resume that stands out to recruiters.',
      category: 'Resume Writing',
      date: 'Dec 15, 2024',
      icon: '📄'
    },
    {
      id: 2,
      title: 'How to Prepare for Your First Technical Interview',
      excerpt: 'Step-by-step guide to ace your first technical interview with confidence. Includes common questions and preparation strategies.',
      category: 'Interview Prep',
      date: 'Dec 10, 2024',
      icon: '💻'
    },
    {
      id: 3,
      title: 'Top Skills Freshers Should Develop in 2025',
      excerpt: 'Discover the most in-demand technical and soft skills that will help you land your first job in the current job market.',
      category: 'Career Tips',
      date: 'Dec 5, 2024',
      icon: '🎯'
    },
    {
      id: 4,
      title: 'Navigating Your First Day at a New Job',
      excerpt: 'Tips and strategies to make a great impression on your first day and set yourself up for success in your new role.',
      category: 'Career Development',
      date: 'Nov 28, 2024',
      icon: '🚀'
    },
    {
      id: 5,
      title: 'Internship vs Full-Time Job: Which Should You Choose?',
      excerpt: 'Compare the pros and cons of internships and full-time positions to help you make the right choice for your career.',
      category: 'Career Guidance',
      date: 'Nov 20, 2024',
      icon: '🤔'
    },
    {
      id: 6,
      title: 'The Art of Following Up After an Interview',
      excerpt: 'Master the follow-up process to demonstrate your continued interest and professionalism to potential employers.',
      category: 'Interview Prep',
      date: 'Nov 15, 2024',
      icon: '✉️'
    }
  ];

  return (
    <section className="blog-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="container">
        
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#162c4a' }}>Career Blog</h1>
          <p className="lead text-muted">Tips, insights, and resources to help you launch your career</p>
        </div>

        {/* Articles Grid */}
        <div className="row g-4">
          {articles.map(article => (
            <div key={article.id} className="col-md-6 col-lg-4">
              <div 
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
