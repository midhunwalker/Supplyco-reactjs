import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RationCardIcon, LicenseIcon, ShopIcon } from '../components/Icons';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isShop, setIsShop] = useState(false);
  const [formData, setFormData] = useState({
    rationCardId: '',
    licenseId: '',
    password: '',
    shopName: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For shops, use licenseId, shopName, and address; for users, use rationCardId.
      const userData = isShop
        ? {
            licenseId: formData.licenseId,
            password: formData.password,
            shopName: formData.shopName,
            address: formData.address
          }
        : {
            rationCardId: formData.rationCardId,
            password: formData.password
          };

      await register(userData, isShop);
      navigate(isShop ? '/shop/dashboard' : '/user/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isShop ? 'Shop Registration' : 'User Registration'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your {isShop ? 'shop' : 'user'} account
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4">
          {['User', 'Shop'].map((type) => (
            <button
              key={type}
              onClick={() => setIsShop(type === 'Shop')}
              className={`px-4 py-2 rounded-full transition ${
                isShop === (type === 'Shop')
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type} Registration
            </button>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* User-specific Field */}
            {!isShop && (
              <InputField
                id="rationCardId"
                label="Ration Card ID"
                icon={<RationCardIcon />}
                value={formData.rationCardId}
                onChange={handleInputChange}
              />
            )}

            {/* Shop-specific Fields */}
            {isShop && (
              <>
                <InputField
                  id="licenseId"
                  label="License ID"
                  icon={<LicenseIcon />}
                  value={formData.licenseId}
                  onChange={handleInputChange}
                />
                <InputField
                  id="shopName"
                  label="Shop Name"
                  icon={<ShopIcon />}
                  value={formData.shopName}
                  onChange={handleInputChange}
                />
                <InputField
                  id="address"
                  label="Shop Address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </>
            )}

            {/* Common Password Field */}
            <InputField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Must contain uppercase, lowercase, number, and special character
            </p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type = 'text', icon, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={id}
        name={id}
        type={type}
        required
        className={`w-full px-3 ${icon ? 'pl-10' : ''} py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500`}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default Register;
