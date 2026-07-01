import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import JobDetailCard from '../components/JobDetailCard.jsx';
import JoinUpdates from '../components/JoinUpdates.jsx';
import { JobCardSkeleton } from '../components/SkeletonLoader.jsx';
import SidebarAd from '../components/SidebarAd.jsx';
import SidebarCareerHub from '../components/SidebarCareerHub.jsx';
import RecommendedBooks from '../components/Affiliate/RecommendedBooks.jsx';
import StudentEssentials from '../components/Affiliate/StudentEssentials.jsx';
import { STATE_MAPPINGS, QUALIFICATION_MAPPINGS, CATEGORY_MAPPINGS, generateSEOTemplates } from '../utils/seoConfig.js';
import customProgrammaticContent from '../utils/customProgrammaticContent.json';

// Helper to resolve clean canonical slug
const getCanonicalSlug = (parsedInfo) => {
  let canonicalStateKey = parsedInfo.stateKey;
  if (parsedInfo.stateKey && STATE_MAPPINGS[parsedInfo.stateKey]?.aliasOf) {
    canonicalStateKey = STATE_MAPPINGS[parsedInfo.stateKey].aliasOf;
  }
  let canonicalQualKey = parsedInfo.key;
  if (parsedInfo.key && QUALIFICATION_MAPPINGS[parsedInfo.key]?.aliasOf) {
    canonicalQualKey = QUALIFICATION_MAPPINGS[parsedInfo.key].aliasOf;
  }

  if (parsedInfo.type === 'state') {
    return `${canonicalStateKey}-govt-jobs`;
  }
  if (parsedInfo.type === 'qualification_only') {
    return `${canonicalQualKey}-jobs`;
  }
  if (parsedInfo.type === 'qualification') {
    return `${canonicalQualKey}-jobs-in-${canonicalStateKey}`;
  }
  if (parsedInfo.type === 'category') {
    return `${parsedInfo.key}-jobs-in-${canonicalStateKey}`;
  }
  return parsedInfo.slug || '';
};

function TrendingJobsLinks() {
  const categories = [
    { label: '🏛️ Govt Jobs', to: '/govt-jobs' },
    { label: '📋 SSC Jobs', to: '/ssc-jobs' },
    { label: '🚂 Railway Jobs', to: '/railway-jobs' },
    { label: '🏦 Bank Jobs', to: '/banking-jobs' },
    { label: '💼 Private Jobs', to: '/private-jobs' },
    { label: '🏡 WFH Jobs', to: '/work-from-home-jobs' },
    { label: '📝 Internships', to: '/internships' },
    { label: '💻 Software Jobs', to: '/software-jobs' }
  ];

  const combinations = [
    { label: '10th Pass in Gujarat', to: '/10th-pass-jobs-in-gujarat' },
    { label: '12th Pass in Bihar', to: '/12th-pass-jobs-in-bihar' },
    { label: 'Graduate in Rajasthan', to: '/graduate-jobs-in-rajasthan' },
    { label: 'SSC Jobs in Gujarat', to: '/ssc-jobs-in-gujarat' },
    { label: 'Railway Jobs in Bihar', to: '/railway-jobs-in-bihar' },
    { label: 'Bank Jobs in Uttar Pradesh', to: '/bank-jobs-in-uttar-pradesh' }
  ];

  return (
    <div className="mt-5 p-4 bg-white rounded shadow-sm border border-light" style={{ animation: 'fadeInUp 0.3s ease' }}>
      <h3 className="h5 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <span>🔥</span> Browse Popular & Trending Jobs
      </h3>
      
      <div className="mb-4">
        <h4 className="h6 fw-semibold text-muted mb-3" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>By Category</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {categories.map((c, idx) => (
            <Link
              key={idx}
              to={c.to}
              style={{
                display: 'block',
                padding: '10px',
                textAlign: 'center',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                color: '#334155',
                textDecoration: 'none',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.color = '#1e3a8a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#334155';
              }}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h4 className="h6 fw-semibold text-muted mb-3" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trending Combined Searches</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {combinations.map((c, idx) => (
            <Link
              key={idx}
              to={c.to}
              style={{
                display: 'block',
                padding: '10px 14px',
                background: '#fdf2f8',
                border: '1px solid #fbcfe8',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                color: '#be185d',
                textDecoration: 'none',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#fce7f3';
                e.currentTarget.style.borderColor = '#f472b6';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#fdf2f8';
                e.currentTarget.style.borderColor = '#fbcfe8';
              }}
            >
              🚀 {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProgrammaticSEOJobsPage({ slug }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const cache = useCache();

  // Parse state, qualification or combinations from slug
  const parsedInfo = useMemo(() => {
    if (!slug) return null;

    // 1. Combination Pages (E.g. "10th-pass-jobs-in-gujarat" or "ssc-jobs-in-gujarat")
    if (slug.includes('-jobs-in-')) {
      const parts = slug.split('-jobs-in-');
      if (parts.length === 2) {
        const key = parts[0];
        const stateKey = parts[1];

        const stateInfo = STATE_MAPPINGS[stateKey];
        if (stateInfo) {
          const qualInfo = QUALIFICATION_MAPPINGS[key];
          if (qualInfo) {
            return {
              type: 'qualification',
              key: key,
              name: qualInfo.name,
              query: qualInfo.query,
              stateKey: stateKey,
              stateName: stateInfo.name,
              stateQuery: stateInfo.query,
              slug: slug
            };
          }

          const catInfo = CATEGORY_MAPPINGS[key];
          if (catInfo) {
            return {
              type: 'category',
              key: key,
              name: catInfo.name,
              query: catInfo.query,
              stateKey: stateKey,
              stateName: stateInfo.name,
              stateQuery: stateInfo.query,
              slug: slug
            };
          }
        }
      }
    }

    // 2. State Pages (E.g. "gujarat-govt-jobs")
    if (slug.endsWith('-govt-jobs')) {
      const stateKey = slug.substring(0, slug.length - 10);
      const stateInfo = STATE_MAPPINGS[stateKey];
      if (stateInfo) {
        return {
          type: 'state',
          key: '',
          name: 'Government',
          query: '',
          stateKey: stateKey,
          stateName: stateInfo.name,
          stateQuery: stateInfo.query,
          slug: slug
        };
      }
    }

    // 3. Qualification Pages (E.g. "10th-pass-jobs")
    if (slug.endsWith('-jobs')) {
      const qualKey = slug.substring(0, slug.length - 5);
      const qualInfo = QUALIFICATION_MAPPINGS[qualKey];
      if (qualInfo) {
        return {
          type: 'qualification_only',
          key: qualKey,
          name: qualInfo.name,
          query: qualInfo.query,
          stateKey: '',
          stateName: 'India',
          stateQuery: '',
          slug: slug
        };
      }
    }

    return null;
  }, [slug]);

  useEffect(() => {
    if (!parsedInfo) return;
    window.prerenderReady = false;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        
        // Exclude syllabus/answer keys/etc
        params.set('excludePostType', 'Syllabus,Admit Card,Result,Answer Key');
        
        // Query filters:
        if (parsedInfo.type === 'qualification') {
          params.set('education', parsedInfo.query);
          params.set('location', parsedInfo.stateQuery);
        } else if (parsedInfo.type === 'category') {
          params.set('q', parsedInfo.query);
          params.set('location', parsedInfo.stateQuery);
        } else if (parsedInfo.type === 'state') {
          params.set('location', parsedInfo.stateQuery);
        } else if (parsedInfo.type === 'qualification_only') {
          params.set('education', parsedInfo.query);
        }
        
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
        console.error('Failed to fetch programmatic SEO jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
        window.prerenderReady = true;
      }
    };

    fetchJobs();
  }, [parsedInfo, location.search]);

  if (!parsedInfo) {
    return (
      <div className="text-center py-5">
        <h4>Page not found</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  const sortedJobs = Array.isArray(jobs) ? [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  const goToPage = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate(`/${slug}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate dynamic rich text content
  const canonicalSlug = getCanonicalSlug(parsedInfo);
  const seoData = useMemo(() => {
    if (customProgrammaticContent && customProgrammaticContent[canonicalSlug]) {
      return customProgrammaticContent[canonicalSlug];
    }
    return generateSEOTemplates(parsedInfo);
  }, [parsedInfo, canonicalSlug]);

  const canonicalUrl = `${window.location.origin}/${canonicalSlug}`;

  // JSON-LD Schemas
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "NextJobPost",
      "url": window.location.origin,
      "logo": `${window.location.origin}/logo.png`,
      "sameAs": [
        "https://www.linkedin.com/in/next-job-post-199b5b371",
        "https://t.me/nextjobpost"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": seoData.h1,
      "description": seoData.metaDescription,
      "url": canonicalUrl,
      "publisher": {
        "@type": "Organization",
        "name": "NextJobPost",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": seoData.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": (() => {
        const elements = [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          }
        ];
        if (parsedInfo.type === 'state') {
          elements.push({
            "@type": "ListItem",
            "position": 2,
            "name": `${parsedInfo.stateName} Jobs`,
            "item": canonicalUrl
          });
        } else if (parsedInfo.type === 'qualification_only') {
          elements.push({
            "@type": "ListItem",
            "position": 2,
            "name": `${parsedInfo.name} Jobs`,
            "item": canonicalUrl
          });
        } else {
          const canonicalStateKey = parsedInfo.stateKey && STATE_MAPPINGS[parsedInfo.stateKey]?.aliasOf
            ? STATE_MAPPINGS[parsedInfo.stateKey].aliasOf
            : parsedInfo.stateKey;
          elements.push({
            "@type": "ListItem",
            "position": 2,
            "name": `${parsedInfo.stateName} Jobs`,
            "item": `${window.location.origin}/${canonicalStateKey}-govt-jobs`
          });
          elements.push({
            "@type": "ListItem",
            "position": 3,
            "name": `${parsedInfo.name} in ${parsedInfo.stateName}`,
            "item": canonicalUrl
          });
        }
        return elements;
      })()
    }
  ];

  if (jobs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": jobs.map((job, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${window.location.origin}/${job.slug}`
      }))
    });
    schemas.push({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": jobs[0].title,
      "description": jobs[0].jobDescription || jobs[0].description,
      "datePosted": jobs[0].createdAt || new Date().toISOString(),
      "hiringOrganization": {
        "@type": "Organization",
        "name": jobs[0].company,
        "logo": `${window.location.origin}/logo.png`
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": jobs[0].location || "Pan India",
          "addressCountry": "IN"
        }
      }
    });
  }

  return (
    <div className="jobs-page">
      <Helmet>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={`${parsedInfo.name} jobs, ${parsedInfo.stateName} jobs, sarkari naukri, recruitment 2026`} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.metaTitle} />
        <meta property="og:description" content={seoData.metaDescription} />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:url" content={canonicalUrl} />

        {schemas.map((schema, idx) => (
          <script type="application/ld+json" key={`schema-${idx}`}>
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      {/* Page Header */}
      <div className="mb-4 text-center py-4 bg-light rounded shadow-sm px-3" style={{ borderLeft: '5px solid #10b981' }}>
        <h1 className="h2 fw-bold text-dark mb-2">💼 {seoData.h1}</h1>
        <p className="text-muted fs-6 max-width-600 mx-auto mb-0">{seoData.metaDescription}</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
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
                <p className="text-muted fs-5 mb-0">No job openings found matching this criteria.</p>
                <p className="text-muted small mt-1">Check back later or search for other central/state openings.</p>
              </div>
            )}
            {sortedJobs.map((job, idx) => (
              <React.Fragment key={job._id}>
                <JobDetailCard job={job} />
                {(idx + 1) % 10 === 0 && (
                  <div style={{ margin: '1.5rem 0' }}>
                    {Math.floor((idx + 1) / 10) % 2 === 1 ? (
                      <RecommendedBooks initialCategory="dsa" viewType="carousel" />
                    ) : (
                      <StudentEssentials viewType="carousel" />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav aria-label="Programmatic jobs pagination" className="mt-4 mb-3">
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
                      borderRadius: '9999px'
                    }}
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    const isActive = pagination.currentPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        style={{
                          minWidth: '38px',
                          height: '38px',
                          border: 'none',
                          borderRadius: '9999px',
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          background: isActive ? '#10b981' : 'transparent',
                          color: isActive ? '#ffffff' : '#374151',
                          cursor: 'pointer'
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}

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
                      borderRadius: '9999px'
                    }}
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}

            {/* Rich SEO Content Guide */}
            <div className="mt-5 p-4 bg-white rounded shadow-sm border border-light" style={{ animation: 'fadeInUp 0.4s ease' }}>
              <h2 className="h4 fw-bold text-dark mb-4">📖 Complete Career Guide & Recruitment Details</h2>
              
              <div className="mb-4">
                <p className="text-muted leading-relaxed" style={{ fontSize: '0.92rem', lineHeight: '1.7' }}>
                  {seoData.intro}
                </p>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="p-3 bg-light rounded border border-light h-100">
                    <h3 className="h6 fw-bold text-primary d-flex align-items-center gap-2 mb-2">
                      <span>🎓</span> Eligibility Criteria
                    </h3>
                    <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                      {seoData.eligibility}
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-3 bg-light rounded border border-light h-100">
                    <h3 className="h6 fw-bold text-success d-flex align-items-center gap-2 mb-2">
                      <span>💰</span> Salary & Pay Scales
                    </h3>
                    <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                      {seoData.salary}
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-3 bg-light rounded border border-light h-100">
                    <h3 className="h6 fw-bold text-warning d-flex align-items-center gap-2 mb-2">
                      <span>⚡</span> Selection Procedure
                    </h3>
                    <p className="text-muted small mb-0" style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {seoData.selection}
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-3 bg-light rounded border border-light h-100">
                    <h3 className="h6 fw-bold text-danger d-flex align-items-center gap-2 mb-2">
                      <span>📝</span> How to Apply Online
                    </h3>
                    <p className="text-muted small mb-0" style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {seoData.apply}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic FAQs Section */}
              <div className="mt-4 pt-3 border-top">
                <h3 className="h5 fw-bold text-dark mb-3">❓ Frequently Asked Questions (FAQ)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {seoData.faqs.map((faq, idx) => (
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
            </div>

            <TrendingJobsLinks />
          </section>
        </div>

        <div className="col-12 col-lg-4 col-right">
          <JoinUpdates />
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            {/* Career Hub siloing navigation */}
            <SidebarCareerHub contextTitle={parsedInfo.stateKey ? parsedInfo.stateName : parsedInfo.name} />
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}
