import axios from 'axios';

// Normalize URL to ensure it always correctly ends in '/api' (handles both 'http://localhost:4000' and 'http://localhost:4000/api')
const formatApiUrl = (url) => {
  if (!url) return 'http://localhost:4000/api';
  const trimmed = url.trim().replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (envUrl) {
    return formatApiUrl(envUrl);
  }
  return 'http://localhost:4000/api';
};

const BACKEND_URL = getBaseUrl();

if (typeof window !== 'undefined') {
  console.log(`📡 [RealEstate API Engine]: Routing requests to: ${BACKEND_URL}`);
}


const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Automatically inject JWT token from localStorage into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Attach secondary headers for maximum compatibility with server middleware
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth failures gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Server Authentication Notice:', error.response.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
