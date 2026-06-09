import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import JoinUpdates from '../components/JoinUpdates.jsx';
import SidebarCategories from '../components/SidebarCategories.jsx';
import RichTextDisplay from '../components/RichTextDisplay.jsx';
import { JobDetailsSkeleton } from '../components/SkeletonLoader.jsx';
import { getImageUrl } from '../utils/imageUtils.js';
import { 
  trackEvent,
  trackPageView, 
  trackJobDetailViewed, 
  trackApplyJobClicked, 
  trackJobShared, 
  trackAdClicked 
} from '../utils/analytics.js';
import SidebarAd from '../components/SidebarAd.jsx';

function extractVacancy(title) {
  if (!title) return 'As per notification';
  const match = title.match(/(\d[\d,]*)\s*(?:Vacancy|Vacancies|Post|Posts|Slot|Slots|LGC|Clerk|Trainee|Openings)/i);
  return match ? match[1] : 'As per notification';
}

const DEFAULT_AD_LINK = 'https://www.effectivegatecpm.com/s738fegejz?key=12ac1ed2eeb4ac73b7d41add24630c1e1e';

// Inline Component for "Also read ---" block
const AlsoReadCard = ({ relatedJob, themeColor = '#dc3545' }) => {
  if (!relatedJob) return null;
  return (
    <div className="also-read-box my-4 p-3 rounded" style={{ 
      border: `1.5px dashed ${themeColor}`, 
      backgroundColor: `${themeColor}05`,
      position: 'relative',
      transition: 'all 200ms ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = `${themeColor}0a`;
      e.currentTarget.style.transform = 'translateX(4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = `${themeColor}05`;
      e.currentTarget.style.transform = 'none';
    }}
    >
      <span style={{ 
        position: 'absolute', 
        top: '-11px', 
        left: '15px', 
        backgroundColor: '#fff', 
        padding: '0 8px', 
        color: themeColor, 
        fontSize: '0.82rem',
        fontWeight: '700'
      }}>Also read ---</span>
      <Link to={`/${relatedJob.slug}`} className="d-flex align-items-center gap-3 text-decoration-none text-dark">
        {relatedJob.image && (
          <img 
            src={getImageUrl(relatedJob.image)} 
            alt={relatedJob.title} 
            style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div>
          <span className="fw-bold" style={{ fontSize: '0.95rem', lineHeight: '1.2', color: '#1e293b' }}>{relatedJob.title}</span>
        </div>
      </Link>
    </div>
  );
};

// Dynamic section enrichment for sparse off-campus/program postings
const getEnrichedJob = (originalJob) => {
  if (!originalJob) return null;
  const enriched = { ...originalJob };
  if (!enriched.isGovernment) {
    const desc = enriched.jobDescription || enriched.description || '';
    const descLines = desc.split('\n').map(l => l.trim()).filter(Boolean);
    
    // Parse key items (e.g. checkmarks, emojis, bullets) for highlights/requirements
    const parsedHighlights = descLines.filter(line => 
      line.startsWith('✅') || 
      line.startsWith('🤖') || 
      line.startsWith('📁') || 
      line.startsWith('🎓') || 
      line.startsWith('💼') || 
      line.startsWith('👉') || 
      line.startsWith('•') ||
      line.startsWith('-') ||
      line.startsWith('*')
    ).map(line => line.replace(/^[✅🤖📁🎓💼👉•\-\s*]+/, '').trim());
    
    if (parsedHighlights.length > 0 && (!enriched.requirements || enriched.requirements.length === 0)) {
      enriched.requirements = parsedHighlights;
    }
    
    // Auto-create "Why Join" if missing
    if (!enriched.whyJoin) {
      const placementHighlight = desc.includes('Placement') || desc.includes('Job Assistance') || desc.includes('Hiring Partners') || desc.includes('Hiring');
      const salaryHighlight = desc.match(/\d+\s*(?:LPA|Lakh|L)/i);
      
      enriched.whyJoin = [
        "🚀 Industry-Relevant Learning: Master high-demand skills like SQL, Python, AI, and Data Visualization.",
        placementHighlight ? "💼 Job Assistance & Direct Support: Get mock interviews, 1:1 mentorship prep, and direct referral opportunities through hiring partners." : null,
        salaryHighlight ? `💰 Compensation Opportunities: Position yourself for premium salary packages (up to ${salaryHighlight[0]} packages).` : null,
        "📁 Practical Experience: Build real-world projects and case studies to showcase in your portfolio."
      ].filter(Boolean);
    }
    
    // Auto-create "How to Apply" if missing
    if (!enriched.howToApply) {
      enriched.howToApply = `
        <ol style="line-height: 1.8; padding-left: 1.25rem; margin: 0;">
          <li style="margin-bottom: 8px;">Click on the <strong>Apply Now</strong> button below to open the official registration page.</li>
          <li style="margin-bottom: 8px;">Fill in your details (Name, Contact, Education, Batch) in the application form.</li>
          <li style="margin-bottom: 8px;">Complete the initial screening profile to highlight your interest in Data Science & Analytics.</li>
          <li style="margin-bottom: 8px;">Submit the application and await further instructions regarding onboarding or interviews.</li>
        </ol>
      `;
    }
  }
  return enriched;
};

export default function JobDetails() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [adLink, setAdLink] = useState(DEFAULT_AD_LINK);
  const cache = useCache();
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (job?._id) {
      setHasApplied(localStorage.getItem(`applied_${job._id}`) === 'true');
      setIsSaved(localStorage.getItem(`saved_${job._id}`) === 'true');
    }
  }, [job]);

  const handleApplyAction = () => {
    if (job?._id) {
      localStorage.setItem(`applied_${job._id}`, 'true');
      setHasApplied(true);
      trackApplyJobClicked(job);
    }
  };

  const handleSaveAction = () => {
    if (job?._id) {
      const nextSaved = !isSaved;
      localStorage.setItem(`saved_${job._id}`, String(nextSaved));
      setIsSaved(nextSaved);
      // Keep simple interaction logs
      trackEvent(nextSaved ? 'Job Saved' : 'Job Unsaved', {
        jobId: job._id,
        title: job.title,
        company: job.company
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackJobShared('Copy Link', job);
  };

  const handleApply = (e, applyUrl) => {
    // Ad popunder disabled for now
    /*
    e.preventDefault();
    if (adLink) {
      window.open(adLink, '_blank', 'noopener,noreferrer');
    }
    window.location.href = applyUrl;
    */
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAdLink = async () => {
      try {
        const res = await api.get('/settings/adLink');
        if (isMounted && res.data?.data) {
          setAdLink(res.data.data);
        }
      } catch {
        // Use default ad link
      }
    };
    fetchAdLink();

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) {
      setJob(null);
      setRecent([]);
      setLoading(false);
      window.prerenderReady = true;
      return;
    }

    let isMounted = true;
    window.prerenderReady = false; // Mark as not ready while we fetch this specific job

    const fetchData = async () => {
      setLoading(true);
      try {
        let jobRes;
        try {
          jobRes = await cache.get((url) => api.get(url), `/jobs/${slug}`);
        } catch (error) {
          const fallbackRes = await cache.get((url) => api.get(url), '/jobs?limit=100');
          const allJobs = fallbackRes.data?.data || fallbackRes.data || [];
          jobRes = { data: { data: allJobs.find((j) => j.slug === slug) || null } };
        }

        if (!isMounted) return;
        const potentialJob = jobRes?.data?.data || jobRes?.data || null;
        // Verify we actually got a valid job object containing a title field
        const currentJob = (potentialJob && typeof potentialJob === 'object' && potentialJob.title) ? potentialJob : null;

        if (currentJob) {
          const enriched = getEnrichedJob(currentJob);
          if (isMounted) { setJob(enriched); }

          // Track Job Detail Viewed and dynamic Page View events
          trackJobDetailViewed(currentJob);
          trackPageView(window.location.pathname, {
            category: currentJob.type,
            jobId: currentJob._id,
            jobTitle: currentJob.title
          });

          const recentRes = await cache.get((url) => api.get(url), '/jobs?limit=25');
          const allJobs = recentRes.data?.data || recentRes.data || [];
          const otherJobs = Array.isArray(allJobs) ? allJobs.filter((j) => j.slug !== slug) : [];

          if (isMounted) {
            setRecent(otherJobs);
          }
        } else {
          if (isMounted) { setJob(null); }
        }

      } catch (error) {
        if (isMounted) { setJob(null); setRecent([]); }
      } finally {
        if (isMounted) { setLoading(false); }
        window.prerenderReady = true; // Signal to prerenderer that rendering is complete
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) return <JobDetailsSkeleton />;
  if (!job) return <p className="text-center text-muted">Job not found.</p>;

  // Get up to 3 related jobs for interspersion
  const intersperseJobs = recent.slice(0, 3);

  const getThemeColor = () => {
    if (!job.isGovernment) return '#7c3aed'; // default premium purple for off-campus
    const pt = String(job.postType || '').toLowerCase();
    if (pt.includes('admit')) return '#1d4ed8'; // blue
    if (pt.includes('result')) return '#b45309'; // amber/gold
    if (pt.includes('answer')) return '#6d28d9'; // purple
    return '#15803d'; // green for standard government job
  };

  const themeColor = getThemeColor();

  const getHeaderStyle = () => ({
    background: `linear-gradient(90deg, ${themeColor}e0, ${themeColor})`,
    color: '#fff',
    fontSize: '1.15rem',
    fontWeight: '700',
    borderLeft: '5px solid rgba(255, 255, 255, 0.45)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  // Helper function for rendering lists securely
  const renderList = (data) => {
    if (!data) return null;
    if (typeof data === 'string' && data.includes('<')) {
      return (
        <div className="rich-text-section ps-3">
          <RichTextDisplay content={data} />
        </div>
      );
    }
    const items = Array.isArray(data) ? data : data.split('\n');
    return (
      <ul className="capsule-list ps-4" style={{ lineHeight: '1.8' }}>
        {items.filter(item => item.trim()).map((item, idx) => (
          <li key={idx} style={{ marginBottom: '8px' }}>{item.replace(/^[✓→●\-*]\s*/, '').trim()}</li>
        ))}
      </ul>
    );
  };

  const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || '';

  const handleSocialJoinClick = (platform) => {
    trackEvent('Social Group Join Clicked', {
      platform,
      jobId: job?._id,
      company: job?.company
    });
  };


  const getEmploymentType = (type) => {
    if (!type) return "FULL_TIME";
    const t = type.toLowerCase();
    if (t.includes("intern")) return "INTERN";
    if (t.includes("contract")) return "CONTRACT";
    if (t.includes("part")) return "PART_TIME";
    return "FULL_TIME";
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.jobDescription || job.description,
    "datePosted": job.createdAt || new Date().toISOString(),
    "validThrough": job.lastDate || undefined,
    "employmentType": getEmploymentType(job.type),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "logo": `${window.location.origin}/logo.png`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Pan India",
        "addressCountry": "IN"
      }
    },
    "directApply": true,
    "jobLocationType": (job.location && job.location.toLowerCase().includes("remote")) ? "TELECOMMUTE" : undefined
  };

  return (
    <div className="job-details container mt-0 mb-4 animate-fade-in-up">
      <Helmet>
        <title>{job.metaTitle || `${job.title} at ${job.company} | NextJobPost`}</title>
        <meta name="description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}. Find eligibility criteria, responsibilities, and apply now.`} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={job.metaTitle || `${job.title} at ${job.company} | NextJobPost`} />
        <meta property="og:description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}.`} />
        <meta property="og:image" content={getImageUrl(job.image) || `${window.location.origin}/logo.png`} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={job.metaTitle || `${job.title} at ${job.company} | NextJobPost`} />
        <meta name="twitter:description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}.`} />
        <meta name="twitter:image" content={getImageUrl(job.image) || `${window.location.origin}/logo.png`} />

        {/* Structured Data (Google Jobs Schema) */}
<script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="job-header-section mb-4 mt-2">
            <div className="d-flex flex-wrap align-items-center gap-2.5 mb-3">
              {/* Category Badge */}
              {job.isGovernment && (
                <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill shadow-sm" style={{
                  background: 
                    String(job.postType || '').toLowerCase().includes('admit') ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' :
                    String(job.postType || '').toLowerCase().includes('result') ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
                    String(job.postType || '').toLowerCase().includes('answer') ? 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' :
                    'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                  border: 
                    String(job.postType || '').toLowerCase().includes('admit') ? '1px solid #3b82f6' :
                    String(job.postType || '').toLowerCase().includes('result') ? '1px solid #f59e0b' :
                    String(job.postType || '').toLowerCase().includes('answer') ? '1px solid #a855f7' :
                    '1px solid #22c55e',
                  color: 
                    String(job.postType || '').toLowerCase().includes('admit') ? '#1d4ed8' :
                    String(job.postType || '').toLowerCase().includes('result') ? '#b45309' :
                    String(job.postType || '').toLowerCase().includes('answer') ? '#6d28d9' :
                    '#15803d',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <span>
                    {String(job.postType || '').toLowerCase().includes('admit') ? '🪪 Exam Admit Card' :
                     String(job.postType || '').toLowerCase().includes('result') ? '📢 Exam Result Out' :
                     String(job.postType || '').toLowerCase().includes('answer') ? '🗝️ Answer Key Out' :
                     '🏛️ Govt Recruitment'}
                  </span>
                </div>
              )}
            </div>

            <h1 className="fw-bold mb-3" style={{ fontSize: '1.95rem', lineHeight: '1.4', color: '#0f172a', letterSpacing: '-0.02em' }}>{job.title}</h1>
            <div className="job-meta-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {/* Calendar Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2" style={{ flexShrink: 0 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.88rem' }}>
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently Posted'}
              </span>
              <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>•</span>
              <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Posted by</span>
              <span style={{ fontWeight: '700', color: themeColor, fontSize: '0.88rem' }}>NextJobPost</span>
            </div>

            {/* Share and Follow Bar */}
            <div className="share-follow-bar p-3 rounded-3 mt-3 d-flex align-items-center gap-2 flex-nowrap" style={{
              backgroundColor: '#f0f7ff',
              border: '1px solid #dbeafe',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%'
            }}>
              {/* SHARE GROUP */}
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Share</span>
              
              {/* WhatsApp Share */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *${job.title}* at *${job.company}*\n👉 Apply Here: ${window.location.href}`)}`}
                onClick={() => trackJobShared('WhatsApp', job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-whatsapp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                WhatsApp
              </a>

              {/* Telegram Share */}
              <a 
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`🔥 ${job.title} at ${job.company}`)}`}
                onClick={() => trackJobShared('Telegram', job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                Telegram
              </a>

              {/* Copy Link Share */}
              <button 
                onClick={handleCopyLink}
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-copylink"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {copied ? 'Copied' : 'Copy Link'}
              </button>

              {/* Divider */}
              <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 8px', flexShrink: 0 }}></div>

              {/* FOLLOW GROUP */}
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Follow</span>

              {/* WhatsApp Channel */}
              <a 
                href={job.whatsapp ? (job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')) : 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ'}
                onClick={() => handleSocialJoinClick('WhatsApp')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-whatsapp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                Join WhatsApp
              </a>

              {/* Telegram Channel */}
              <a 
                href={job.telegram ? (job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')) : 'https://t.me/nextjobpost'}
                onClick={() => handleSocialJoinClick('Telegram')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                Join Telegram
              </a>
            </div>
          </div>

          {job.image && (
            <div className="job-image-section mb-4">
              <img 
                src={getImageUrl(job.image)} 
                alt="job banner" 
                loading="lazy" 
                className="img-fluid rounded-4 shadow-sm w-100" 
                style={{ maxHeight: '400px', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Short Summary Intro */}
          {job.description && (
            <div className="mb-4 job-summary-box p-3 rounded" style={{ 
              fontSize: '1.05rem', 
              lineHeight: '1.7', 
              color: '#334155',
              backgroundColor: '#f8fafc',
              borderLeft: `4px solid ${themeColor}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              {typeof job.description === 'string' && job.description.includes('<') ? (
                <RichTextDisplay content={job.description} />
              ) : (
                <p style={{ margin: 0 }}><strong>{job.company}</strong> {job.description.replace(new RegExp('^' + job.company + '?', 'i'), '')}</p>
              )}
            </div>
          )}
          {job.lastDate && (
            job.isGovernment ? (
              <p className="mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#333' }}>
                If you are looking for a career in the government sector, this is a great opportunity to apply for <strong>{job.company} {job.postType || 'Recruitment'} 2026</strong>. Candidates meeting the eligibility criteria (<strong>{job.eligibility || job.education}</strong>) can apply before the closing date. Below is the detailed information regarding eligibility, salary, selection process, and official links.
              </p>
            ) : (
              <p className="mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#333' }}>
                If you are a <strong>Graduation - {job.education || 'Any Degree'}</strong> this is your chance to <strong>build your future with {job.company}</strong>. The detailed eligibility criteria, responsibilities, and application process for the {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''} are provided below.
              </p>
            )
          )}

          {/* OVERVIEW SECTION */}
          <div className="mb-4">
            {job.isGovernment ? (
              <div className="govt-overview-card p-4 rounded-4 shadow-sm border" style={{
                background: '#ffffff',
                borderTop: '5px solid #ff9933', // saffron top line
                borderColor: '#e2e8f0',
                position: 'relative'
              }}>
                {/* Saffron, White, Green Tricolor Line */}
                <div style={{ display: 'flex', height: '4px', position: 'absolute', top: 0, left: 0, right: 0 }}>
                  <div style={{ flex: 1, backgroundColor: '#ff9933' }}></div>
                  <div style={{ flex: 1, backgroundColor: '#ffffff' }}></div>
                  <div style={{ flex: 1, backgroundColor: '#138808' }}></div>
                </div>

                <h2 className="fw-bold mb-3 mt-2 text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.35rem' }}>
                  <span>🏛️</span> {job.company} {job.postType || 'Recruitment'} – Overview
                </h2>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 bg-light border border-light-subtle h-100 d-flex align-items-start gap-2.5">
                      <span style={{ fontSize: '1.25rem' }}>🏛️</span>
                      <div>
                        <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Organization</div>
                        <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.95rem' }}>{job.company}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 bg-light border border-light-subtle h-100 d-flex align-items-start gap-2.5">
                      <span style={{ fontSize: '1.25rem' }}>📢</span>
                      <div>
                        <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Notification Type</div>
                        <div className="fw-bold text-dark mt-1">
                          <span className="badge rounded-pill px-2.5 py-1" style={{
                            fontSize: '0.8rem',
                            backgroundColor: `${themeColor}12`,
                            color: themeColor,
                            border: `1px solid ${themeColor}30`
                          }}>
                            {job.postType || 'Notification'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {job.eligibility && (
                    <div className="col-12 col-md-6">
                      <div className="p-3 rounded-3 bg-light border border-light-subtle h-100 d-flex align-items-start gap-2.5">
                        <span style={{ fontSize: '1.25rem' }}>🎓</span>
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Eligibility Criteria</div>
                          <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.95rem' }}>{job.eligibility}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {job.salary && (
                    <div className="col-12 col-md-6">
                      <div className="p-3 rounded-3 bg-light border border-light-subtle h-100 d-flex align-items-start gap-2.5">
                        <span style={{ fontSize: '1.25rem' }}>💰</span>
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Salary / Pay Scale</div>
                          <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.95rem' }}>{job.salary}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {(job.vacancies || extractVacancy(job.title)) && (
                    <div className="col-12 col-md-6">
                      <div className="p-3 rounded-3 bg-light border border-light-subtle h-100 d-flex align-items-start gap-2.5">
                        <span style={{ fontSize: '1.25rem' }}>👥</span>
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Vacancies</div>
                          <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.95rem' }}>{job.vacancies || extractVacancy(job.title)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {job.lastDate && (
                    <div className="col-12 col-md-6">
                      <div className="p-3 rounded-3 bg-light border border-light-subtle h-100 d-flex align-items-start gap-2.5">
                        <span style={{ fontSize: '1.25rem' }}>📅</span>
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Last Date to Apply</div>
                          <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.95rem' }}>
                            {new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <AlsoReadCard relatedJob={intersperseJobs[0]} />

                {/* Important Downloads Block */}
                {(job.pdfLink || job.applyLink) && (
                  <div className="mt-4 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                    <div className="fw-bold mb-2 text-dark">🔗 Essential Links:</div>
                    <div className="d-flex flex-wrap gap-2">
                      {job.pdfLink && !job.pdfLink.includes('govtjobsalert.in') && !job.pdfLink.includes('sarkariresult.com') && (
                        <a href={job.pdfLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-danger fw-bold d-inline-flex align-items-center gap-1">
                          📄 Download Official PDF
                        </a>
                      )}
                      {job.applyLink && (
                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary fw-bold d-inline-flex align-items-center gap-1">
                          🌐 Apply Now / Source URL
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                  <span>🏛️</span> {capitalize(job.company)} Off Campus Recruitment {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''} – Overview
                </h2>
                <ul className="job-overview-list list-unstyled ps-4" style={{ lineHeight: '2' }}>
                  {job.company && <li style={{listStyleType: 'disc'}}><strong>Company Name:</strong> {job.company}</li>}
                  {job.type && <li style={{listStyleType: 'disc'}}><strong>Role:</strong> {job.type}</li>}
                  {job.education && <li style={{listStyleType: 'disc'}}><strong>Qualification:</strong> {job.education}</li>}
                  {job.experience && <li style={{listStyleType: 'disc'}}><strong>Experience:</strong> {job.experience}</li>}
                  
                  <AlsoReadCard relatedJob={intersperseJobs[0]} themeColor={themeColor} />

                  {job.batch && <li style={{listStyleType: 'disc'}}><strong>Batch:</strong> {job.batch}</li>}
                  {job.location && <li style={{listStyleType: 'disc'}}><strong>Location:</strong> {job.location}</li>}
                  {job.salary && <li style={{listStyleType: 'disc'}}><strong>Salary:</strong> {job.salary}</li>}
                  {job.lastDate && <li style={{listStyleType: 'disc'}}><strong>Application Deadline:</strong> {new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>}
                </ul>
              </div>
            )}
          </div>

          {/* ABOUT COMPANY */}
          {job.aboutCompany && (
            <div className="mb-4 text-dark" style={{ lineHeight: '1.7' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>🏢</span> {job.isGovernment ? `About ${job.company}` : `About ${job.company} Off Campus Drive ${job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}`}
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.aboutCompany} />
              </div>
              
              <AlsoReadCard relatedJob={intersperseJobs[1]} themeColor={themeColor} />
            </div>
          )}

          {/* JOB DESCRIPTION */}
          {job.jobDescription && (
            <div className="mb-4 text-dark" style={{ lineHeight: '1.7' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>📝</span> Job Description
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.jobDescription} />
              </div>
            </div>
          )}

          {/* RESPONSIBILITIES */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>🎯</span> {job.isGovernment ? `Job Responsibilities` : `Roles & Responsibilities for ${job.company} Off Campus Drive ${job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}`}
              </h2>
              {renderList(job.responsibilities)}
            </div>
          )}

          {/* ELIGIBILITY CRITERIA */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>🎓</span> {job.isGovernment ? 'Eligibility Criteria' : 'Key Highlights & Requirements'}
              </h2>
              {renderList(job.requirements)}
            </div>
          )}

          {/* WHY JOIN SECTION */}
          {job.whyJoin && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>✨</span> Why Join {job.company}?
              </h2>
              {renderList(job.whyJoin)}

              <AlsoReadCard relatedJob={intersperseJobs[2]} themeColor={themeColor} />
            </div>
          )}

          {job.contact && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>📞</span> Contact Information
              </h2>
              <p className="ps-2">{job.contact}</p>
            </div>
          )}

          {job.howToApply && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>🚀</span> {job.isGovernment ? `How to Apply` : `How to Apply for ${job.company} Off Campus Drive ${job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}`}
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.howToApply} />
              </div>
            </div>
          )}

          {job.finalThoughts && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>💭</span> Final Thoughts
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.finalThoughts} />
              </div>
            </div>
          )}

          <div className="my-5 p-4 rounded-4 shadow-sm" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <h4 className="fw-bold mb-3" style={{ fontSize: '1.25rem', color: '#1e293b' }}>
              ⚡ Action Center
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem' }}>
              Take the next step. Apply directly, save this notification, or share it with your network!
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <a 
                href={job.applyLink} 
                onClick={(e) => {
                  handleApply(e, job.applyLink);
                  handleApplyAction();
                }} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn text-white fw-bold d-inline-flex align-items-center justify-content-center shadow-sm" 
                style={{ 
                  backgroundColor: themeColor, 
                  padding: '12px 32px', 
                  fontSize: '1.1rem', 
                  borderRadius: '8px',
                  transition: 'all 200ms ease',
                  border: 'none',
                  flex: '1 1 auto',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
              >
                Apply Now
              </a>

              <button 
                onClick={handleSaveAction}
                className="btn d-inline-flex align-items-center justify-content-center fw-bold"
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  backgroundColor: isSaved ? '#fef3c7' : '#ffffff',
                  border: '1.5px solid #d97706',
                  color: '#d97706',
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                  flex: '1 1 auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSaved ? '#fef3c7' : '#ffffff';
                }}
              >
                {isSaved ? '⭐ Saved for Later' : '⏳ Save for Later'}
              </button>
            </div>

            {/* Status Alerts */}
            {hasApplied && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-4" style={{ borderRadius: '8px', fontSize: '0.95rem' }}>
                <span>🎉 <strong>Applied!</strong> Awesome job! Best of luck with your application. Share this with a friend!</span>
              </div>
            )}


            <hr style={{ borderTop: '1px solid #cbd5e1', margin: '1.5rem 0' }} />

            {/* Share and Follow Bar */}
            <div className="share-follow-bar p-3 rounded-3 mt-3 d-flex align-items-center gap-2 flex-nowrap" style={{
              backgroundColor: '#f0f7ff',
              border: '1px solid #dbeafe',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%'
            }}>
              {/* SHARE GROUP */}
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Share</span>
              
              {/* WhatsApp Share */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *${job.title}* at *${job.company}*\n👉 Apply Here: ${window.location.href}`)}`}
                onClick={() => trackJobShared('WhatsApp', job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-whatsapp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                WhatsApp
              </a>

              {/* Telegram Share */}
              <a 
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`🔥 ${job.title} at ${job.company}`)}`}
                onClick={() => trackJobShared('Telegram', job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                Telegram
              </a>

              {/* Copy Link Share */}
              <button 
                onClick={handleCopyLink}
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-copylink"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {copied ? 'Copied' : 'Copy Link'}
              </button>

              {/* Divider */}
              <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 8px', flexShrink: 0 }}></div>

              {/* FOLLOW GROUP */}
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Follow</span>

              {/* WhatsApp Channel */}
              <a 
                href={job.whatsapp ? (job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')) : 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ'}
                onClick={() => handleSocialJoinClick('WhatsApp')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-whatsapp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                Join WhatsApp
              </a>

              {/* Telegram Channel */}
              <a 
                href={job.telegram ? (job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')) : 'https://t.me/nextjobpost'}
                onClick={() => handleSocialJoinClick('Telegram')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                Join Telegram
              </a>
            </div>
          </div>

        </div>

        <div className="col-12 col-lg-4 col-right">
          <JoinUpdates />
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <SidebarCategories jobs={recent} />
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}
