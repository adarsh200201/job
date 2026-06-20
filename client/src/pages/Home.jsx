import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
import HomeSEOContent from '../components/HomeSEOContent.jsx';
import { articlesData } from '../data/articlesData.js';


function RecommendationSection({ title, emoji, description, jobs, showSeeAll, onDismiss, isLoggedIn }) {
  if (!jobs || jobs.length === 0) return null;
  // Slice to top 3 jobs per section to keep page length optimal on the home page
  const displayJobs = jobs.slice(0, 3);
  return (
    <div style={{ marginBottom: '2.5rem', width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.6rem' }}>{emoji}</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              {title}
            </h2>
          </div>
          {description && (
            <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0.25rem 0 0 0' }}>
              {description}
            </p>
          )}
        </div>
        
        {/* Control buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {showSeeAll && (
            <Link 
              to={isLoggedIn ? '/dashboard' : '/signup'}
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#4f46e5',
                textDecoration: 'none',
                background: '#f5f3ff',
                padding: '0.4rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid #ddd6fe',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ede9fe'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f5f3ff'; }}
            >
              See all matches →
            </Link>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              title="Hide recommendations"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.2rem 0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'none'; }}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {displayJobs.map(job => (
          <JobDetailCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const [recommendations, setRecommendations] = useState(null);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [hideRecs, setHideRecs] = useState(() => localStorage.getItem('hide_home_recommendations') === 'true');
  const location = useLocation();
  const navigate = useNavigate();
  const cache = useCache();

  const [results, setResults] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [answerKeys, setAnswerKeys] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);

  const [resultsTotalCount, setResultsTotalCount] = useState(0);
  const [admitCardsTotalCount, setAdmitCardsTotalCount] = useState(0);
  const [answerKeysTotalCount, setAnswerKeysTotalCount] = useState(0);
  const [syllabusTotalCount, setSyllabusTotalCount] = useState(0);

  const [loadingResultsMore, setLoadingResultsMore] = useState(false);
  const [loadingAdmitMore, setLoadingAdmitMore] = useState(false);
  const [loadingAnswerMore, setLoadingAnswerMore] = useState(false);
  const [loadingSyllabusMore, setLoadingSyllabusMore] = useState(false);

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isPageOne = useMemo(() => parseInt(queryParams.get('page') || '1', 10) === 1, [queryParams]);
  const hasFilters = useMemo(() => {
    return queryParams.has('q') || queryParams.has('type') || queryParams.has('location') || queryParams.has('experience') || queryParams.has('education') || queryParams.has('salary');
  }, [queryParams]);

  const handleDismissRecommendations = () => {
    localStorage.setItem('hide_home_recommendations', 'true');
    setHideRecs(true);
  };

  useEffect(() => {
    if (isPageOne && !hasFilters) {
      setUpdatesLoading(true);
      Promise.all([
        cache.get((url) => api.get(url), '/jobs?postType=Result&limit=5'),
        cache.get((url) => api.get(url), '/jobs?postType=Admit Card&limit=5'),
        cache.get((url) => api.get(url), '/jobs?postType=Answer Key&limit=5'),
        cache.get((url) => api.get(url), '/jobs?postType=Syllabus&limit=5')
      ]).then(([resResults, resAdmit, resAnswer, resSyllabus]) => {
        setResults(resResults.data?.data || resResults.data || []);
        setResultsTotalCount(resResults.data?.total || 0);

        setAdmitCards(resAdmit.data?.data || resAdmit.data || []);
        setAdmitCardsTotalCount(resAdmit.data?.total || 0);

        setAnswerKeys(resAnswer.data?.data || resAnswer.data || []);
        setAnswerKeysTotalCount(resAnswer.data?.total || 0);

        setSyllabus(resSyllabus.data?.data || resSyllabus.data || []);
        setSyllabusTotalCount(resSyllabus.data?.total || 0);
      }).catch(err => {
        console.error("Error fetching homepage updates:", err);
      }).finally(() => {
        setUpdatesLoading(false);
      });
    }
  }, [isPageOne, hasFilters]);

  const loadMoreResults = async () => {
    setLoadingResultsMore(true);
    try {
      const nextLimit = results.length + 5;
      const res = await api.get(`/jobs?postType=Result&limit=${nextLimit}`);
      setResults(res.data?.data || res.data || []);
      setResultsTotalCount(res.data?.total || resultsTotalCount);
    } catch (err) {
      console.error("Error loading more results:", err);
    } finally {
      setLoadingResultsMore(false);
    }
  };

  const loadMoreAdmitCards = async () => {
    setLoadingAdmitMore(true);
    try {
      const nextLimit = admitCards.length + 5;
      const res = await api.get(`/jobs?postType=Admit Card&limit=${nextLimit}`);
      setAdmitCards(res.data?.data || res.data || []);
      setAdmitCardsTotalCount(res.data?.total || admitCardsTotalCount);
    } catch (err) {
      console.error("Error loading more admit cards:", err);
    } finally {
      setLoadingAdmitMore(false);
    }
  };

  const loadMoreAnswerKeys = async () => {
    setLoadingAnswerMore(true);
    try {
      const nextLimit = answerKeys.length + 5;
      const res = await api.get(`/jobs?postType=Answer Key&limit=${nextLimit}`);
      setAnswerKeys(res.data?.data || res.data || []);
      setAnswerKeysTotalCount(res.data?.total || answerKeysTotalCount);
    } catch (err) {
      console.error("Error loading more answer keys:", err);
    } finally {
      setLoadingAnswerMore(false);
    }
  };

  const loadMoreSyllabus = async () => {
    setLoadingSyllabusMore(true);
    try {
      const nextLimit = syllabus.length + 5;
      const res = await api.get(`/jobs?postType=Syllabus&limit=${nextLimit}`);
      setSyllabus(res.data?.data || res.data || []);
      setSyllabusTotalCount(res.data?.total || syllabusTotalCount);
    } catch (err) {
      console.error("Error loading more syllabus:", err);
    } finally {
      setLoadingSyllabusMore(false);
    }
  };


  useEffect(() => {
    window.prerenderReady = false; // Mark as not ready while we fetch jobs list
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const hasFilters = searchParams.has('q') || searchParams.has('type') || searchParams.has('location') || searchParams.has('experience') || searchParams.has('education') || searchParams.has('salary');
        
        const sessionVal = sessionStorage.getItem('_njp_session_id') || sessionStorage.getItem('session_id') || 'guest';

        const token = localStorage.getItem('token');
        if (!hasFilters && token) {
          try {
            const recResponse = await api.get(`/recommendations?sessionId=${sessionVal}`);
            if (recResponse.data?.success) {
              setRecommendations(recResponse.data.data);
              setIsPersonalized(true);
            }
          } catch (err) {
            console.error('Failed to load recommendations:', err);
          }
        } else {
          setRecommendations(null);
          setIsPersonalized(false);
        }

        if (!searchParams.has('limit')) {
          searchParams.set('limit', '20');
        }
        // Never show Syllabus posts on the home listing
        if (!searchParams.has('postType')) {
          searchParams.set('excludePostType', 'Syllabus');
        }
        
        // Pass sessionId to personalize search/category lists for guests
        if (!searchParams.has('sessionId')) {
          searchParams.set('sessionId', sessionVal);
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
    if (!Array.isArray(jobs)) return [];
    // If backend already scored the jobs, preserve their personalized ranking order
    const hasPersonalizedScores = jobs.some(job => job.matchScore !== undefined);
    if (hasPersonalizedScores) {
      return jobs;
    }
    return [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [jobs]);

  const showRecommendations = useMemo(() => {
    const hasRecommendedJobs = recommendations && recommendations.recommended && recommendations.recommended.length > 0;
    return !!(recommendations && !hideRecs && isPageOne && hasRecommendedJobs && recommendations.hasPreferences);
  }, [recommendations, hideRecs, isPageOne]);

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
            {showRecommendations && (
              <div>
                {/* Personalized Welcome Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e0a3c 0%, #4c1d95 60%, #6d28d9 100%)',
                  borderRadius: 16,
                  padding: '1.75rem 2rem',
                  marginBottom: '2rem',
                  color: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(109,40,217,0.15)'
                }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                  <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>
                    {isPersonalized ? '✨ Personalized Job Matches for You' : '👋 Welcome to NextJobPost'}
                  </h2>
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.86rem', color: '#e9d5ff', lineHeight: 1.5 }}>
                    {isPersonalized
                      ? 'Our recommendation engine analyzed your preferences, skills, and activities to suggest the most matching opportunities.'
                      : 'Sign in and complete onboarding to unlock customized match scores and personalized job feeds!'}
                  </p>
                </div>

                <RecommendationSection
                  title="Recommended For You"
                  emoji="🎯"
                  description="Top opportunities matching your preferred role, skills, and experience."
                  jobs={recommendations.recommended}
                  showSeeAll={true}
                  onDismiss={handleDismissRecommendations}
                  isLoggedIn={!!localStorage.getItem('token')}
                />
              </div>
            )}

            <div style={{ marginTop: showRecommendations ? '1.5rem' : '0' }}>
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
            </div>

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

            {/* Latest Updates Sections (Only on Page 1 & No filters) */}
            {isPageOne && !hasFilters && (
              <div className="homepage-updates-sections" style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {/* 1. Latest Exam Results */}
                {(results.length > 0 || updatesLoading) && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📢</span> Latest Exam Results
                      </h3>
                      <Link to="/results" className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.8rem', fontWeight: 700, borderRadius: '20px', padding: '0.25rem 0.75rem' }}>
                        View All →
                      </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {updatesLoading ? (
                        <>
                          <JobCardSkeleton />
                          <JobCardSkeleton />
                        </>
                      ) : (
                        results.map((job) => (
                          <JobDetailCard key={job._id} job={job} />
                        ))
                      )}
                    </div>
                    {!updatesLoading && resultsTotalCount > results.length && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                        <button
                          onClick={loadMoreResults}
                          disabled={loadingResultsMore}
                          className="btn btn-outline-primary"
                          style={{
                            borderRadius: '20px',
                            padding: '0.4rem 1.5rem',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {loadingResultsMore ? 'Loading...' : `Load More (${resultsTotalCount - results.length} remaining)`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Latest Admit Cards */}
                {(admitCards.length > 0 || updatesLoading) && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🪪</span> Latest Admit Cards
                      </h3>
                      <Link to="/admit-cards" className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.8rem', fontWeight: 700, borderRadius: '20px', padding: '0.25rem 0.75rem' }}>
                        View All →
                      </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {updatesLoading ? (
                        <>
                          <JobCardSkeleton />
                          <JobCardSkeleton />
                        </>
                      ) : (
                        admitCards.map((job) => (
                          <JobDetailCard key={job._id} job={job} />
                        ))
                      )}
                    </div>
                    {!updatesLoading && admitCardsTotalCount > admitCards.length && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                        <button
                          onClick={loadMoreAdmitCards}
                          disabled={loadingAdmitMore}
                          className="btn btn-outline-primary"
                          style={{
                            borderRadius: '20px',
                            padding: '0.4rem 1.5rem',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {loadingAdmitMore ? 'Loading...' : `Load More (${admitCardsTotalCount - admitCards.length} remaining)`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Latest Answer Keys */}
                {(answerKeys.length > 0 || updatesLoading) && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🗝️</span> Latest Answer Keys
                      </h3>
                      <Link to="/answer-keys" className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.8rem', fontWeight: 700, borderRadius: '20px', padding: '0.25rem 0.75rem' }}>
                        View All →
                      </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {updatesLoading ? (
                        <>
                          <JobCardSkeleton />
                          <JobCardSkeleton />
                        </>
                      ) : (
                        answerKeys.map((job) => (
                          <JobDetailCard key={job._id} job={job} />
                        ))
                      )}
                    </div>
                    {!updatesLoading && answerKeysTotalCount > answerKeys.length && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                        <button
                          onClick={loadMoreAnswerKeys}
                          disabled={loadingAnswerMore}
                          className="btn btn-outline-primary"
                          style={{
                            borderRadius: '20px',
                            padding: '0.4rem 1.5rem',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {loadingAnswerMore ? 'Loading...' : `Load More (${answerKeysTotalCount - answerKeys.length} remaining)`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Latest Exam Syllabus */}
                {(syllabus.length > 0 || updatesLoading) && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📚</span> Latest Exam Syllabus
                      </h3>
                      <Link to="/syllabus" className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.8rem', fontWeight: 700, borderRadius: '20px', padding: '0.25rem 0.75rem' }}>
                        View All →
                      </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {updatesLoading ? (
                        <>
                          <JobCardSkeleton />
                          <JobCardSkeleton />
                        </>
                      ) : (
                        syllabus.map((job) => (
                          <JobDetailCard key={job._id} job={job} />
                        ))
                      )}
                    </div>
                    {!updatesLoading && syllabusTotalCount > syllabus.length && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                        <button
                          onClick={loadMoreSyllabus}
                          disabled={loadingSyllabusMore}
                          className="btn btn-outline-primary"
                          style={{
                            borderRadius: '20px',
                            padding: '0.4rem 1.5rem',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {loadingSyllabusMore ? 'Loading...' : `Load More (${syllabusTotalCount - syllabus.length} remaining)`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Career Blog Articles */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>✍️</span> Career Blog & Preparation Advice
                    </h3>
                    <Link to="/blog" className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.8rem', fontWeight: 700, borderRadius: '20px', padding: '0.25rem 0.75rem' }}>
                      Go to Blog →
                    </Link>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {articlesData.slice(0, 3).map((article) => (
                      <div key={article.id} style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                        transition: 'all 0.2s ease'
                      }}>
                        <div>
                          <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{article.icon}</div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', lineHeight: '1.4' }}>{article.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>{article.excerpt}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>{article.date}</span>
                          <Link to="/blog" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb', textDecoration: 'none' }}>Read Article →</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
      
      {/* Home SEO Directories & Content Block */}
      <HomeSEOContent />
    </div>
  );
}
