import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container footer-grid">
          
          {/* Column 1: Language Dropdown */}
          <div className="footer-col footer-lang-col">
            <div className="lang-selector">
              <span className="lang-flag">🇮🇳</span>
              <select className="lang-select">
                <option value="en">India (English)</option>
              </select>
            </div>
            <div className="footer-extracted-note mt-3">
              <small className="text-muted">* We extracted this information from the job description.</small>
            </div>
          </div>

          {/* Column 2: Job Seekers */}
          <div className="footer-col">
            <h4 className="footer-heading">For Job Seekers</h4>
            <ul className="footer-links">
              <li><Link to="/">Browse Jobs</Link></li>
              <li><Link to="/blog">Salary Tools</Link></li>
              <li><Link to="/blog">Career Advice</Link></li>
              <li><Link to="/about">Free Resume Templates</Link></li>
              <li><Link to="/about">Free Resume Builder</Link></li>
              <li><Link to="/about">Company Profile</Link></li>
              <li><Link to="/?type=Internship">Student Career Center</Link></li>
              <li><Link to="/faq">Help</Link></li>
            </ul>
          </div>

          {/* Column 3: Employers */}
          <div className="footer-col">
            <h4 className="footer-heading">For Employers</h4>
            <ul className="footer-links">
              <li><Link to="/admin">Products</Link></li>
              <li><Link to="/admin">Solutions</Link></li>
              <li><Link to="/admin">Pricing</Link></li>
              <li><Link to="/admin">Resources</Link></li>
              <li><Link to="/faq">Help</Link></li>
            </ul>
          </div>

          {/* Column 4: Helpful Resources */}
          <div className="footer-col">
            <h4 className="footer-heading">Helpful Resources</h4>
            <ul className="footer-links">
              <li><Link to="/terms">Terms of Use</Link></li>
              <li><Link to="/disclaimer">Privacy Center - UPDATED!</Link></li>
              <li><Link to="/about">Security Center</Link></li>
              <li><Link to="/contact">Accessibility Center</Link></li>
              <li><Link to="/disclaimer">Do Not Sell My Personal Information</Link></li>
              <li><Link to="/disclaimer">AdChoices</Link></li>
              <li><Link to="/disclaimer">Your Privacy Choices <span className="privacy-icon">✔❌</span></Link></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-grid">
          
          {/* Col 1: Empty */}
          <div className="footer-col"></div>

          {/* Col 2: Social Icons & Copyright */}
          <div className="footer-col footer-social-wrap">
            <h5 className="footer-subheading">Find us on social media:</h5>
            <div className="footer-social-icons">
              <a href="#" className="social-icon fb"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" className="social-icon x"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg></a>
              <a href="#" className="social-icon ig"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a href="#" className="social-icon yt"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#2d0057"></polygon></svg></a>
              <a href="#" className="social-icon pt"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.633 0 12.017 0z"></path></svg></a>
              <a href="#" className="social-icon tk"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg></a>
            </div>
            <p className="copyright-text mt-5">
              © {new Date().getFullYear()} NextJobPost Ltd
            </p>
          </div>

          {/* Col 3: App Buttons */}
          <div className="footer-col footer-app-wrap">
            <h5 className="footer-subheading">Get the NextJobPost App</h5>
            <div className="footer-app-buttons">
              <a href="#" className="pf-app-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" style={{height: "36px"}}/></a>
              <a href="#" className="pf-app-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" style={{height: "36px"}}/></a>
            </div>
          </div>

          {/* Col 4: Empty */}
          <div className="footer-col"></div>

        </div>
      </div>
    </footer>
  );
}
