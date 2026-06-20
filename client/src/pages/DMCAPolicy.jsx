import React from 'react';

export default function DMCAPolicy() {
  return (
    <div className="legal-page" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="legal-header">
            <h1 className="legal-page-title" style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>DMCA & Copyright Policy</h1>
            <p className="legal-last-updated" style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Last Updated: June 18, 2026</p>
          </div>

          <div className="legal-body" style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.8' }}>
            <section className="legal-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>1. Notice of Copyright Infringement</h2>
              <p>
                NextJobPost.in respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act ("DMCA"), we will respond quickly to claims of copyright infringement committed on our website.
                If you are a copyright owner, or are authorized to act on behalf of one, please report alleged copyright infringements by sending a formal DMCA Notice of Alleged Infringement to our designated agent.
              </p>
            </section>

            <section className="legal-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>2. How to File a Takedown Notice</h2>
              <p>
                To file a valid copyright infringement notice, you must provide the following information in writing:
              </p>
              <ul>
                <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest.</li>
                <li>A description of the copyrighted work that you claim has been infringed.</li>
                <li>A description of where the material that you claim is infringing is located on the site (e.g., the direct URL of the page).</li>
                <li>Your contact information: address, telephone number, and email address.</li>
                <li>A statement by you that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement by you, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</li>
              </ul>
            </section>

            <section className="legal-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>3. Counter-Notification Procedure</h2>
              <p>
                If you believe your content was removed by mistake or misidentification, you may file a counter-notification with our agent. Your counter-notice must be in writing and include your contact info, signature, identification of the removed content, and a statement under penalty of perjury that the material was removed as a result of mistake or misidentification.
              </p>
            </section>

            <section className="legal-section last-section" style={{ marginBottom: '2rem' }}>
              <h2 className="legal-section-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>4. Designated Agent Contact</h2>
              <p>
                Please deliver all takedown notices and counter-notifications to our designated email address:
              </p>
              <p className="contact-info" style={{ fontWeight: '600' }}>
                Email: <a href="mailto:nextjobpost@gmail.com">nextjobpost@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
