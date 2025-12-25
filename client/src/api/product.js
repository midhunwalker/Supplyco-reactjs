import api from "./client";

/**
 * Product API methods
 * All product-related endpoints (browsing, search, details)
 */

/**
 * Get all products with optional filters
 */
export const getAllProducts = (params) => api.get("/products", { params });

/**
 * Get product by ID
 */
export const getProductById = (productId) => api.get(`/products/${productId}`);

/**
 * Search products
 */
export const searchProducts = (searchTerm, filters = {}) =>
  api.get("/products/search", {
    params: { q: searchTerm, ...filters }
  });

/**
 * Get products by category
 */
export const getProductsByCategory = (category, params) =>
  api.get(`/products/category/${category}`, { params });

/**
 * Get featured products
 */
export const getFeaturedProducts = (limit = 10) =>
  api.get("/products/featured", { params: { limit } });
