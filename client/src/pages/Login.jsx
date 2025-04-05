import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RationCardIcon, LicenseIcon } from '../components/Icons';

const Login = () => {
  const { login } = useAuth();
  const [isShop, setIsShop] = useState(false);
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Dynamically choose the field name based on isShop state
      const loginCredentials = {
        [isShop ? 'licenseId' : 'rationCardId']: credentials.id,
        password: credentials.password,
      };
      await login(loginCredentials, isShop);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Login failed. Please check your credentials.'
      );
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
            {isShop ? 'Shop Login' : 'User Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your {isShop ? 'shop' : 'user'} account
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4">
          {['User Login', 'Shop Login'].map((label, index) => {
            const shopMode = index === 1;
            return (
              <button
                key={label}
                onClick={() => setIsShop(shopMode)}
                className={`px-4 py-2 rounded-full transition ${
                  isShop === shopMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
            aria-live="polite"
          >
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* ID Input */}
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {isShop ? 'License ID' : 'Ration Card ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isShop ? <LicenseIcon /> : <RationCardIcon />}
                </div>
                <input
                  id="id"
                  type="text"
                  autoFocus
                  required
                  className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    isShop ? 'Enter license ID' : 'Enter ration card ID'
                  }
                  value={credentials.id}
                  onChange={(e) =>
                    setCredentials({ ...credentials, id: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>

          {/* Register Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600">
              Don't have an account?{' '}
            </span>
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
