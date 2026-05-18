import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className="auth-page-container">
      {/* Header matching Monster/CareerBuilder style */}
      <div className="auth-header-bar">
        <div className="auth-header-inner">
          <Link to="/" className="auth-logo">
            <span className="auth-brand-next">Next</span>
            <span className="auth-brand-job">Job</span>
            <span className="auth-brand-post">Post</span>
          </Link>
          <div className="auth-header-divider">|</div>
          <div className="auth-header-subtitle">Join the Network</div>
        </div>
      </div>

      <div className="auth-card">
        {/* Top switch link */}
        <div className="auth-switch-header">
          <div className="auth-switch-box">
            Have an account? <Link to="/login" className="auth-switch-link">Log in</Link>
          </div>
        </div>

        <div className="auth-split-layout">
          {/* Left Column: Create Account & Social */}
          <div className="auth-left-col">
            <h1 className="auth-title">Create An Account</h1>
            
            <ul className="auth-benefits-list">
              <li><span className="bullet-dot">•</span> Easily see skills match</li>
              <li><span className="bullet-dot">•</span> Receive jobs that match your interests</li>
              <li><span className="bullet-dot">•</span> Quickly apply to thousands of jobs</li>
              <li><span className="bullet-dot">•</span> Get a FREE professional resume review</li>
            </ul>

            <div className="auth-social-buttons">
              <button className="btn-social btn-google">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" className="social-icon">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.084,5.571l6.19,5.238C43.496,35.341,44,29.743,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Continue with Google
              </button>
              

            </div>
          </div>

          {/* Right Column: Email Sign Up */}
          <div className="auth-right-col">
            <h2 className="auth-subtitle">Or Sign Up With Email</h2>
            
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter email address" 
                  className="auth-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="Enter password" 
                  className="auth-input"
                />
              </div>

              <button type="submit" className="btn-auth-submit">
                Create Account
              </button>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <div className="auth-footer-text">
          <p>
            By continuing you are agreeing to our <Link to="/terms">Terms of Use</Link> and <Link to="/disclaimer">Privacy Policy</Link>. By continuing, you consent to our sending you job recommendations based on jobs you apply to and preferences you share, career advice and content, and updates about our services and features. You may unsubscribe at any time by clicking the relevant link at the bottom of the emails we send you or by updating your email options in your communication preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
