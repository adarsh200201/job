import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function CorrectionPolicy() {
  return (
    <section style={{ paddingTop: '3rem', paddingBottom: '4rem', background: '#f8fafc', minHeight: '80vh' }}>
      <Helmet>
        <title>Correction & Update Policy | NextJobPost.in – How We Fix Errors</title>
        <meta name="description" content="Understand how NextJobPost handles content corrections, date updates, and vacancy changes. Report inaccuracies and see our commitment to accurate, up-to-date job information." />
        <link rel="canonical" href="https://nextjobpost.in/correction-policy" />
      </Helmet>

      <div className="container" style={{ maxWidth: '860px' }}>

        {/* Header */}
        <div className="mb-5 text-center">
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff',
            fontSize: '0.88rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '30px',
            fontWeight: '700',
            marginBottom: '1rem',
            letterSpacing: '0.5px'
          }}>
            🔄 Transparency First
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '800', color: '#0f172a', lineHeight: '1.25' }}>
            Correction &amp; Updates Policy
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '620px', margin: '1rem auto 0', lineHeight: '1.7' }}>
            Accuracy is non-negotiable at NextJobPost. When errors occur — whether from source changes or our own oversight — we correct them openly, completely, and on record.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            Last Updated: <strong>July 2026</strong>
          </p>
        </div>

        {/* Our Commitment */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            🤝 Our Commitment to Accuracy
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '0.75rem' }}>
            We believe that trust is built over many accurate decisions and can be erased by a single uncorrected mistake. If you find incorrect information on NextJobPost — whether it is a wrong application date, a changed vacancy count, an outdated salary figure, or an expired link — we commit to reviewing and resolving the issue within <strong>24 hours</strong> of being notified.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.8', margin: 0 }}>
            We also do not silently patch errors. All significant corrections are noted visibly on the affected page with a "Correction Notice" timestamp, making our process fully transparent to all readers.
          </p>
        </div>

        {/* Types of Corrections */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
            📋 Types of Corrections We Handle
          </h2>
          {[
            {
              icon: '📅',
              title: 'Date Changes',
              color: '#2563eb',
              desc: 'Application start dates, last dates, exam dates, and admit card release dates sometimes change mid-cycle. When an official extension or revision is announced, we update the affected notification within hours, with the old and new dates clearly noted.'
            },
            {
              icon: '🔢',
              title: 'Vacancy Count Updates',
              color: '#059669',
              desc: 'Recruiting boards occasionally revise total vacancy counts post-notification — either adding seats or reducing them. We update vacancy counts immediately upon official confirmation and add a note indicating the change from the originally published figure.'
            },
            {
              icon: '💰',
              title: 'Salary & Pay Scale Corrections',
              color: '#d97706',
              desc: 'Pay matrix levels, gross salary figures, and allowance details sometimes differ between preliminary and final official notifications. We revise salary information to align with the final official PDF, never speculative or estimated figures.'
            },
            {
              icon: '🔗',
              title: 'Broken or Redirected Links',
              color: '#7c3aed',
              desc: 'Government portals frequently restructure their URLs after initial publication. We continuously monitor all active application and PDF links, and replace broken or redirected links within 12 hours of detection.'
            },
            {
              icon: '❌',
              title: 'Cancelled Notifications',
              color: '#e11d48',
              desc: 'In rare cases, recruiting boards withdraw or cancel advertised notifications. When this occurs, we immediately mark the listing as "Cancelled / Withdrawn" with a prominent alert and a link to the official cancellation notice.'
            },
            {
              icon: '📝',
              title: 'Editorial & Factual Corrections',
              color: '#0891b2',
              desc: 'Any factual error in our original editorial content — preparation guides, category descriptions, or career articles — is corrected at the earliest opportunity and annotated at the bottom of the article with the original error and the correction.'
            }
          ].map(({ icon, title, color, desc }) => (
            <div key={title} style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
              alignItems: 'flex-start',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{
                flexShrink: 0,
                width: '44px',
                height: '44px',
                background: `${color}18`,
                border: `2px solid ${color}40`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {icon}
              </div>
              <div>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '0.4rem' }}>{title}</h3>
                <p style={{ color: '#475569', lineHeight: '1.7', margin: 0, fontSize: '0.94rem' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How to Report */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1rem' }}>
            📧 How to Report an Error
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '1rem' }}>
            To report any inaccuracy, outdated information, broken link, or fraudulent listing, please reach out through any of these channels:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '1.2rem' }}>📧</span>
              <div>
                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>Email</div>
                <a href="mailto:nextjobpost@gmail.com" style={{ color: '#2563eb', fontSize: '0.9rem', fontWeight: '600' }}>nextjobpost@gmail.com</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '1.2rem' }}>📝</span>
              <div>
                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>Contact Form</div>
                <Link to="/contact" style={{ color: '#2563eb', fontSize: '0.9rem', fontWeight: '600' }}>nextjobpost.in/contact</Link>
              </div>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
            Please include: (1) the URL of the affected page, (2) the specific detail you believe is incorrect, and (3) a reference to the official source confirming the correct information. All reports are reviewed and acknowledged within 24 hours.
          </p>
        </div>

        {/* SLA */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
            ⏱️ Our Resolution Timelines
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { type: 'Critical (scam / fee-fraud / cancelled listing)', time: 'Removed within 2 hours', color: '#e11d48', bg: '#fff1f2' },
              { type: 'High (broken apply link, wrong last date)', time: 'Fixed within 12 hours', color: '#d97706', bg: '#fffbeb' },
              { type: 'Standard (vacancy count, salary, format errors)', time: 'Fixed within 24 hours', color: '#059669', bg: '#ecfdf5' },
              { type: 'Editorial content (article facts, prep guides)', time: 'Fixed within 48 hours', color: '#2563eb', bg: '#eff6ff' },
            ].map(({ type, time, color, bg }) => (
              <div key={type} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1.1rem',
                background: bg,
                borderRadius: '10px',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ color: '#374151', fontWeight: '600', fontSize: '0.9rem' }}>{type}</span>
                <span style={{ color: color, fontWeight: '800', fontSize: '0.88rem', flexShrink: 0 }}>{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
          Also see:{' '}
          <Link to="/fact-checking-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Fact-Checking Policy</Link>
          {' | '}
          <Link to="/sourcing-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Sourcing Process</Link>
          {' | '}
          <Link to="/editorial-policy" style={{ color: '#2563eb', fontWeight: '600' }}>Editorial Policy</Link>
        </div>

      </div>
    </section>
  );
}
