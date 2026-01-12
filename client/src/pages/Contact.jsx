import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send to backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="contact-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="container narrow-container">
        
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#162c4a' }}>Get In Touch</h1>
          <p className="lead text-muted">Have feedback, questions, or want to list your job? We're here to help!</p>
        </div>

        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="p-4" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e0e7f1' }}>
              {submitted && (
                <div className="alert alert-success mb-4" role="alert">
                  ✓ Thank you! Your message has been received. We'll get back to you soon.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#162c4a' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    style={{ borderRadius: '8px', padding: '0.75rem' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#162c4a' }}>Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    style={{ borderRadius: '8px', padding: '0.75rem' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#162c4a' }}>Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    style={{ borderRadius: '8px', padding: '0.75rem' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#162c4a' }}>Message</label>
                  <textarea 
                    className="form-control" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5" 
                    placeholder="Tell us more..."
                    required
                    style={{ borderRadius: '8px', padding: '0.75rem' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary fw-bold"
                  style={{ padding: '0.8rem 2rem', borderRadius: '8px' }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-5">
            <div className="mb-4 p-4" style={{ background: 'linear-gradient(135deg, #e3f2fd, #e1f5fe)', borderRadius: '12px', border: '2px solid #b3e5fc' }}>
              <h5 style={{ color: '#01579b', marginBottom: '1rem' }}>📧 Email</h5>
              <p style={{ color: '#465a6b', marginBottom: '0.75rem' }}>
                <strong>nextjobpost@gmail.com</strong><br/>
                We typically respond within 24 hours
              </p>
            </div>

            <div className="mb-4 p-4" style={{ background: 'linear-gradient(135deg, #f3e5f5, #f1f5f7)', borderRadius: '12px', border: '2px solid #e1bee7' }}>
              <h5 style={{ color: '#4a148c', marginBottom: '1rem' }}>💬 Social Media</h5>
              <p style={{ color: '#465a6b', marginBottom: '1rem' }}>Follow us for job updates and career tips:</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: '#1f2937', color: '#fff', textDecoration: 'none', fontSize: '1.2rem', transition: 'all 200ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}><span>f</span></a>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: '#1f2937', color: '#fff', textDecoration: 'none', fontSize: '1.2rem', transition: 'all 200ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}><span>𝕏</span></a>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: '#1f2937', color: '#fff', textDecoration: 'none', fontSize: '1.2rem', transition: 'all 200ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}><span>in</span></a>
              </div>
            </div>

            <div className="p-4" style={{ background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', border: '2px solid #c8e6c9' }}>
              <h5 style={{ color: '#1b5e20', marginBottom: '1rem' }}>⏰ Response Time</h5>
              <p style={{ color: '#465a6b', marginBottom: '0.5rem' }}>
                <strong>Monday - Friday:</strong> 9 AM - 6 PM IST<br/>
                <strong>Saturday - Sunday:</strong> Closed
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-5 p-4" style={{ background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e0e7f1' }}>
          <h3 className="h5 mb-3" style={{ color: '#162c4a' }}>Frequently Asked Questions</h3>
          <p style={{ color: '#465a6b', marginBottom: 0 }}>
            Have a common question? Check out our <a href="/faq" style={{ color: '#0d6efd', textDecoration: 'none', fontWeight: '600' }}>FAQ page</a> for quick answers.
          </p>
        </div>
      </div>
    </section>
  );
}
