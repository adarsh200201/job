import React, { useEffect } from 'react';
import Banner468x60 from './Banner468x60';

export default function SidebarAd() {
  useEffect(() => {
    const scriptSrc = "https://pl30587568.effectivecpmnetwork.com/87559d9939384ac9fbf272280d62c49e/invoke.js";
    let script = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      {/* Clickadilla Banner (Zone 448017) */}
      <div 
        data-admpid="448017" 
        style={{ 
          width: '300px', 
          height: '250px', 
          background: '#f9fafb', 
          borderRadius: '12px', 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb'
        }}
      />

      {/* EffectiveCPMNetwork Native Banner (30487069) */}
      <div style={{ width: '100%', maxWidth: '300px', minHeight: '100px', borderRadius: '12px', overflow: 'hidden' }}>
        <div id="container-87559d9939384ac9fbf272280d62c49e"></div>
      </div>

      {/* EffectiveCPMNetwork Banner 468x60 (30487071) */}
      <Banner468x60 />
    </div>
  );
}
