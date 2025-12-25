import api, { setAuthToken } from "./client";

/**
 * Authentication API methods
 * All auth-related endpoints with automatic token management
 */

/**
 * Validate current session token
 */
export const validateToken = () => api.get("/auth/validate");

/**
 * User login
 */
export const loginUser = (credentials) =>
  api.post("/auth/user/login", credentials);

/**
 * Shop owner login
 */
export const loginShop = (credentials) =>
  api.post("/auth/shop/login", credentials);

/**
 * User registration
 */
export const registerUser = (userData) =>
  api.post("/auth/user/register", userData);

/**
 * Shop owner registration
 */
export const registerShop = (shopData) =>
  api.post("/auth/shop-owner/register", shopData);

/**
 * Logout (client-side token cleanup)
 */
export const logout = () => {
  setAuthToken(null);
  // Clear any other stored user data
  localStorage.removeItem("supplyco_user");
};

/**
 * Generic login handler (detects user type)
 * @deprecated Use loginUser or loginShop directly for better type safety
 */
export const login = async (credentials, isShop = false) => {
  const endpoint = isShop ? "/auth/shop/login" : "/auth/user/login";
  return api.post(endpoint, credentials);
};

/**
 * Generic register handler (detects user type)
 * @deprecated Use registerUser or registerShop directly for better type safety
 */
export const register = async (userData, isShop = false) => {
  const endpoint = isShop ? "/auth/shop-owner/register" : "/auth/user/register";
  return api.post(endpoint, userData);
};
