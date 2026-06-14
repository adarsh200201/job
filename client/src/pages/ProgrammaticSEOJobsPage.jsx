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

// State Mapping Config
const STATE_MAPPINGS = {
  'gujarat': { name: 'Gujarat', query: 'Gujarat' },
  'bihar': { name: 'Bihar', query: 'Bihar' },
  'rajasthan': { name: 'Rajasthan', query: 'Rajasthan' },
  'up': { name: 'Uttar Pradesh', query: 'Uttar Pradesh' },
  'maharashtra': { name: 'Maharashtra', query: 'Maharashtra' },
  'delhi': { name: 'Delhi', query: 'Delhi' },
  'mp': { name: 'Madhya Pradesh', query: 'Madhya Pradesh' },
  'punjab': { name: 'Punjab', query: 'Punjab' },
  'haryana': { name: 'Haryana', query: 'Haryana' },
  'karnataka': { name: 'Karnataka', query: 'Karnataka' },
  'tamil-nadu': { name: 'Tamil Nadu', query: 'Tamil Nadu' },
  'west-bengal': { name: 'West Bengal', query: 'West Bengal' },
  'andhra-pradesh': { name: 'Andhra Pradesh', query: 'Andhra Pradesh' },
  'telangana': { name: 'Telangana', query: 'Telangana' },
  'kerala': { name: 'Kerala', query: 'Kerala' },
  'odisha': { name: 'Odisha', query: 'Odisha' }
};

// Qualification Mapping Config
const QUALIFICATION_MAPPINGS = {
  '10th-pass': { name: '10th Pass', query: '10th' },
  '12th-pass': { name: '12th Pass', query: '12th' },
  'graduate': { name: 'Graduate', query: 'graduate' },
  'post-graduate': { name: 'Post Graduate', query: 'post graduate' },
  'diploma': { name: 'Diploma', query: 'diploma' },
  'iti': { name: 'ITI', query: 'ITI' }
};

// Category Mapping Config
const CATEGORY_MAPPINGS = {
  'ssc': { name: 'SSC', query: 'SSC' },
  'railway': { name: 'Railway', query: 'Railway' },
  'bank': { name: 'Bank', query: 'Bank' },
  'upsc': { name: 'UPSC', query: 'UPSC' },
  'defence': { name: 'Defence', query: 'Defence' },
  'teaching': { name: 'Teaching', query: 'Teacher' }
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
    { label: 'Bank Jobs in UP', to: '/bank-jobs-in-up' }
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

  // Parse qualification/category and state from slug
  // E.g. "10th-pass-jobs-in-gujarat" or "ssc-jobs-in-gujarat"
  const parsedInfo = useMemo(() => {
    if (!slug) return null;
    const parts = slug.split('-jobs-in-');
    if (parts.length !== 2) return null;

    const key = parts[0];
    const stateKey = parts[1];

    const stateInfo = STATE_MAPPINGS[stateKey];
    if (!stateInfo) return null;

    const qualInfo = QUALIFICATION_MAPPINGS[key];
    if (qualInfo) {
      return {
        type: 'qualification',
        key: key,
        name: qualInfo.name,
        query: qualInfo.query,
        stateName: stateInfo.name,
        stateQuery: stateInfo.query
      };
    }

    const catInfo = CATEGORY_MAPPINGS[key];
    if (catInfo) {
      return {
        type: 'category',
        key: key,
        name: catInfo.name,
        query: catInfo.query,
        stateName: stateInfo.name,
        stateQuery: stateInfo.query
      };
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
        } else {
          // category search
          params.set('q', parsedInfo.query);
        }
        
        // Location filter (using partial/regex text search)
        params.set('location', parsedInfo.stateQuery);
        
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

  // Dynamic High-CTR metadata configurations
  const pageTitle = `${parsedInfo.name} Jobs in ${parsedInfo.stateName} 2026 – Latest Vacancies & Recruitment | Apply Online`;
  const pageDescription = `Find the latest ${parsedInfo.name} job openings, recruitment notifications, and career drives in ${parsedInfo.stateName} for 2026. View selection process, syllabus, eligibility, and apply online.`;
  const pageHeading = `${parsedInfo.name} Jobs in ${parsedInfo.stateName} 2026`;

  return (
    <div className="jobs-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${parsedInfo.name} jobs in ${parsedInfo.stateName}, ${parsedInfo.stateName} recruitment 2026, sarkari naukri ${parsedInfo.stateName}`} />
        <link rel="canonical" href={`${window.location.origin}/${slug}`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:url" content={`${window.location.origin}/${slug}`} />
      </Helmet>

      {/* Page Header */}
      <div className="mb-4 text-center py-4 bg-light rounded shadow-sm px-3" style={{ borderLeft: '5px solid #10b981' }}>
        <h1 className="h2 fw-bold text-dark mb-2">💼 {pageHeading}</h1>
        <p className="text-muted fs-6 max-width-600 mx-auto mb-0">{pageDescription}</p>
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
            {sortedJobs.map((job) => (
              <JobDetailCard key={job._id} job={job} />
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
            <TrendingJobsLinks />
          </section>
        </div>

        <div className="col-12 col-lg-4 col-right">
          <JoinUpdates />
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            {/* Career Hub siloing navigation */}
            <SidebarCareerHub contextTitle={parsedInfo.name} />
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}
export { STATE_MAPPINGS, QUALIFICATION_MAPPINGS, CATEGORY_MAPPINGS };
