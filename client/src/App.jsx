import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UserDashboard from './pages/user/Dashboard';
import ShopOwnerDashboard from './pages/shop/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopView from './pages/user/ShopView';
import Cart from './pages/user/Cart';
import ShopRegistration from './pages/shop/Registration';
import ProductsManagement from './pages/shop/ProductsManagement';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Profile from './pages/Profile';
import Shops from './pages/Shops';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Replace with a spinner if desired.
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shops" element={<Shops />} />
            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/shops/:shopId"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <ShopView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/cart"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* Shop Owner Routes */}
            <Route
              path="/shop/dashboard"
              element={
                <ProtectedRoute allowedRoles={['shop_owner']}>
                  <ShopOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/shop/register" element={<ShopRegistration />} />
            <Route
              path="/shop/products"
              element={
                <ProtectedRoute allowedRoles={['shop_owner']}>
                  <ProductsManagement />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
