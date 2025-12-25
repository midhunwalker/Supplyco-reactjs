import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HomeIcon, ShoppingCartIcon, UserIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export default function UserLayout() {
    const { user, loading, cart } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "user") return <Navigate to="/" replace />;

    const cartCount = cart?.length || 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                {/* Sidebar */}
                <aside className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-20">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-1">User Menu</h3>
                        <p className="text-sm text-gray-500">Welcome, {user.name}</p>
                    </div>
                    <nav className="space-y-2">
                        <NavLink
                            to="/user/dashboard"
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <HomeIcon className="h-5 w-5" />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/user/cart"
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <ShoppingCartIcon className="h-5 w-5" />
                            <span className="flex-1">Cart</span>
                            {cartCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>
                        <NavLink
                            to="/user/profile"
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <UserIcon className="h-5 w-5" />
                            Profile
                        </NavLink>
                        <NavLink
                            to="/shops"
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <BuildingStorefrontIcon className="h-5 w-5" />
                            Browse Shops
                        </NavLink>
                    </nav>
                </aside>

                {/* Main Content */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
