import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChartBarIcon, ShoppingBagIcon, Cog6ToothIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export default function ShopLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "shop_owner") return <Navigate to="/" replace />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                {/* Sidebar */}
                <aside className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-20">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-1">Shop Owner</h3>
                        <p className="text-sm text-gray-500">{user.name || user.licenseId}</p>
                    </div>
                    <nav className="space-y-2">
                        <NavLink
                            to="/shop/dashboard"
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <ChartBarIcon className="h-5 w-5" />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/shop/products"
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <ShoppingBagIcon className="h-5 w-5" />
                            Products
                        </NavLink>
                        <NavLink
                            to="/shops"
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <BuildingStorefrontIcon className="h-5 w-5" />
                            View All Shops
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
