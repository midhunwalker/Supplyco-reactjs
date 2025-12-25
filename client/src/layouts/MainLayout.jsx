import { Link, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function MainLayout() {
    const { user, logout, cart } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const cartItemCount = cart?.length || 0;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header/Navbar */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                            SupplyCo
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/shops"
                                className={({ isActive }) =>
                                    `hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`
                                }
                            >
                                Shops
                            </NavLink>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`
                                }
                            >
                                Contact
                            </NavLink>

                            {/* User-specific links */}
                            {user ? (
                                <>
                                    <NavLink
                                        to={user.role === 'shop_owner' ? '/shop/dashboard' : '/user/dashboard'}
                                        className={({ isActive }) =>
                                            `hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>

                                    {user.role !== 'shop_owner' && (
                                        <NavLink
                                            to="/user/cart"
                                            className="relative hover:text-blue-600 transition-colors"
                                        >
                                            <ShoppingCartIcon className="h-6 w-6" />
                                            {cartItemCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </NavLink>
                                    )}

                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-700">
                                            {user.name || user.email}
                                        </span>
                                        <button
                                            onClick={logout}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t">
                            <nav className="flex flex-col space-y-4">
                                <NavLink
                                    to="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-2 hover:bg-gray-100 rounded ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : ''}`
                                    }
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    to="/shops"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-2 hover:bg-gray-100 rounded ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : ''}`
                                    }
                                >
                                    Shops
                                </NavLink>
                                <NavLink
                                    to="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-2 hover:bg-gray-100 rounded ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : ''}`
                                    }
                                >
                                    Contact
                                </NavLink>

                                {user ? (
                                    <>
                                        <NavLink
                                            to={user.role === 'shop_owner' ? '/shop/dashboard' : '/user/dashboard'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `px-4 py-2 hover:bg-gray-100 rounded ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : ''}`
                                            }
                                        >
                                            Dashboard
                                        </NavLink>

                                        {user.role !== 'shop_owner' && (
                                            <NavLink
                                                to="/user/cart"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="px-4 py-2 hover:bg-gray-100 rounded flex items-center justify-between"
                                            >
                                                <span>Cart</span>
                                                {cartItemCount > 0 && (
                                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                                        {cartItemCount}
                                                    </span>
                                                )}
                                            </NavLink>
                                        )}

                                        <div className="px-4 py-2 text-sm text-gray-600">
                                            {user.name || user.email}
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="mx-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-4 py-2 hover:bg-gray-100 rounded"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="mx-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-blue-600 mb-4">SupplyCo</h3>
                            <p className="text-gray-600 text-sm">
                                Your trusted platform for essential supplies distribution.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
                                <li><Link to="/shops" className="text-gray-600 hover:text-blue-600">Browse Shops</Link></li>
                                <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
                                <li><Link to="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">For Businesses</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/shop/register" className="text-gray-600 hover:text-blue-600">Register Your Shop</Link></li>
                                <li><Link to="/login" className="text-gray-600 hover:text-blue-600">Shop Owner Login</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
                        © {new Date().getFullYear()} SupplyCo. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
