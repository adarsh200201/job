import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SalarySearch() {
  const [selectedRole, setSelectedRole] = useState("Software Engineer");

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

  return (
    <div className="salary-search" style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b' }}>
      
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
              <div style={{ position: 'absolute', left: '0%', top: '16px', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Min: {currentData.min}</span>
              </div>
              {/* Avg pin */}
              <div style={{ position: 'absolute', left: '50%', top: '-24px', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5', backgroundColor: '#e0e7ff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Average</span>
                <span style={{ height: '8px', width: '2px', backgroundColor: '#4f46e5', marginTop: '2px' }}></span>
              </div>
              {/* Max pin */}
              <div style={{ position: 'absolute', right: '0%', top: '16px', transform: 'translateX(50%)', textAlign: 'center' }}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e1b4b' }}>
              Top Hiring Hubs for {selectedRole}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentData.locations.map((loc, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e1b4b' }}>
              Top Paying Companies
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentData.companies.map((comp, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>{comp.name}</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>{comp.avg} / yr</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CTA Box */}
      <section style={{
        backgroundColor: '#faf5ff',
        border: '1.5px dashed #c084fc',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#5b21b6', marginBottom: '0.5rem' }}>
          Ready to aim for the higher end?
        </h4>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.25rem' }}>
          Explore our entry-level listings and find job profiles matching your target salary scale.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.5rem',
            backgroundColor: '#6d28d9',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'background-color 200ms ease'
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
