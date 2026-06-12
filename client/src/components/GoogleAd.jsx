import React, { useEffect, useRef } from 'react';

/**
 * GoogleAd — Reusable Google AdSense unit
 *
 * Usage:
 *   <GoogleAd slot="YOUR_AD_SLOT_ID" />
 *   <GoogleAd slot="YOUR_AD_SLOT_ID" format="rectangle" style={{ minHeight: 250 }} />
 *
 * Props:
 *   slot    — AdSense ad unit slot ID (get from AdSense dashboard)
 *   format  — 'auto' | 'rectangle' | 'horizontal' | 'vertical' (default: 'auto')
 *   style   — extra wrapper styles
 *   className — extra class on wrapper
 */
export default function GoogleAd({
  slot,
  format = 'auto',
  responsive = true,
  style = {},
  className = '',
}) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      }
    } catch (e) {
      // AdSense blocked by ad-blocker — silently ignore
    }
  }, []);

  if (!slot) return null;

  return (
    <div
      className={`google-ad-wrapper ${className}`}
      style={{
        display: 'block',
        textAlign: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1098770732597626"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
