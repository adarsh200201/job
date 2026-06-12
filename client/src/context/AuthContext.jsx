import React, { createContext, useContext, useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { identifyUser, resetUser } from '../utils/analytics.js';
import api, {
  setAdminAccessToken,
  getAdminAccessToken,
  clearAdminAccessToken,
  seedCsrfToken,
} from '../api/index.js';

const AuthContext = createContext(null);

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes
const REFRESH_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes (before 15-min expiry)

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  // Regular user state (token in localStorage)
  const [token, setToken]       = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isAdmin, setIsAdmin]   = useState(localStorage.getItem('isAdmin') === 'true');

  // Admin in-memory access token state
  const [adminReady, setAdminReady]       = useState(false);
  // true while we're attempting to restore the session from refresh-token cookie
  const [adminRestoring, setAdminRestoring] = useState(
    localStorage.getItem('isAdmin') === 'true' // only restore if we know it was admin
  );

  const inactivityTimer = useRef(null);
  const refreshTimer    = useRef(null);

  // ── Seed CSRF cookie on mount ──────────────────────────────────────────────
  useEffect(() => {
    seedCsrfToken();
  }, []);

  // ── On page refresh: restore admin session via refresh-token cookie ─────────
  useEffect(() => {
    const wasAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!wasAdmin) return; // not admin — nothing to restore

    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.post('/control/refresh-token');
        if (cancelled) return;
        if (data?.token) {
          setAdminAccessToken(data.token);
          setIsAdmin(true);
          setAdminReady(true);
          startRefreshCycleRef.current?.();
        } else {
          throw new Error('No token in refresh response');
        }
      } catch {
        // Refresh token expired or invalid — clear admin state
        if (!cancelled) {
          clearAdminAccessToken();
          setIsAdmin(false);
          setAdminReady(false);
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('username');
        }
      } finally {
        if (!cancelled) setAdminRestoring(false);
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only runs once on mount

  // ── Analytics identification ───────────────────────────────────────────────
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        identifyUser(decoded.id || decoded.sub || username, {
          $name: username, $email: decoded.email,
          role: decoded.role || (isAdmin ? 'admin' : 'user'),
        });
      } else {
        identifyUser(username, { $name: username, role: isAdmin ? 'admin' : 'user' });
      }
    } else if (!isAdmin) {
      resetUser();
    }
  }, [token, username, isAdmin]);

  // ── Inactivity auto-logout (admin only) ────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    if (!isAdmin) return;
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      console.warn('[Auth] Admin session timed out due to inactivity.');
      adminLogout();
    }, INACTIVITY_LIMIT_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || !adminReady) return;
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer, { passive: true }));
    resetInactivityTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
      clearTimeout(inactivityTimer.current);
    };
  }, [isAdmin, adminReady, resetInactivityTimer]);

  // ── Silent access-token refresh interval (admin only) ─────────────────────
  const startRefreshCycle = useCallback(() => {
    clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(async () => {
      if (!getAdminAccessToken()) return;
      try {
        const { data } = await api.post('/control/refresh-token');
        setAdminAccessToken(data.token);
      } catch {
        console.warn('[Auth] Refresh token failed. Logging out admin.');
        adminLogout();
      }
    }, REFRESH_INTERVAL_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep a ref so the mount-time restore effect can call it
  const startRefreshCycleRef = useRef(startRefreshCycle);
  useEffect(() => { startRefreshCycleRef.current = startRefreshCycle; }, [startRefreshCycle]);

  // ── Login (regular users) ──────────────────────────────────────────────────
  const login = useCallback((t, u, adminStatus = false) => {
    setToken(t);
    setUsername(u);
    setIsAdmin(adminStatus);
    localStorage.setItem('token', t);
    localStorage.setItem('username', u);
    localStorage.setItem('isAdmin', String(adminStatus));
  }, []);

  // ── Admin login — stores access token in-memory, not localStorage ──────────
  const adminLogin = useCallback((accessToken, u) => {
    setAdminAccessToken(accessToken);
    setUsername(u);
    setIsAdmin(true);
    setAdminReady(true);
    setAdminRestoring(false);
    localStorage.setItem('username', u);
    localStorage.setItem('isAdmin', 'true');
    startRefreshCycle();
  }, [startRefreshCycle]);

  // ── Admin logout ───────────────────────────────────────────────────────────
  const adminLogout = useCallback(async () => {
    try { await api.post('/control/logout'); } catch { /* ignore */ }
    clearAdminAccessToken();
    clearInterval(refreshTimer.current);
    clearTimeout(inactivityTimer.current);
    setToken('');
    setUsername('');
    setIsAdmin(false);
    setAdminReady(false);
    setAdminRestoring(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
  }, []);

  // ── Regular user logout ────────────────────────────────────────────────────
  const logout = useCallback(() => {
    if (isAdmin) {
      adminLogout();
    } else {
      setToken('');
      setUsername('');
      setIsAdmin(false);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('isAdmin');
    }
  }, [isAdmin, adminLogout]);

  const value = useMemo(() => ({
    token,
    username,
    isAdmin,
    adminReady,
    adminRestoring,
    login,
    adminLogin,
    logout,
    adminLogout,
  }), [token, username, isAdmin, adminReady, adminRestoring, login, adminLogin, logout, adminLogout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
