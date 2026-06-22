import React, { useEffect, useRef } from 'react';

/**
 * HilltopAd — Dynamic script injection wrapper for HilltopAds
 * 
 * Props:
 *  - zoneId: The zone hash (default 'b008ca5bbdca79f97b70')
 *  - height: Height of the ad slot in pixels (default 250)
 *  - width: Width of the ad slot in pixels (default 300)
 */
export default function HilltopAd({ zoneId = 'b008ca5bbdca79f97b70', height = 250, width = 300 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous content in the container
    container.innerHTML = '';

    // Determine the script source based on the dimensions provided
    let scriptSrc = '';
    if (width === 728 && height === 90) {
      // 728x90 Banner Ad (first script provided by user)
      scriptSrc = '//relieved-understanding.com/buX/VAs.d/Gul/0nYtWVcg/jenmd9Uu/ZbU/l-kgPYTucAxBNNTxknw-M-Tzc/tgN/zVEn1SODTdAvy/MZQG';
    } else if (width === 300 && height === 250) {
      // 300x250 MultiTag Banner / Sidebar Ad (second script provided by user)
      scriptSrc = '//relieved-understanding.com/b.XsVKsPdgGblI0gYHWLcZ/peAm/9_uzZ/UIlMkMP/TFcvx/NuTXkowyMNzQMFtEN/z/Eb1vOnTDAOzWNpwy';
    }

    let script;

    if (scriptSrc) {
      script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.referrerPolicy = 'no-referrer-when-downgrade';
      script.settings = {};

      container.appendChild(script);
    } else if (zoneId) {
      // Fallback to the old invoke.js style if a different zoneId is specified
      window.atOptions = {
        key: zoneId,
        format: 'iframe',
        height: height,
        width: width,
        params: {},
      };

      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.effectivegatecpm.com/${zoneId}/invoke.js`;
      script.async = true;

      container.appendChild(script);
    }

    return () => {
      // Cleanup script element on unmount
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [zoneId, height, width]);

  return (
    <div 
      className="hilltop-ad-wrapper"
      style={{ 
        display: 'block', 
        margin: '15px auto', 
        textAlign: 'center', 
        minHeight: `${height}px`,
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={containerRef}
        style={{ 
          display: 'inline-block', 
          minHeight: `${height}px`, 
          width: '100%', 
          maxWidth: `${width}px` 
        }}
      />
    </div>
  );
}
