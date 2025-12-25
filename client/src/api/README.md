# API Layer Documentation

## Overview

This directory contains all API client code for the SupplyCo application. The API layer is organized into modular files by domain (auth, shop, product, cart, order) with a centralized configuration in `client.js`.

## Architecture

```
api/
├── client.js      # Axios instance with interceptors, auth token management
├── auth.js        # Authentication endpoints
├── shop.js        # Shop browsing and management
├── product.js     # Product browsing and search
├── cart.js        # Shopping cart operations
├── order.js       # Order management
└── index.js       # Centralized exports
```

## Security Features

### Automatic Token Management
- Tokens are automatically attached to all requests via interceptors
- Token stored securely in localStorage
- Automatic cleanup on logout or 401 errors

### Error Handling
- Global error interceptor catches network failures
- Automatic redirect to login on 401 Unauthorized
- Normalized error responses

### Request Timeout
- 10-second timeout prevents hanging requests
- Configurable per-request if needed

## Usage Examples

### Import Methods

```javascript
// Option 1: Named imports from index
import { loginUser, getAllShops, addToCart } from '../../api';

// Option 2: Namespace imports
import * as authAPI from '../../api/auth';
import * as shopAPI from '../../api/shop';

// Option 3: Direct api client (for custom requests)
import { api } from '../../api';
```

### Authentication Examples

```javascript
import { loginUser, registerUser, logout } from '../../api';

// User login
try {
  const { data } = await loginUser({ email, password });
  console.log('Logged in:', data.user);
  console.log('Token:', data.token);
} catch (error) {
  console.error('Login failed:', error.message);
}

// User registration
const userData = { name, email, password, phone, address };
const { data } = await registerUser(userData);

// Logout
logout(); // Clears token and user data
```

### Shop Operations

```javascript
import { getAllShops, getShopById, getShopProducts } from '../../api';

// Browse all shops
const { data } = await getAllShops({ page: 1, limit: 20 });

// Get specific shop
const { data: shop } = await getShopById(shopId);

// Get shop products
const { data: products } = await getShopProducts(shopId, { 
  category: 'electronics',
  minPrice: 100 
});
```

### Shop Owner Operations

```javascript
import * as shopAPI from '../../api/shop';

// Get dashboard data
const { data } = await shopAPI.getShopDashboard(user.licenseId);

// Add product
const productData = { name, description, price, stock };
await shopAPI.addProduct(user.licenseId, productData);

// Update product
await shopAPI.updateProduct(productId, { price: newPrice });

// Delete product
await shopAPI.deleteProduct(productId);
```

### Cart Operations

```javascript
import { getCart, addToCart, updateCartItem, removeFromCart } from '../../api';

// Get cart
const { data } = await getCart();

// Add to cart
await addToCart(productId, quantity);

// Update quantity
await updateCartItem(productId, newQuantity);

// Remove item
await removeFromCart(productId);
```

### Order Operations

```javascript
import { createOrder, getUserOrders } from '../../api';

// Checkout
const orderData = { items: cartItems, address, paymentMethod };
const { data: order } = await createOrder(orderData);

// View orders
const { data: orders } = await getUserOrders({ status: 'pending' });
```

### Direct API Client Usage

For custom requests not covered by helper methods:

```javascript
import { api } from '../../api';

// Custom GET request
const { data } = await api.get('/custom-endpoint', {
  params: { filter: 'value' }
});

// Custom POST with headers
await api.post('/custom-endpoint', payload, {
  headers: { 'X-Custom-Header': 'value' }
});

// Cancel requests with AbortController
const controller = new AbortController();
const { data } = await api.get('/shops', { signal: controller.signal });
// Later: controller.abort();
```

## Component Integration Examples

### Using in Components

```javascript
import { useEffect, useState } from 'react';
import { getAllShops } from '../../api';

function ShopsList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data } = await getAllShops();
        setShops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {shops.map(shop => <div key={shop._id}>{shop.name}</div>)}
    </div>
  );
}
```

### Using with Context

```javascript
// In AuthContext
import { api, validateToken, logout } from '../api/client';

// The api instance is already configured and can be passed down
<AuthContext.Provider value={{ user, api, logout }}>
  {children}
</AuthContext.Provider>

// In components
const { api } = useAuth();
await api.get('/protected-endpoint'); // Auto-includes token
```

## Best Practices

### ✅ DO

- Use named API methods instead of raw `api.get()` when available
- Handle errors in components with try-catch
- Use AbortController for requests in useEffect
- Import only what you need to reduce bundle size
- Use TypeScript interfaces for type safety (when migrating)

### ❌ DON'T

- Don't import raw `axios` in components - use `api` or helper methods
- Don't manually add Authorization headers (interceptor handles it)
- Don't store tokens in component state
- Don't make API calls outside useEffect or event handlers
- Don't create multiple axios instances

## Environment Variables

Configure the API base URL in `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

For production:
```env
REACT_APP_API_BASE_URL=https://api.supplyco.com/api
```

## Error Response Format

All API errors follow this structure:

```javascript
{
  message: string,    // Human-readable error message
  status: number,     // HTTP status code
  data: object        // Original error response data
}
```

## Migration Guide

### Before (Inconsistent)

```javascript
// Component 1
import axios from 'axios';
const res = await axios.get('http://localhost:5000/api/shops');

// Component 2
import api from '../../api/client';
const res = await api.get('/shops');

// Component 3
const { api } = useAuth();
const res = await api.get('/shops');
```

### After (Consistent)

```javascript
// All components
import { getAllShops } from '../../api';
const { data } = await getAllShops();
```

## Testing

Mock API calls in tests:

```javascript
import * as shopAPI from '../../api/shop';

jest.mock('../../api/shop');

test('loads shops', async () => {
  shopAPI.getAllShops.mockResolvedValue({ data: [{ id: 1, name: 'Shop' }] });
  // test component
});
```

## Support

For questions or issues with the API layer, check:
1. This README
2. The backend API documentation
3. The `client.js` interceptors for request/response handling
