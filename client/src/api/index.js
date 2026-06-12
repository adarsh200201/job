import axios from 'axios';

const RENDER_BACKEND = 'https://nextjobpost-backend.onrender.com/api';
const envBaseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const baseURL = envBaseURL || RENDER_BACKEND;

const api = axios.create({ baseURL, withCredentials: true });

// ── In-memory admin access token (never stored in localStorage) ───────────────
let _adminAccessToken = '';
export function setAdminAccessToken(t) { _adminAccessToken = t; }
export function getAdminAccessToken() { return _adminAccessToken; }
export function clearAdminAccessToken() { _adminAccessToken = ''; }

// ── In-memory CSRF token (populated from server, stored in memory not cookie) ─
let _csrfToken = '';
export function setCsrfToken(t) { _csrfToken = t; }
export function getCsrfToken() {
  // Prefer in-memory; fall back to cookie
  if (_csrfToken) return _csrfToken;
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

// ── Seed the CSRF token from the server ───────────────────────────────────────
let _csrfSeeded = false;
export async function seedCsrfToken() {
  if (_csrfSeeded) return;
  try {
    const { data } = await api.get('/control/csrf-token');
    if (data?.csrfToken) {
      setCsrfToken(data.csrfToken);
    }
    _csrfSeeded = true;
  } catch {
    // silently ignore — CSRF enforcement is relaxed in dev
  }
}

// ── REQUEST interceptor — attach tokens ───────────────────────────────────────
api.interceptors.request.use((config) => {
  // Regular user token from localStorage
  const userToken = localStorage.getItem('token');
  if (userToken && !_adminAccessToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  // Admin in-memory access token takes priority
  if (_adminAccessToken) {
    config.headers.Authorization = `Bearer ${_adminAccessToken}`;
  }

  // CSRF header for mutating requests
  const method = (config.method || '').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) config.headers['X-CSRF-Token'] = csrf;
  }

  return config;
});

// ── Track if a refresh is already in progress ─────────────────────────────────
let _isRefreshing = false;
let _refreshQueue = [];

function processRefreshQueue(err, token) {
  _refreshQueue.forEach(({ resolve, reject }) => {
    if (err) reject(err); else resolve(token);
  });
  _refreshQueue = [];
}

// ── RESPONSE interceptor — silent token refresh on 401 TOKEN_EXPIRED ──────────
api.interceptors.response.use(
  (response) => {
    if (response.data) response.data = cleanJobs(response.data);
    return response;
  },
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // Only attempt refresh if: admin token expired, not already retried
    if (
      status === 401 &&
      code === 'TOKEN_EXPIRED' &&
      !original._retry &&
      _adminAccessToken
    ) {
      original._retry = true;

      if (_isRefreshing) {
        return new Promise((resolve, reject) => {
          _refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      _isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${baseURL}/control/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = data.token;
        setAdminAccessToken(newToken);
        processRefreshQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        processRefreshQueue(refreshErr, null);
        clearAdminAccessToken();
        return Promise.reject(refreshErr);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Title sanitizer for job data ───────────────────────────────────────────────
function cleanJobTitle(title) {
  if (!title || typeof title !== 'string') return title;
  return title
    .replace(/^[\p{Extended_Pictographic}\s\u200d\uFE0F🚨🔔🔥🚀]+/gu, '')
    .replace(/[\p{Extended_Pictographic}\s\u200d\uFE0F🚨🔔🔥🚀]+$/gu, '')
    .trim();
}

function cleanJobs(data) {
  if (!data) return data;
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) data[i] = cleanJobs(data[i]);
  } else if (typeof data === 'object') {
    if (typeof data.title === 'string' &&
      (data.company !== undefined || data.location !== undefined ||
       data.salary !== undefined || data.isGovernment !== undefined ||
       data.postType !== undefined)) {
      data.title = cleanJobTitle(data.title);
    }
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = cleanJobs(data[key]);
      }
    }
  }
  return data;
}

export default api;
