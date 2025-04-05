import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { ShoppingCartIcon, BuildingStorefrontIcon, UserIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Welcome to SupplyCo
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your trusted platform for essential supplies distribution. 
            {user ? 'Manage your account and access services' : 'Join us today to access quality supplies'}.
          </p>
          
          <div className="flex justify-center space-x-4">
            {user ? (
              <NavLink
                to={user.role === 'shopOwner' ? '/shop/dashboard' : '/user/dashboard'}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Go to Dashboard
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </NavLink>
                <NavLink
                  to="/login"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  Login
                </NavLink>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose SupplyCo?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <ShoppingCartIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Shopping</h3>
              <p className="text-gray-600">
                Browse and purchase essential supplies from verified shops with just a few clicks.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <BuildingStorefrontIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Shop Management</h3>
              <p className="text-gray-600">
                For shop owners - manage your inventory and orders through our intuitive dashboard.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <ChartBarIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your orders in real-time and receive instant notifications.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <UserIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Your data and transactions are protected with industry-standard security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {user ? 'Manage Your Account' : 'Create Account'}
              </h3>
              <p className="text-gray-600">
                {user ? 'Update your profile and preferences' : 'Register as a user or shop owner in minutes'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {user?.role === 'shopOwner' ? 'Manage Products' : 'Browse Shops'}
              </h3>
              <p className="text-gray-600">
                {user?.role === 'shopOwner' 
                  ? 'Add and manage your product listings' 
                  : 'Explore verified shops and their offerings'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {user?.role === 'shopOwner' ? 'Handle Orders' : 'Place Orders'}
              </h3>
              <p className="text-gray-600">
                {user?.role === 'shopOwner'
                  ? 'Process and fulfill customer orders efficiently'
                  : 'Secure checkout and easy payment options'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied users and shop owners already using SupplyCo.
          </p>
          {!user && (
            <NavLink
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Sign Up Free
            </NavLink>
          )}
          <div className="mt-8 flex justify-center space-x-6">
            <NavLink to="/about" className="text-gray-300 hover:text-white">
              About Us
            </NavLink>
            <NavLink to="/contact" className="text-gray-300 hover:text-white">
              Contact
            </NavLink>
            <NavLink to="/terms" className="text-gray-300 hover:text-white">
              Terms of Service
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;