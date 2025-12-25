import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import ShopSkeleton from '../../components/ShopSkeleton';

// Helper to validate that the shop data structure is correct
const isValidShop = (shop) => {
  return shop &&
    typeof shop === 'object' &&
    '_id' in shop &&
    typeof shop.name === 'string' &&
    typeof shop.address === 'string';
};

const Shops = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShops = async (signal) => {
    try {
      const response = await api.get('/shops', { signal });
      const shopsData = response.data.data;
      if (!Array.isArray(shopsData)) {
        throw new Error('Invalid data format received from server');
      }
      const validShops = shopsData.filter(isValidShop);
      if (validShops.length === 0) {
        throw new Error('No valid shops found in response');
      }
      setShops(validShops);
      setError(null);
    } catch (err) {
      if (!signal.aborted) {
        setError(err.response?.data?.message || err.message || 'Failed to load shops');
        setShops([]);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchShops(controller.signal).catch(err => {
      if (!controller.signal.aborted) console.error('Data loading error:', err);
    });
    return () => controller.abort();
  }, []);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchShops(new AbortController().signal);
    } catch (err) {
      setError(err.message || 'Failed to reload shops');
    }
  };

  const filteredShops = shops.filter(shop => {
    const searchLower = searchTerm.toLowerCase();
    return (
      shop.name.toLowerCase().includes(searchLower) ||
      shop.address.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.rationCardId || 'User'}
        </h1>
        <p className="text-gray-600">Browse available supply shops</p>
      </div>

      <div className="mb-6 relative">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-4" />
          <input
            type="text"
            placeholder="Search shops by name or location..."
            className="w-full px-4 py-3 border-0 focus:ring-0 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading || !!error}
            aria-label="Search shops"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ShopSkeleton count={3} />
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            aria-label="Retry loading shops"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.length > 0 ? (
            filteredShops.map(shop => (
              <NavLink
                key={shop._id}
                to={`/user/shops/${shop._id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
                aria-label={`View ${shop.name} details`}
              >
                <div className="flex items-center mb-4">
                  <BuildingStorefrontIcon className="h-12 w-12 text-blue-600 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {shop.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  <span>
                    {(shop.products?.length || 0).toLocaleString()}
                    {shop.products?.length === 1 ? ' product' : ' products'} available
                  </span>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ?
                  'No shops match your search' :
                  'No shops available in your area'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 hover:text-blue-700 transition-colors"
                  aria-label="Clear search"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shops;
