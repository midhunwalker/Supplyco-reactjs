import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { user, cart, fetchCart, api } = useAuth();
  const [localCart, setLocalCart] = useState(cart);
  const [loading, setLoading] = useState(!cart.length);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  // Sync local cart with AuthContext cart if available
  useEffect(() => {
    if (cart.length) {
      setLocalCart(cart);
      setLoading(false);
    }
  }, [cart]);

  // Fallback fetch in case cart wasn't loaded by AuthContext
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cart');
        setLocalCart(response.data.items || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    if (user && (!cart || cart.length === 0)) {
      fetchData();
    }
  }, [user, cart, api]);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const updatedItems = localCart.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      );
      setLocalCart(updatedItems);
      await api.patch('/cart', { productId, quantity: newQuantity });
      if (fetchCart) fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedItems = localCart.filter(item => item.product._id !== productId);
      setLocalCart(updatedItems);
      await api.delete(`/cart/${productId}`);
      if (fetchCart) fetchCart();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return localCart
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await api.post('/orders', { items: localCart });
      setLocalCart([]);
      if (fetchCart) fetchCart();
      navigate('/orders/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      {localCart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/shops')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Shops
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {localCart.map(item => (
              <div key={item.product._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-gray-600">₹{item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="w-24 text-right font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-white rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Total</h2>
              <p className="text-2xl font-bold text-gray-800">₹{calculateTotal()}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;