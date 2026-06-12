import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/index.js';

export default function PreFooterSections() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Default state fallbacks based on seeded data so we have real links immediately
  const [categories, setCategories] = useState([
    { label: 'Full-Time Jobs', to: '/?type=Full-Time' },
    { label: 'Internship Jobs', to: '/?type=Internship' },
    { label: 'Remote Jobs', to: '/?type=Remote' },
    { label: 'Part-Time Jobs', to: '/?type=Part-Time' },
    { label: 'Software Developer Jobs', to: '/?q=Software' },
    { label: 'Web Developer Jobs', to: '/?q=Developer' },
    { label: 'Quality Assurance Jobs', to: '/?q=QA' },
    { label: 'Content Writing Jobs', to: '/?q=Writer' },
    { label: 'Data Analyst Jobs', to: '/?q=Data' },
    { label: 'Customer Support Jobs', to: '/?q=Support' }
  ]);

  const [titles, setTitles] = useState([
    { label: 'Software Engineer Fresher…', to: '/?q=Software' },
    { label: 'Frontend Developer Internship…', to: '/?q=Frontend' },
    { label: 'Junior QA Engineer…', to: '/?q=QA' },
    { label: 'Part-time Content Writer…', to: '/?q=Writer' },
    { label: 'Work From Home Data…', to: '/?q=Data' },
    { label: 'Full Stack Developer…', to: '/?q=Developer' },
    { label: 'Backend Developer…', to: '/?q=Backend' },
    { label: 'DevOps Intern…', to: '/?q=DevOps' },
    { label: 'Graphic Designer…', to: '/?q=Designer' },
    { label: 'Data Analyst Fresher…', to: '/?q=Data' }
  ]);

  const [locations, setLocations] = useState([
    { label: 'Bangalore Jobs', to: '/?q=Bangalore' },
    { label: 'Hyderabad Jobs', to: '/?q=Hyderabad' },
    { label: 'Pune Jobs', to: '/?q=Pune' },
    { label: 'Mumbai Jobs', to: '/?q=Mumbai' },
    { label: 'Delhi Jobs', to: '/?q=Delhi' },
    { label: 'Chennai Jobs', to: '/?q=Chennai' },
    { label: 'Remote Jobs', to: '/?q=Remote' }
  ]);

  useEffect(() => {
    let isMounted = true;
    
    api.get('/jobs?limit=100')
      .then(res => {
        if (!isMounted) return;
        const jobsArray = res.data?.data || res.data || [];
        if (!Array.isArray(jobsArray) || jobsArray.length === 0) return;

        // 1. Process Categories dynamically
        const activeTypes = Array.from(new Set(jobsArray.map(j => j.type).filter(Boolean)));
        const catList = activeTypes.map(type => ({
          label: `${type} Jobs`,
          to: `/?type=${encodeURIComponent(type)}`
        }));
        
        const popularTerms = [
          { term: 'Software', label: 'Software Developer Jobs' },
          { term: 'Developer', label: 'Web Developer Jobs' },
          { term: 'QA', label: 'Quality Assurance Jobs' },
          { term: 'Writer', label: 'Content Writing Jobs' },
          { term: 'Data', label: 'Data Analyst Jobs' },
          { term: 'Support', label: 'Customer Support Jobs' },
          { term: 'Design', label: 'Graphic Design Jobs' },
          { term: 'Marketing', label: 'Marketing Jobs' }
        ];

        popularTerms.forEach(item => {
          const hasMatch = jobsArray.some(j => 
            (j.title && j.title.toLowerCase().includes(item.term.toLowerCase())) ||
            (j.jobDescription && j.jobDescription.toLowerCase().includes(item.term.toLowerCase()))
          );
          if (hasMatch) {
            if (!catList.some(c => c.label === item.label)) {
              catList.push({
                label: item.label,
                to: `/?q=${encodeURIComponent(item.term)}`
              });
            }
          }
        });
        if (catList.length > 0) {
          setCategories(catList.slice(0, 10));
        }

        // 2. Process Titles dynamically - point directly to actual job detail routes
        // Truncate long titles to first 5 words to keep the list clean
        const truncateTitle = (title) => {
          if (!title) return '';
          const words = title.trim().split(/\s+/);
          if (words.length <= 5) return title;
          return words.slice(0, 5).join(' ') + '…';
        };

        const titleList = jobsArray.slice(0, 10).map(job => ({
          label: truncateTitle(job.title),
          to: `/${job.slug}`
        }));
        if (titleList.length > 0) {
          setTitles(titleList);
        }

        // 3. Process Locations dynamically
        const rawLocations = jobsArray.map(j => j.location).filter(Boolean);
        const locSet = new Set();
        rawLocations.forEach(loc => {
          const cities = ['Bangalore', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Chennai', 'Noida', 'Gurgaon', 'Kolkata', 'Remote'];
          cities.forEach(city => {
            if (loc.toLowerCase().includes(city.toLowerCase())) {
              locSet.add(city === 'Bengaluru' ? 'Bangalore' : city);
            }
          });
        });
        
        if (locSet.size < 5) {
          rawLocations.forEach(loc => {
            const clean = loc.split('(')[0].split(',')[0].trim();
            if (clean) locSet.add(clean);
          });
        }

        const locList = Array.from(locSet).map(loc => ({
          label: `${loc} Jobs`,
          to: `/?q=${encodeURIComponent(loc)}`
        }));
        if (locList.length > 0) {
          setLocations(locList.slice(0, 10));
        }
      })
      .catch(err => {
        console.error("Failed to fetch popular jobs:", err);
      });
      
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pre-footer-sections">
      
      {/* SECTION 2: Graduating Section */}
      <section className="pf-graduating-section">
        <div className="pf-container">
          <div className="pf-grad-inner">
            <div className="pf-grad-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                alt="Students graduating" 
                className="pf-grad-image"
                width="800"
                height="533"
                loading="lazy"
              />
            </div>
            <div className="pf-grad-content">
              <h2 className="pf-grad-title">Just graduating? We can help.</h2>
              <div className="pf-grad-buttons">
                <Link to="/student-career-center" className="pf-btn-outline">
                  Visit the Student Career Center
                  <span className="pf-btn-icon">→</span>
                </Link>
                <Link to="/salaries" className="pf-btn-outline">
                  Search salaries
                  <span className="pf-btn-icon">→</span>
                </Link>
                <Link to="/?type=Full-Time" className="pf-btn-outline">
                  Search entry-level jobs
                  <span className="pf-btn-icon">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Browse Popular Jobs */}
      <section className="pf-popular-section">
        <div className="pf-container">
          <h2 className="pf-popular-title">Browse Popular & Trending Jobs</h2>
          
          <div className={`pf-popular-grid ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {/* Column 1: Categories */}
            <div className="pf-pop-col">
              <h3>Jobs by Categories</h3>
              <ul>
                {categories.map((item, idx) => (
                  <li key={`cat-${idx}`}><Link to={item.to}>{item.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Column 2: Titles */}
            <div className="pf-pop-col">
              <h3>Jobs by Titles</h3>
              <ul>
                {titles.map((item, idx) => (
                  <li key={`title-${idx}`}><Link to={item.to}>{item.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Column 3: Locations */}
            <div className="pf-pop-col">
              <h3>Jobs by Locations</h3>
              <ul>
                {locations.map((item, idx) => (
                  <li key={`loc-${idx}`}><Link to={item.to}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pf-popular-action">
            <button
              className={`pf-btn-collapse ${isExpanded ? 'expanded' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {/* Eye icon */}
              {isExpanded ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
              <span>{isExpanded ? 'See Fewer Jobs' : 'See All Jobs'}</span>
              {/* Animated chevron */}
              <svg
                className={`pf-chevron ${isExpanded ? 'rotated' : ''}`}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
