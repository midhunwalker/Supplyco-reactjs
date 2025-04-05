import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Common navigation links available to everyone
  const commonLinks = [
    { path: '/', name: 'Home' },
    { path: '/shops', name: 'Shops' }
  ];

  // Role-specific links for regular users and shops
  const roleSpecificLinks = {
    user: [
      { path: '/user/dashboard', name: 'Dashboard' },
      { path: '/profile', name: 'Profile' },
      { path: '/user/cart', name: 'Cart' }
    ],
    shop: [
      { path: '/shop/dashboard', name: 'Dashboard' },
      { path: '/shop/profile', name: 'Profile' },
      { path: '/shop/products', name: 'Products' }
    ]
  };

  // Determine specific links based on logged in user
  // For shops, we assume a shop account has a 'licenseId' property.
  const specificLinks = user ? (user.licenseId ? roleSpecificLinks.shop : roleSpecificLinks.user) : [];

  // Authentication links (if not authenticated, show login/register; if logged in, show logout)
  const authLinks = user
    ? [{ name: 'Logout', action: () => { logout(); navigate('/'); } }]
    : [
        { path: '/login', name: 'Login' },
        { path: '/register', name: 'Register' }
      ];

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section - Logo & Desktop Nav */}
          <div className="flex items-center">
            <NavLink to="/" className="text-xl font-bold text-blue-600">
              SupplyCo
            </NavLink>
            <div className="hidden md:flex space-x-8 ml-10">
              {[...commonLinks, ...specificLinks].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Section - Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {authLinks.map((link) =>
              link.path ? (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                  {link.name}
                </NavLink>
              ) : (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                  {link.name}
                </button>
              )
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[...commonLinks, ...specificLinks].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600"
                >
                  {link.name}
                </NavLink>
              ))}

              {authLinks.map((link) =>
                link.path ? (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600"
                  >
                    {link.name}
                  </NavLink>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => {
                      link.action();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600"
                  >
                    {link.name}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
