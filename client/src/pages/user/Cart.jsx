import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { 
    cart, 
    loading, 
    fetchCart, 
    api,
    user 
  } = useAuth();
  
  const [actionError, setActionError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (!user) return;
    
    try {
      setProcessing(true);
      setActionError(null);
      
      await api.patch('/cart', {
        productId,
        quantity: Math.max(1, newQuantity)
      });
      
      await fetchCart();
    } catch (err) {
      setActionError(err.message || 'Failed to update quantity');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!user) return;
    
    try {
      setProcessing(true);
      setActionError(null);
      
      await api.delete(`/cart/${productId}`);
      await fetchCart();
    } catch (err) {
      setActionError(err.message || 'Failed to remove item');
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    ).toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      
      {(loading || processing) ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : actionError ? (
        <div className="text-red-600 p-4 bg-red-50 rounded-lg">{actionError}</div>
      ) : cart?.items?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm divide-y">
            {cart?.items?.map(item => (
              <div key={item.product?._id} className="p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.product?.name || 'Unknown Product'}</h3>
                  <p className="text-gray-600">${item.product?.price?.toFixed(2) || '0.00'}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={processing || item.quantity <= 1}
                      className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      disabled={processing}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="w-24 text-right">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    disabled={processing}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Total</h3>
              <p className="text-2xl font-bold">${calculateTotal()}</p>
            </div>
            <button 
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!cart?.items?.length || processing}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;