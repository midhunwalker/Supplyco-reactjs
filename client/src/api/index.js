/**
 * Centralized API exports
 * Import all API methods from a single entry point
 * 
 * Usage:
 *   import { loginUser, getAllShops, getCart } from '../../api';
 *   // or
 *   import * as authAPI from '../../api/auth';
 */

// Re-export the base API client for direct use when needed
export { default as api, setAuthToken } from "./client";

// Re-export all API modules
export * as auth from "./auth";
export * as shop from "./shop";
export * as product from "./product";
export * as cart from "./cart";
export * as order from "./order";

// Convenience exports for most common operations
export {
  validateToken,
  loginUser,
  loginShop,
  registerUser,
  registerShop,
  logout
} from "./auth";

export {
  getAllShops,
  getShopById,
  getShopProducts,
  searchShops
} from "./shop";

export {
  getAllProducts,
  getProductById,
  searchProducts
} from "./product";

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} from "./cart";

export {
  createOrder,
  getUserOrders,
  getOrderById
} from "./order";
