import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';

const MIXPANEL_TOKEN = '99f55a1e0ff42d36dbf679a878e375fa';

// Helper to parse UTM and referrer information
const parseUTMAndReferrer = () => {
  const params = new URLSearchParams(window.location.search);
  const utmProps = {};
  
  // Parse standard UTM codes
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
    if (params.has(param)) {
      utmProps[param] = params.get(param);
    }
  });

  // Handle current and initial referrer
  if (document.referrer) {
    utmProps['current_referrer'] = document.referrer;
    if (!localStorage.getItem('initial_referrer')) {
      localStorage.setItem('initial_referrer', document.referrer);
    }
  } else {
    utmProps['current_referrer'] = 'Direct';
  }
  
  const initialReferrer = localStorage.getItem('initial_referrer') || 'Direct';
  utmProps['initial_referrer'] = initialReferrer;
  
  return utmProps;
};

// Helper to fetch/update session user engagement metrics
export const getEngagementProps = () => {
  // Session pages viewed counter
  let pagesViewed = parseInt(sessionStorage.getItem('pages_viewed_count') || '0', 10);
  pagesViewed += 1;
  sessionStorage.setItem('pages_viewed_count', pagesViewed.toString());

  // Session start time tracking
  let startTime = sessionStorage.getItem('session_start_time');
  if (!startTime) {
    startTime = Date.now().toString();
    sessionStorage.setItem('session_start_time', startTime);
  }
  const sessionDuration = Math.round((Date.now() - parseInt(startTime, 10)) / 1000); // duration in seconds

  return {
    pages_viewed: pagesViewed,
    session_duration: sessionDuration
  };
};

export const initMixpanel = () => {
  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false,
      track_pageview: false, // Track manually to keep it precise and router-aligned
      persistence: 'localstorage',
    });
    
    // Register traffic attribution parameters as super properties
    const trafficProps = parseUTMAndReferrer();
    mixpanel.register(trafficProps);
  } catch (error) {
    console.error('Failed to initialize Mixpanel:', error);
  }
};

export const trackEvent = (eventName, properties = {}) => {
  try {
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.error(`Mixpanel failed to track event "${eventName}":`, error);
  }
};

export const trackPageView = (pageName, properties = {}) => {
  try {
    const engagement = getEngagementProps();
    
    // Slight delay so React Helmet can write the document.title first
    setTimeout(() => {
      mixpanel.track('Page View', {
        current_url: window.location.href,
        current_path: window.location.pathname,
        page_title: document.title,
        ...engagement,
        ...properties
      });
    }, 150);
  } catch (error) {
    console.error(`Mixpanel failed to track page view for "${pageName}":`, error);
  }
};

// Helper for Job Detail Viewed event
export const trackJobDetailViewed = (job) => {
  if (!job) return;
  trackEvent('Job Detail Viewed', {
    jobId: job._id || job.id,
    jobTitle: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary || 'Best in Industry',
    category: job.type,
    current_path: window.location.pathname
  });
};

// Helper for Apply Job Clicked event
export const trackApplyJobClicked = (job) => {
  if (!job) return;
  trackEvent('Apply Job Clicked', {
    jobId: job._id || job.id,
    jobTitle: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary || 'Best in Industry',
    category: job.type,
    current_url: window.location.href,
    current_path: window.location.pathname,
    referrer: document.referrer || 'Direct'
  });
};

// Helper for Job Search event
export const trackJobSearch = (keyword, resultsCount) => {
  trackEvent('Job Search', {
    keyword: keyword || '',
    results_count: resultsCount || 0
  });
};

// Helper for Category Viewed event
export const trackCategoryViewed = (category) => {
  trackEvent('Category Viewed', {
    category: category || 'General',
    current_path: window.location.pathname
  });
};

// Helper for Job Shared event
export const trackJobShared = (platform, job) => {
  if (!job) return;
  trackEvent('Job Shared', {
    platform: platform || 'Copy Link',
    jobId: job._id || job.id,
    jobTitle: job.title
  });
};

// Helper for Ad Clicked event
export const trackAdClicked = (adPosition) => {
  trackEvent('Ad Clicked', {
    ad_position: adPosition || 'sidebar_banner',
    current_path: window.location.pathname
  });
};

// React hook to handle scroll depth tracking on page paths
export const useScrollDepth = (path) => {
  useEffect(() => {
    const triggered = new Set();

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) return;

      const percentage = Math.round((scrollTop / scrollHeight) * 100);
      const thresholds = [25, 50, 75, 100];

      thresholds.forEach(threshold => {
        if (percentage >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);

          let pageType = 'static';
          if (path === '/') {
            pageType = 'home';
          } else if (path === '/salaries') {
            pageType = 'salaries';
          } else if (path === '/student-career-center') {
            pageType = 'student_career_center';
          } else if (!['/about', '/contact', '/faq', '/terms', '/disclaimer', '/login', '/signup', '/auth/callback', '/admin/login', '/admin', '/dashboard', '/onboarding'].includes(path)) {
            pageType = 'job_detail';
          }

          trackEvent('Scroll Depth', {
            scroll_depth: `${threshold}%`,
            current_path: path,
            page_type: pageType
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [path]);
};

export const identifyUser = (userId, traits = {}) => {
  try {
    mixpanel.identify(userId);
    if (Object.keys(traits).length > 0) {
      mixpanel.people.set(traits);
    }
  } catch (error) {
    console.error('Mixpanel failed to identify user:', error);
  }
};

export const resetUser = () => {
  try {
    mixpanel.reset();
  } catch (error) {
    console.error('Mixpanel failed to reset user:', error);
  }
};
