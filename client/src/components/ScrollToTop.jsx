import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page smoothly whenever the route path or query parameters change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname, search]);

  return null;
}
