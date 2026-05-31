import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import JobDetailCard from '../components/JobDetailCard.jsx';
import RecentJobs from '../components/RecentJobs.jsx';
import SidebarSearch from '../components/SidebarSearch.jsx';
import { JobCardSkeleton } from '../components/SkeletonLoader.jsx';
import { trackEvent } from '../utils/analytics.js';

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
        const query = location.search ? location.search : '';
        const response = await cache.get(
          (url) => api.get(url),
          `/jobs${query}`
        );
        const jobsArray = response.data?.data || response.data || [];
        setJobs(Array.isArray(jobsArray) ? jobsArray : []);

        // Track Search/Filter action
        if (location.search) {
          const params = new URLSearchParams(location.search);
          const searchParams = {};
          params.forEach((value, key) => {
            searchParams[key] = value;
          });
          trackEvent('Job Search Filtered', searchParams);
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
              <nav aria-label="Job listings pagination" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => goToPage(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>
                      Previous
                    </button>
                  </li>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 || 
                      page === pagination.totalPages || 
                      (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                    ) {
                      return (
                        <li key={page} className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => goToPage(page)}>
                            {page}
                          </button>
                        </li>
                      );
                    } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                      return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>;
                    }
                    return null;
                  })}
                  
                  <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => goToPage(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </section>
        </div>

        <div className="col-12 col-lg-4 col-right">
          <SidebarSearch />
          <div className="sidebar-sticky">
            <RecentJobs jobs={sortedJobs} />
          </div>
        </div>
      </div>
    </div>
  );
}
