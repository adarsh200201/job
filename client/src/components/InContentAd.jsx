import React, { useEffect, useRef, useState } from 'react';

/**
 * InContentAd — fully responsive ad unit.
 * - Mobile (<480px): 320x50
 * - Tablet/Desktop (≥480px): 468x60
 * Uses IntersectionObserver for lazy loading (only fires when visible).
 */
export default function InContentAd({ instanceId = 'default' }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const observerRef = useRef(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (containerRef.current) observerRef.current.observe(containerRef.current);
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !containerRef.current) return;
    // Prevent double-injection on re-render
    if (injectedRef.current) return;
    injectedRef.current = true;

    containerRef.current.innerHTML = '';

    const adWidth = isMobile ? 320 : 468;
    const adHeight = isMobile ? 50 : 60;

    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.text = `
      atOptions = {
        'key' : 'bc871abd6058fecb0fcafdc48804f536',
        'format' : 'iframe',
        'height' : ${adHeight},
        'width' : ${adWidth},
        'params' : {}
      };
    `;

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://www.highperformanceformat.com/bc871abd6058fecb0fcafdc48804f536/invoke.js';

    containerRef.current.appendChild(script1);
    containerRef.current.appendChild(script2);
  }, [visible, isMobile]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px auto',
        width: '100%',
        overflow: 'hidden',
        minHeight: isMobile ? '50px' : '60px',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: isMobile ? '320px' : '468px',
          minHeight: isMobile ? '50px' : '60px',
          maxWidth: '100%',
        }}
      />
    </div>
  );
}
