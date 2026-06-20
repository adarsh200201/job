import React from 'react';

export default function EditorialPolicy() {
  return (
    <div className="legal-page" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="legal-header">
            <h1 className="legal-page-title" style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Editorial Policy</h1>
            <p className="legal-last-updated" style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Last Updated: June 18, 2026</p>
          </div>

          <div className="legal-body" style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.8' }}>
            <section className="legal-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>1. Introduction & Sourcing Standards</h2>
              <p>
                At NextJobPost.in, we are committed to providing our audience with accurate, reliable, and timely information regarding job notifications, internships, syllabus updates, exam results, and career advice. 
                Every job notification and exam update published on our platform is sourced directly from verified official resources, such as official government portals, leading company recruitment boards, and authorized press releases.
              </p>
            </section>

            <section className="legal-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>2. Content Verification & Accuracy</h2>
              <p>
                Our career and editorial team verifies the details of every post before it goes live. This includes checking:
              </p>
              <ul>
                <li>The official apply links to ensure they direct candidates to secure, official hiring portals (e.g., matching the company's official domain name).</li>
                <li>The specified vacancy counts, qualifications, salaries, and application deadlines against official notifications to prevent misrepresentation.</li>
                <li>Exam syllabus and patterns against the latest official syllabus PDFs released by the Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), and other exam authorities.</li>
              </ul>
            </section>

            <section className="legal-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>3. Editorial Independence & Non-Commercial Links</h2>
              <p>
                NextJobPost.in maintains absolute editorial independence. We do **not** accept placement fees, registration charges, or payments from third-party agencies to promote job listings. Every link provided in our job listings is a direct application link. We do not participate in candidate shortlisting or recruitment decisions, keeping our evaluations transparent and unbiased.
              </p>
            </section>

            <section className="legal-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>4. Corrections & Updates Policy</h2>
              <p>
                If we discover or are notified of a factual error, typo, or broken link in any of our articles, syllabus documents, or job posts, our team will review the issue and issue a correction within 24 hours. We welcome feedback and reports from our readers to maintain content integrity. If you spot an error, please reach out to us at <a href="mailto:nextjobpost@gmail.com">nextjobpost@gmail.com</a>.
              </p>
            </section>

            <section className="legal-section last-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>5. Contact Us</h2>
              <p>
                If you have questions about our editorial standards or wish to submit feedback regarding our articles, please contact us at:
              </p>
              <p className="contact-info" style={{ fontWeight: '600' }}>
                Email: <a href="mailto:support@nextjobpost.in">support@nextjobpost.in</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
