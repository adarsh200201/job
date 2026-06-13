import React from 'react';

export function JobCardSkeleton() {
  return (
    <article className="mb-4 pb-4 border-bottom" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      <div className="mb-2" style={{ height: '28px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem' }}></div>
      <div className="mb-3" style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', width: '70%' }}></div>
      
      <div className="row g-3">
        <div className="col-md-5 col-lg-4">
          <div style={{ paddingBottom: '100%', position: 'relative', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}></div>
        </div>
        <div className="col-md-7 col-lg-8">
          <div className="mb-3">
            <div className="mb-2" style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', width: '50%' }}></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <div style={{ height: '24px', backgroundColor: '#dbeafe', borderRadius: '12px', width: '80px' }}></div>
              <div style={{ height: '24px', backgroundColor: '#dbeafe', borderRadius: '12px', width: '100px' }}></div>
            </div>
          </div>
          <div className="mb-3">
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', marginBottom: '8px' }}></div>
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', marginBottom: '8px' }}></div>
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', width: '80%' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ height: '40px', backgroundColor: '#dbeafe', borderRadius: '20px', width: '120px' }}></div>
            <div style={{ height: '40px', backgroundColor: '#dcfce7', borderRadius: '20px', width: '120px' }}></div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function JobDetailsSkeleton({ isMobile = false }) {
  if (isMobile) {
    return (
      <div className="job-details-mobile mt-0 mb-5" style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '80px', fontFamily: "'Inter', sans-serif" }}>
        {/* Sticky Mobile Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 1020,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          height: '54px'
        }}>
          {/* Back button placeholder */}
          <div style={{ width: '22px', height: '22px', backgroundColor: '#e5e7eb', borderRadius: '50%', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          {/* Right actions placeholders */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <div style={{ width: '22px', height: '22px', backgroundColor: '#e5e7eb', borderRadius: '50%' }} />
            <div style={{ width: '22px', height: '22px', backgroundColor: '#e5e7eb', borderRadius: '50%' }} />
            <div style={{ width: '70px', height: '28px', backgroundColor: '#e5e7eb', borderRadius: '20px' }} />
          </div>
        </div>

        {/* Relative Posted Time Banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #f1f5f9',
          height: '40px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}>
          <div style={{ width: '130px', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
          <div style={{ width: '90px', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
        </div>

        {/* Sticky Mobile Tabs Bar */}
        <div className="mobile-tabs" style={{
          position: 'sticky',
          top: '54px',
          zIndex: 1010,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          padding: '0 8px',
          height: '47px',
          alignItems: 'center',
          gap: '16px',
          overflow: 'hidden',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}>
          <div style={{ width: '80px', height: '18px', backgroundColor: '#e5e7eb', borderRadius: '4px', margin: '12px 6px' }} />
          <div style={{ width: '110px', height: '18px', backgroundColor: '#f3f4f6', borderRadius: '4px', margin: '12px 6px' }} />
          <div style={{ width: '100px', height: '18px', backgroundColor: '#f3f4f6', borderRadius: '4px', margin: '12px 6px' }} />
          <div style={{ width: '90px', height: '18px', backgroundColor: '#f3f4f6', borderRadius: '4px', margin: '12px 6px' }} />
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '20px 16px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          
          {/* Job details top block */}
          <div style={{ marginBottom: '20px' }}>
            {/* Title */}
            <div style={{ height: '28px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '90%' }} />
            <div style={{ height: '28px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '12px', width: '60%' }} />
            
            {/* Company / Brand Name */}
            <div style={{ height: '20px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', width: '40%' }} />
            
            {/* Posted Date & Publisher row */}
            <div style={{ height: '14px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', width: '70%' }} />

            {/* Share and Follow Bar */}
            <div className="share-follow-bar p-3 rounded-3 mt-3 d-flex align-items-center gap-2 flex-nowrap" style={{
              backgroundColor: '#f0f7ff',
              border: '1px solid #dbeafe',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%',
              height: '56px',
              marginBottom: '16px'
            }}>
              <div style={{ width: '80px', height: '28px', backgroundColor: '#dbeafe', borderRadius: '14px' }} />
              <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1', margin: '0 6px' }} />
              <div style={{ width: '100px', height: '28px', backgroundColor: '#dbeafe', borderRadius: '14px' }} />
              <div style={{ width: '100px', height: '28px', backgroundColor: '#dbeafe', borderRadius: '14px' }} />
            </div>
          </div>

          {/* Job Highlights card */}
          <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', height: '76px' }}>
            <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '100px' }} />
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '85%' }} />
          </div>

          {/* Parameters List */}
          <div className="d-flex flex-column gap-3 mb-4" style={{ padding: '4px 0' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="d-flex align-items-center gap-3">
                <div style={{ width: '20px', height: '20px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
                <div style={{ width: i === 3 ? '120px' : '150px', height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px' }} />
              </div>
            ))}
          </div>

          <hr style={{ borderTop: '1px solid #cbd5e1', margin: '24px 0' }} />

          {/* Main body content block */}
          <div>
            <div style={{ height: '40px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '16px', width: '180px' }} />
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '10px', width: '100%' }} />
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '10px', width: '95%' }} />
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '10px', width: '90%' }} />
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '10px', width: '85%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details container">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="mb-4" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <div style={{ height: '40px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', marginBottom: '16px' }}></div>
            <div style={{ height: '20px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', width: '60%', marginBottom: '8px' }}></div>
            <div style={{ height: '20px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', width: '50%' }}></div>
          </div>
          <div className="mb-4" style={{ paddingBottom: '60%', position: 'relative', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
          <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <div style={{ height: '24px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', marginBottom: '12px', width: '200px' }}></div>
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', marginBottom: '8px' }}></div>
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', marginBottom: '8px' }}></div>
            <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', width: '80%' }}></div>
          </div>
        </div>

        <div className="col-12 col-lg-4" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          <div style={{ height: '300px', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}></div>
        </div>
      </div>
    </div>
  );
}
