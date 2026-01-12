import { useEffect, useRef, useState, useCallback } from 'react';

export function useIntersectionObserver(options = {}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once visible, stop observing to save resources
        observer.unobserve(entry.target);
      }
    }, defaultOptions);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [defaultOptions]);

  return { elementRef, isVisible };
}
