import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/index.js';

export default function SidebarFilter() {
  const [stats, setStats] = useState(null);
  const [experienceVal, setExperienceVal] = useState(10); // 10 is 'Any'
  const [expandedGroups, setExpandedGroups] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/jobs/stats');
        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch job statistics for sidebar:', error);
      }
    };
    fetchStats();
    
    // Check if there is an active experience filter in URL to initialize slider
    const params = new URLSearchParams(location.search);
    const expParam = params.get('experience');
    if (expParam) {
      if (expParam.toLowerCase() === 'fresher') {
        setExperienceVal(0);
      } else {
        const parsed = parseInt(expParam, 10);
        if (!isNaN(parsed)) {
          setExperienceVal(parsed);
        }
      }
    }
  }, [location.search]);

  const getExpLabel = (val) => {
    if (val === 10) return 'Any';
    if (val === 0) return 'Fresher';
    return `${val} Yr${val > 1 ? 's' : ''}`;
  };

  const handleSliderRelease = () => {
    const params = new URLSearchParams(location.search);
    if (experienceVal === 10) {
      params.delete('experience');
    } else {
      params.set('experience', experienceVal === 0 ? 'Fresher' : `${experienceVal} Year`);
    }
    navigate(`/?${params.toString()}`);
  };

  const toggleSection = (key) => {
    setCollapsedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filterGroups = [
    {
      title: 'Work Mode',
      key: 'type',
      options: [
        { label: 'Remote', to: '/?type=Remote', countKey: 'Remote' },
        { label: 'Hybrid', to: '/?type=Hybrid', countKey: 'Hybrid' },
        { label: 'Full-Time', to: '/?type=Full-Time', countKey: 'Full-Time' },
        { label: 'Part-Time', to: '/?type=Part-Time', countKey: 'Part-Time' },
        { label: 'Internship', to: '/?type=Internship', countKey: 'Internship' },
      ]
    },
    {
      title: 'Job Category',
      key: 'category',
      options: [
        { label: 'Government Jobs', to: '/?isGovernment=true', countKey: 'Government' },
        { label: 'Private Jobs', to: '/?isGovernment=false', countKey: 'Private' },
      ]
    },
    {
      title: 'Salary / Stipend',
      key: 'salary',
      options: [
        { label: '0-3 Lakhs (0-25k/mo)', to: '/?salary=0-3', countKey: '0-3' },
        { label: '3-6 Lakhs (25k-50k/mo)', to: '/?salary=3-6', countKey: '3-6' },
        { label: '6-10 Lakhs (50k-85k/mo)', to: '/?salary=6-10', countKey: '6-10' },
        { label: '10-15 Lakhs (85k-125k/mo)', to: '/?salary=10-15', countKey: '10-15' },
        { label: '15+ Lakhs (125k+/mo)', to: '/?salary=15+', countKey: '15+' },
      ]
    },
    {
      title: 'Popular Locations',
      key: 'location',
      options: [
        { label: 'Remote', to: '/?location=Remote', countKey: 'Remote' },
        { label: 'Delhi / NCR', to: '/?location=Delhi', countKey: 'Delhi' },
        { label: 'Bengaluru (Bangalore)', to: '/?location=Bengaluru', countKey: 'Bengaluru' },
        { label: 'Mumbai', to: '/?location=Mumbai', countKey: 'Mumbai' },
        { label: 'Pune', to: '/?location=Pune', countKey: 'Pune' },
        { label: 'Hyderabad', to: '/?location=Hyderabad', countKey: 'Hyderabad' },
      ]
    },
    {
      title: 'Education',
      key: 'education',
      options: [
        { label: 'Any Graduate', to: '/?education=Graduate', countKey: 'Graduate' },
        { label: 'B.Tech / B.E.', to: '/?education=B.Tech', countKey: 'Btech' },
        { label: 'Diploma Holder', to: '/?education=Diploma', countKey: 'Diploma' },
        { label: '12th Pass', to: '/?education=12th', countKey: '12th' },
        { label: '10th Pass', to: '/?education=10th', countKey: '10th' },
      ]
    }
  ];

  // Helper render for checklist filter groups
  const renderFilterGroup = (group) => {
    const isCollapsed = !!collapsedSections[group.key];
    const isExpanded = !!expandedGroups[group.key];
    const visibleOptions = isExpanded ? group.options : group.options.slice(0, 4);
    const hasMore = group.options.length > 4;

    return (
      <div key={group.key} className="filter-group">
        <h4 
          className="filter-group-title" 
          onClick={() => toggleSection(group.key)} 
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <span>{group.title}</span>
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 10 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            style={{ 
              color: '#7a8c9e', 
              transform: isCollapsed ? 'rotate(-90deg)' : 'none', 
              transition: 'transform 150ms ease' 
            }}
          >
            <path d="M1 3l4 4 4-4"/>
          </svg>
        </h4>
        {!isCollapsed && (
          <>
            <div className="filter-group-options">
              {visibleOptions.map((option, optionIndex) => {
                const count = stats?.[group.key]?.[option.countKey];
                return (
                  <Link key={optionIndex} to={option.to} className="filter-option-link">
                    <span className="filter-custom-checkbox" />
                    <span className="filter-option-label">
                      {option.label}
                      {count !== undefined && (
                        <span className="filter-option-count" style={{ color: '#7a8c9e', fontSize: '0.75rem', marginLeft: '5px', fontWeight: 'normal' }}>
                          ({count})
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
            {hasMore && (
              <button 
                type="button"
                className="filter-view-more"
                onClick={() => setExpandedGroups(prev => ({ ...prev, [group.key]: !isExpanded }))}
              >
                {isExpanded ? (
                  <>
                    <span>View Less</span>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 7l4-4 4 4"/></svg>
                  </>
                ) : (
                  <>
                    <span>View More</span>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 3l4 4 4-4"/></svg>
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  // Calculate left position of the slider tooltip bubble to align exactly with the thumb center
  const bubbleLeftStyle = `calc(${(experienceVal / 10) * 100}% + ${11 - experienceVal * 2.2}px)`;

  const isExpCollapsed = !!collapsedSections['experience'];

  // Split filter groups: Work Mode is rendered first, others rendered after Experience
  const workModeGroup = filterGroups[0];
  const remainingGroups = filterGroups.slice(1);

  return (
    <div className="sidebar-filter-card">
      <div className="filter-header">
        <div className="filter-title-wrap">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ color: '#091e42' }}
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="filter-title">Filters</span>
        </div>
        <Link to="/" className="filter-clear-all">
          Clear All
        </Link>
      </div>

      {/* 1. Work Mode Group (Sits at the top) */}
      {renderFilterGroup(workModeGroup)}

      {/* 2. Experience Range Slider Group */}
      <div className="filter-group">
        <h4 
          className="filter-group-title" 
          onClick={() => toggleSection('experience')} 
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <span>Experience</span>
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 10 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            style={{ 
              color: '#7a8c9e', 
              transform: isExpCollapsed ? 'rotate(-90deg)' : 'none', 
              transition: 'transform 150ms ease' 
            }}
          >
            <path d="M1 3l4 4 4-4"/>
          </svg>
        </h4>
        {!isExpCollapsed && (
          <div className="slider-container">
            <div 
              className="slider-bubble" 
              style={{ 
                left: bubbleLeftStyle
              }}
            >
              {getExpLabel(experienceVal)}
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={experienceVal} 
              onChange={(e) => setExperienceVal(parseInt(e.target.value, 10))}
              onMouseUp={handleSliderRelease}
              onTouchEnd={handleSliderRelease}
              className="experience-slider"
            />
            <div className="slider-labels">
              <span>0 Yrs</span>
              <span>Any</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Remaining Checklist Filter Groups */}
      {remainingGroups.map(renderFilterGroup)}
    </div>
  );
}
