import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { triggerAd, openDualTabs } from '../utils/adUtils.js';

export default function Footer() {
  const [muted, setMuted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Initial check of permission state on mount
    if ('Notification' in window) {
      setMuted(Notification.permission !== 'granted');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMute = async () => {
    if (!('Notification' in window)) {
      setToastMessage("Notifications not supported by this browser.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }

    if (Notification.permission === 'granted') {
      const nextMuted = !muted;
      setMuted(nextMuted);
      setToastMessage(nextMuted ? "Notifications muted locally." : "Notifications enabled!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);

      if (!nextMuted) {
        new Notification("NextJobPost", {
          body: "🔔 You will now receive instant job alert notifications!",
          icon: "/logo.png"
        });
      }
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setMuted(false);
        setToastMessage("Notifications enabled!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);

        new Notification("NextJobPost", {
          body: "🎉 Thank you for subscribing to NextJobPost alerts!",
          icon: "/logo.png"
        });
      } else {
        setMuted(true);
        setToastMessage("Notification permission denied.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      }
    } else {
      setToastMessage("Notifications blocked. Please enable permission in site settings.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // State jobs divided exactly as shown in the mockup:
  const stateCol1 = [
    { label: 'A&N Islands', to: '/andaman-nicobar-jobs' },
    { label: 'Assam', to: '/assam-jobs' },
    { label: 'Chhattisgarh', to: '/chhattisgarh-jobs' },
    { label: 'Goa', to: '/goa-jobs' },
    { label: 'HP', to: '/himachal-pradesh-jobs' },
    { label: 'Karnataka', to: '/karnataka-jobs' },
    { label: 'Lakshadweep', to: '/lakshadweep-jobs' },
    { label: 'Manipur', to: '/manipur-jobs' },
    { label: 'Nagaland', to: '/nagaland-jobs' },
    { label: 'Punjab', to: '/punjab-jobs' },
    { label: 'Tamil Nadu', to: '/tamil-nadu-jobs' },
    { label: 'UP', to: '/uttar-pradesh-jobs' }
  ];

  const stateCol2 = [
    { label: 'Andhra Pradesh', to: '/andhra-pradesh-jobs' },
    { label: 'Bihar', to: '/bihar-jobs' },
    { label: 'Delhi', to: '/delhi-jobs' },
    { label: 'Gujarat', to: '/gujarat-jobs' },
    { label: 'J&K', to: '/jammu-kashmir-jobs' },
    { label: 'Kerala', to: '/kerala-jobs' },
    { label: 'MP', to: '/madhya-pradesh-jobs' },
    { label: 'Meghalaya', to: '/meghalaya-jobs' },
    { label: 'Odisha', to: '/odisha-jobs' },
    { label: 'Rajasthan', to: '/rajasthan-jobs' },
    { label: 'Telangana', to: '/telangana-jobs' },
    { label: 'Uttarakhand', to: '/uttarakhand-jobs' }
  ];

  const stateCol3 = [
    { label: 'Arunachal', to: '/arunachal-pradesh-jobs' },
    { label: 'Chandigarh', to: '/chandigarh-jobs' },
    { label: 'DNHDD', to: '/dnh-dd-jobs' },
    { label: 'Haryana', to: '/haryana-jobs' },
    { label: 'Jharkhand', to: '/jharkhand-jobs' },
    { label: 'Ladakh', to: '/ladakh-jobs' },
    { label: 'Maharashtra', to: '/maharashtra-jobs' },
    { label: 'Mizoram', to: '/mizoram-jobs' },
    { label: 'Puducherry', to: '/puducherry-jobs' },
    { label: 'Sikkim', to: '/sikkim-jobs' },
    { label: 'Tripura', to: '/tripura-jobs' },
    { label: 'West Bengal', to: '/west-bengal-jobs' }
  ];

  const [bellPos, setBellPos] = useState({ x: 0, y: 0 });
  const [bellDragging, setBellDragging] = useState(false);
  const bellDragStart = React.useRef({ x: 0, y: 0 });
  const bellBasePos = React.useRef({ x: 0, y: 0 });
  const bellHasMoved = React.useRef(false);

  const handleBellPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    bellDragStart.current = { x: e.clientX, y: e.clientY };
    bellBasePos.current = { ...bellPos };
    setBellDragging(true);
    bellHasMoved.current = false;
  };

  const handleBellPointerMove = (e) => {
    if (!bellDragging) return;
    const dx = e.clientX - bellDragStart.current.x;
    const dy = e.clientY - bellDragStart.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      bellHasMoved.current = true;
    }
    setBellPos({
      x: bellBasePos.current.x + dx,
      y: bellBasePos.current.y + dy
    });
  };

  const handleBellPointerUp = (e) => {
    if (!bellDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setBellDragging(false);
  };

  const handleBellClick = (e) => {
    if (bellHasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handleToggleMute();
  };

  const [scrollTopPos, setScrollTopPos] = useState({ x: 0, y: 0 });
  const [scrollTopDragging, setScrollTopDragging] = useState(false);
  const scrollTopDragStart = React.useRef({ x: 0, y: 0 });
  const scrollTopBasePos = React.useRef({ x: 0, y: 0 });
  const scrollTopHasMoved = React.useRef(false);

  const handleScrollTopPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    scrollTopDragStart.current = { x: e.clientX, y: e.clientY };
    scrollTopBasePos.current = { ...scrollTopPos };
    setScrollTopDragging(true);
    scrollTopHasMoved.current = false;
  };

  const handleScrollTopPointerMove = (e) => {
    if (!scrollTopDragging) return;
    const dx = e.clientX - scrollTopDragStart.current.x;
    const dy = e.clientY - scrollTopDragStart.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      scrollTopHasMoved.current = true;
    }
    setScrollTopPos({
      x: scrollTopBasePos.current.x + dx,
      y: scrollTopBasePos.current.y + dy
    });
  };

  const handleScrollTopPointerUp = (e) => {
    if (!scrollTopDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setScrollTopDragging(false);
  };

  const handleScrollTopClick = (e) => {
    if (scrollTopHasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handleScrollToTop();
  };

  return (
    <footer className="site-footer">
      {/* Toast Alert */}
      {showToast && (
        <div className="footer-toast animate-fade-in">
          <span>{muted ? '🔕' : '🔔'}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Buttons */}
      <button 
        onPointerDown={handleBellPointerDown}
        onPointerMove={handleBellPointerMove}
        onPointerUp={handleBellPointerUp}
        onClick={handleBellClick}
        className={`floating-btn floating-left ${muted ? 'muted' : ''}`}
        aria-label="Toggle notifications"
        style={{
          transform: `translate(${bellPos.x}px, ${bellPos.y}px)`,
          touchAction: 'none',
          cursor: bellDragging ? 'grabbing' : 'grab'
        }}
      >
        {muted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
            <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8v7a4 4 0 0 0-4 4h18a4 4 0 0 0-1.84-3.37" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        )}
      </button>

      {showScrollBtn && (
        <button 
          onPointerDown={handleScrollTopPointerDown}
          onPointerMove={handleScrollTopPointerMove}
          onPointerUp={handleScrollTopPointerUp}
          onClick={handleScrollTopClick}
          className="floating-btn floating-right animate-fade-in"
          aria-label="Scroll to top"
          style={{
            transform: `translate(${scrollTopPos.x}px, ${scrollTopPos.y}px)`,
            touchAction: 'none',
            cursor: scrollTopDragging ? 'grabbing' : 'grab'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      <div className="footer-top">
        <div className="container footer-grid">
          
          {/* Column 1: About NextJobPost */}
          <div className="footer-col footer-col-about">
            <h4 className="footer-heading">About NextJobPost</h4>
            <p className="footer-about-text">
              NextJobPost is India's trusted government job notification platform. Latest recruitment alerts, results, admit cards, and answer keys for UPSC, SSC, Railway, Banking, Defence, PSU and all 36 States & UTs.
            </p>
            <p className="footer-contact">
              <strong>Contact:</strong> <a href="mailto:nextjobpost@gmail.com">nextjobpost@gmail.com</a>
            </p>
            <div className="footer-social-buttons mt-3">
              <a href="https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ" onClick={(e) => openDualTabs("https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ", e)} target="_blank" rel="noopener noreferrer" className="footer-social-btn whatsapp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                WhatsApp
              </a>
              <a href="https://t.me/nextjobpost" onClick={(e) => openDualTabs("https://t.me/nextjobpost", e)} target="_blank" rel="noopener noreferrer" className="footer-social-btn telegram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Column 2: Central Govt Jobs */}
          <div className="footer-col footer-col-central">
            <h4 className="footer-heading">Central Govt Jobs</h4>
            <div className="footer-subcols-2">
              <ul className="footer-links">
                <li><Link to="/upsc-jobs">UPSC Jobs</Link></li>
                <li><Link to="/railway-jobs">Railway Jobs</Link></li>
                <li><Link to="/defence-jobs">Defence Jobs</Link></li>
                <li><Link to="/teaching-jobs">Teaching Jobs</Link></li>
              </ul>
              <ul className="footer-links">
                <li><Link to="/ssc-jobs">SSC Jobs</Link></li>
                <li><Link to="/banking-jobs">Banking Jobs</Link></li>
                <li><Link to="/?q=Police">Police Jobs</Link></li>
                <li><Link to="/psu-jobs">PSU Jobs</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: State & UT Jobs */}
          <div className="footer-col footer-col-states">
            <h4 className="footer-heading">State & UT Jobs</h4>
            <div className="footer-subcols-3">
              <ul className="footer-links">
                {stateCol1.map((item, idx) => (
                  <li key={`st1-${idx}`}><Link to={item.to}>{item.label}</Link></li>
                ))}
              </ul>
              <ul className="footer-links">
                {stateCol2.map((item, idx) => (
                  <li key={`st2-${idx}`}><Link to={item.to}>{item.label}</Link></li>
                ))}
              </ul>
              <ul className="footer-links">
                {stateCol3.map((item, idx) => (
                  <li key={`st3-${idx}`}><Link to={item.to}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: By Qualification */}
          <div className="footer-col footer-col-qual">
            <h4 className="footer-heading">By Qualification</h4>
            <div className="footer-subcols-2">
              <ul className="footer-links">
                <li><Link to="/10th-pass-jobs">10th Pass</Link></li>
                <li><Link to="/graduate-jobs">Graduate</Link></li>
                <li><Link to="/engineering-jobs">Engineering</Link></li>
                <li><Link to="/diploma-jobs">Diploma</Link></li>
                <li><Link to="/teaching-jobs">Teaching</Link></li>
                <li><Link to="/commerce-jobs">Commerce</Link></li>
              </ul>
              <ul className="footer-links">
                <li><Link to="/12th-pass-jobs">12th Pass</Link></li>
                <li><Link to="/post-graduate-jobs">Post Graduate</Link></li>
                <li><Link to="/iti-jobs">ITI Jobs</Link></li>
                <li><Link to="/medical-jobs">Medical</Link></li>
                <li><Link to="/computer-it-jobs">Computer/IT</Link></li>
                <li><Link to="/law-jobs">Law Jobs</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 5: Useful Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-heading">Useful Links</h4>
            <div className="footer-subcols-2">
              <ul className="footer-links">
                <li><Link to="/govt-jobs">All Govt Jobs</Link></li>
                <li><Link to="/govt-jobs-calendar">Govt Jobs Calendar</Link></li>
                <li><Link to="/ssc-calendar">SSC Calendar 2026</Link></li>
                <li><Link to="/exam-dates">Sarkari Exam Dates</Link></li>
                <li><Link to="/admit-cards">Admit Cards</Link></li>
              </ul>
              <ul className="footer-links">
                <li><Link to="/results">Exam Results</Link></li>
                <li><Link to="/answer-keys">Answer Keys</Link></li>
                <li><Link to="/current-affairs">Current Affairs GK</Link></li>
                <li><Link to="/preparation">Preparation Hub</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p className="copyright-text">
            © {new Date().getFullYear()} NextJobPost.in
          </p>
          <div className="footer-bottom-links">
            <Link to="/about">About us</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/contact">Contact Us</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/disclaimer">Disclaimer</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/terms">Terms & Conditions</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/editorial-policy">Editorial Policy</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/dmca-policy">DMCA Policy</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/fact-checking-policy">Fact Checking</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/correction-policy">Correction Policy</Link>
            <span className="footer-link-divider">|</span>
            <Link to="/sourcing-policy">Sourcing Process</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
