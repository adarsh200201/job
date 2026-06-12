/**
 * useScrollTracking — Fires Scroll Depth events at 25%, 50%, 75%, 100%.
 * Resets thresholds on route change so each page is tracked independently.
 * Replaces the inline useScrollDepth in utils/analytics.js.
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackScrollDepth } from '../services/analytics/index.js';
import { getPageType } from '../services/analytics/globalProps.js';

export function useScrollTracking() {
  const location = useLocation();
  const triggeredRef = useRef(new Set());

  useEffect(() => {
    // Reset thresholds for new page
    triggeredRef.current = new Set();

    const path = location.pathname;
    const pageType = getPageType(path);
    const thresholds = [25, 50, 75, 100];

    const handleScroll = () => {
      const scrollTop    = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) return;

      const pct = Math.round((scrollTop / scrollHeight) * 100);

      thresholds.forEach(threshold => {
        if (pct >= threshold && !triggeredRef.current.has(threshold)) {
          triggeredRef.current.add(threshold);
          trackScrollDepth(threshold, path, pageType);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);
}
