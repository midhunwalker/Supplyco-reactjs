import api from "./client";

/**
 * Shop API methods
 * All shop-related endpoints (browsing, management, products)
 */

// ============ Public Shop Endpoints ============

/**
 * Get all shops (public)
 */
export const getAllShops = (params) => api.get("/shops", { params });

/**
 * Get shop by ID (public)
 */
export const getShopById = (shopId) => api.get(`/shops/${shopId}`);

/**
 * Get shop products (public)
 */
export const getShopProducts = (shopId, params) =>
  api.get(`/shops/${shopId}/products`, { params });

/**
 * Search shops (public)
 */
export const searchShops = (searchTerm) =>
  api.get("/shops/search", { params: { q: searchTerm } });

// ============ Shop Owner Endpoints (Authenticated) ============

/**
 * Get shop owner dashboard data
 */
export const getShopDashboard = (licenseId) =>
  api.get(`/shops/${licenseId}/dashboard`);

/**
 * Get shop owner's products
 */
export const getMyProducts = (licenseId) =>
  api.get(`/shops/${licenseId}/products`);

/**
 * Add product to shop
 */
export const addProduct = (licenseId, productData) =>
  api.post(`/shops/${licenseId}/products`, productData);

/**
 * Update product
 */
export const updateProduct = (productId, productData) =>
  api.put(`/products/${productId}`, productData);

/**
 * Delete product
 */
export const deleteProduct = (productId) =>
  api.delete(`/products/${productId}`);

/**
 * Get shop orders
 */
export const getShopOrders = (licenseId, params) =>
  api.get(`/shops/${licenseId}/orders`, { params });

/**
 * Update order status
 */
export const updateOrderStatus = (orderId, status) =>
  api.patch(`/orders/${orderId}/status`, { status });

/**
 * Update shop profile
 */
export const updateShopProfile = (licenseId, profileData) =>
  api.put(`/shops/${licenseId}/profile`, profileData);
