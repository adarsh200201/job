import React, { useEffect } from 'react';

/**
 * HilltopAd — Dynamic script injection wrapper for HilltopAds
 * 
 * Props:
 *  - zoneId: The zone hash (default 'b008ca5bbdca79f97b70')
 *  - height: Height of the ad slot in pixels (default 250)
 *  - width: Width of the ad slot in pixels (default 300)
 */
export default function HilltopAd({ zoneId = 'b008ca5bbdca79f97b70', height = 250, width = 300 }) {
  const containerId = `container-${zoneId}`;

  useEffect(() => {
    if (!zoneId) return;

    // Define option properties globally for HilltopAds delivery script to pick up
    window.atOptions = {
      key: zoneId,
      format: 'iframe',
      height: height,
      width: width,
      params: {},
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.effectivegatecpm.com/${zoneId}/invoke.js`;
    script.async = true;

    const container = document.getElementById(containerId);
    if (container) {
      // Clean up container before appending to avoid duplicate scripts on re-renders
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      // Cleanup script element on unmount
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [zoneId, height, width, containerId]);

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
        id={containerId} 
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
