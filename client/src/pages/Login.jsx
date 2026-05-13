import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
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
          <div className="auth-header-subtitle">Welcome Back</div>
        </div>
      </div>

      <div className="auth-card">
        {/* Top switch link */}
        <div className="auth-switch-header">
          <div className="auth-switch-box">
            Don't have an account? <Link to="/signup" className="auth-switch-link">Sign up</Link>
          </div>
        </div>

        <div className="auth-split-layout">
          {/* Left Column: Log In & Social */}
          <div className="auth-left-col">
            <h1 className="auth-title">Log In</h1>
            
            <p className="auth-welcome-text">
              Log in to access your profile, saved jobs, and job recommendations.
            </p>

            <div className="auth-social-buttons">
              <button className="btn-social btn-google">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" className="social-icon">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.084,5.571l6.19,5.238C43.496,35.341,44,29.743,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Log in with Google
              </button>
              
              <button className="btn-social btn-apple">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20px" height="20px" fill="currentColor" className="social-icon">
                  <path d="M318.7 268.7c-.2-36.3 15.6-71.3 44-92.5-18.5-27.1-48.5-45.3-82.5-50.5-35.8-5.5-70.8 19.3-89.1 19.3-18.9 0-48.4-20.3-78.5-19.8-39.4.5-76.1 23.2-96.3 58.4-41.2 71.9-10.6 178 29.5 235.8 19.6 28.3 42.5 59.8 73.1 58.6 29.5-1.2 40.7-19 76.5-19s46.1 19 76.9 18.3c31.3-.5 51.5-28.5 70.8-56.9 22.4-32.8 31.6-64.6 32-66.3-.7-.3-61.9-23.7-62.4-94zm-60.6-165c15.6-19 25.9-45.3 22.9-71.6-22.6.9-45.9 15.2-61.1 33-13.6 15.6-25.5 42.5-22.2 68.2 24.9 1.9 46.8-11.2 60.4-29.6z"/>
                </svg>
                Log in with Apple
              </button>
            </div>
          </div>

          {/* Right Column: Email Log In */}
          <div className="auth-right-col">
            <h2 className="auth-subtitle">Or Log In With Email</h2>
            
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
                <div className="label-with-link">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" style={{ color: '#7c3aed', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot password?</Link>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="Enter password" 
                  className="auth-input"
                />
              </div>

              <button type="submit" className="btn-auth-submit">
                Log In
              </button>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <div className="auth-footer-text">
          <p>
            By continuing you are agreeing to our <Link to="/terms">Terms of Use</Link> and <Link to="/disclaimer">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
