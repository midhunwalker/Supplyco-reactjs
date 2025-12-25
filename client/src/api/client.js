import axios from "axios";

/**
 * API base URL
 */
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? "http://localhost:5000/api";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

/**
 * Token helpers
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("supplyco_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("supplyco_token");
    delete api.defaults.headers.common.Authorization;
  }
};

/**
 * Attach token automatically
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("supplyco_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Global error handler
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please try again.",
        status: 0,
      });
    }

    const { status, data } = error.response;

    if (status === 401) {
      setAuthToken(null);
      window.location.replace("/login");
    }

    return Promise.reject({
      message: data?.error || data?.message || "Request failed",
      status,
      data,
    });
  }
);

export default api;
