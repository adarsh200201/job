/**
 * NextJobPost — Analytics Utility (Legacy Compatibility Layer)
 *
 * All exports from this file are preserved for backwards compatibility.
 * New code should import directly from src/services/analytics/index.js.
 *
 * Existing usages across the codebase continue to work without any changes:
 *   - initMixpanel()        → used in main.jsx
 *   - trackPageView()       → used in App.jsx
 *   - trackJobDetailViewed() → used in JobDetails.jsx
 *   - trackApplyJobClicked() → used in JobDetails.jsx
 *   - trackJobSearch()       → used in Home.jsx
 *   - trackCategoryViewed()  → used in Home.jsx
 *   - trackJobShared()       → used in JobDetails.jsx
 *   - trackAdClicked()       → used in JobDetails.jsx
 *   - useScrollDepth()       → used in App.jsx (replaced by useScrollTracking hook)
 *   - identifyUser()         → used in AuthContext.jsx
 *   - resetUser()            → used in AuthContext.jsx
 *   - getEngagementProps()   → used in trackPageView
 */
import { useEffect } from 'react';
import {
  initAnalytics,
  track,
  trackPage,
  trackJobDetailViewed,
  trackApplyJobClicked,
  trackJobImpression,
  trackJobCardClicked,
  trackJobSearch,
  trackCategoryViewed,
  trackJobShared,
  trackAdClicked,
  trackScrollDepth,
  identifyUser,
  resetUser,
  EVENTS,
} from '../services/analytics/index.js';
import { getPageType } from '../services/analytics/globalProps.js';

// ─── Backwards-compatible exports ─────────────────────────────────────────

/** @deprecated Call initAnalytics() directly in new code */
export const initMixpanel = initAnalytics;

/** @deprecated Use track(EVENTS.X, props) in new code */
export const trackEvent = track;

/**
 * @deprecated Use trackPage(path, props) in new code
 * Kept for App.jsx compatibility
 */
export function trackPageView(pathOrName, properties = {}) {
  const path = typeof pathOrName === 'string' ? pathOrName : window.location.pathname;
  trackPage(path, properties, 150);
}

export function getEngagementProps() {
  let pagesViewed = parseInt(sessionStorage.getItem('pages_viewed_count') || '0', 10);
  pagesViewed += 1;
  sessionStorage.setItem('pages_viewed_count', pagesViewed.toString());

  let startTime = sessionStorage.getItem('_njp_session_start');
  if (!startTime) {
    startTime = Date.now().toString();
    sessionStorage.setItem('_njp_session_start', startTime);
  }
  const sessionDuration = Math.round((Date.now() - parseInt(startTime, 10)) / 1000);
  return { pages_viewed: pagesViewed, session_duration: sessionDuration };
}

/**
 * Scroll depth hook — backwards-compatible with App.jsx.
 * New code should use useScrollTracking() hook instead.
 */
export function useScrollDepth(path) {
  useEffect(() => {
    const triggered = new Set();
    const pageType  = getPageType(path);

    const handleScroll = () => {
      const scrollTop    = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) return;

      const percentage = Math.round((scrollTop / scrollHeight) * 100);
      [25, 50, 75, 100].forEach(threshold => {
        if (percentage >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          trackScrollDepth(threshold, path, pageType);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [path]);
}

// Re-export new service functions under legacy names
export {
  trackJobDetailViewed,
  trackApplyJobClicked,
  trackJobSearch,
  trackCategoryViewed,
  trackJobShared,
  trackAdClicked,
  trackJobImpression,
  trackJobCardClicked,
  identifyUser,
  resetUser,
  EVENTS,
};
