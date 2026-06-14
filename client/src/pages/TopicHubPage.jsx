import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import JobDetailCard from '../components/JobDetailCard.jsx';
import JoinUpdates from '../components/JoinUpdates.jsx';
import { JobCardSkeleton } from '../components/SkeletonLoader.jsx';
import SidebarAd from '../components/SidebarAd.jsx';
import SidebarCareerHub from '../components/SidebarCareerHub.jsx';

// Cluster configurations
const CLUSTER_PAGES = {
  'ssc-syllabus': {
    title: 'SSC CGL, CHSL, MTS Exam Syllabus & Pattern 2026 PDF – Download Now',
    description: 'Get the latest Staff Selection Commission (SSC) syllabus, exam pattern, subject-wise marking schemes, and topic details for CGL, CHSL, MTS, and GD exams.',
    heading: '📚 Staff Selection Commission (SSC) Exam Syllabus 2026',
    q: 'SSC',
    postType: 'Syllabus'
  },
  'ssc-results': {
    title: 'SSC Results 2026 – Latest Sarkari Merit Lists & Final Cut Off Marks',
    description: 'Check Staff Selection Commission (SSC) written exam results, final selection merit lists, cut-off marks, and scorecard download notifications.',
    heading: '📢 SSC Exam Results & Merit Lists 2026',
    q: 'SSC',
    postType: 'Result'
  },
  'ssc-admit-cards': {
    title: 'SSC Admit Cards 2026 – Download SSC Exam Hall Tickets & Call Letters',
    description: 'Download Staff Selection Commission (SSC) tier 1 / tier 2 exam admit cards, hall tickets, check exam dates, city selection, and exam day guidelines.',
    heading: '🪪 SSC Exam Admit Cards & Hall Tickets 2026',
    q: 'SSC',
    postType: 'Admit Card'
  },
  'railway-syllabus': {
    title: 'Railway RRB NTPC & Group D Syllabus & CBT Exam Pattern 2026 PDF',
    description: 'Download Indian Railways (RRB/RRC) written exam syllabus, CBT 1 & CBT 2 patterns, selection criteria, and subject-wise marking details.',
    heading: '📚 Railway RRB & RRC Exam Syllabus 2026',
    q: 'Railway',
    postType: 'Syllabus'
  },
  'railway-results': {
    title: 'Railway Board (RRB) Results 2026 – Merit Lists, CBT Cut Offs & Scorecards',
    description: 'View the latest Indian Railways RRB NTPC, Group D, ALP, and Technician exam results, cut-off scores, and final selection panel notifications.',
    heading: '📢 Indian Railway (RRB) Exam Results 2026',
    q: 'Railway',
    postType: 'Result'
  },
  'railway-admit-cards': {
    title: 'Railway (RRB) Admit Cards 2026 – Download CBT Hall Tickets & Exam City Info',
    description: 'Get direct links to download Indian Railways RRB NTPC, Group D, ALP, and Technician exam admit cards, hall tickets, and call letters.',
    heading: '🪪 Indian Railway Exam Admit Cards & Hall Tickets 2026',
    q: 'Railway',
    postType: 'Admit Card'
  }
};

export default function TopicHubPage({ slug }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cache = useCache();

  const config = useMemo(() => {
    return CLUSTER_PAGES[slug];
  }, [slug]);

  useEffect(() => {
    if (!config) return;
    window.prerenderReady = false;

    const fetchClusterItems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        
        // Exact filters:
        params.set('q', config.q);
        params.set('postType', config.postType);
        
        if (!params.has('limit')) {
          params.set('limit', '20');
        }

        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await cache.get(
          (url) => api.get(url),
          `/jobs${query}`
        );

        const dataArray = response.data?.data || response.data || [];
        setItems(Array.isArray(dataArray) ? dataArray : []);
      } catch (error) {
        console.error('Failed to fetch cluster items:', error);
        setItems([]);
      } finally {
        setLoading(false);
        window.prerenderReady = true;
      }
    };

    fetchClusterItems();
  }, [config, location.search]);

  if (!config) {
    return (
      <div className="text-center py-5">
        <h4>Page not found</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="topic-hub-page">
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={`${config.q.toLowerCase()} ${config.postType.toLowerCase()} 2026, download ${config.q.toLowerCase()} ${config.postType.toLowerCase()}`} />
        <link rel="canonical" href={`${window.location.origin}/${slug}`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.description} />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:url" content={`${window.location.origin}/${slug}`} />
      </Helmet>

      {/* Page Header */}
      <div className="mb-4 text-center py-4 bg-light rounded shadow-sm px-3" style={{ borderLeft: '5px solid #4f46e5' }}>
        <h1 className="h2 fw-bold text-dark mb-2">{config.heading}</h1>
        <p className="text-muted fs-6 max-width-600 mx-auto mb-0">{config.description}</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          <section aria-label="Exam Hub Resources">
            {loading && items.length === 0 && (
              <>
                {[...Array(3)].map((_, i) => (
                  <JobCardSkeleton key={`skeleton-${i}`} />
                ))}
              </>
            )}
            {items.length === 0 && !loading && (
              <div className="text-center py-5 bg-white rounded shadow-sm border border-light">
                <p className="text-muted fs-5 mb-0">No active {config.postType.toLowerCase()} posts are listed at the moment.</p>
                <p className="text-muted small mt-1">Please check back soon. Updates are posted immediately upon official announcement.</p>
              </div>
            )}
            {items.map((item) => (
              <JobDetailCard key={item._id} job={item} />
            ))}
          </section>
        </div>

        <div className="col-12 col-lg-4 col-right">
          <JoinUpdates />
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            {/* Show interlinked Career Hub cluster links in the sidebar */}
            <SidebarCareerHub contextTitle={config.q} />
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}
export { CLUSTER_PAGES };
