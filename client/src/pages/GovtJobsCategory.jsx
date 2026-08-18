import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import JobDetailCard from '../components/JobDetailCard.jsx';
import RecentJobs from '../components/RecentJobs.jsx';
import JoinUpdates from '../components/JoinUpdates.jsx';
import { JobCardSkeleton } from '../components/SkeletonLoader.jsx';
import SidebarAd from '../components/SidebarAd.jsx';
import AffiliateBooks from '../components/AffiliateBooks.jsx';
import { MEGA_CATEGORIES } from '../utils/categoryConfig.js';
import SidebarCategories from '../components/SidebarCategories.jsx';
import SidebarCareerHub from '../components/SidebarCareerHub.jsx';
import { generateCategorySEOTemplates } from '../utils/seoConfig.js';
import InContentAd from '../components/InContentAd.jsx';
import MobileTopAd from '../components/MobileTopAd.jsx';


// Configurations for each category to ensure optimized SEO meta tags
const CATEGORY_CONFIGS = {
  'govt-jobs': {
    postTypeQuery: 'Government Job',
    searchQuery: '',
    typeQuery: '',
    title: 'Latest Govt Jobs 2026 – State & Central Recruitment | Apply Online',
    heading: '🏛️ Latest Government Jobs & Recruitment 2026',
    description: 'Find the latest government job vacancies, notifications, and recruitment schedules for state and central government departments across India.',
    keywords: 'govt jobs, government recruitment, sarkari naukri, central govt jobs, state govt jobs, latest vacancies',
    emoji: '🏛️'
  },
  'upsc-jobs': {
    searchQuery: 'UPSC',
    typeQuery: '',
    title: 'UPSC Jobs 2026 – Civil Services & IAS Recruitment | Apply Online',
    heading: '🎓 UPSC Jobs & Recruitment 2026',
    description: 'Discover and apply to the latest UPSC jobs, Union Public Service Commission recruitment notifications, civil services exams, vacancies, and application details for central government careers in India.',
    keywords: 'upsc jobs, upsc recruitment 2026, civil services vacancy, upsc notifications, ias jobs, ips recruitment, central govt jobs, union public service commission',
    emoji: '🎓'
  },
  'ssc-jobs': {
    searchQuery: 'SSC',
    typeQuery: '',
    title: 'SSC Jobs 2026 – Latest CHSL, CGL & MTS Recruitment | Apply Online',
    heading: '📋 SSC Jobs & Recruitment 2026',
    description: 'Apply online for the latest Staff Selection Commission (SSC) jobs, including SSC CGL, CHSL, MTS, GD Constable, and other competitive exam recruitment notifications.',
    keywords: 'ssc jobs, staff selection commission recruitment, ssc cgl, ssc chsl, ssc mts, ssc gd, ssc vacancies',
    emoji: '📋'
  },
  'railway-jobs': {
    searchQuery: 'Railway',
    typeQuery: '',
    title: 'Latest Railway Jobs 2026 – 5,000+ Vacancies | RRB & RRC Recruitment',
    heading: '🚂 Indian Railway Jobs & RRB Recruitment 2026',
    description: 'Explore the latest Indian Railway jobs, RRB recruitment notifications, NTPC, Group D, ALP, Technician vacancies, and online application details.',
    keywords: 'railway jobs, indian railway recruitment, rrb recruitment, rrc jobs, railway vacancy, rrb ntpc, rrb group d',
    emoji: '🚂'
  },
  'banking-jobs': {
    searchQuery: 'Banking',
    typeQuery: '',
    title: 'Bank Jobs 2026 – Latest IBPS, SBI & RBI Bank Recruitment | Apply Now',
    heading: '🏦 Banking Jobs & Bank Recruitment 2026',
    description: 'Find the latest banking sector jobs in India. View SBI, IBPS, RBI, and public/private sector bank recruitment notifications for PO, Clerk, and Specialist Officers.',
    keywords: 'banking jobs, bank recruitment, sbi po, ibps clerk, rbi recruitment, bank exam notifications, sbi clerk',
    emoji: '🏦'
  },
  'defence-jobs': {
    searchQuery: 'Defence',
    typeQuery: '',
    title: 'Defence Jobs 2026 - Indian Army, Navy, Air Force Recruitment',
    heading: '⚔️ Indian Defence Jobs & Recruitment 2026',
    description: 'Apply for the latest Indian Defence jobs. Get notifications for Indian Army, Indian Navy, Indian Air Force, CDS, NDA, and AFCAT recruitment drives.',
    keywords: 'defence jobs, indian army recruitment, indian navy jobs, air force vacancy, cds exam, nda recruitment',
    emoji: '⚔️'
  },
  'other-govt-jobs': {
    searchQuery: 'Govt Jobs',
    typeQuery: '',
    title: 'Other Govt Jobs 2026 - Miscellaneous Government Recruitment & Vacancies',
    heading: '📂 Other Government Jobs & Recruitment 2026',
    description: 'Discover various other state and central government job opportunities, notifications, and competitive exam vacancies across different departments in India.',
    keywords: 'other govt jobs, government vacancies, state govt recruitment, sarkari results, public sector careers',
    emoji: '📂'
  },
  'teaching-jobs': {
    searchQuery: 'Teacher',
    typeQuery: '',
    title: 'Teaching Jobs 2026 - Latest Teacher, Lecturer & Professor Recruitment',
    heading: '📚 Teaching Jobs & Teacher Recruitment 2026',
    description: 'Find the latest teaching jobs in India. Notifications for School Teachers, PGT, TGT, PRT, College Lecturers, and University Professors in government and private institutions.',
    keywords: 'teaching jobs, teacher recruitment, tgt pgt vacancies, government teacher jobs, lecturer posts, professor recruitment',
    emoji: '📚'
  },
  'psu-jobs': {
    searchQuery: 'PSU',
    typeQuery: '',
    title: 'PSU Jobs 2026 - Public Sector Undertakings Recruitment & Careers',
    heading: '🔬 PSU Jobs & Public Sector Recruitment 2026',
    description: 'Latest recruitment notifications for Public Sector Undertakings (PSUs) in India, including ONGC, NTPC, BHEL, IOCL, and other Maharatna/Navratna companies.',
    keywords: 'psu jobs, public sector recruitment, ongc jobs, ntpc vacancies, bhel recruitment, psu careers, gate score jobs',
    emoji: '🔬'
  },
  'results': {
    postTypeQuery: 'Result',
    searchQuery: '',
    typeQuery: '',
    title: 'Latest Sarkari Result 2026 - Central & State Board Exam Results',
    heading: '📢 Latest Sarkari Results 2026',
    description: 'Find the latest government recruitment exam results, sarkari results, state board results, and selection merit lists in India.',
    keywords: 'sarkari result, exam results, selection list, final results, board results',
    emoji: '📢'
  },
  'admit-cards': {
    postTypeQuery: 'Admit Card',
    searchQuery: '',
    typeQuery: '',
    title: 'Latest Admit Cards 2026 - Download Sarkari Exam Hall Tickets & Call Letters',
    heading: '🪪 Latest Admit Cards & Hall Tickets 2026',
    description: 'Download the latest government recruitment exam admit cards, hall tickets, call letters, and exam date notices.',
    keywords: 'admit card, hall ticket, call letter, exam dates, download admit card',
    emoji: '🪪'
  },
  'answer-keys': {
    postTypeQuery: 'Answer Key',
    searchQuery: '',
    typeQuery: '',
    title: 'Latest Answer Keys 2026 - Sarkari Exam Question Paper Solutions',
    heading: '🗝️ Latest Answer Keys & Solutions 2026',
    description: 'Get the official final and provisional answer keys, question paper solutions, and objection link details for government competitive exams.',
    keywords: 'answer key, provisional key, final answer key, exam solutions, question paper',
    emoji: '🗝️'
  },
  'private-jobs': {
    isGovernmentQuery: 'false',
    searchQuery: '',
    typeQuery: '',
    title: 'Private Jobs 2026 - Latest Private Sector Openings & Careers',
    heading: '💼 Latest Private Jobs & Vacancies 2026',
    description: 'Find the latest private sector jobs, corporate vacancies, and corporate career opportunities for freshers and experienced professionals in India.',
    keywords: 'private jobs, corporate jobs, private sector careers, corporate recruitment',
    emoji: '💼'
  },
  'freshers-jobs': {
    isGovernmentQuery: 'false',
    searchQuery: 'fresher',
    typeQuery: '',
    title: 'Freshers Jobs 2026 - Latest Job Openings for College Graduates',
    heading: '🎓 Latest Jobs for Freshers 2026',
    description: 'Apply online for the latest freshers jobs, entry-level openings, and graduate trainee positions at top companies in India.',
    keywords: 'freshers jobs, entry level jobs, graduate recruitment, jobs for freshers',
    emoji: '🎓'
  },
  'work-from-home-jobs': {
    isGovernmentQuery: 'false',
    searchQuery: '',
    typeQuery: 'Remote',
    title: 'Work From Home Jobs 2026 - Latest Remote Jobs & Work From Home Careers',
    heading: '🏡 Work From Home & Remote Jobs 2026',
    description: 'Explore and apply online for the latest work from home jobs, remote positions, and freelance online career opportunities in India.',
    keywords: 'work from home jobs, remote jobs, remote vacancies, freelance jobs, online work',
    emoji: '🏡'
  },
  'internships': {
    isGovernmentQuery: 'false',
    searchQuery: '',
    typeQuery: 'Internship',
    title: 'Internships 2026 - Latest Paid Internships for College Students',
    heading: '📝 Latest Paid Internships 2026',
    description: 'Find paid internships, summer training programs, and virtual internship opportunities for engineering, science, commerce, and arts students.',
    keywords: 'internships, paid internship, summer internship, internships for students',
    emoji: '📝'
  },
  'software-jobs': {
    isGovernmentQuery: 'false',
    searchQuery: 'software',
    typeQuery: '',
    title: 'Software Jobs 2026 - Latest Software Engineer & Developer Openings',
    heading: '💻 Software Jobs & IT Careers 2026',
    description: 'Apply online for the latest software engineering jobs, web developer vacancies, frontend/backend roles, and IT careers at top tech companies.',
    keywords: 'software jobs, it jobs, software developer, web developer, software engineering vacancies',
    emoji: '💻'
  },
  'engineering-freshers': {
    isGovernmentQuery: 'false',
    searchQuery: 'engineer',
    typeQuery: '',
    title: 'Engineering Jobs for Freshers 2026 - Latest Openings for B.Tech/B.E Graduates',
    heading: '⚙️ Engineering Freshers Jobs & Careers 2026',
    description: 'Latest entry-level job opportunities for engineering freshers. Apply online for graduate engineer trainee (GET) positions across IT and core engineering sectors.',
    keywords: 'engineering freshers jobs, get jobs, btech freshers, jobs for be graduates, entry level engineer',
    emoji: '⚙️'
  }
};

// Merge basic configs with mega-categories configs
const ALL_CATEGORY_CONFIGS = {
  ...CATEGORY_CONFIGS,
  ...MEGA_CATEGORIES
};

export default function GovtJobsCategory({ categoryKey }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const cache = useCache();

  const config = ALL_CATEGORY_CONFIGS[categoryKey] || ALL_CATEGORY_CONFIGS['govt-jobs'];

  useEffect(() => {
    window.prerenderReady = false;
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        
        if (config.postTypeQuery) {
          params.set('postType', config.postTypeQuery);
        } else {
          // Exclude non-job post types from general category listings
          params.set('excludePostType', 'Syllabus');
        }
        if (config.searchQuery) {
          params.set('q', config.searchQuery);
        }
        if (config.typeQuery) {
          params.set('type', config.typeQuery);
        }
        if (config.isGovernmentQuery !== undefined) {
          if (config.isGovernmentQuery !== 'all') {
            params.set('isGovernment', config.isGovernmentQuery);
          } else {
            params.delete('isGovernment');
          }
        } else {
          params.set('isGovernment', 'true');
        }
        // Always show 20 per page — same as home page
        if (!params.has('limit')) {
          params.set('limit', '20');
        }
        
        const query = params.toString() ? `?${params.toString()}` : '';

        const response = await cache.get(
          (url) => api.get(url),
          `/jobs${query}`
        );
        const jobsArray = response.data?.data || response.data || [];
        setJobs(Array.isArray(jobsArray) ? jobsArray : []);

        if (response.data?.totalPages) {
          setPagination({
            currentPage: response.data.currentPage || 1,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || 0
          });
        }
      } catch (error) {
        console.error(`Failed to fetch jobs for ${categoryKey}:`, error);
        setJobs([]);
      } finally {
        setLoading(false);
        window.prerenderReady = true;
      }
    };
    fetchJobs();
  }, [categoryKey, location.search]);

  const sortedJobs = useMemo(() => {
    return Array.isArray(jobs) ? [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
  }, [jobs]);

  const goToPage = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate(`/${categoryKey}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categorySEO = useMemo(() => {
    return generateCategorySEOTemplates(categoryKey);
  }, [categoryKey]);

  return (
    <div className="jobs-page">
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={config.keywords} />
        <link rel="canonical" href={`${window.location.origin}/${categoryKey}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.description} />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:url" content={`${window.location.origin}/${categoryKey}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={config.title} />
        <meta name="twitter:description" content={config.description} />
        <meta name="twitter:image" content={`${window.location.origin}/logo.png`} />

        {/* Structured Data (CollectionPage Schema) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": config.heading,
            "description": config.description,
            "url": `${window.location.origin}/${categoryKey}`,
            "publisher": {
              "@type": "Organization",
              "name": "NextJobPost",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            }
          })}
        </script>
      </Helmet>

      {/* Page Header */}
      <div className="mb-4 text-center py-4 bg-light rounded shadow-sm px-3" style={{ borderLeft: '5px solid #7c3aed' }}>
        <h1 className="h2 fw-bold text-dark mb-2">{config.heading}</h1>
        <p className="text-muted fs-6 max-width-600 mx-auto mb-0">{config.description}</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          {/* Mobile-only top ad */}
          <MobileTopAd />
          <section aria-label="Job listings">
            {loading && jobs.length === 0 && (
              <>
                {[...Array(3)].map((_, i) => (
                  <JobCardSkeleton key={`skeleton-${i}`} />
                ))}
              </>
            )}
            {sortedJobs.length === 0 && !loading && (
              <div className="text-center py-5 bg-white rounded shadow-sm border border-light">
                <p className="text-muted fs-5 mb-0">No positions listed at the moment.</p>
                <p className="text-muted small">Please check back later for updates or search for other opportunities.</p>
              </div>
            )}
            {sortedJobs.map((job, idx) => (
              <React.Fragment key={job._id}>
                <JobDetailCard job={job} />
                {(idx + 1) % 5 === 0 && (
                  <InContentAd instanceId={`govtjobs-list-${idx}`} />
                )}
              </React.Fragment>
            ))}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav aria-label="Job listings pagination" className="mt-4 mb-3">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  padding: '5px',
                  width: 'fit-content',
                  margin: '0 auto'
                }}>
                  {/* Previous */}
                  <button
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '8px 18px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: pagination.currentPage === 1 ? '#94a3b8' : '#374151',
                      cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer',
                      borderRadius: '9999px',
                      transition: 'background 160ms ease, color 160ms ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => { if (pagination.currentPage !== 1) e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    const isActive = pagination.currentPage === page;
                    const showEllipsis =
                      page === pagination.currentPage - 2 || page === pagination.currentPage + 2;

                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          style={{
                            minWidth: '38px',
                            height: '38px',
                            padding: '0 6px',
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 160ms ease',
                            background: isActive ? '#2563eb' : 'transparent',
                            color: isActive ? '#ffffff' : '#374151',
                            boxShadow: isActive ? '0 2px 8px rgba(37,99,235,0.3)' : 'none'
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#eff6ff'; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {page}
                        </button>
                      );
                    } else if (showEllipsis) {
                      return (
                        <span key={page} style={{
                          minWidth: '38px',
                          height: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          color: '#94a3b8',
                          fontWeight: '600'
                        }}>
                          …
                        </span>
                      );
                    }
                    return null;
                  })}

                  {/* Next */}
                  <button
                    onClick={() => goToPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '8px 18px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: pagination.currentPage === pagination.totalPages ? '#94a3b8' : '#374151',
                      cursor: pagination.currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                      borderRadius: '9999px',
                      transition: 'background 160ms ease, color 160ms ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => { if (pagination.currentPage !== pagination.totalPages) e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}

            {/* Rich SEO Content Guide */}
            {categorySEO && categorySEO.intro && (
              <div className="mt-5 p-4 bg-white rounded shadow-sm border border-light" style={{ animation: 'fadeInUp 0.4s ease' }}>
                <h2 className="h4 fw-bold text-dark mb-4">📖 Complete Career Guide & Recruitment Details</h2>
                
                <div className="mb-4">
                  <p className="text-muted leading-relaxed" style={{ fontSize: '0.92rem', lineHeight: '1.7' }}>
                    {categorySEO.intro}
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded border border-light h-100">
                      <h3 className="h6 fw-bold text-primary d-flex align-items-center gap-2 mb-2">
                        <span>🎓</span> Eligibility Criteria
                      </h3>
                      <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                        {categorySEO.eligibility}
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded border border-light h-100">
                      <h3 className="h6 fw-bold text-success d-flex align-items-center gap-2 mb-2">
                        <span>💰</span> Salary & Pay Scales
                      </h3>
                      <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                        {categorySEO.salary}
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded border border-light h-100">
                      <h3 className="h6 fw-bold text-warning d-flex align-items-center gap-2 mb-2">
                        <span>⚡</span> Selection Procedure
                      </h3>
                      <p className="text-muted small mb-0" style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        {categorySEO.selection}
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded border border-light h-100">
                      <h3 className="h6 fw-bold text-danger d-flex align-items-center gap-2 mb-2">
                        <span>📝</span> How to Apply Online
                      </h3>
                      <p className="text-muted small mb-0" style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        {categorySEO.apply}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dynamic FAQs Section */}
                {categorySEO.faqs && categorySEO.faqs.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h3 className="h5 fw-bold text-dark mb-3">❓ Frequently Asked Questions (FAQ)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {categorySEO.faqs.map((faq, idx) => (
                        <details key={idx} className="p-3 bg-white rounded border border-light shadow-sm" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                          <summary className="fw-bold text-dark fs-6" style={{ outline: 'none' }}>
                            {faq.q}
                          </summary>
                          <p className="text-muted small mt-2 mb-0" style={{ lineHeight: '1.6' }}>
                            {faq.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hiring Trends Section */}
                {categorySEO.hiringTrends && (
                  <div className="mt-4 pt-3 border-top">
                    <h3 className="h5 fw-bold text-dark mb-3">📈 2026 Hiring Trends &amp; Market Outlook</h3>
                    <div className="p-3 rounded" style={{ background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', border: '1px solid #bfdbfe', lineHeight: '1.75', fontSize: '0.92rem', color: '#374151' }}>
                      {categorySEO.hiringTrends}
                    </div>
                  </div>
                )}

                {/* Top Recruiters Grid */}
                {categorySEO.topRecruiters && categorySEO.topRecruiters.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h3 className="h5 fw-bold text-dark mb-3">🏛️ Top Recruiting Organizations</h3>
                    <div className="row g-2">
                      {categorySEO.topRecruiters.map((org, idx) => (
                        <div key={idx} className="col-12 col-md-6">
                          <div className="d-flex align-items-start gap-2 p-3 bg-white rounded border border-light h-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <span style={{ fontSize: '1.4rem', lineHeight: '1', marginTop: '2px' }}>🏢</span>
                            <div>
                              <div className="fw-bold text-dark small">{org.name}</div>
                              <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>{org.posts}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Growth Path */}
                {categorySEO.careerGrowth && (
                  <div className="mt-4 pt-3 border-top">
                    <h3 className="h5 fw-bold text-dark mb-3">🚀 Career Growth &amp; Promotion Pathways</h3>
                    <div className="p-3 rounded" style={{ background: '#fafafa', border: '1px solid #e2e8f0', lineHeight: '1.75', fontSize: '0.92rem', color: '#374151', borderLeft: '4px solid #2563eb' }}>
                      {categorySEO.careerGrowth}
                    </div>
                  </div>
                )}

                {/* Common Mistakes Alert */}
                {categorySEO.commonMistakes && categorySEO.commonMistakes.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h3 className="h5 fw-bold text-dark mb-3">⚠️ Common Application Mistakes to Avoid</h3>
                    <div className="p-3 rounded" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                      <ul className="mb-0" style={{ paddingLeft: '1.2rem' }}>
                        {categorySEO.commonMistakes.map((mistake, idx) => (
                          <li key={idx} className="small mb-2" style={{ color: '#92400e', lineHeight: '1.6' }}>
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Preparation Tips Checklist */}
                {categorySEO.prepTips && categorySEO.prepTips.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h3 className="h5 fw-bold text-dark mb-3">📚 Preparation Tips &amp; Study Strategy</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {categorySEO.prepTips.map((tip, idx) => (
                        <div key={idx} className="d-flex align-items-start gap-2 p-3 bg-white rounded border border-light" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '1rem', lineHeight: '1.4', flexShrink: 0 }}>✓</span>
                          <span className="small text-dark" style={{ lineHeight: '1.6' }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Affiliate Book Recommendations */}
            <div className="mt-4">
              <AffiliateBooks
                category={
                  categoryKey === 'ssc-jobs' ? 'ssc'
                  : categoryKey === 'banking-jobs' ? 'banking'
                  : categoryKey === 'railway-jobs' ? 'railway'
                  : 'general'
                }
                title="📚 Recommended Books for This Category"
              />
            </div>

          </section>
        </div>

        <div className="col-12 col-lg-4 col-right">
          <JoinUpdates />
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <SidebarCareerHub contextTitle={config.heading} />
            <SidebarCategories jobs={sortedJobs} />
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}
