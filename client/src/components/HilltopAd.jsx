import React, { useEffect, useRef } from 'react';

/**
 * HilltopAd — Dynamic script injection wrapper for HilltopAds
 * 
 * Props:
 *  - zoneId: The zone hash (default 'b008ca5bbdca79f97b70')
 *  - height: Height of the ad slot in pixels (default 250)
 *  - width: Width of the ad slot in pixels (default 300)
 *  - scriptSrc: Custom script source to execute (optional)
 */
export default function HilltopAd({ zoneId = 'b008ca5bbdca79f97b70', height = 250, width = 300, scriptSrc: scriptSrcProp }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous content in the container
    container.innerHTML = '';

    // Determine the script source based on the dimensions provided
    let scriptSrc = '';
    let settingsVar = 'settingsVar';
    if (width === 728 && height === 90) {
      // 728x90 Banner Ad (first script provided by user)
      scriptSrc = '//relieved-understanding.com/buX/VAs.d/Gul/0nYtWVcg/jenmd9Uu/ZbU/l-kgPYTucAxBNNTxknw-M-Tzc/tgN/zVEn1SODTdAvy/MZQG';
      settingsVar = 'hulmld';
    } else if (width === 300 && height === 250) {
      if (scriptSrcProp) {
        // Use custom script URL if provided (e.g. blog grid ad)
        scriptSrc = scriptSrcProp;
        settingsVar = 'awdd';
      } else {
        // 300x250 MultiTag Banner / Sidebar Ad (second script provided by user)
        scriptSrc = '//relieved-understanding.com/b.XsVKsPdgGblI0gYHWLcZ/peAm/9_uzZ/UIlMkMP/TFcvx/NuTXkowyMNzQMFtEN/z/Eb1vOnTDAOzWNpwy';
        settingsVar = 'kaqdcm';
      }
    }

    let script;

    if (scriptSrc) {
      // Create and execute inline IIFE block to replicate the official script behavior
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(${settingsVar}){
        var d = document,
            s = d.createElement('script'),
            l = d.scripts[d.scripts.length - 1];
        s.settings = ${settingsVar} || {};
        s.src = "${scriptSrc}";
        s.async = true;
        s.referrerPolicy = 'no-referrer-when-downgrade';
        l.parentNode.insertBefore(s, l);
        })({})
      `;

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
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [zoneId, height, width, scriptSrcProp]);

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
