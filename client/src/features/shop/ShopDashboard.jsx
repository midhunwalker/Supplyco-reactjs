import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { ChartBarIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const ShopOwnerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`/api/shops/${user.licenseId}/products`),
          axios.get(`/api/shops/${user.licenseId}/orders`)
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.licenseId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Shop Dashboard - {user?.licenseId}
        </h1>
        <p className="text-gray-600">Manage your shop's operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Total Products</h3>
          <div className="flex items-center">
            <PlusIcon className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-3xl font-bold">{products.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Pending Orders</h3>
          <div className="flex items-center">
            <ShoppingBagIcon className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-3xl font-bold">
              {orders.filter(o => o.status === 'pending').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sales Analytics</h3>
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-3xl font-bold">
              ${orders.reduce((sum, o) => sum + o.total, 0)}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="h-32 bg-gray-200 rounded-lg" />
        </div>
      ) : error ? (
        <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.orderId}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Product Inventory</h3>
            <div className="space-y-4">
              {products.slice(0, 5).map(product => (
                <div key={product._id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock} | Price: ${product.price}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopOwnerDashboard;