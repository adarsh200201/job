import React from 'react';

export default function SidebarAd() {
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
    </div>
  );
}
