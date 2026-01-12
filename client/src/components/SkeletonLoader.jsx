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

export function JobDetailsSkeleton() {
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
