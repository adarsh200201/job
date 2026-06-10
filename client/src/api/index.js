import axios from 'axios';

const envBaseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

const baseURL = envBaseURL || (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api');

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    for (let i = 0; i < data.length; i++) {
      data[i] = cleanJobs(data[i]);
    }
  } else if (typeof data === 'object') {
    if (typeof data.title === 'string' && (data.company !== undefined || data.location !== undefined || data.salary !== undefined || data.isGovernment !== undefined || data.postType !== undefined)) {
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

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = cleanJobs(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
