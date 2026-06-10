import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import JobDetailCard from '../components/JobDetailCard.jsx';
import RecentJobs from '../components/RecentJobs.jsx';
import JoinUpdates from '../components/JoinUpdates.jsx';
import { JobCardSkeleton } from '../components/SkeletonLoader.jsx';
import { trackJobSearch, trackCategoryViewed } from '../utils/analytics.js';
import SidebarAd from '../components/SidebarAd.jsx';
import SidebarCategories from '../components/SidebarCategories.jsx';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const cache = useCache();

  useEffect(() => {
    window.prerenderReady = false; // Mark as not ready while we fetch jobs list
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        if (!searchParams.has('limit')) {
          searchParams.set('limit', '20');
        }
        // Never show Syllabus posts on the home listing
        if (!searchParams.has('postType')) {
          searchParams.set('excludePostType', 'Syllabus');
        }
        const query = `?${searchParams.toString()}`;
        const response = await cache.get(
          (url) => api.get(url),
          `/jobs${query}`
        );
        const jobsArray = response.data?.data || response.data || [];
        setJobs(Array.isArray(jobsArray) ? jobsArray : []);

        // Track Search/Filter action
        const params = new URLSearchParams(location.search);
        if (params.has('q')) {
          trackJobSearch(params.get('q'), jobsArray.length);
        }
        if (params.has('type')) {
          trackCategoryViewed(params.get('type'));
        }

        // Set pagination data if available
        if (response.data?.totalPages) {
          setPagination({
            currentPage: response.data.currentPage || 1,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || 0
          });
        }
      } catch (error) {
        setJobs([]);
      } finally {
        setLoading(false);
        window.prerenderReady = true; // Signal that content is loaded
      }
    };
    fetchJobs();
  }, [location.search]);

  const sortedJobs = useMemo(() => {
    return Array.isArray(jobs) ? [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
  }, [jobs]);

  const goToPage = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="jobs-page">
      <Helmet>
        <title>NextJobPost - Latest Fresher Jobs & Internships</title>
        <meta name="description" content="Discover and apply to the latest off-campus job drives, internships, and entry-level career opportunities for freshers across India. Find your next job today!" />
        <meta name="keywords" content="fresher jobs, internships, off campus drive, entry level jobs, software engineer jobs, IT jobs, careers, job listings" />
        <link rel="canonical" href={window.location.origin} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NextJobPost - Latest Fresher Jobs & Internships" />
        <meta property="og:description" content="Discover and apply to the latest off-campus job drives, internships, and entry-level career opportunities for freshers across India." />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NextJobPost - Latest Fresher Jobs & Internships" />
        <meta name="twitter:description" content="Discover and apply to the latest off-campus job drives, internships, and entry-level career opportunities for freshers across India." />
        <meta name="twitter:image" content={`${window.location.origin}/logo.png`} />

        {/* Structured Data (Organization Schema) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "NextJobPost",
            "url": window.location.origin,
            "logo": `${window.location.origin}/logo.png`,
            "sameAs": [
              "https://www.linkedin.com/in/next-job-post-199b5b371",
              "https://t.me/nextjobpost"
            ]
          })}
        </script>
      </Helmet>
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
            {sortedJobs.length === 0 && !loading && <p className="text-center text-muted">No jobs available.</p>}
            {sortedJobs.map((job) => (
              <JobDetailCard key={job._id} job={job} />
            ))}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav aria-label="Job listings pagination" className="mt-5 mb-3">
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
                    const isEllipsis =
                      page !== 1 &&
                      page !== pagination.totalPages &&
                      !(page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1);
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
          </section>
        </div>

        <div className="col-12 col-lg-4 col-right">
          <JoinUpdates />
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <SidebarCategories jobs={sortedJobs} />
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}
