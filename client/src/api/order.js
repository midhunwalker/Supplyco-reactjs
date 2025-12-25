import api from "./client";

/**
 * Order API methods
 * All order-related endpoints (authenticated users only)
 */

/**
 * Create new order (checkout)
 */
export const createOrder = (orderData) => api.post("/orders", orderData);

/**
 * Get user's orders
 */
export const getUserOrders = (params) => api.get("/orders", { params });

/**
 * Get order by ID
 */
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

/**
 * Cancel order
 */
export const cancelOrder = (orderId) =>
  api.patch(`/orders/${orderId}/cancel`);
