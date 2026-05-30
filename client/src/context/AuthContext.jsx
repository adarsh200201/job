import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { identifyUser, resetUser } from '../utils/analytics.js';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        identifyUser(decoded.id || decoded.sub || username, {
          $name: username,
          $email: decoded.email,
          role: decoded.role || (isAdmin ? 'admin' : 'user')
        });
      } else {
        identifyUser(username, {
          $name: username,
          role: isAdmin ? 'admin' : 'user'
        });
      }
    } else {
      resetUser();
    }
  }, [token, username, isAdmin]);

  const login = (t, u, adminStatus = false) => {
    setToken(t);
    setUsername(u);
    setIsAdmin(adminStatus);
    localStorage.setItem('token', t);
    localStorage.setItem('username', u);
    localStorage.setItem('isAdmin', String(adminStatus));
  };

  const logout = () => {
    setToken('');
    setUsername('');
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
  };

  const value = useMemo(() => ({ token, username, isAdmin, login, logout }), [token, username, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
