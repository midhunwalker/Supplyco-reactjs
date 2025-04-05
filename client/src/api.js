import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor: attach auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supplyco_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response || {};
    if (status === 401) {
      // Clear token and redirect if unauthorized
      localStorage.removeItem('supplyco_token');
      window.location.href = '/login';
    }
    return Promise.reject({
      message: data?.error || 'Request failed',
      status: status || 500,
    });
  }
);

export default api;
