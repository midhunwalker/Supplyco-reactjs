# API Migration Guide

## Overview

This guide helps you migrate existing components from inconsistent API usage to the new structured API layer.

## Common Migration Patterns

### Pattern 1: Replace raw axios with API methods

**Before:**
```javascript
import axios from 'axios';

const fetchShops = async () => {
  const response = await axios.get('/api/shops');
  setShops(response.data);
};
```

**After:**
```javascript
import { getAllShops } from '../../api';

const fetchShops = async () => {
  const { data } = await getAllShops();
  setShops(data);
};
```

### Pattern 2: Replace direct api.get() with named methods

**Before:**
```javascript
import api from '../../api/client';

const response = await api.get(`/shops/${shopId}/products`);
```

**After:**
```javascript
import { getShopProducts } from '../../api';

const { data } = await getShopProducts(shopId);
```

### Pattern 3: Cart operations

**Before:**
```javascript
const { api } = useAuth();
await api.patch('/cart', { productId, quantity });
await api.delete(`/cart/${productId}`);
```

**After:**
```javascript
import { updateCartItem, removeFromCart } from '../../api';

await updateCartItem(productId, quantity);
await removeFromCart(productId);
```

## Component-Specific Migrations

### Dashboard.jsx & Shops.jsx

**Before:**
```javascript
import api from '../../api/client';

const response = await api.get('/shops', { signal });
setShops(response.data);
```

**After:**
```javascript
import { getAllShops } from '../../api';

const { data } = await getAllShops();
setShops(data);

// With AbortController
const controller = new AbortController();
const { data } = await getAllShops({ signal: controller.signal });
```

### ShopView.jsx

**Before:**
```javascript
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const shopRes = await axios.get(`${API_BASE_URL}/shops/${shopId}`);
const productsRes = await axios.get(`${API_BASE_URL}/shops/${shopId}/products`);
```

**After:**
```javascript
import { getShopById, getShopProducts } from '../../api';

const { data: shop } = await getShopById(shopId);
const { data: products } = await getShopProducts(shopId);
```

### ShopDashboard.jsx & ProductsManagement.jsx

**Before:**
```javascript
import axios from 'axios';

const response = await axios.get(`/api/shops/${user.licenseId}/products`);
await axios.post(`/api/shops/${user.licenseId}/products`, formData, {
  headers: { Authorization: `Bearer ${localStorage.getItem('supplyco_token')}` }
});
await axios.delete(`/api/products/${productId}`, {
  headers: { Authorization: `Bearer ${localStorage.getItem('supplyco_token')}` }
});
```

**After:**
```javascript
import { getMyProducts, addProduct, deleteProduct } from '../../api/shop';

const { data } = await getMyProducts(user.licenseId);
await addProduct(user.licenseId, formData); // Token auto-added by interceptor
await deleteProduct(productId); // Token auto-added by interceptor
```

### Cart.jsx

**Before:**
```javascript
const { api } = useAuth();

await api.get('/cart');
await api.patch('/cart', { productId, quantity });
await api.delete(`/cart/${productId}`);
await api.post('/orders', { items: localCart });
```

**After:**
```javascript
import { getCart, updateCartItem, removeFromCart } from '../../api/cart';
import { createOrder } from '../../api/order';

await getCart();
await updateCartItem(productId, quantity);
await removeFromCart(productId);
await createOrder({ items: localCart });
```

## Benefits of Migration

### 1. **Type Safety** (Future TypeScript migration ready)
```typescript
// Future: Full IntelliSense support
const { data } = await getAllShops(); // IDE knows return type
```

### 2. **Centralized Updates**
Change endpoint in one place, all components updated:
```javascript
// In api/shop.js
export const getAllShops = () => api.get("/v2/shops"); // Updated to v2
```

### 3. **Easier Testing**
```javascript
import * as shopAPI from '../../api/shop';
jest.mock('../../api/shop');

shopAPI.getAllShops.mockResolvedValue({ data: mockShops });
```

### 4. **Better Error Handling**
```javascript
import { getAllShops } from '../../api';

try {
  const { data } = await getAllShops();
} catch (error) {
  // Normalized error format from interceptor
  console.error(error.message); // Always available
  console.error(error.status);  // Always available
}
```

### 5. **No Manual Token Management**
```javascript
// Before: Manual token in every request
await axios.get('/api/protected', {
  headers: { Authorization: `Bearer ${token}` }
});

// After: Automatic via interceptor
await getProtectedData(); // Token auto-added
```

## Migration Checklist

For each component:

- [ ] Remove `import axios from 'axios'`
- [ ] Remove manual API_BASE_URL construction
- [ ] Replace `api.get/post/put/delete` with named API methods
- [ ] Remove manual Authorization headers
- [ ] Update error handling to use normalized error format
- [ ] Test the component thoroughly

## Quick Reference: Import Statements

```javascript
// Authentication
import { loginUser, registerUser, logout, validateToken } from '../../api';

// Shops (browsing)
import { getAllShops, getShopById, getShopProducts } from '../../api';

// Shop management (owner)
import * as shopAPI from '../../api/shop';
// shopAPI.getMyProducts, shopAPI.addProduct, shopAPI.deleteProduct, etc.

// Products
import { getAllProducts, getProductById, searchProducts } from '../../api';

// Cart
import { getCart, addToCart, updateCartItem, removeFromCart } from '../../api';

// Orders
import { createOrder, getUserOrders } from '../../api';

// Direct client (when needed)
import { api } from '../../api';
```

## Need Help?

1. Check `api/README.md` for detailed documentation
2. Look at `context/AuthContext.js` for best practice examples
3. Review the API method signatures in each `api/*.js` file
