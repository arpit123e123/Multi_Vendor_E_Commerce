import { BrowserRouter, Routes, Route } from "react-router-dom";

// User Pages
import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetails from "../pages/user/ProductDetails";
import Cart from "../pages/user/Cart";
import Wishlist from "../pages/user/Wishlist";
import Checkout from "../pages/user/Checkout";
import Orders from "../pages/user/Orders";
import Profile from "../pages/user/Profile";

// Auth
import Auth from "../pages/Auth/Auth";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import Categories from "../pages/admin/Categories";
import AdminOrders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import Vendors from "../pages/admin/Vendors";
import AdminLayout from "../components/admin/AdminLayout";
import Coupons from "../pages/admin/Coupons";
import Settings from "../pages/admin/Settings";

// Vendor Pages
import VendorDashboard from "../pages/vendor/Dashboard";
import AddProduct from "../pages/vendor/AddProduct";
import VendorProducts from "../pages/vendor/Products";
import VendorOrders from "../pages/vendor/Orders";
import VendorProfile from "../pages/vendor/Profile";
import Analytics from "../pages/vendor/Analytics";
import BecomeVendor from "../pages/vendor/BecomeVendor";

import ProtectedRoute from "../components/ProtectedRoute";
import VendorLayout from "../layouts/VendorLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= USER ================= */}

        <Route path="/" element={<Home />} />

        {/* Single Login + Register Page */}
        <Route path="/auth" element={<Auth />} />

        {/* Keep old URLs working */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="settings" element={<Settings />} />

          <Route path="users" element={<Users />} />

          <Route path="vendors" element={<Vendors />} />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          <Route
            path="coupons"
            element={<Coupons />}
          />
        </Route>

        {/* ================= VENDOR ================= */}

        <Route
          path="/vendor"
          element={
            <ProtectedRoute role="vendor">
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            index
            element={<VendorDashboard />}
          />

          <Route
            path="dashboard"
            element={<VendorDashboard />}
          />

          <Route
            path="products"
            element={<VendorProducts />}
          />

          <Route
            path="add-product"
            element={<AddProduct />}
          />

          <Route
            path="orders"
            element={<VendorOrders />}
          />

          <Route
            path="profile"
            element={<VendorProfile />}
          />
        </Route>

        {/* ================= BECOME VENDOR ================= */}

        <Route
          path="/become-vendor"
          element={
            <ProtectedRoute>
              <BecomeVendor />
            </ProtectedRoute>
          }
        />

        {/* ================= PASSWORD ================= */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

      </Routes>
    </BrowserRouter>
  ); 
}

export default AppRoutes;