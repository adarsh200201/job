import React, { useEffect, useRef, useState } from 'react';

/**
 * GoogleAd — Performance-optimised Google AdSense unit
 *
 * Strategy:
 *  - IntersectionObserver: only inject the <ins> tag + push ad when element
 *    is about to scroll into view (rootMargin 200px). The heavy AdSense
 *    show_ads_impl.js (516 KB) is NOT loaded up-front — it is pulled in
 *    lazily by adsbygoogle.js the first time an ad slot is pushed.
 *  - Reserved height: the wrapper holds its dimensions before the ad loads,
 *    eliminating the CLS shift that was contributing 0.43 CLS.
 *  - Graceful fallback: if no slot is provided or AdSense is blocked,
 *    nothing renders.
 *
 * Usage:
 *   <GoogleAd slot="1234567890" />
 *   <GoogleAd slot="1234567890" format="rectangle" style={{ minHeight: 250 }} />
 */

// Only inject the adsbygoogle.js script once across the lifetime of the page.
let adsenseScriptInjected = false;

function injectAdsenseScript() {
  if (adsenseScriptInjected) return;
  if (document.querySelector('script[src*="adsbygoogle"]')) {
    adsenseScriptInjected = true;
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1098770732597626';
  s.async = true;
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
  adsenseScriptInjected = true;
}

export default function GoogleAd({
  slot,
  format = 'auto',
  responsive = true,
  style = {},
  className = '',
}) {
  const wrapperRef = useRef(null);
  const pushed = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!slot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // pre-load 200px before user sees it
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [slot]);

  // Once visible, inject the script (if not already) and push the slot
  useEffect(() => {
    if (!isVisible || pushed.current) return;
    injectAdsenseScript();

    // Give the script a moment to initialise adsbygoogle array
    const t = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        // Silently swallow ad-blocker errors
      }
    }, 100);

    return () => clearTimeout(t);
  }, [isVisible]);

  if (!slot) return null;

  // Determine sensible reserved height based on format to prevent CLS
  const reservedHeight =
    format === 'rectangle' ? 250 :
    format === 'horizontal' ? 90 :
    format === 'vertical' ? 600 : 90;

  return (
    <div
      ref={wrapperRef}
      className={`google-ad-wrapper ${className}`}
      style={{
        display: 'block',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: reservedHeight,
        ...style,
      }}
    >
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1098770732597626"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      )}
    </div>
  );
}
