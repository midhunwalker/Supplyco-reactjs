import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ProductCard from '../../components/ProductCard';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ShopView = () => {
  const { shopId } = useParams();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shop data and products when shopId changes
  useEffect(() => {
    if (!shopId) {
      setError("Invalid shop ID");
      setLoading(false);
      return;
    }

    const fetchShopData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch shop details
        const shopRes = await axios.get(`${API_BASE_URL}/shops/${shopId}`);
        // Assuming the API returns the shop data in a "data" property
        setShop(shopRes.data.data || shopRes.data);
        
        // Fetch shop products
        try {
          const productsRes = await axios.get(`${API_BASE_URL}/shops/${shopId}/products`);
          setProducts(productsRes.data.data || []);
        } catch (productErr) {
          console.error("Error fetching products:", productErr);
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching shop data:", err);
        setError("Failed to load shop data");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addToCart = async (productId) => {
    if (!user?.token) {
      setError("You must be logged in to add items to the cart");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/cart`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add item to cart");
    }
  };

  // Filter products based on the search term (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{shop?.name}</h1>
            <p className="text-gray-600">{shop?.address}</p>
          </div>

          <div className="mb-6 relative">
            <div className="flex items-center bg-white rounded-lg shadow-sm">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 border-0 focus:ring-0"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search products"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500">No products available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id}
                  product={product}
                  onAddToCart={() => addToCart(product._id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopView;
