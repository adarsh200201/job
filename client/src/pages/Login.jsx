import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const envBaseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const baseURL = envBaseURL || (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api');

export default function Login() {
  const [params] = useSearchParams();
  const error = params.get('error');

  const handleGoogle = () => {
    const oauthUrl = baseURL.startsWith('http') 
      ? `${baseURL}/auth/google` 
      : `${window.location.origin}${baseURL}/auth/google`;
    window.location.href = oauthUrl;
  };

  return (
    <div className="auth-page-container">
      {/* Header */}
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
        {/* Error banner */}
        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Google sign-in failed. Please try again.
          </div>
        )}

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
              <button id="btn-login-google" className="btn-social btn-google" onClick={handleGoogle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" className="social-icon">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.084,5.571l6.19,5.238C43.496,35.341,44,29.743,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Log in with Google
              </button>
            </div>
          </div>

          {/* Right Column: Email Log In */}
          <div className="auth-right-col">
            <h2 className="auth-subtitle">Or Log In With Email</h2>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" placeholder="Enter email address" className="auth-input" />
              </div>

              <div className="form-group">
                <div className="label-with-link">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" style={{ color: '#7c3aed', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot password?</Link>
                </div>
                <input type="password" id="password" placeholder="Enter password" className="auth-input" />
              </div>

              <button type="submit" className="btn-auth-submit">Log In</button>
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
