import axios from 'axios';

const envBaseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

const baseURL = envBaseURL || (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api');

if (!envBaseURL && !import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[api] Missing VITE_API_BASE_URL (or VITE_API_URL). Falling back to /api. ' +
      'If you host the backend separately (e.g., Render), set the env var in Netlify and redeploy.'
  );
}

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
