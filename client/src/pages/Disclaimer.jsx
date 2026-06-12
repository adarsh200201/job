import React from 'react';

export default function Disclaimer() {
  return (
    <div className="legal-page">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="legal-header">
            <h1 className="legal-page-title">Disclaimer</h1>
            <p className="legal-last-updated">Last Updated: June 12, 2026</p>
          </div>

          <div className="legal-body">
            <section className="legal-section">
              <h2 className="legal-section-title">General Disclaimer</h2>
              <p>
                The information provided on the NextJobPost.in website is for general informational and educational purposes only. While we strive to provide accurate, up-to-date, and reliable information, we make no representations, warranties, or guarantees of any kind, express or implied, regarding the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website for any purpose.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">Job Listings Disclaimer</h2>
              <p className="section-subtitle"><strong>Important Safety Notice:</strong></p>
              <ul className="legal-list">
                <li><strong>Third-Party Content:</strong> All job postings, notifications, internships, and recruiter listings on our website are aggregated or submitted by third parties and employers. We do not prepare, create, or control these postings.</li>
                <li><strong>No Verification:</strong> We do not verify the legitimacy, background, or operational status of the employers listing vacancies. Job seekers are strongly urged to independently verify the credentials of any company before applying or attending interviews.</li>
                <li><strong>No Placement Fees:</strong> NextJobPost.in does not charge job seekers any fee at any stage. You should never pay any money to secure a job or interview. Any listing demanding payments for training, registration, or processing should be treated as fraudulent.</li>
                <li><strong>No Liability:</strong> NextJobPost.in shall not be held responsible for any loss, damage, or misrepresentation arising from job listings published on the site.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">Advertisements & Third-Party Cookies</h2>
              <p>
                We serve third-party advertisements on NextJobPost.in, including ads powered by Google AdSense. Google and other advertising partners use cookies (such as the DoubleClick cookie) and beacons to track user behavior and serve personalized ads based on your visits to our site and other pages on the internet. We have no access to, control over, or responsibility for these tracking technologies. You can manage your preferences or opt-out of personalized advertisements via Google's Ads Settings or the AboutAds.info portal.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">Employment & Career Advice Disclaimer</h2>
              <p>
                Any articles, tips, preparation strategies, resume templates, and study guides offered on this platform represent general guidance. They do not constitute professional legal, recruitment, career, or financial advice. Job seekers should exercise their own judgment and consult with professional counselors before making critical career decisions.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">No Endorsement</h2>
              <p>
                The inclusion of any job vacancy, company profile, banner ad, or outbound link on NextJobPost.in does not imply or constitute an endorsement, recommendation, or approval of that company or listing. Outbound links to external websites are visited at the user's own risk, and we have no control over their content, terms, or privacy practices.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">Technical Disclaimer</h2>
              <p>
                NextJobPost.in is provided on an "as-is" and "as-available" basis. We do not warrant that:
              </p>
              <ul className="legal-list">
                <li>The website will operate without interruptions, delays, or technical errors.</li>
                <li>The server hosting the website is free of viruses, malware, or other harmful digital components.</li>
                <li>Any bugs, glitches, or database errors will be corrected immediately.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable laws, NextJobPost.in, its team, and associates shall not be liable for any direct, indirect, incidental, special, punitive, or consequential damages (including loss of employment, data, profits, or goodwill) arising out of or in connection with your access, use, or inability to use this website.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">Changes to This Disclaimer</h2>
              <p>
                We reserve the right to revise or update this disclaimer page at any time without prior notice. Your continued use of NextJobPost.in following the posting of changes will be deemed as your acceptance of those updates.
              </p>
            </section>

            <section className="legal-section last-section">
              <h2 className="legal-section-title">Contact Us</h2>
              <p>
                If you have questions, feedback, or need to report a suspicious job listing, please contact us at:
              </p>
              <p className="contact-info">
                <strong>Email:</strong> <a href="mailto:nextjobpost@gmail.com">nextjobpost@gmail.com</a>
              </p>
            </section>

            <div className="warning-notice">
              <h4 className="warning-title">⚠️ Important Safety Notice</h4>
              <p>
                <strong>Watch out for job scams:</strong> Be cautious of employers asking for upfront payments, personal financial information, or background checks conducted outside legitimate channels. Always verify job opportunities through official company websites and contact numbers.
              </p>
              <p className="mb-0">
                <strong>Report suspicious listings:</strong> If you encounter a suspicious job posting, please report it to us at <a href="mailto:nextjobpost@gmail.com">nextjobpost@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
