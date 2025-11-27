import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/index.js';
import JobDetailCard from '../components/JobDetailCard.jsx';
import RecentJobs from '../components/RecentJobs.jsx';
import CategoryTiles from '../components/CategoryTiles.jsx';
import SidebarSearch from '../components/SidebarSearch.jsx';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const query = location.search ? location.search : '';
        const { data } = await api.get(`/jobs${query}`);
        const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
        setJobs(sorted);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [location.search]);

  return (
    <div className="jobs-page">
      {loading && <p className="text-center my-4">Loading jobs…</p>}

      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          <section aria-label="Job listings">
            <CategoryTiles />
            {jobs.length === 0 && !loading && <p className="text-center text-muted">No jobs available.</p>}
            {jobs.map((job) => (
              <JobDetailCard key={job._id} job={job} />
            ))}
          </section>
        </div>

        <div className="col-12 col-lg-4 col-right">
          <SidebarSearch />
          <RecentJobs jobs={jobs} />
        </div>
      </div>
    </div>
  );
}
