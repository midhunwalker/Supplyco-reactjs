import api from "./client";

/**
 * Cart API methods
 * All cart-related endpoints (authenticated users only)
 */

/**
 * Get user's cart
 */
export const getCart = () => api.get("/cart");

/**
 * Add item to cart
 */
export const addToCart = (productId, quantity = 1) =>
  api.post("/cart", { productId, quantity });

/**
 * Update cart item quantity
 */
export const updateCartItem = (productId, quantity) =>
  api.patch("/cart", { productId, quantity });

/**
 * Remove item from cart
 */
export const removeFromCart = (productId) =>
  api.delete(`/cart/${productId}`);

/**
 * Clear entire cart
 */
export const clearCart = () => api.delete("/cart");
