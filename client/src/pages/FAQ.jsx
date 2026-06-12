import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'What is NextJobPost.in?',
          a: 'NextJobPost.in is a curated online platform designed to connect job seekers (including fresh graduates and experienced professionals) with employers across India. We offer job listings, internships, and extensive career preparation resources like aptitude tests and technical preparation modules.'
        },
        {
          q: 'Is it free to use?',
          a: 'Yes! NextJobPost.in is completely free to use. There are no hidden fees, premium memberships, or subscription charges for job seekers. You can browse, practice, and apply to jobs directly without any cost.'
        },
        {
          q: 'Do I need to create an account?',
          a: 'No, you do not need to create an account to browse jobs or practice prep questions. However, creating an account allows you to build resumes, save progress, and access dashboard features.'
        }
      ]
    },
    {
      category: 'Job Listings',
      questions: [
        {
          q: 'How are jobs filtered on this platform?',
          a: 'We list a wide range of job opportunities. We categorize listings clearly so you can filter for freshers, experienced individuals, remote roles, or internships depending on your needs.'
        },
        {
          q: 'How often are new jobs posted?',
          a: 'New job listings and internships are added regularly. We recommend checking back frequently to stay updated on the newest opportunities.'
        },
        {
          q: 'Can I filter jobs by location?',
          a: 'Yes! You can use our search filters to narrow down jobs by location, job type (Full-Time, Internship, Remote), experience level, and industry.'
        }
      ]
    },
    {
      category: 'Application Process',
      questions: [
        {
          q: 'How do I apply for a job?',
          a: 'Each job listing contains details and an option to apply. In many cases, we redirect you directly to the company\'s official application portal to ensure your application goes straight to the recruiter.'
        },
        {
          q: 'Will you sell my personal information?',
          a: 'No. We take privacy seriously and do not sell your personal data. Please refer to our Privacy Policy for more information on how we handle and protect your data.'
        },
        {
          q: 'Can I track my application status on NextJobPost.in?',
          a: 'NextJobPost.in connects you with opportunities, but tracking individual applications is typically managed by the hiring companies. We recommend following up directly with the employer or checking their recruitment portal.'
        }
      ]
    },
    {
      category: 'Career Preparation',
      questions: [
        {
          q: 'What should I prepare before applying?',
          a: 'Update your resume with your latest achievements, education, projects, and skills. Use our free Resume Builder to create a professional CV, and practice using our Aptitude and Technical Prep modules.'
        },
        {
          q: 'Do you provide interview preparation resources?',
          a: 'Yes! We offer free preparation sections covering Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, and Technical topics like JavaScript, Java, DBMS, and Python, complete with MCQs and Interview Q&As.'
        },
        {
          q: 'What is the typical interview process for freshers?',
          a: 'The process generally includes: Resume Screening → Online Aptitude & Technical Assessment → Technical Interviews → HR Interview. Using our preparation resources helps you prepare for each of these stages.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          q: 'A job link is not working. What should I do?',
          a: 'Occasionally company links may expire or change. If you find a broken link, please let us know at nextjobpost@gmail.com with the job details, and we will update or remove it.'
        },
        {
          q: 'Can I use this platform on my mobile phone?',
          a: 'Yes! NextJobPost.in is fully responsive and optimized for mobile devices. You can browse job listings, practice prep questions, and build resumes on your smartphone or tablet.'
        },
        {
          q: 'Why are job details not loading on my screen?',
          a: 'Try refreshing the page or clearing your browser cache. If you still experience issues, verify your internet connection or try accessing the site from a different web browser.'
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
          <p className="lead text-muted">Find answers to common questions about NextJobPost.in</p>
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
