import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const ProductsManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/shops/${user.licenseId}/products`);
        setProducts(response.data.data);
      } catch (err) {
        setError('Failed to load products');
      }
    };
    
    if (user?.licenseId) {
      fetchProducts();
    }
  }, [user?.licenseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `/api/shops/${user.licenseId}/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('supplyco_token')}`
          }
        }
      );

      setProducts([...products, response.data]);
      setFormData({ name: '', description: '', price: '', stock: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('supplyco_token')}`
          }
        });
        setProducts(products.filter(p => p._id !== productId));
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <p className="text-gray-600">Add and manage your shop's products</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Current Products</h3>
        </div>
        
        {products.length === 0 ? (
          <p className="p-6 text-gray-500">No products found</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product._id} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-700">${product.price}</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-700">{product.stock} in stock</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;