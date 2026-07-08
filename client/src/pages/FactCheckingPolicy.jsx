import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function FactCheckingPolicy() {
  return (
    <section style={{ paddingTop: '3rem', paddingBottom: '4rem', background: '#f8fafc', minHeight: '80vh' }}>
      <Helmet>
        <title>Fact-Checking Policy | NextJobPost.in – How We Verify Job Information</title>
        <meta name="description" content="Learn how NextJobPost verifies every government and private job notification before publishing. Our 4-step fact-checking process ensures accurate, reliable, and scam-free recruitment information." />
        <link rel="canonical" href="https://nextjobpost.in/fact-checking-policy" />
      </Helmet>

      <div className="container" style={{ maxWidth: '860px' }}>

        {/* Header */}
        <div className="mb-5 text-center">
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #1e3a5f, #0d6efd)',
            color: '#fff',
            fontSize: '0.88rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '30px',
            fontWeight: '700',
            marginBottom: '1rem',
            letterSpacing: '0.5px'
          }}>
            ✅ Our Standards
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '800', color: '#0f172a', lineHeight: '1.25' }}>
            Fact-Checking &amp; Verification Policy
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '620px', margin: '1rem auto 0', lineHeight: '1.7' }}>
            Every job notification published on NextJobPost.in goes through a strict multi-step verification process before it reaches you. Here is exactly how we ensure accuracy.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            Last Updated: <strong>July 2026</strong>
          </p>
        </div>

        {/* Why It Matters */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            📌 Why Fact-Checking Matters
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', margin: 0 }}>
            India's job-seeking ecosystem is plagued with fraudulent listings, misleading vacancy counts, and unofficial notifications shared by unverified third-party aggregators. Applicants routinely waste time — or worse, lose money — to scam recruiters demanding application fees under the guise of legitimate opportunities.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.8', marginTop: '0.75rem', marginBottom: 0 }}>
            At NextJobPost, our editorial team's primary obligation is to every job seeker who relies on our platform. We do not publish a single notification unless it clears our complete verification process. This commitment is non-negotiable.
          </p>
        </div>

        {/* 4-Step Process */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
            🔍 Our 4-Step Verification Process
          </h2>

          {[
            {
              step: '01',
              title: 'Primary Source Verification',
              color: '#2563eb',
              bg: '#eff6ff',
              content: 'Every notification is traced directly to the issuing authority\'s official domain — for government jobs this means official .gov.in, .nic.in, or .org.in domains of the respective recruiting board (e.g. ssc.gov.in for SSC, rrbcdg.gov.in for Railway). For private companies, we verify the company domain, LinkedIn presence, and registration details against the Ministry of Corporate Affairs database. We never publish from secondary aggregators like newspapers, WhatsApp forwards, or social media posts without independent source confirmation.'
            },
            {
              step: '02',
              title: 'Notification PDF & Details Review',
              color: '#059669',
              bg: '#ecfdf5',
              content: 'Once the primary source is confirmed, our editorial team downloads and reads the official recruitment notification PDF in full. We extract all critical application details — vacancy counts, age limits, pay scale, eligibility qualifications, application fee amounts, and important dates — and cross-reference each data point with the official PDF to ensure exact accuracy. Any ambiguity or discrepancy results in the notification being held until a clarification is issued.'
            },
            {
              step: '03',
              title: 'Scam Detection & Link Safety Check',
              color: '#d97706',
              bg: '#fffbeb',
              content: 'We run each linked URL through a domain-safety and age verification check. Links to domains registered within the previous 30 days are automatically rejected until the domain owner\'s identity is confirmed. We also flag any listing that demands application fees payable to individuals rather than official government challan systems, and any listing that requests candidates to send documents to a personal email or WhatsApp number. All application links provided on our platform redirect directly to the official portal — not to any intermediary.'
            },
            {
              step: '04',
              title: 'Post-Publication Monitoring & Correction',
              color: '#7c3aed',
              bg: '#f5f3ff',
              content: 'Our responsibility does not end at publication. We monitor each live notification for updates — such as application date extensions, correction windows, additional vacancies, or complete withdrawal of the advertisement. Our team rechecks all active notifications at a minimum of every 72 hours for time-sensitive updates. When updates are required, the notification is updated in real time with a "Last Verified" timestamp and, if needed, a visible correction note explaining what changed and why.'
            }
          ].map(({ step, title, color, bg, content }) => (
            <div key={step} style={{
              display: 'flex',
              gap: '1.25rem',
              marginBottom: '1.75rem',
              alignItems: 'flex-start'
            }}>
              <div style={{
                flexShrink: 0,
                width: '52px',
                height: '52px',
                background: bg,
                border: `2px solid ${color}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1rem',
                color: color
              }}>
                {step}
              </div>
              <div>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: '#475569', lineHeight: '1.75', margin: 0, fontSize: '0.95rem' }}>{content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What We Do Not Publish */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            🚫 Content We Will Never Publish
          </h2>
          <ul style={{ color: '#475569', lineHeight: '1.85', paddingLeft: '1.25rem', margin: 0, fontSize: '0.96rem' }}>
            <li>Job notifications from unverified or unofficial sources — including WhatsApp forwards, Telegram channels, or social media posts without traceable official origins.</li>
            <li>Listings that demand any form of application fees payable to individuals, non-governmental bank accounts, or through informal payment channels like Paytm or Google Pay to private numbers.</li>
            <li>Vacancy counts, salary figures, or eligibility details that contradict the official notification PDF.</li>
            <li>Listings from companies or individuals with no verifiable registered business identity.</li>
            <li>Job postings that ask candidates to send personal documents (resume, Aadhaar, mark sheets) to personal email addresses or messaging apps.</li>
            <li>Notifications that were officially cancelled, withdrawn, or superseded by the recruiting authority.</li>
          </ul>
        </div>

        {/* Editorial Team */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            👥 Our Editorial Team
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '0.75rem' }}>
            Our editorial team consists of professionals with experience in government recruitment processes, competitive examinations, and digital publishing. All team members are trained in verifying official government documents, identifying scam patterns, and accurately interpreting recruitment notification language.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.8', margin: 0 }}>
            Every published notification is reviewed by at least one qualified team member before going live. Editor names are credited on high-value guides and career articles. For any concerns about our editorial standards, please contact us at{' '}
            <a href="mailto:nextjobpost@gmail.com" style={{ color: '#2563eb', fontWeight: '600' }}>nextjobpost@gmail.com</a>.
          </p>
        </div>

        {/* Report Inaccuracy CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
          border: '1px solid #bfdbfe',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e40af', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
            🔔 Found an Inaccuracy?
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.75', marginBottom: '1.25rem', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
            If you find any incorrect detail — salary, date, eligibility, or application link — on any listing, please report it immediately. We take all reports seriously and resolve confirmed inaccuracies within 24 hours.
          </p>
          <Link to="/contact" style={{
            display: 'inline-block',
            background: '#2563eb',
            color: '#fff',
            padding: '0.65rem 1.75rem',
            borderRadius: '10px',
            fontWeight: '700',
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}>
            Report an Issue →
          </Link>
        </div>

        {/* Footer nav */}
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
          Also see:{' '}
          <Link to="/correction-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Correction Policy</Link>
          {' | '}
          <Link to="/sourcing-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Sourcing Process</Link>
          {' | '}
          <Link to="/editorial-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Editorial Policy</Link>
        </div>

      </div>
    </section>
  );
}
