import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/index.js';

export default function SalarySearch() {
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [liveJobs, setLiveJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [filterText, setFilterText] = useState("");

  const salaryData = {
    "Software Engineer": {
      avg: "₹12,50,000",
      min: "₹4,50,000",
      max: "₹32,00,000",
      demand: "Very High",
      growth: "+14.2% YoY",
      locations: [
        { name: "Bangalore", avg: "₹14,20,000" },
        { name: "Hyderabad", avg: "₹12,80,000" },
        { name: "Pune", avg: "₹10,50,000" },
        { name: "Delhi NCR", avg: "₹11,00,000" }
      ],
      companies: [
        { name: "Google", avg: "₹24,50,000" },
        { name: "Microsoft", avg: "₹22,00,000" },
        { name: "Amazon", avg: "₹19,80,000" },
        { name: "TCS", avg: "₹6,80,000" }
      ]
    },
    "DevOps Engineer": {
      avg: "₹14,00,000",
      min: "₹6,00,000",
      max: "₹35,00,000",
      demand: "Extreme",
      growth: "+18.5% YoY",
      locations: [
        { name: "Bangalore", avg: "₹16,50,000" },
        { name: "Hyderabad", avg: "₹14,20,000" },
        { name: "Mumbai", avg: "₹13,50,000" },
        { name: "Pune", avg: "₹12,00,000" }
      ],
      companies: [
        { name: "Amazon Web Services", avg: "₹23,00,000" },
        { name: "Accenture", avg: "₹12,40,000" },
        { name: "Cognizant", avg: "₹8,50,000" },
        { name: "Wipro", avg: "₹7,20,000" }
      ]
    },
    "Frontend Engineer": {
      avg: "₹9,80,000",
      min: "₹3,80,000",
      max: "₹24,00,000",
      demand: "High",
      growth: "+11.8% YoY",
      locations: [
        { name: "Bangalore", avg: "₹11,20,000" },
        { name: "Delhi NCR", avg: "₹9,50,000" },
        { name: "Chennai", avg: "₹8,20,000" },
        { name: "Pune", avg: "₹8,80,000" }
      ],
      companies: [
        { name: "Paytm", avg: "₹16,00,000" },
        { name: "Flipkart", avg: "₹15,20,000" },
        { name: "Infosys", avg: "₹5,80,000" },
        { name: "Capgemini", avg: "₹6,20,000" }
      ]
    },
    "Data Scientist": {
      avg: "₹15,20,000",
      min: "₹7,00,000",
      max: "₹40,00,000",
      demand: "Extreme",
      growth: "+22.1% YoY",
      locations: [
        { name: "Bangalore", avg: "₹18,00,000" },
        { name: "Mumbai", avg: "₹16,50,000" },
        { name: "Hyderabad", avg: "₹14,80,000" },
        { name: "Delhi NCR", avg: "₹15,00,000" }
      ],
      companies: [
        { name: "Meta", avg: "₹28,00,000" },
        { name: "Walmart Global Tech", avg: "₹21,50,000" },
        { name: "IBM", avg: "₹14,00,000" },
        { name: "Fractal Analytics", avg: "₹11,50,000" }
      ]
    },
    "Product Manager": {
      avg: "₹18,50,000",
      min: "₹8,00,000",
      max: "₹45,00,000",
      demand: "Very High",
      growth: "+16.3% YoY",
      locations: [
        { name: "Bangalore", avg: "₹21,00,000" },
        { name: "Mumbai", avg: "₹19,50,000" },
        { name: "Delhi NCR", avg: "₹17,80,000" },
        { name: "Hyderabad", avg: "₹16,20,000" }
      ],
      companies: [
        { name: "Uber", avg: "₹29,00,000" },
        { name: "Razorpay", avg: "₹22,00,000" },
        { name: "Oyo Rooms", avg: "₹17,50,000" },
        { name: "Tech Mahindra", avg: "₹11,00,000" }
      ]
    }
  };

  const roles = Object.keys(salaryData);
  const currentData = salaryData[selectedRole];

  // Reset filter when selected role changes
  useEffect(() => {
    setFilterText("");
  }, [selectedRole]);

  // Fetch live openings
  useEffect(() => {
    window.prerenderReady = false; // Mark as not ready while we fetch live jobs for salary role
    const fetchLiveJobs = async () => {
      setLoadingJobs(true);
      try {
        const response = await api.get(`/jobs?q=${encodeURIComponent(selectedRole)}&limit=30`);
        const jobsArray = response.data?.data || response.data || [];
        
        let filtered = jobsArray;
        if (filterText) {
          const lowerFilter = filterText.toLowerCase();
          filtered = jobsArray.filter(job => 
            job.company?.toLowerCase().includes(lowerFilter) || 
            job.location?.toLowerCase().includes(lowerFilter)
          );
        }
        setLiveJobs(filtered.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch live jobs", error);
        setLiveJobs([]);
      } finally {
        setLoadingJobs(false);
        window.prerenderReady = true; // Signal that salary details and jobs are loaded
      }
    };
    fetchLiveJobs();
  }, [selectedRole, filterText]);

  return (
    <div className="salary-search" style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b', overflowX: 'hidden' }}>
      
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
        padding: '4rem 2rem',
        borderRadius: '16px',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '3rem',
        boxShadow: '0 10px 30px rgba(79,70,229,0.15)'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Salary Insights Explorer 📊
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#e0e7ff', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore average compensation packages, demand trends, and top paying companies in the tech sector.
        </p>

        {/* Dropdown Selector */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: '#1e1b4b',
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Stats Grid */}
      <div className="row g-4 mb-4">
        
        {/* Core metrics */}
        <div className="col-md-4">
          <div style={{
            background: '#ffffff',
            padding: '1.75rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Average Annual Salary
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4f46e5', margin: '0.5rem 0 0.2rem 0' }}>
              {currentData.avg}
            </h2>
            <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700 }}>
              {currentData.growth}
            </span>
          </div>
        </div>

        {/* Percentiles Gauges */}
        <div className="col-md-8">
          <div style={{
            background: '#ffffff',
            padding: '1.75rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Salary Distribution Range
            </span>
            
            {/* Linear distribution bar */}
            <div style={{
              height: '12px',
              background: 'linear-gradient(90deg, #c7d2fe 0%, #4f46e5 50%, #1e1b4b 100%)',
              borderRadius: '6px',
              position: 'relative',
              marginBottom: '1.75rem'
            }}>
              {/* Min pin */}
              <div style={{ position: 'absolute', left: '0%', top: '16px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Min: {currentData.min}</span>
              </div>
              {/* Avg pin */}
              <div style={{ position: 'absolute', left: '50%', top: '-24px', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5', backgroundColor: '#e0e7ff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Average</span>
                <span style={{ height: '8px', width: '2px', backgroundColor: '#4f46e5', marginTop: '2px' }}></span>
              </div>
              {/* Max pin */}
              <div style={{ position: 'absolute', right: '0%', top: '16px', textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Max: {currentData.max}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>Demand Level: <strong style={{ color: '#ef4444' }}>{currentData.demand}</strong></span>
              <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>Source: NextJobPost Market Index</span>
            </div>
          </div>
        </div>

      </div>

      {/* Details Columns */}
      <div className="row g-4">
        
        {/* Left: Locations */}
        <div className="col-md-6">
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e1b4b' }}>
              Top Hiring Hubs for {selectedRole}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              💡 Click on a location below to show matching live jobs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentData.locations.map((loc, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setFilterText(loc.name)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    backgroundColor: filterText === loc.name ? '#e0e7ff' : 'transparent',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (filterText !== loc.name) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (filterText !== loc.name) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e7ff',
                      color: '#4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 600, color: '#374151' }}>{loc.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#4f46e5' }}>{loc.avg} / yr</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Companies */}
        <div className="col-md-6">
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e1b4b' }}>
              Top Paying Companies
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              💡 Click on a company below to show matching live jobs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentData.companies.map((comp, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setFilterText(comp.name)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    backgroundColor: filterText === comp.name ? '#e0e7ff' : 'transparent',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (filterText !== comp.name) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (filterText !== comp.name) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#374151' }}>{comp.name}</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>{comp.avg} / yr</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Openings Section */}
      <section style={{
        background: '#ffffff',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        marginTop: '3rem',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
              🔥 Live Openings for {selectedRole} {filterText ? `at/in ${filterText}` : ''}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '4px 0 0 0' }}>
              Real-time opportunities synced from our active job board.
            </p>
          </div>
          {filterText && (
            <button 
              onClick={() => setFilterText("")}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                boxShadow: '0 4px 12px rgba(239,68,68,0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Clear Filter ×
            </button>
          )}
        </div>

        {loadingJobs ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading live jobs...</span>
            </div>
          </div>
        ) : liveJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #cbd5e1' }}>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
              No direct matches found for "{selectedRole}" {filterText ? `with filter "${filterText}"` : ''} at the moment.
            </p>
            <Link to="/" style={{ color: '#4f46e5', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>
              Browse all active listings &rarr;
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            {liveJobs.map((job) => (
              <div key={job._id} className="col-md-6">
                <div 
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    background: '#ffffff',
                    transition: 'all 250ms ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.01)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4f46e5';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(79,70,229,0.06)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.01)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', backgroundColor: '#e0e7ff', padding: '4px 10px', borderRadius: '6px' }}>
                        {job.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                        {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1b4b', margin: '4px 0' }}>
                      {job.title}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: '2px 0 12px 0', fontWeight: 600 }}>
                      🏢 {job.company}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                      <span>📍 {job.location}</span>
                      {job.salary && <span>💰 {job.salary}</span>}
                      {job.experience && <span>⏳ {job.experience}</span>}
                    </div>
                  </div>
                  <Link 
                    to={`/${job.slug}`}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      textAlign: 'center',
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'all 200ms ease',
                      boxShadow: '0 4px 12px rgba(79,70,229,0.15)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                  >
                    Apply Now &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Box */}
      <section style={{
        backgroundColor: '#faf5ff',
        border: '1.5px dashed #c084fc',
        borderRadius: '12px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        marginTop: '3.5rem'
      }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#5b21b6', marginBottom: '0.5rem' }}>
          Ready to aim for the higher end?
        </h4>
        <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          Explore our entry-level listings and find job profiles matching your target salary scale.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: '#6d28d9',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'background-color 200ms ease',
            boxShadow: '0 4px 12px rgba(109,40,217,0.15)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5b21b6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
        >
          Browse All Jobs Now
        </Link>
      </section>

    </div>
  );
}
