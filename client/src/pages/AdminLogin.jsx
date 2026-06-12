import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { seedCsrfToken } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [tempToken, setTempToken] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [csrfReady, setCsrfReady] = useState(false);

  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  // Seed CSRF token on mount — store from response body
  useEffect(() => {
    seedCsrfToken().then(() => setCsrfReady(true)).catch(() => setCsrfReady(true));
  }, []);


  // Load Cloudflare Turnstile widget
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const loadTurnstile = () => {
      if (window.turnstile && turnstileRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => setCaptchaToken(token),
          'expired-callback': () => setCaptchaToken(''),
          theme: 'light',
        });
      }
    };

    if (window.turnstile) {
      loadTurnstile();
    } else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = loadTurnstile;
      document.head.appendChild(script);
      return () => { try { document.head.removeChild(script); } catch {} };
    }
  }, []);

  // Reset turnstile on error
  const resetTurnstile = () => {
    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
      setCaptchaToken('');
    }
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { username, password };
      if (TURNSTILE_SITE_KEY) {
        if (!captchaToken) {
          setError('Please complete the CAPTCHA verification.');
          setLoading(false);
          return;
        }
        payload.captchaToken = captchaToken;
      }

      const { data } = await api.post('/control/login', payload);

      if (data.twoFactorRequired) {
        setTempToken(data.tempToken);
        setStep('otp');
      } else {
        adminLogin(data.token, data.username);
        navigate('/control-center');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials';
      setError(msg);
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/control/login/verify-otp', { otp, tempToken });
      adminLogin(data.token, data.username);
      navigate('/control-center');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.logo}>🛡️</div>
          <h1 style={S.title}>Control Center</h1>
          <p style={S.subtitle}>
            {step === 'login' ? 'Secure admin access' : '2FA Verification'}
          </p>
        </div>

        {error && (
          <div style={S.alert}>
            <span>⚠️</span> {error}
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={onLoginSubmit} style={S.form}>
            <div style={S.field}>
              <label style={S.label}>Email / Username</label>
              <input
                id="cc-username"
                type="email"
                style={S.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                placeholder="admin@example.com"
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input
                id="cc-password"
                type="password"
                style={S.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••••"
              />
            </div>

            {/* Cloudflare Turnstile */}
            {TURNSTILE_SITE_KEY && (
              <div style={S.turnstileWrap}>
                <div ref={turnstileRef} />
              </div>
            )}

            <button
              id="cc-login-btn"
              type="submit"
              style={{ ...S.btn, opacity: (loading || !csrfReady) ? 0.7 : 1 }}
              disabled={loading || !csrfReady}
            >
              {!csrfReady ? <><span style={S.spinner} /> Initializing…</> : loading ? (
                <span style={S.spinner} />
              ) : (
                <>🔐 Sign In</>
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={onOtpSubmit} style={S.form}>
            <div style={S.otpInfo}>
              <span style={{ fontSize: '2rem' }}>📱</span>
              <p>Enter the 6-digit code from your authenticator app</p>
            </div>
            <div style={S.field}>
              <label style={S.label}>One-Time Password (OTP)</label>
              <input
                id="cc-otp"
                style={{ ...S.input, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                inputMode="numeric"
                placeholder="000000"
                autoFocus
                required
              />
            </div>
            <button
              id="cc-otp-btn"
              type="submit"
              style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading || otp.length !== 6}
            >
              {loading ? <span style={S.spinner} /> : <>✅ Verify</>}
            </button>
            <button
              type="button"
              style={S.backBtn}
              onClick={() => { setStep('login'); setOtp(''); setError(''); }}
            >
              ← Back to Login
            </button>
          </form>
        )}

        <p style={S.secNotice}>
          🔒 This is a restricted area. Unauthorized access attempts are logged.
        </p>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    padding: '20px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logo: {
    fontSize: '2.5rem',
    marginBottom: '8px',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#111827',
    margin: '0 0 4px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '0.9rem',
    margin: 0,
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '0.88rem',
    marginBottom: '20px',
    fontWeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '11px 14px',
    fontSize: '0.95rem',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#f9fafb',
    color: '#111827',
  },
  turnstileWrap: {
    display: 'flex',
    justifyContent: 'center',
    margin: '4px 0',
  },
  btn: {
    padding: '13px',
    fontSize: '0.95rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    marginTop: '4px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#6d28d9',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: 600,
    textAlign: 'center',
    padding: '6px',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTop: '2.5px solid #fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  otpInfo: {
    textAlign: 'center',
    padding: '12px',
    background: '#f5f3ff',
    borderRadius: '10px',
    color: '#5b21b6',
    fontSize: '0.88rem',
    fontWeight: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  secNotice: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.78rem',
    marginTop: '20px',
    marginBottom: 0,
  },
};
