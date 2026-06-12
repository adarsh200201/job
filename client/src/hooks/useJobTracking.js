/**
 * useJobTracking — Viewport-based job impression tracking.
 * Returns a ref to attach to a job card container.
 * Fires Job Impression exactly ONCE when the card scrolls into view.
 *
 * Usage:
 *   const { cardRef } = useJobTracking(job, index);
 *   return <div ref={cardRef}>...</div>;
 */
import { useRef, useEffect } from 'react';
import { trackJobImpression } from '../services/analytics/index.js';

export function useJobTracking(job, position = -1) {
  const cardRef  = useRef(null);
  const fired    = useRef(false);

  useEffect(() => {
    if (!job || fired.current || !cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackJobImpression(job, position);
          observer.disconnect();
        }
      },
      { threshold: 0.4 } // 40% visible = impression
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [job, position]);

  return { cardRef };
}
