import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/index.js';
import JobDetailCard from '../components/JobDetailCard.jsx';
import RecentJobs from '../components/RecentJobs.jsx';
import SidebarSearch from '../components/SidebarSearch.jsx';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const query = location.search ? location.search : '';
        const response = await api.get(`/jobs${query}`);
        const jobsArray = response.data?.data || response.data || [];
        const sorted = Array.isArray(jobsArray) ? jobsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
        setJobs(sorted);
        
        // Set pagination data if available
        if (response.data?.totalPages) {
          setPagination({
            currentPage: response.data.currentPage || 1,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || 0
          });
        }
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [location.search]);

  const goToPage = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="jobs-page">
      {loading && <p className="text-center my-4">Loading jobs…</p>}

      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          <section aria-label="Job listings">
            {jobs.length === 0 && !loading && <p className="text-center text-muted">No jobs available.</p>}
            {jobs.map((job) => (
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
          <div style={{ position: 'sticky', top: '20px' }}>
            <SidebarSearch />
            <RecentJobs jobs={jobs} />
          </div>
        </div>
      </div>
    </div>
  );
}
