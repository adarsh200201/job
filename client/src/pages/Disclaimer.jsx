import React from 'react';

export default function Disclaimer() {
  return (
    <section className="disclaimer-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="container narrow-container">
        
        <h1 className="display-5 fw-bold mb-4" style={{ color: '#162c4a' }}>Disclaimer</h1>
        <p style={{ color: '#999', marginBottom: '2rem' }}>Last Updated: December 2024</p>

        <div style={{ lineHeight: '1.8', color: '#465a6b', fontSize: '1.05rem' }}>
          
          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>General Disclaimer</h2>
            <p>
              The information provided on the Job For Fresher website is for informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind regarding the completeness, accuracy, reliability, or availability of information contained on this website.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>Job Listings Disclaimer</h2>
            <p className="mb-2"><strong>Important:</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Third-Party Content:</strong> All job listings on our platform are provided by employers and third parties. We do not create, prepare, or verify job descriptions.</li>
              <li><strong>No Verification:</strong> We do not independently verify the authenticity, legitimacy, or details of job postings. We recommend that you independently verify any job opportunity before applying.</li>
              <li><strong>Liability:</strong> Job For Fresher is not responsible for any misrepresentation, fraud, or misleading information in job listings.</li>
              <li><strong>Scam Protection:</strong> Be cautious of job offers that seem too good to be true. Never share sensitive information like passwords, financial details, or personal identification numbers.</li>
            </ul>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>Employment Advice Disclaimer</h2>
            <p>
              While we provide articles and tips on career preparation, interview techniques, and resume writing, these are general guidelines only. They should not be considered professional legal, financial, or employment advice. We recommend consulting with appropriate professionals before making career decisions.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>No Endorsement</h2>
            <p>
              Inclusion of a job listing on our platform does not constitute an endorsement of the employer or the job opportunity. Job For Fresher is not affiliated with, nor do we endorse, any employer or organization listed on our website.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>Technical Disclaimer</h2>
            <p>
              Job For Fresher is provided on an "as-is" basis without any warranties of any kind. We do not warrant that:
            </p>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>The website will be error-free or uninterrupted</li>
              <li>The website will be secure or free from viruses</li>
              <li>Any defects will be corrected</li>
              <li>Your use of the website will be successful or meet your expectations</li>
            </ul>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>Data Accuracy</h2>
            <p>
              While we strive to maintain accurate information about job listings, we cannot guarantee that all information is current or error-free. Job postings may be updated, removed, or expired by employers without our notification. We recommend checking job listings with the original employer before applying.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>Geographic Scope</h2>
            <p>
              The information and services provided on Job For Fresher are intended for use within India. We do not warrant that the website or the information contained therein is appropriate for use in other locations or jurisdictions.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Job For Fresher shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of this website or the information contained therein.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>User Responsibility</h2>
            <p>
              You are responsible for:
            </p>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>Maintaining the confidentiality of any account information</li>
              <li>Verifying the authenticity of job opportunities independently</li>
              <li>Understanding and complying with all terms and conditions before applying</li>
              <li>Making informed decisions about your career based on reliable research</li>
            </ul>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>Changes to Disclaimer</h2>
            <p>
              Job For Fresher reserves the right to update this disclaimer at any time without prior notice. Your continued use of the website constitutes acceptance of the updated disclaimer.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h5 mb-3" style={{ color: '#162c4a' }}>Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this disclaimer, please contact us at support@jobforfresher.com
            </p>
          </section>

          {/* Warning Box */}
          <div style={{ background: '#fff3cd', border: '2px solid #ffc107', borderRadius: '10px', padding: '1.5rem', marginTop: '2rem' }}>
            <h4 style={{ color: '#856404', marginBottom: '0.75rem' }}>⚠️ Important Safety Notice</h4>
            <p style={{ color: '#856404', marginBottom: '0.5rem' }}>
              <strong>Watch out for job scams:</strong> Be cautious of employers asking for upfront payments, personal financial information, or background checks conducted outside legitimate channels. Always verify job opportunities through official company websites and contact numbers.
            </p>
            <p style={{ color: '#856404', marginBottom: 0 }}>
              <strong>Report suspicious listings:</strong> If you encounter a suspicious job posting, please report it to us at support@jobforfresher.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
