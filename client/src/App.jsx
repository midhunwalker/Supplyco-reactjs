// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import UserLayout from "./layouts/UserLayout";
import ShopLayout from "./layouts/ShopLayout";

// Marketing / public pages
import Home from "./features/marketing/Home";
import About from "./features/marketing/About";
import Contact from "./features/marketing/Contact";
import Terms from "./features/marketing/Terms";
import Shops from "./features/user/Shops";

// Auth
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

// User features
import UserDashboard from "./features/user/Dashboard";
import ShopView from "./features/user/ShopView";
import Cart from "./features/user/Cart";
import Profile from "./features/user/Profile";

// Shop-owner features
import ShopOwnerDashboard from "./features/shop/ShopDashboard";
import ShopRegistration from "./features/shop/Registration";
import ProductsManagement from "./features/shop/ProductsManagement";

// Misc
import NotFound from "./features/common/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes wrapped by MainLayout */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
            <Route path="shops" element={<Shops />} />

            {/* Auth */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Public shop registration (intentional) */}
            <Route path="shop/register" element={<ShopRegistration />} />

            {/* Legacy single-page profile route -> redirect to new user profile */}
            <Route path="profile" element={<Navigate to="/user/profile" replace />} />
          </Route>

          {/* User-only routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="shops/:shopId" element={<ShopView />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Shop-owner only routes */}
          <Route path="/shop" element={<ShopLayout />}>
            <Route path="dashboard" element={<ShopOwnerDashboard />} />
            <Route path="products" element={<ProductsManagement />} />
          </Route>

          {/* Fallback / 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
