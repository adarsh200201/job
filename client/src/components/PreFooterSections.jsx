import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PreFooterSections() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="pre-footer-sections">
      
      {/* SECTION 1: App Banner */}
      <section className="pf-app-banner">
        <div className="pf-app-banner-split">
          <div className="pf-app-content-side">
            <div className="pf-app-content">
              <h2 className="pf-app-title">Get the app.</h2>
              <p className="pf-app-subtitle">Get the power of NextJobPost on-the-go, featuring one-touch apply.</p>
              <div className="pf-app-buttons">
                <a href="#" className="pf-app-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" /></a>
                <a href="#" className="pf-app-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" /></a>
              </div>
            </div>
          </div>
          <div className="pf-app-image-side">
            <img 
              src="/app_mockup.png" 
              alt="NextJobPost App on Phone" 
              className="pf-app-image-cover"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: Graduating Section */}
      <section className="pf-graduating-section">
        <div className="pf-container">
          <div className="pf-grad-inner">
            <div className="pf-grad-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                alt="Students graduating" 
                className="pf-grad-image"
              />
            </div>
            <div className="pf-grad-content">
              <h2 className="pf-grad-title">Just graduating? We can help.</h2>
              <div className="pf-grad-buttons">
                <Link to="/?type=Internship" className="pf-btn-outline">
                  Visit the Student Career Center
                  <span className="pf-btn-icon">→</span>
                </Link>
                <Link to="/blog" className="pf-btn-outline">
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
                <li><Link to="/?q=Accounting">Accounting Jobs</Link></li>
                <li><Link to="/?q=Childcare">Childcare Jobs</Link></li>
                <li><Link to="/?q=Clerical">Clerical Jobs</Link></li>
                <li><Link to="/?q=Communication">Communication Jobs</Link></li>
                <li><Link to="/?q=Construction">Construction Jobs</Link></li>
                <li><Link to="/?q=Customer+Service">Customer Service Jobs</Link></li>
                <li><Link to="/?q=Education">Education Jobs</Link></li>
                <li><Link to="/?q=Engineering">Engineering Jobs</Link></li>
                <li><Link to="/?q=Healthcare">Healthcare Jobs</Link></li>
                <li><Link to="/?q=Human+Resources">Human Resources Jobs</Link></li>
              </ul>
            </div>

            {/* Column 2: Titles */}
            <div className="pf-pop-col">
              <h3>Jobs by Titles</h3>
              <ul>
                <li><Link to="/?q=Administrative+Assistant">Administrative Assistant Jobs</Link></li>
                <li><Link to="/?q=Delivery+Driver">Delivery Driver Jobs</Link></li>
                <li><Link to="/?q=Electrician">Electrician Jobs</Link></li>
                <li><Link to="/?q=LPN">LPN Jobs</Link></li>
                <li><Link to="/?q=Medical+Assistant">Medical Assistant Jobs</Link></li>
                <li><Link to="/?q=Nurse+Practitioner">Nurse Practitioner Jobs</Link></li>
                <li><Link to="/?q=Online+Teaching">Online Teaching Jobs</Link></li>
                <li><Link to="/?q=Project+Manager">Project Manager Jobs</Link></li>
                <li><Link to="/?q=Security+Guard">Security Guard Jobs</Link></li>
                <li><Link to="/?q=Software+Developer">Software Developer Jobs</Link></li>
              </ul>
            </div>

            {/* Column 3: Locations */}
            <div className="pf-pop-col">
              <h3>Jobs by Locations</h3>
              <ul>
                <li><Link to="/?q=Atlanta">Atlanta, GA Jobs</Link></li>
                <li><Link to="/?q=Austin">Austin, TX Jobs</Link></li>
                <li><Link to="/?q=Chicago">Chicago, IL Jobs</Link></li>
                <li><Link to="/?q=Dallas">Dallas, TX Jobs</Link></li>
                <li><Link to="/?q=Denver">Denver, CO Jobs</Link></li>
                <li><Link to="/?q=Houston">Houston, TX Jobs</Link></li>
                <li><Link to="/?q=Los+Angeles">Los Angeles, CA Jobs</Link></li>
                <li><Link to="/?q=New+York">NYC, NY Jobs</Link></li>
                <li><Link to="/?q=San+Diego">San Diego, CA Jobs</Link></li>
                <li><Link to="/?q=Seattle">Seattle, WA Jobs</Link></li>
              </ul>
            </div>
          </div>

          <div className="pf-popular-action">
            <button 
              className="pf-btn-collapse"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'See Fewer NextJobPost Jobs ^' : 'See More NextJobPost Jobs ˅'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
