import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="contact-page" style={{ paddingTop: '3rem', paddingBottom: '4rem', background: '#f8fafc' }}>
      <div className="container">
        
        {/* Header Section */}
        <div className="mb-5 text-center">
          <span 
            className="badge mb-3" 
            style={{ 
              background: '#0d6efd', 
              fontSize: '0.9rem', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '30px',
              fontWeight: '600'
            }}
          >
            Help & Support
          </span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#0f172a' }}>Contact NextJobPost.in</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '1.15rem' }}>
            Have a suggestion, found a bug in a practice MCQ, or want to publish a verified job listing? We are here to help. Reach out to us directly!
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Form Column */}
          <div className="col-lg-6">
            <div 
              className="p-5 bg-white border border-light-subtle h-100" 
              style={{ 
                borderRadius: '24px', 
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.03)' 
              }}
            >
              <h3 className="fw-bold mb-4" style={{ color: '#0f172a' }}>Send Us a Message</h3>
              
              {submitted && (
                <div className="alert alert-success mb-4 py-3" style={{ borderRadius: '12px' }} role="alert">
                  <strong>✓ Message Received!</strong> Thank you for reaching out. We will respond to you within 24 hours.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#334155' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    style={{ borderRadius: '10px', padding: '0.8rem', border: '1px solid #e2e8f0' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#334155' }}>Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@example.com"
                    required
                    style={{ borderRadius: '10px', padding: '0.8rem', border: '1px solid #e2e8f0' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#334155' }}>Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Job Posting Request, MCQ correction"
                    required
                    style={{ borderRadius: '10px', padding: '0.8rem', border: '1px solid #e2e8f0' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#334155' }}>Message</label>
                  <textarea 
                    className="form-control" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5" 
                    placeholder="Write your query or feedback here..."
                    required
                    style={{ borderRadius: '10px', padding: '0.8rem', border: '1px solid #e2e8f0' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary fw-bold w-100"
                  style={{ padding: '0.9rem', borderRadius: '10px', fontSize: '1.05rem' }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="col-lg-6">
            <div className="d-flex flex-column gap-4 h-100">
              
              {/* Email Support Card */}
              <div 
                className="p-4 bg-white border border-light-subtle" 
                style={{ borderRadius: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.02)' }}
              >
                <div className="d-flex align-items-center mb-3">
                  <span className="fs-3 me-3">📧</span>
                  <h3 className="fw-bold mb-0" style={{ fontSize: '1.2rem', color: '#0f172a' }}>Direct Email Support</h3>
                </div>
                <p className="text-muted small mb-2" style={{ lineHeight: '1.6' }}>
                  For general queries, advertiser inquiries, partnership proposals, or technical support with the preparation portal:
                </p>
                <a 
                  href="mailto:nextjobpost@gmail.com" 
                  className="fw-bold text-decoration-none fs-5 text-primary"
                >
                  nextjobpost@gmail.com
                </a>
              </div>

              {/* Recruitment Submissions Card */}
              <div 
                className="p-4 bg-white border border-light-subtle" 
                style={{ borderRadius: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.02)' }}
              >
                <div className="d-flex align-items-center mb-3">
                  <span className="fs-3 me-3">💼</span>
                  <h3 className="fw-bold mb-0" style={{ fontSize: '1.2rem', color: '#0f172a' }}>Post a Free Job Listing</h3>
                </div>
                <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>
                  Are you an employer looking to post job descriptions, placement notices, or internship drives? We publish verified listings for free. Email us the listing details:
                </p>
                <div className="p-3 bg-light rounded" style={{ fontSize: '0.85rem', color: '#475569' }}>
                  <strong>Required Information:</strong> Company name, position, salary/stipend range, location (or remote), eligibility criteria, and link to apply. Send listings to: <a href="mailto:nextjobpost@gmail.com" className="fw-bold text-decoration-none">nextjobpost@gmail.com</a>
                </div>
              </div>

              {/* Response Times Card */}
              <div 
                className="p-4 bg-white border border-light-subtle" 
                style={{ borderRadius: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.02)' }}
              >
                <div className="d-flex align-items-center mb-3">
                  <span className="fs-3 me-3">⏱️</span>
                  <h3 className="fw-bold mb-0" style={{ fontSize: '1.2rem', color: '#0f172a' }}>Average Response Guarantee</h3>
                </div>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                  Our team reads and filters every message. We typically get back to you within <strong>24 business hours</strong>. Our operational hours are:
                  <br />
                  <span className="fw-semibold text-dark mt-2 d-inline-block">Monday to Friday — 9 AM to 6 PM IST</span>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* FAQ redirection banner */}
        <div 
          className="mt-5 p-4 text-center bg-white border border-light-subtle" 
          style={{ borderRadius: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.02)' }}
        >
          <p className="mb-0 text-muted">
            Have a common question about application limits or resume builder PDF exports? Check out our <a href="/faq" className="fw-bold text-decoration-none text-primary">Frequently Asked Questions (FAQ)</a>.
          </p>
        </div>

      </div>
    </section>
  );
}
