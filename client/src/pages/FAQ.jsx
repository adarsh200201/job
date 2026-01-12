import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'What is Job For Fresher?',
          a: 'Job For Fresher is a curated platform dedicated to helping fresh graduates find job opportunities, internships, and work-from-home positions from top companies across India. We filter opportunities specifically for freshers and recent graduates.'
        },
        {
          q: 'Is it free to use?',
          a: 'Yes! Job For Fresher is completely free. There are no hidden charges, premium memberships, or subscription fees. You can browse all job listings and apply directly to companies without any cost.'
        },
        {
          q: 'Do I need to create an account?',
          a: 'No, you don\'t need to create an account to browse jobs. You can directly visit company links to apply from there. However, we recommend checking back regularly for new opportunities.'
        }
      ]
    },
    {
      category: 'Job Listings',
      questions: [
        {
          q: 'How are jobs filtered on this platform?',
          a: 'All jobs listed are specifically marked as "Fresher Friendly" or explicitly mention openness to recent graduates. We verify that companies are genuinely hiring for entry-level positions.'
        },
        {
          q: 'How often are new jobs posted?',
          a: 'New job listings are added regularly throughout the week. We recommend visiting the site frequently or checking the "Recent Jobs" section to stay updated on the latest opportunities.'
        },
        {
          q: 'Can I filter jobs by location?',
          a: 'Yes! You can use the search filters to narrow down by location, job type (Full-Time, Internship, Remote), experience level, education, and other criteria.'
        }
      ]
    },
    {
      category: 'Application Process',
      questions: [
        {
          q: 'How do I apply for a job?',
          a: 'Each job listing has an "Apply Now" button that takes you directly to the company\'s application portal. You apply directly with the company, not through our platform.'
        },
        {
          q: 'Will you sell my information to companies?',
          a: 'No. We never share or sell your personal information. When you apply, you\'re applying directly with the company through their own application system.'
        },
        {
          q: 'Can I track my applications on this platform?',
          a: 'Job For Fresher shows available opportunities, but tracking applications is managed by each company directly. Keep your application credentials saved and follow up with companies accordingly.'
        }
      ]
    },
    {
      category: 'Career Preparation',
      questions: [
        {
          q: 'What should I prepare before applying?',
          a: 'Update your resume with your academic achievements, projects, and any internship experience. Prepare your LinkedIn profile, write a brief cover letter, and practice answering common interview questions about your background and career goals.'
        },
        {
          q: 'Do you provide interview preparation resources?',
          a: 'Yes! Check our Blog section for interview tips, resume writing guides, and preparation resources. We regularly publish helpful articles for freshers.'
        },
        {
          q: 'What is the typical interview process for freshers?',
          a: 'Most fresher interviews include: Online Assessment/Aptitude Test → Technical Interview → HR Interview. Some companies have additional group discussions or case studies. Each company has its own process - check the job posting for specifics.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          q: 'The job link is not working. What should I do?',
          a: 'Some company links may expire or change. If you encounter a broken link, please contact us at nextjobpost@gmail.com with the job title and company name so we can update it.'
        },
        {
          q: 'Can I use this platform on my mobile phone?',
          a: 'Yes! Our platform is fully responsive and works great on mobile devices. You can browse, search, and apply to jobs directly from your smartphone.'
        },
        {
          q: 'Why are jobs not loading on my screen?',
          a: 'Try refreshing the page or clearing your browser cache. Make sure you have a stable internet connection. If the issue persists, try a different browser or contact us.'
        }
      ]
    }
  ];

  return (
    <section className="faq-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="container narrow-container">
        
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#162c4a' }}>Frequently Asked Questions</h1>
          <p className="lead text-muted">Find answers to common questions about Job For Fresher</p>
        </div>

        {/* FAQ Categories */}
        {faqs.map((section, idx) => (
          <div key={idx} className="mb-5">
            <h2 className="h5 mb-3 p-3" style={{ background: 'linear-gradient(90deg, #0d6efd, #0d6b6b)', color: '#fff', borderRadius: '8px' }}>
              {section.category}
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {section.questions.map((item, qIdx) => {
                const itemIndex = `${idx}-${qIdx}`;
                const isOpen = openIndex === itemIndex;
                
                return (
                  <div 
                    key={qIdx}
                    style={{ 
                      border: '1px solid #e0e7f1', 
                      borderRadius: '10px', 
                      overflow: 'hidden',
                      boxShadow: isOpen ? '0 8px 20px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 200ms ease'
                    }}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : itemIndex)}
                      style={{
                        width: '100%',
                        padding: '1.25rem',
                        background: isOpen ? '#f0f7ff' : '#fff',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 200ms ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isOpen) e.currentTarget.style.background = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        if (!isOpen) e.currentTarget.style.background = '#fff';
                      }}
                    >
                      <span style={{ color: '#162c4a', fontWeight: '600', fontSize: '1.05rem' }}>
                        {item.q}
                      </span>
                      <span style={{ color: '#0d6efd', fontSize: '1.5rem', transition: 'transform 200ms ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ 
                        padding: '0 1.25rem 1.25rem 1.25rem',
                        background: '#f8f9fa',
                        borderTop: '1px solid #e0e7f1',
                        animation: 'slideDown 200ms ease'
                      }}>
                        <p style={{ color: '#465a6b', lineHeight: '1.8', marginBottom: 0 }}>
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="mt-5 p-4 text-center" style={{ background: 'linear-gradient(135deg, #fff5f7, #ffe4e9)', borderRadius: '12px', border: '2px solid #f8bbd0' }}>
          <h3 className="h6 mb-2" style={{ color: '#c2185b' }}>Didn't find your answer?</h3>
          <p className="mb-3" style={{ color: '#465a6b' }}>We're here to help! Reach out to our support team.</p>
          <a href="/contact" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.75rem 1.5rem' }}>
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
