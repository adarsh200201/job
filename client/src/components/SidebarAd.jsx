import React from 'react';
import GoogleAd from './GoogleAd.jsx';

// Replace with your actual AdSense slot IDs from your AdSense dashboard
const ADSENSE_SIDEBAR_SLOT = ''; // e.g. '1234567890' — sidebar/vertical
const ADSENSE_INLINE_SLOT = '';  // e.g. '0987654321' — between job cards

export { ADSENSE_INLINE_SLOT };

export default function SidebarAd() {
  if (!ADSENSE_SIDEBAR_SLOT) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <GoogleAd
        slot={ADSENSE_SIDEBAR_SLOT}
        format="auto"
        style={{ minHeight: 250, background: '#f9fafb', borderRadius: '12px', overflow: 'hidden' }}
      />
    </div>
  );
}
