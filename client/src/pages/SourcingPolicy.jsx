import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function SourcingPolicy() {
  return (
    <section style={{ paddingTop: '3rem', paddingBottom: '4rem', background: '#f8fafc', minHeight: '80vh' }}>
      <Helmet>
        <title>Sourcing & Data Collection Policy | NextJobPost.in – Where We Get Job Data</title>
        <meta name="description" content="Understand exactly where NextJobPost sources its government and private job notifications, how we collect data from official portals, and our strict anti-scam controls." />
        <link rel="canonical" href="https://nextjobpost.in/sourcing-policy" />
      </Helmet>

      <div className="container" style={{ maxWidth: '860px' }}>

        {/* Header */}
        <div className="mb-5 text-center">
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            color: '#fff',
            fontSize: '0.88rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '30px',
            fontWeight: '700',
            marginBottom: '1rem',
            letterSpacing: '0.5px'
          }}>
            🔎 Full Transparency
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '800', color: '#0f172a', lineHeight: '1.25' }}>
            Sourcing &amp; Data Collection Policy
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '620px', margin: '1rem auto 0', lineHeight: '1.7' }}>
            We are fully transparent about where every job notification on NextJobPost originates, how we collect that data, and how we protect you from fraudulent listings.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            Last Updated: <strong>July 2026</strong>
          </p>
        </div>

        {/* Primary Sources */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            🏛️ Our Primary Data Sources
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '1.25rem' }}>
            All job notifications published on NextJobPost originate from one or more of the following official primary sources. We do not accept user-submitted listings or take data from unofficial third-party aggregators without independent verification.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                cat: 'Central Government Portals',
                icon: '🏛️',
                sources: ['ssc.gov.in (Staff Selection Commission)', 'upsc.gov.in (Union Public Service Commission)', 'indianrailways.gov.in & regional RRB portals', 'ibps.in (Institute of Banking Personnel Selection)', 'rbi.org.in (Reserve Bank of India)', 'sbi.co.in (State Bank of India)', 'joinindianarmy.nic.in, joinindiannavy.gov.in, careerindianairforce.cdac.in'],
                color: '#2563eb'
              },
              {
                cat: 'State Government Portals',
                icon: '🗺️',
                sources: ['Respective State Public Service Commission (PSC) official websites', 'State Employment News portals (.gov.in domains)', 'State Education Department and Teacher Recruitment Board websites', 'State Police Recruitment Board official portals'],
                color: '#059669'
              },
              {
                cat: 'Official PSU & Autonomous Body Portals',
                icon: '🔬',
                sources: ['ongcindia.com (ONGC)', 'ntpc.co.in', 'bhel.com', 'iocl.com (Indian Oil Corporation)', 'ISRO, DRDO, HAL official career pages'],
                color: '#d97706'
              },
              {
                cat: 'Private Company Career Pages',
                icon: '💼',
                sources: ['Official careers.company.com sub-domain of the respective employer', 'Verified LinkedIn Recruiter postings linked to official company pages', 'Official company hiring email domains (e.g., hr@company.com)'],
                color: '#7c3aed'
              },
              {
                cat: 'Official Employment Gazettes',
                icon: '📰',
                sources: ['Employment News Weekly (employmentnews.gov.in) — India\'s official government job publication', 'Rozgar Samachar (Hindi edition)', 'Ministry of Labour & Employment circulars'],
                color: '#0891b2'
              }
            ].map(({ cat, icon, sources, color }) => (
              <div key={cat} style={{
                padding: '1.25rem 1.5rem',
                background: `${color}08`,
                border: `1.5px solid ${color}25`,
                borderRadius: '12px'
              }}>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{icon}</span> {cat}
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', lineHeight: '1.75', fontSize: '0.9rem' }}>
                  {sources.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How We Collect */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            ⚙️ How We Collect and Publish Data
          </h2>
          <ol style={{ color: '#475569', lineHeight: '1.9', paddingLeft: '1.25rem', margin: 0, fontSize: '0.96rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#1e293b' }}>Source Monitoring:</strong> Our editorial team monitors all primary source portals multiple times daily using a structured checklist. High-priority portals (SSC, Railways, Banking) are checked every 2 hours. State portals are reviewed at least twice daily.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#1e293b' }}>Notification Extraction:</strong> When a new notification is identified, the official PDF is downloaded and stored in our internal document archive. Key data fields (vacancy count, eligibility, salary, application dates, fee amounts) are manually extracted from the PDF — not auto-scraped from other aggregator websites.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#1e293b' }}>Editorial Review:</strong> Every extracted notification is reviewed by a second team member before publication to catch any transcription errors. The reviewer checks all data points against the source PDF independently.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#1e293b' }}>Link Validation:</strong> All application and PDF links are tested immediately before publication and again within 48 hours of going live. Expired or redirected links are replaced within 12 hours.
            </li>
            <li>
              <strong style={{ color: '#1e293b' }}>Structured Publication:</strong> Validated data is published on our platform with a "Last Verified" timestamp, source attribution, and a direct link to the official notification PDF, giving readers the ability to independently verify any detail at the primary source.
            </li>
          </ol>
        </div>

        {/* Anti-Scam Controls */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            🛡️ Our Anti-Scam & Fraud Controls
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '1rem' }}>
            We understand that the government recruitment space is heavily targeted by fraudulent operators. The following controls are non-negotiable standards in our sourcing process:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '🔒', title: 'Domain Age Verification', desc: 'We reject all links from domains registered less than 90 days ago unless they are subdomains of verified government portals.' },
              { icon: '💳', title: 'No Private Fee Channels', desc: 'Any listing requesting fees via UPI personal IDs, WhatsApp Pay, or informal wallets is immediately removed as a scam alert.' },
              { icon: '📧', title: 'Official Email Validation', desc: 'Private sector listings must have job postings hosted on official company domains — not generic Gmail or Yahoo email addresses.' },
              { icon: '📋', title: 'Ministry of Corporate Affairs Check', desc: 'All private companies listed on NextJobPost are cross-referenced with the MCA21 database to confirm valid registration.' },
              { icon: '🔗', title: 'No Referral Link Injections', desc: 'We never modify application URLs to include affiliate codes, tracking IDs, or redirects that would alter the destination link.' },
              { icon: '🗑️', title: 'Immediate Takedown Protocol', desc: 'Any listing confirmed as fraudulent after publication is removed within 2 hours with a public notification to all users who viewed it.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                padding: '1.1rem 1.25rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.35rem' }}>{title}</div>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.65', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Retention */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            📦 Data Archiving & Retention
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '0.75rem' }}>
            NextJobPost maintains an internal archive of all sourced notification PDFs for a minimum of <strong>3 years</strong> after publication. This archive serves multiple purposes:
          </p>
          <ul style={{ color: '#475569', lineHeight: '1.85', paddingLeft: '1.25rem', margin: 0, fontSize: '0.95rem' }}>
            <li>Enabling quick verification of historical vacancy details reported by readers.</li>
            <li>Supporting candidates who need to reference original notification terms for appeal processes.</li>
            <li>Providing an audit trail for our editorial team when handling correction requests.</li>
            <li>Assisting regulatory compliance reviews if requested by government authorities.</li>
          </ul>
          <p style={{ color: '#475569', lineHeight: '1.8', marginTop: '0.75rem', marginBottom: 0 }}>
            To request access to an archived notification document, contact us at{' '}
            <a href="mailto:nextjobpost@gmail.com" style={{ color: '#2563eb', fontWeight: '600' }}>nextjobpost@gmail.com</a> with the job title and publication date.
          </p>
        </div>

        {/* Footer nav */}
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
          Also see:{' '}
          <Link to="/fact-checking-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Fact-Checking Policy</Link>
          {' | '}
          <Link to="/correction-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Correction Policy</Link>
          {' | '}
          <Link to="/editorial-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Editorial Policy</Link>
        </div>

      </div>
    </section>
  );
}
