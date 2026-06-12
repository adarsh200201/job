/**
 * usePageTracking — Auto fires Page Viewed + SEO + Session events
 * on every React Router navigation.
 * Mount ONCE inside AppLayout (already has access to useLocation).
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPage } from '../services/analytics/index.js';
import { recordPageEnter, recordPageExit } from '../services/analytics/session.js';

export function usePageTracking() {
  const location = useLocation();
  const prevPath = useRef(null);
  const prevTitle = useRef(document.title);

  useEffect(() => {
    const path = location.pathname;

    // Fire exit event for previous page
    if (prevPath.current && prevPath.current !== path) {
      recordPageExit(prevPath.current, prevTitle.current);
    }

    // Record entry time for new page
    recordPageEnter();
    prevPath.current = path;

    // Track page view (150ms delay for Helmet to set title)
    trackPage(path, {}, 150);

    // Store title after a brief delay
    setTimeout(() => { prevTitle.current = document.title; }, 200);
  }, [location.pathname, location.search]);
}
