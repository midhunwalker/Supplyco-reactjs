import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, validateToken, setAuthToken } from '../api';
import * as cartAPI from '../api/cart';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await cartAPI.getCart();
      setCart(data?.items || []);
    } catch (err) {
      setCart([]);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await validateToken();
      // Note: data is expected to have a "user" object.
      setUser(data.user);
      await fetchCart();
    } catch (err) {
      localStorage.removeItem('supplyco_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  useEffect(() => {
    const token = localStorage.getItem('supplyco_token');
    if (token) fetchUser();
    else setLoading(false);
  }, [fetchUser]);

  const login = async (credentials, isShop = false) => {
    try {
      const endpoint = isShop ? '/auth/shop/login' : '/auth/user/login';
      const { data } = await api.post(endpoint, credentials);
      setAuthToken(data.token);
      localStorage.setItem('supplyco_token', data.token);
      setUser(data.user);
      await fetchCart();
      // Updated role check for shops with role "shop_owner"
      navigate(data.user.role === 'shop_owner' ? '/shop/dashboard' : '/user/dashboard');
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData, isShop = false) => {
    try {
      const endpoint = isShop ? '/auth/shop/register' : '/auth/user/register';
      const { data } = await api.post(endpoint, userData);
      setAuthToken(data.token);
      localStorage.setItem('supplyco_token', data.token);
      setUser(data.user);
      await fetchCart();
      navigate(data.user.role === 'shop_owner' ? '/shop/dashboard' : '/user/dashboard');
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('supplyco_token');
    setUser(null);
    setCart([]);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        cart,
        loading,
        login,
        register,
        logout,
        fetchCart,
        api, // Exposing the configured API client
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
