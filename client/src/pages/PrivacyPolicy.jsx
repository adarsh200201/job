import React, { useState, useEffect } from 'react';
import SidebarSearch from '../components/SidebarSearch.jsx';
import RecentJobs from '../components/RecentJobs.jsx';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';

export default function PrivacyPolicy() {
  const [recentJobs, setRecentJobs] = useState([]);
  const cache = useCache();

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await cache.get((url) => api.get(url), '/jobs?limit=8');
        const jobs = response.data?.data || response.data || [];
        const sortedJobs = Array.isArray(jobs) ? [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
        setRecentJobs(sortedJobs);
      } catch (error) {
        // Handle error silently
      }
    };
    fetchRecentJobs();
  }, []);

  return (
    <div className="legal-page">
      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          <div className="legal-header">
            <h1 className="legal-page-title">Privacy Policy</h1>
            <p className="legal-last-updated">Last Updated: December 2024</p>
          </div>

          <div className="legal-body">
            <section className="legal-section">
              <h2 className="legal-section-title">1. Introduction</h2>
              <p>
                NextJobPost ("we", "us", "our" or "Company") operates the <strong>www.nextjobpost.com</strong> website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">2. Information Collection and Use</h2>
              <p className="section-subtitle"><strong>We collect limited information:</strong></p>
              <ul className="legal-list">
                <li>Browse data: IP address, browser type, pages visited, and time spent</li>
                <li>Search queries and job filtering preferences</li>
                <li>Cookies to enhance your experience</li>
                <li>Voluntarily provided information through contact forms</li>
              </ul>
              <p className="highlight-box"><strong>We DO NOT collect:</strong> Name, email, phone number, or personal data unless you voluntarily provide it through a contact form.</p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">3. Use of Data</h2>
              <p>NextJobPost uses the collected data for various purposes:</p>
              <ul className="legal-list">
                <li>To provide and maintain our Service</li>
                <li>To improve and optimize our website</li>
                <li>To understand how users interact with our platform</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To send you updates about new job listings (if you opt-in)</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">4. Security of Data</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">5. Third-Party Links</h2>
              <p>
                Our Service contains links to other websites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
              </p>
              <p className="highlight-box">
                <strong>Important:</strong> When you apply to jobs through links on our platform, you are applying directly with the employers. Those companies' privacy policies will apply to the data you provide to them.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">6. Cookies</h2>
              <p>
                We use cookies to enhance your experience on our platform. Cookies are small data files stored on your device. You can instruct your browser to refuse all cookies or alert you when cookies are being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">7. Children's Privacy</h2>
              <p>
                Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If we become aware that we have collected personal data from a child under 18, we immediately take steps to remove such information from our servers.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
              </p>
            </section>

            <section className="legal-section last-section">
              <h2 className="legal-section-title">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="contact-info">
                <strong>Email:</strong> <a href="mailto:nextjobpost@gmail.com">nextjobpost@gmail.com</a>
              </p>
            </section>
          </div>
        </div>

        <div className="col-12 col-lg-4 col-right">
          <SidebarSearch />
          <div className="sidebar-sticky">
            <RecentJobs jobs={recentJobs} />
          </div>
        </div>
      </div>
    </div>
  );
}
