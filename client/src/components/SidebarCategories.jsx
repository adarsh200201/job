import React from 'react';
import { Link } from 'react-router-dom';

const PlayIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#0066cc" style={{ flexShrink: 0, marginTop: '4px' }}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const cardStyle = {
  background: '#ffffff',
  borderRadius: '8px',
  padding: '1.25rem',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

const headerStyle = {
  fontSize: '1.1rem',
  fontWeight: '800',
  color: '#0f2942',
  margin: 0,
  paddingBottom: '8px',
  borderBottom: '3px solid #f97316', // Orange line
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const jobLinkStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '10px 0',
  textDecoration: 'none',
  color: '#0055b3', // Royal blue link color
  fontSize: '0.86rem',
  fontWeight: '500',
  lineHeight: '1.4',
  borderBottom: '1px solid #f1f5f9',
  textAlign: 'left',
  transition: 'all 150ms ease'
};

const catLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 6px',
  textDecoration: 'none',
  color: '#1e3a8a',
  fontSize: '0.88rem',
  fontWeight: '600',
  borderBottom: '1px solid #f1f5f9',
  transition: 'all 150ms ease',
  textAlign: 'left',
};

export default function SidebarCategories({ jobs = [] }) {
  // 1. Trending Jobs: Slice first 7 jobs
  const trendingJobs = Array.isArray(jobs) ? jobs.slice(0, 7) : [];

  // 2. Latest Govt Jobs: Filter by Full-Time or next slice
  const latestGovtJobs = Array.isArray(jobs) 
    ? jobs.filter(j => j.type === 'Full-Time').slice(0, 8)
    : [];
  const backupGovtJobs = latestGovtJobs.length > 0 ? latestGovtJobs : (Array.isArray(jobs) ? jobs.slice(7, 15) : []);

  // 3. Recent Updates: Filter for result/admit/answer keys or next slice
  const recentUpdates = Array.isArray(jobs)
    ? jobs.filter(j => 
        j.title.toLowerCase().includes('result') || 
        j.title.toLowerCase().includes('admit') || 
        j.title.toLowerCase().includes('key')
      ).slice(0, 7)
    : [];
  const backupRecentUpdates = recentUpdates.length > 0 ? recentUpdates : (Array.isArray(jobs) ? jobs.slice(15, 22) : []);

  // Central Govt categories
  const centralGovtItems = [
    { label: '🏛️ UPSC Jobs', to: '/upsc-jobs' },
    { label: '📋 SSC Jobs', to: '/ssc-jobs' },
    { label: '🚆 Railway Jobs', to: '/railway-jobs' },
    { label: '🏦 Banking Jobs', to: '/banking-jobs' },
    { label: '🎖️ Defence Jobs', to: '/defence-jobs' },
    { label: '👮 Police Jobs', to: '/?q=Police' },
    { label: '📚 Teaching Jobs', to: '/teaching-jobs' },
    { label: '🏭 PSU Jobs', to: '/psu-jobs' }
  ];

  // State categories (arranged in 2 columns)
  const stateItems = [
    { label: '📍 Andhra Pradesh', to: '/andhra-pradesh-jobs' },
    { label: '📍 Arunachal Pradesh', to: '/arunachal-pradesh-jobs' },
    { label: '📍 Assam', to: '/assam-jobs' },
    { label: '📍 Bihar', to: '/bihar-jobs' },
    { label: '📍 Chandigarh', to: '/chandigarh-jobs' },
    { label: '📍 Chhattisgarh', to: '/chhattisgarh-jobs' },
    { label: '📍 Delhi', to: '/delhi-jobs' },
    { label: '📍 Goa', to: '/goa-jobs' },
    { label: '📍 Gujarat', to: '/gujarat-jobs' },
    { label: '📍 Haryana', to: '/haryana-jobs' },
    { label: '📍 Himachal Pradesh', to: '/himachal-pradesh-jobs' },
    { label: '📍 Jammu & Kashmir', to: '/jammu-kashmir-jobs' },
    { label: '📍 Jharkhand', to: '/jharkhand-jobs' },
    { label: '📍 Karnataka', to: '/karnataka-jobs' },
    { label: '📍 Kerala', to: '/kerala-jobs' },
    { label: '📍 Ladakh', to: '/ladakh-jobs' },
    { label: '📍 Madhya Pradesh', to: '/madhya-pradesh-jobs' },
    { label: '📍 Maharashtra', to: '/maharashtra-jobs' },
    { label: '📍 Manipur', to: '/manipur-jobs' },
    { label: '📍 Meghalaya', to: '/meghalaya-jobs' },
    { label: '📍 Mizoram', to: '/mizoram-jobs' },
    { label: '📍 Nagaland', to: '/nagaland-jobs' },
    { label: '📍 Odisha', to: '/odisha-jobs' },
    { label: '📍 Puducherry', to: '/puducherry-jobs' },
    { label: '📍 Punjab', to: '/punjab-jobs' },
    { label: '📍 Rajasthan', to: '/rajasthan-jobs' },
    { label: '📍 Sikkim', to: '/sikkim-jobs' },
    { label: '📍 Tamil Nadu', to: '/tamil-nadu-jobs' },
    { label: '📍 Telangana', to: '/telangana-jobs' },
    { label: '📍 Tripura', to: '/tripura-jobs' },
    { label: '📍 Uttar Pradesh', to: '/uttar-pradesh-jobs' },
    { label: '📍 Uttarakhand', to: '/uttarakhand-jobs' },
    { label: '📍 West Bengal', to: '/west-bengal-jobs' },
    { label: '📍 Andaman & Nicobar', to: '/andaman-nicobar-jobs' },
    { label: '📍 DNH & Daman Diu', to: '/dnh-dd-jobs' },
    { label: '📍 Lakshadweep', to: '/lakshadweep-jobs' }
  ];

  // Qualifications categories
  const qualificationItems = [
    { label: '📝 10th Pass Jobs', to: '/10th-pass-jobs' },
    { label: '📖 12th Pass Jobs', to: '/12th-pass-jobs' },
    { label: '🎓 Graduate Jobs', to: '/graduate-jobs' },
    { label: '🎯 Post Graduate Jobs', to: '/post-graduate-jobs' },
    { label: '⚙️ Engineering Jobs', to: '/engineering-jobs' },
    { label: '🔧 ITI Jobs', to: '/iti-jobs' },
    { label: '📜 Diploma Jobs', to: '/diploma-jobs' },
    { label: '⚕️ Medical Jobs', to: '/medical-jobs' },
    { label: '👩‍🏫 Teaching Jobs', to: '/teaching-jobs' },
    { label: '💻 Computer/IT Jobs', to: '/computer-it-jobs' },
    { label: '📊 Commerce Jobs', to: '/commerce-jobs' },
    { label: '⚖️ Law & Judicial Jobs', to: '/law-jobs' }
  ];

  // Divide state items into two columns
  const midPoint = Math.ceil(stateItems.length / 2);
  const leftColStates = stateItems.slice(0, midPoint);
  const rightColStates = stateItems.slice(midPoint);

  return (
    <>
      {/* 1. Trending Jobs Card */}
      {trendingJobs.length > 0 && (
        <div className="sidebar-card" style={cardStyle}>
          <h3 style={headerStyle}>
            <span>🔥</span> Trending Jobs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            {trendingJobs.map((job) => (
              <Link key={job._id} to={`/${job.slug}`} style={jobLinkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#0055b3'; e.currentTarget.style.textDecoration = 'none'; }}
              >
                <PlayIcon />
                <span>{job.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2. Latest Govt Jobs Card */}
      {backupGovtJobs.length > 0 && (
        <div className="sidebar-card" style={cardStyle}>
          <h3 style={headerStyle}>
            <span>📋</span> Latest Govt Jobs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            {backupGovtJobs.map((job) => (
              <Link key={job._id} to={`/${job.slug}`} style={jobLinkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#0055b3'; e.currentTarget.style.textDecoration = 'none'; }}
              >
                <PlayIcon />
                <span>{job.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. Recent Updates Card */}
      {backupRecentUpdates.length > 0 && (
        <div className="sidebar-card" style={cardStyle}>
          <h3 style={headerStyle}>
            <span>🆕</span> Recent Updates
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            {backupRecentUpdates.map((job) => (
              <Link key={job._id} to={`/${job.slug}`} style={jobLinkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#0055b3'; e.currentTarget.style.textDecoration = 'none'; }}
              >
                <PlayIcon />
                <span>{job.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 4. Central Govt Jobs Card */}
      <div className="sidebar-card" style={cardStyle}>
        <h3 style={headerStyle}>
          Central Govt Jobs
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
          {centralGovtItems.map((item, i) => (
            <Link key={i} to={item.to} style={catLinkStyle}
              onMouseEnter={e => { e.currentTarget.style.color = '#6d28d9'; e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1e3a8a'; e.currentTarget.style.background = 'transparent'; }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 5. State Govt Jobs Card - 2 Columns */}
      <div className="sidebar-card" style={cardStyle}>
        <h3 style={headerStyle}>
          State Govt Jobs
        </h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {/* Left Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {leftColStates.map((item, i) => (
              <Link key={i} to={item.to} style={catLinkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = '#6d28d9'; e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#1e3a8a'; e.currentTarget.style.background = 'transparent'; }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Right Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {rightColStates.map((item, i) => (
              <Link key={i} to={item.to} style={catLinkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = '#6d28d9'; e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#1e3a8a'; e.currentTarget.style.background = 'transparent'; }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Jobs by Qualification Card */}
      <div className="sidebar-card" style={cardStyle}>
        <h3 style={headerStyle}>
          Jobs by Qualification
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
          {qualificationItems.map((item, i) => (
            <Link key={i} to={item.to} style={catLinkStyle}
              onMouseEnter={e => { e.currentTarget.style.color = '#6d28d9'; e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1e3a8a'; e.currentTarget.style.background = 'transparent'; }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
