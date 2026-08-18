import React, { useEffect, useRef, useState } from 'react';

/**
 * InContentAd — renders the Adsterra 468x60 banner inline within page content.
 * Placed between sections for maximum visibility and CTR.
 * Each instance gets a unique key to avoid script conflicts.
 */
export default function InContentAd({ instanceId = 'default' }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    // Lazy-load: only inject ad when element is near viewport
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.text = `
      atOptions = {
        'key' : 'bc871abd6058fecb0fcafdc48804f536',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://www.highperformanceformat.com/bc871abd6058fecb0fcafdc48804f536/invoke.js';

    containerRef.current.appendChild(script1);
    containerRef.current.appendChild(script2);
  }, [visible]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px auto',
        width: '100%',
        overflow: 'hidden',
        minHeight: '60px',
        background: 'transparent',
      }}
    >
      <div
        ref={containerRef}
        style={{ width: '468px', minHeight: '60px', maxWidth: '100%' }}
      />
    </div>
  );
}
