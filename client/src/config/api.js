import axios from 'axios';

// Detect whether running in development (npm run dev) or production (Vercel build)
const getFallbackUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:4000/api';
  }
  // If in production on cloud without explicit VITE_BACKEND_URL set, default to relative '/api' or warning
  return 'http://localhost:4000/api';
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || getFallbackUrl();

// Diagnostic Safety Check: Warn immediately if a live Vercel cloud app attempts to contact local desktop loopback IP
if (import.meta.env.PROD && BACKEND_URL.includes('localhost') && window.location.hostname !== 'localhost') {
  console.error(
    '🚨 [Vercel Deployment Alert]: Your React app running on Vercel is attempting to contact http://localhost:4000! Because localhost only exists on your local laptop, Chrome CORS policies block this immediately. To resolve: Deploy your Express backend server to Render.com or Vercel, and paste the HTTPS backend server URL into VITE_BACKEND_URL in your Vercel Project Settings.'
  );
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
