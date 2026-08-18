import React, { useEffect, useRef, useState } from 'react';

/**
 * MobileTopAd — shows a 320x50 banner at the top of pages on mobile only.
 * On desktop this renders nothing (sidebar ads handle desktop).
 * This ensures mobile users see ads immediately without scrolling.
 */
export default function MobileTopAd() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const injectedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    if (injectedRef.current) return;
    injectedRef.current = true;

    containerRef.current.innerHTML = '';

    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.text = `
      atOptions = {
        'key' : 'bc871abd6058fecb0fcafdc48804f536',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://www.highperformanceformat.com/bc871abd6058fecb0fcafdc48804f536/invoke.js';

    containerRef.current.appendChild(script1);
    containerRef.current.appendChild(script2);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '8px 0 16px',
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{ width: '320px', minHeight: '50px', maxWidth: '100%' }}
      />
    </div>
  );
}
