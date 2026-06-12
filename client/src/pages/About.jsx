import React from 'react';

export default function About() {
  return (
    <section className="about-page" style={{ paddingTop: '3rem', paddingBottom: '4rem', background: '#f8fafc' }}>
      {/* Hero Header Section */}
      <div 
        className="mb-5 p-5 text-white" 
        style={{ 
          background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)'
        }}
      >
        <div className="container">
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
            Empowering Careers
          </span>
          <h1 className="display-4 fw-bold mb-3">About NextJobPost.in</h1>
          <p className="lead fs-5 mb-0" style={{ color: '#94a3b8', maxWidth: '800px', lineHeight: '1.7' }}>
            We are India's premier, 100% free career development and recruitment platform. By blending verified job boards with extensive preparation resources, we bridge the gap between seeking a job and landing one.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Statistics Section */}
        <div className="row g-4 mb-5 text-center">
          {[
            { value: '2,800+', label: 'Practice Questions', icon: '❓', bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
            { value: '8+', label: 'Prep Categories', icon: '📚', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
            { value: '100% Free', label: 'No Hidden Fees', icon: '💎', bg: '#fdf2f8', border: '#fbcfe8', color: '#be185d' },
            { value: 'Direct Apply', label: 'Verified Employer Links', icon: '🔗', bg: '#fff7ed', border: '#fed7aa', color: '#c2410c' }
          ].map((stat, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div 
                className="p-4" 
                style={{ 
                  background: stat.bg, 
                  border: `1px solid ${stat.border}`, 
                  borderRadius: '16px',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <div className="fs-1 mb-2">{stat.icon}</div>
                <h3 className="fw-bold mb-1" style={{ color: stat.color }}>{stat.value}</h3>
                <span className="text-muted fw-semibold small">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Two-Column Core Purpose */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-lg-6">
            <h2 className="display-6 fw-bold mb-4" style={{ color: '#0f172a' }}>🎯 Our Vision and Mission</h2>
            <p className="text-muted mb-3" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Finding a job or preparing for interviews shouldn't be gated behind expensive subscriptions. Our vision is to make recruitment resources, mock assessments, and resume tools open and accessible to all job seekers across India.
            </p>
            <p className="text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              We strive to create a transparent, user-focused ecosystem where fresh graduates can comfortably start their career journeys, and experienced candidates can find next-level growth—without the distraction of premium tiers or third-party agencies.
            </p>
            <div className="p-4 border-start border-4 border-primary bg-white rounded-end" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <p className="fst-italic text-dark mb-0 fw-semibold">
                "We operate with 100% transparency. Every job application link is verified and redirects directly to the hiring employer's portal—no middlemen, no service charges, and no hidden terms."
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="p-5 bg-white border border-light" style={{ borderRadius: '24px', boxShadow: '0 12px 30px rgba(0,0,0,0.04)' }}>
              <h3 className="fw-bold mb-4" style={{ color: '#0f172a' }}>🛠️ Core Pillars of NextJobPost</h3>
              <div className="d-flex mb-4">
                <span className="fs-3 me-3">💼</span>
                <div>
                  <h4 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>Curated Job Board</h4>
                  <p className="text-muted mb-0 small">Daily listings of verified vacancies across diverse fields for freshers and experienced professionals alike.</p>
                </div>
              </div>
              <div className="d-flex mb-4">
                <span className="fs-3 me-3">📝</span>
                <div>
                  <h4 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>Professional Resume Builder</h4>
                  <p className="text-muted mb-0 small">A simple, structured builder that compiles your credentials into industry-standard recruiter-friendly PDF formats.</p>
                </div>
              </div>
              <div className="d-flex mb-4">
                <span className="fs-3 me-3">📊</span>
                <div>
                  <h4 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>Aptitude Prep Center</h4>
                  <p className="text-muted mb-0 small">Comprehensive modules featuring Quantitative, Logical, Verbal, and Data Interpretation practice question banks.</p>
                </div>
              </div>
              <div className="d-flex">
                <span className="fs-3 me-3">💻</span>
                <div>
                  <h4 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>Technical Prep Module</h4>
                  <p className="text-muted mb-0 small">Coding MCQs and Q&As covering JavaScript, Java, Python, DBMS, and other developer frameworks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed What We Do Section */}
        <div className="mb-5">
          <h2 className="h3 fw-bold mb-4 text-center" style={{ color: '#0f172a' }}>⚡ How We Help You Succeed</h2>
          <div className="row g-4">
            {[
              {
                title: 'No Sign-Up Barriers',
                desc: 'Browse all job listings, view exam formulas, and practice with our prep tools instantly without mandatorily creating accounts.',
                color: '#fff',
                accent: '#0d6efd',
                emoji: '🔓'
              },
              {
                title: 'No Job Scams Policy',
                desc: 'We screen and vet postings. We explicitly warn against and filter out postings that charge candidates for application processes.',
                color: '#fff',
                accent: '#10b981',
                emoji: '🛡️'
              },
              {
                title: 'Mobile-Optimized Experience',
                desc: 'Our entire portal is fully responsive. You can learn formulas, solve math sets, and search jobs smoothly from any smartphone.',
                color: '#fff',
                accent: '#8b5cf6',
                emoji: '📱'
              },
              {
                title: 'Google AdSense Integrated',
                desc: 'We run on transparent third-party ads to fund our hosting and database costs, keeping our services 100% free for you.',
                color: '#fff',
                accent: '#f59e0b',
                emoji: '🎯'
              }
            ].map((card, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div 
                  className="p-4 h-100 bg-white border border-light" 
                  style={{ 
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div 
                    className="d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '12px', 
                      background: card.accent + '15',
                      color: card.accent,
                      fontSize: '1.5rem'
                    }}
                  >
                    {card.emoji}
                  </div>
                  <h4 className="fw-bold mb-2" style={{ fontSize: '1.15rem', color: '#0f172a' }}>{card.title}</h4>
                  <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Coverage */}
        <div className="mb-5 p-5 bg-white border border-light" style={{ borderRadius: '24px', boxShadow: '0 12px 30px rgba(0,0,0,0.02)' }}>
          <h2 className="h4 fw-bold mb-3 text-center" style={{ color: '#0f172a' }}>🌍 Nationwide Access</h2>
          <p className="text-muted text-center mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            We index and list job roles, walk-ins, off-campus drives, and internships across all major IT and business centers in India.
          </p>
          <div className="row g-3 justify-content-center">
            {['Bangalore', 'Hyderabad', 'Pune', 'Noida / Delhi NCR', 'Mumbai', 'Chennai', 'Kolkata', 'Ahmedabad'].map((city, idx) => (
              <div className="col-6 col-md-3 col-lg-2" key={idx}>
                <div 
                  className="p-3 border border-light text-center fw-semibold" 
                  style={{ 
                    borderRadius: '12px',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.95rem'
                  }}
                >
                  📍 {city}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div 
          className="text-center p-5 text-white" 
          style={{ 
            background: 'linear-gradient(135deg, #0d6efd, #0d6b6b)', 
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(13, 110, 253, 0.15)'
          }}
        >
          <h2 className="fw-bold mb-2">Kickstart Your Prep or Job Search Today</h2>
          <p className="mb-4 text-white-50" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Ready to find your next opportunity or prepare for your upcoming placement test? Explore our sections for free.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <a href="/" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Search Jobs</a>
            <a href="/preparation" className="btn btn-outline-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Practice MCQ & Aptitude</a>
          </div>
        </div>
      </div>
    </section>
  );
}
