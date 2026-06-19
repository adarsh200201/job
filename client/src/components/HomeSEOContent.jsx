import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#3b82f6', flexShrink: 0 }}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="9" y1="22" x2="9" y2="16"></line>
    <line x1="15" y1="22" x2="15" y2="16"></line>
    <line x1="9" y1="16" x2="15" y2="16"></line>
    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#ef4444', flexShrink: 0 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const GradCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#10b981', flexShrink: 0 }}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
  </svg>
);

const SmallChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', transition: 'transform 0.15s ease', flexShrink: 0 }} className="link-chevron">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ChevronIcon = ({ isOpen }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: '#94a3b8', flexShrink: 0 }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function HomeSEOContent() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const orgItems = [
    { label: 'UPSC Jobs', to: '/upsc-jobs' },
    { label: 'SSC Jobs', to: '/ssc-jobs' },
    { label: 'Railway Jobs', to: '/railway-jobs' },
    { label: 'Banking Jobs', to: '/banking-jobs' },
    { label: 'Defence Jobs', to: '/defence-jobs' },
    { label: 'PSU Jobs', to: '/psu-jobs' },
    { label: 'Other Govt Jobs', to: '/other-govt-jobs' }
  ];

  const stateItems = [
    { label: 'Andaman & Nicobar', to: '/andaman-nicobar-jobs' },
    { label: 'Andhra Pradesh', to: '/andhra-pradesh-jobs' },
    { label: 'Arunachal Pradesh', to: '/arunachal-pradesh-jobs' },
    { label: 'Assam', to: '/assam-jobs' },
    { label: 'Bihar', to: '/bihar-jobs' },
    { label: 'Chandigarh', to: '/chandigarh-jobs' },
    { label: 'Chhattisgarh', to: '/chhattisgarh-jobs' },
    { label: 'Delhi', to: '/delhi-jobs' },
    { label: 'DNHDD', to: '/dnh-dd-jobs' },
    { label: 'Goa', to: '/goa-jobs' },
    { label: 'Gujarat', to: '/gujarat-jobs' },
    { label: 'Haryana', to: '/haryana-jobs' },
    { label: 'Himachal Pradesh', to: '/himachal-pradesh-jobs' },
    { label: 'Jammu & Kashmir', to: '/jammu-kashmir-jobs' },
    { label: 'Jharkhand', to: '/jharkhand-jobs' },
    { label: 'Karnataka', to: '/karnataka-jobs' },
    { label: 'Kerala', to: '/kerala-jobs' },
    { label: 'Ladakh', to: '/ladakh-jobs' },
    { label: 'Lakshadweep', to: '/lakshadweep-jobs' },
    { label: 'Madhya Pradesh', to: '/madhya-pradesh-jobs' },
    { label: 'Maharashtra', to: '/maharashtra-jobs' },
    { label: 'Manipur', to: '/manipur-jobs' },
    { label: 'Meghalaya', to: '/meghalaya-jobs' },
    { label: 'Mizoram', to: '/mizoram-jobs' },
    { label: 'Nagaland', to: '/nagaland-jobs' },
    { label: 'Odisha', to: '/odisha-jobs' },
    { label: 'Puducherry', to: '/puducherry-jobs' },
    { label: 'Punjab', to: '/punjab-jobs' },
    { label: 'Rajasthan', to: '/rajasthan-jobs' },
    { label: 'Sikkim', to: '/sikkim-jobs' },
    { label: 'Tamil Nadu', to: '/tamil-nadu-jobs' },
    { label: 'Telangana', to: '/telangana-jobs' },
    { label: 'Tripura', to: '/tripura-jobs' },
    { label: 'Uttar Pradesh', to: '/uttar-pradesh-jobs' },
    { label: 'Uttarakhand', to: '/uttarakhand-jobs' },
    { label: 'West Bengal', to: '/west-bengal-jobs' }
  ];

  const qualItems = [
    { label: '10th Pass Jobs', to: '/10th-pass-jobs' },
    { label: '12th Pass Jobs', to: '/12th-pass-jobs' },
    { label: 'Graduate Jobs', to: '/graduate-jobs' },
    { label: 'Post Graduate Jobs', to: '/post-graduate-jobs' },
    { label: 'Engineering Jobs', to: '/engineering-jobs' },
    { label: 'ITI Jobs', to: '/iti-jobs' },
    { label: 'Diploma Jobs', to: '/diploma-jobs' },
    { label: 'Medical & Healthcare', to: '/medical-jobs' },
    { label: 'Teaching & Faculty', to: '/teaching-jobs' },
    { label: 'Computer & IT', to: '/computer-it-jobs' },
    { label: 'Commerce & Finance', to: '/commerce-jobs' },
    { label: 'Law & Judicial', to: '/law-jobs' }
  ];

  const provideItems = [
    { cat: 'Government Jobs', desc: 'Central, State, Railway, Banking, Police, Defence, PSU — all recruitment notifications', icon: '🏛️', bg: '#eff6ff', color: '#2563eb', glow: 'rgba(37, 99, 235, 0.08)' },
    { cat: 'Exam Results', desc: 'All major exam results published instantly with direct links', icon: '📢', bg: '#fffbeb', color: '#d97706', glow: 'rgba(217, 119, 6, 0.08)' },
    { cat: 'Admit Cards', desc: 'Download links as soon as admit cards are released', icon: '🪪', bg: '#ecfdf5', color: '#059669', glow: 'rgba(5, 150, 105, 0.08)' },
    { cat: 'Answer Keys', desc: 'Official answer keys with analysis and objection links', icon: '🗝️', bg: '#f5f3ff', color: '#7c3aed', glow: 'rgba(124, 58, 237, 0.08)' },
    { cat: 'Exam Syllabus', desc: 'Detailed syllabus and exam pattern for all competitive exams', icon: '📋', bg: '#fff1f2', color: '#e11d48', glow: 'rgba(225, 29, 72, 0.08)' },
    { cat: 'Exam Calendar', desc: 'Month-wise upcoming exam schedule and important dates', icon: '📅', bg: '#f0fdfa', color: '#0d9488', glow: 'rgba(13, 148, 136, 0.08)' },
    { cat: 'Previous Papers', desc: 'Previous year question papers with solutions', icon: '📄', bg: '#f8fafc', color: '#475569', glow: 'rgba(71, 85, 105, 0.06)' },
    { cat: 'Preparation Tips', desc: 'Step-by-step strategies, study plans, and expert guidance', icon: '💡', bg: '#fdf2f8', color: '#db2777', glow: 'rgba(219, 39, 119, 0.08)' }
  ];

  const whyChooseItems = [
    { title: 'Lightning Fast Updates', desc: 'We publish updates within minutes of official release — admit cards, results, answer keys, everything instant.', icon: '⚡', color: '#ef4444', bg: '#fef2f2', glow: 'rgba(239, 68, 68, 0.08)' },
    { title: '100% Verified Sources', desc: 'Every notification is verified from official government sources. No misleading or incorrect information.', icon: '✅', color: '#10b981', bg: '#ecfdf5', glow: 'rgba(16, 185, 129, 0.08)' },
    { title: 'Complete All-India Coverage', desc: 'UPSC, SSC, Railway, Banking, Defence, PSU, and all 36 States & UTs — everything in one place.', icon: '🗂️', color: '#3b82f6', bg: '#eff6ff', glow: 'rgba(59, 130, 246, 0.08)' },
    { title: 'Completely Free Access', desc: 'Our website is 100% free. No registration fees, no hidden subscriptions, and no paywalls.', icon: '🆓', color: '#8b5cf6', bg: '#f5f3ff', glow: 'rgba(139, 92, 246, 0.08)' },
    { title: 'Seamless Mobile Interface', desc: 'Engineered to load fast and look stunning on desktop, tablet, and mobile devices.', icon: '📱', color: '#f59e0b', bg: '#fffbeb', glow: 'rgba(245, 158, 11, 0.08)' },
    { title: 'Direct Application Links', desc: 'Direct official links for online application forms, admit card downloads, and results pages.', icon: '🔗', color: '#06b6d4', bg: '#ecfeff', glow: 'rgba(6, 182, 212, 0.08)' }
  ];

  const faqs = [
    {
      q: 'Is NextJobPost an official government website?',
      a: 'No, NextJobPost is an independent information aggregation platform that matches job seekers with government notifications. All details are meticulously cross-checked with official recruitment web portals before publication. We provide absolute direct links to the official PDF announcements and online applications.'
    },
    {
      q: 'How frequently is the website updated?',
      a: 'We monitor official sources 24/7. New notifications, results, call letters, and exam updates are uploaded immediately upon release. Join our dedicated WhatsApp and Telegram channels for instant real-time alerts.'
    },
    {
      q: 'Is NextJobPost completely free to use?',
      a: 'Yes, absolutely. All services, notifications, preparation materials, syllabus files, and exam calendar lookups on NextJobPost are entirely free. There are no premium paywalls or subscription packages.'
    },
    {
      q: 'How can I get instant alerts for new job postings?',
      a: 'To stay ahead, you can join our Telegram Channel or WhatsApp Alerts Group. You can also opt-in to our web browser push notifications by clicking "Allow" on the subscription popup.'
    },
    {
      q: 'Which recruitments does NextJobPost cover?',
      a: 'We cover all central recruitments (UPSC, SSC, Banking, Railways, Defence, PSUs) and state-level recruitments for all 36 states and Union Territories in India. We cater to all academic qualifications from 10th pass up to Doctorates.'
    },
    {
      q: 'What is the typical age limit for government jobs in India?',
      a: 'The age limit varies significantly depending on the job category and department. Generally, for general category candidates, it ranges from 18 to 30 years. However, reserved category candidates (OBC, SC, ST, PwD, and Ex-Servicemen) receive age relaxations in accordance with government norms, ranging from 3 to 15 years.'
    },
    {
      q: 'Can final year college students apply for government recruitments?',
      a: 'Yes, many government recruitments allow final year students to apply provisionally, provided they can produce their final degree certificates or marks sheets during document verification (DV) or by the specified cutoff date mentioned in the official notification.'
    },
    {
      q: 'What is the minimum qualification required for a government job?',
      a: 'Government jobs are available for almost all educational levels in India. Typical entry-level requirements include 10th Pass (for Group D, MTS, Peon), 12th Pass (for LDC, Data Entry Operators, Constable), ITI/Diploma (for Junior Engineers, Technicians), and Graduate/Postgraduate degrees (for Officers, Bank PO, UPSC Civil Services, and Teaching posts).'
    },
    {
      q: 'How do I download a government exam admit card or hall ticket?',
      a: 'Once an admit card is officially released, go to the corresponding notification page on NextJobPost, locate the "Important Links" table, and click on the direct "Download Admit Card" link. You will need to enter your registration number/roll number and date of birth/password on the official portal to download it.'
    },
    {
      q: 'What is the selection process for government jobs?',
      a: 'Most government selections involve multiple stages, which may include: a Preliminary written exam (online/offline), Main exam, Physical Endurance Test (for police/defence), Skill/Typing test, Interview (for Group A/B posts), and final Document Verification (DV) along with a Medical Examination.'
    },
    {
      q: 'How can I raise objections against a provisional answer key?',
      a: 'Recruitment boards release provisional answer keys to ensure transparency. If you find any discrepancies, you can log in to the official portal using the link provided on NextJobPost, select the question number, upload supporting documentation/references, pay the fee (if applicable), and submit your objection before the deadline.'
    },
    {
      q: 'What is the difference between Central Government and State Government jobs?',
      a: 'Central Government jobs (UPSC, SSC, Railways, Defence) are under the jurisdiction of the Government of India, and employees can be posted anywhere in the country. State Government jobs (State PSC, Vyapam, Police) are controlled by the respective state governments, offer local state postings, and often require proficiency in the state\'s regional language.'
    }
  ];

  const importantPages = [
    { label: 'All Govt Jobs', to: '/govt-jobs' },
    { label: 'Exam Results', to: '/results' },
    { label: 'Admit Cards', to: '/admit-cards' },
    { label: 'Answer Keys', to: '/answer-keys' },
    { label: 'Exam Syllabus', to: '/ssc-syllabus' },
    { label: 'Upcoming Exam Calendar', to: '/govt-jobs-calendar' },
    { label: 'Previous Papers', to: '/preparation' },
    { label: 'Career Hub', to: '/student-career-center' }
  ];

  return (
    <div className="premium-seo-section">
      {/* 1. Browse by Organisation */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="premium-section-title">🏢 Browse Jobs by Organisation</h2>
        <div className="premium-browse-grid">
          {orgItems.map((item, idx) => (
            <Link key={idx} to={item.to} className="premium-browse-card">
              <BuildingIcon />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Browse by State / UT */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="premium-section-title">📍 Browse Jobs by State / UT</h2>
        <div className="premium-browse-grid">
          {stateItems.map((item, idx) => (
            <Link key={idx} to={item.to} className="premium-browse-card">
              <MapPinIcon />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Browse by Qualification */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="premium-section-title">🎓 Browse Jobs by Qualification</h2>
        <div className="premium-browse-grid">
          {qualItems.map((item, idx) => (
            <Link key={idx} to={item.to} className="premium-browse-card">
              <GradCapIcon />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. SEO Intro copy */}
      <div className="premium-seo-intro">
        <span className="premium-seo-badge">✨ Platform Overview</span>
        <h2 className="premium-seo-title">NextJobPost — India’s Most Trusted Government Job Portal</h2>
        <p className="premium-seo-lead">
          NextJobPost is India’s fastest-growing government job notification platform, trusted by job seekers nationwide.
        </p>
        <p className="premium-seo-text">
          We provide the latest recruitment notifications, exam results, admit cards, answer keys, syllabus, and exam calendars for all central and state government jobs — covering UPSC, SSC, Railway, Banking, Defence, PSU, and all States & Union Territories. Every notification is verified from official sources and updated within minutes of release.
        </p>
        <div className="premium-seo-chips">
          <span className="premium-seo-chip">✓ Verified Sources</span>
          <span className="premium-seo-chip">✓ Fast Notifications</span>
          <span className="premium-seo-chip">✓ Free Forever</span>
        </div>
      </div>

      {/* 5. What We Provide Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="premium-seo-sub-title">What We Provide</h2>
        <div className="premium-features-grid">
          {provideItems.map((item, idx) => (
            <div 
              key={idx} 
              className="premium-feature-card"
              style={{
                '--hover-border': item.color,
                '--hover-glow': item.glow
              }}
            >
              <div className="premium-feature-icon-wrap" style={{ backgroundColor: item.bg }}>
                {item.icon}
              </div>
              <div className="premium-feature-body">
                <h4 className="premium-feature-name">{item.cat}</h4>
                <p className="premium-feature-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Why Choose Us */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="premium-seo-sub-title">Why Choose NextJobPost?</h2>
        <div className="premium-why-grid">
          {whyChooseItems.map((item, idx) => (
            <div 
              key={idx} 
              className="premium-why-card"
              style={{
                '--hover-border': item.color,
                '--hover-glow': item.glow
              }}
            >
              <div className="premium-why-icon-wrap" style={{ backgroundColor: item.bg }}>
                {item.icon}
              </div>
              <h4 className="premium-why-title">{item.title}</h4>
              <p className="premium-why-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. FAQ Accordion */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="premium-seo-sub-title">Frequently Asked Questions (FAQ)</h2>
        <div className="premium-faq-wrapper">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={`premium-faq-item ${isOpen ? 'active' : ''}`}>
                <button onClick={() => toggleFaq(idx)} className="premium-faq-trigger">
                  <span className="premium-faq-question">{faq.q}</span>
                  <ChevronIcon isOpen={isOpen} />
                </button>
                <div className="premium-faq-content" style={{ maxHeight: isOpen ? '200px' : '0px' }}>
                  <p className="premium-faq-answer">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Important Pages */}
      <div className="premium-footer-links-box">
        <h3 className="premium-footer-links-title">Quick Utilities & Important Pages</h3>
        <div className="premium-footer-links-grid">
          {importantPages.map((page, idx) => (
            <Link key={idx} to={page.to} className="premium-footer-link-tag">
              <span>{page.label}</span>
              <SmallChevronRight />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
