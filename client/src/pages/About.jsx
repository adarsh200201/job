import React from 'react';

export default function About() {
  return (
    <section className="about-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="container narrow-container">
        
        {/* Header */}
        <div className="mb-5">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#162c4a' }}>About Job For Fresher</h1>
          <p className="lead text-muted" style={{ fontSize: '1.2rem' }}>
            Empowering fresh graduates to launch their careers with curated job opportunities and clear guidance.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-5 p-4" style={{ background: 'linear-gradient(135deg, #f0f7ff, #e6f4ff)', borderRadius: '12px', border: '2px solid #dbeafe' }}>
          <h2 className="h4 mb-3" style={{ color: '#0d6efd' }}>🎯 Our Mission</h2>
          <p style={{ color: '#465a6b', lineHeight: '1.8', fontSize: '1.05rem' }}>
            To provide a simple, distraction-free platform where fresh graduates can discover genuine job opportunities and internships from top companies across India. We believe in making career entry smooth and accessible for every fresher.
          </p>
        </div>

        {/* What We Offer */}
        <div className="mb-5">
          <h2 className="h4 mb-4" style={{ color: '#162c4a' }}>💼 What We Offer</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4" style={{ background: '#fff9e6', borderRadius: '10px', border: '1px solid #ffeaa7' }}>
                <h5 style={{ color: '#d9a704', marginBottom: '1rem' }}>📋 Curated Job Listings</h5>
                <p style={{ color: '#465a6b', marginBottom: 0 }}>Hand-picked job opportunities from verified companies targeting freshers and recent graduates</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4" style={{ background: '#e8f5e9', borderRadius: '10px', border: '1px solid #81c784' }}>
                <h5 style={{ color: '#2e7d32', marginBottom: '1rem' }}>🎓 Internship Programs</h5>
                <p style={{ color: '#465a6b', marginBottom: 0 }}>Discover internship opportunities to gain real-world experience and build your professional portfolio</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4" style={{ background: '#e3f2fd', borderRadius: '10px', border: '1px solid #64b5f6' }}>
                <h5 style={{ color: '#1565c0', marginBottom: '1rem' }}>🏠 Remote Opportunities</h5>
                <p style={{ color: '#465a6b', marginBottom: 0 }}>Work from home roles that offer flexibility while you build your career</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4" style={{ background: '#f3e5f5', borderRadius: '10px', border: '1px solid #ba68c8' }}>
                <h5 style={{ color: '#6a1b9a', marginBottom: '1rem' }}>📊 Career Insights</h5>
                <p style={{ color: '#465a6b', marginBottom: 0 }}>Helpful tips and resources to prepare for interviews and kick-start your career</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-5 p-4" style={{ background: 'linear-gradient(135deg, #fff5f7, #ffe4e9)', borderRadius: '12px', border: '2px solid #f8bbd0' }}>
          <h2 className="h4 mb-3" style={{ color: '#c2185b' }}>⭐ Why Choose Job For Fresher?</h2>
          <ul style={{ color: '#465a6b', lineHeight: '2', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
            <li><strong>Fresher-Focused:</strong> We only list positions explicitly open for freshers</li>
            <li><strong>Simple Interface:</strong> No clutter, no distractions - just quality job listings</li>
            <li><strong>Verified Companies:</strong> All job listings are from legitimate, top-rated employers</li>
            <li><strong>Multiple Opportunities:</strong> Full-time roles, internships, and work-from-home positions</li>
            <li><strong>Direct Apply:</strong> Apply directly on company websites without intermediaries</li>
            <li><strong>Free to Use:</strong> No hidden fees or premium memberships required</li>
          </ul>
        </div>

        {/* Coverage */}
        <div className="mb-5">
          <h2 className="h4 mb-3" style={{ color: '#162c4a' }}>🌍 Our Coverage</h2>
          <p style={{ color: '#465a6b', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Job For Fresher lists opportunities across major cities in India including:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {['Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'].map(city => (
              <div key={city} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', border: '1px solid #e0e7f1', color: '#162c4a', fontWeight: '600' }}>
                {city}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center p-5" style={{ background: 'linear-gradient(90deg, #0d6efd, #0d6b6b)', borderRadius: '12px', color: '#fff' }}>
          <h2 className="h5 mb-2">Have Questions?</h2>
          <p className="mb-3">We'd love to hear from you. Get in touch with our team.</p>
          <a href="/contact" className="btn btn-light fw-bold">Contact Us</a>
        </div>
      </div>
    </section>
  );
}
