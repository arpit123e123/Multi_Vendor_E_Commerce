import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// =========================
// USER PAGES
// =========================
import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetails from "../pages/user/ProductDetails";
import Cart from "../pages/user/Cart";
import Wishlist from "../pages/user/Wishlist";
import Checkout from "../pages/user/Checkout";
import Orders from "../pages/user/Orders";
import Profile from "../pages/user/Profile";

// =========================
// AUTH
// =========================
import Auth from "../pages/Auth/Auth";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// =========================
// ADMIN
// =========================
import Dashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import Users from "../pages/admin/Users";
import Vendors from "../pages/admin/Vendors";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import Coupons from "../pages/admin/Coupons";
import Settings from "../pages/admin/Settings";
import AdminLayout from "../components/admin/AdminLayout";

// =========================
// VENDOR
// =========================
import VendorDashboard from "../pages/vendor/Dashboard";
import AddProduct from "../pages/vendor/AddProduct";
import VendorProducts from "../pages/vendor/Products";
import VendorOrders from "../pages/vendor/Orders";
import VendorProfile from "../pages/vendor/Profile";
import Analytics from "../pages/vendor/Analytics";
import BecomeVendor from "../pages/vendor/BecomeVendor";

import ProtectedRoute from "../components/ProtectedRoute";
import VendorLayout from "../layouts/VendorLayout";

const AdminProtectedLayout = () => (
  <ProtectedRoute role="admin">
    <AdminLayout />
  </ProtectedRoute>
);

const VendorProtectedLayout = () => (
  <ProtectedRoute role="vendor">
    <VendorLayout />
  </ProtectedRoute>
);

// =========================
// ROLE HOME
// =========================
const RoleHome = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
  }

  if (!user) {
    return <Home />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;

    case "vendor":
      return <Navigate to="/vendor" replace />;

    default:
      return <Home />;
  }
};

// =========================
// APP ROUTES
// =========================
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            ROOT
        ========================= */}
        <Route path="/" element={<RoleHome />} />

        {/* =========================
            AUTH
        ========================= */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* =========================
            PUBLIC PRODUCTS
        ========================= */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* =========================
            CUSTOMER
        ========================= */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute role="customer">
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="customer">
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="customer">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =========================
            ADMIN
            Admin = platform management
            No product/order operations
        ========================= */}
        <Route path="/admin/products" element={<AdminProtectedLayout />}>
          <Route index element={<AdminProducts />} />
        </Route>

        <Route path="/admin/orders" element={<AdminProtectedLayout />}>
          <Route index element={<AdminOrders />} />
        </Route>

        <Route
          path="/admin/*"
          element={<AdminProtectedLayout />}
        >
          <Route index element={<Dashboard />} />

          <Route path="users" element={<Users />} />

          <Route path="vendors" element={<Vendors />} />

          <Route path="products" element={<AdminProducts />} />

          <Route path="categories" element={<Categories />} />

          <Route path="orders" element={<AdminOrders />} />

          <Route path="coupons" element={<Coupons />} />

          <Route path="settings" element={<Settings />} />
        </Route>

        {/* =========================
            VENDOR
            Vendor = own products + orders
        ========================= */}
        <Route
          path="/vendor/*"
          element={<VendorProtectedLayout />}
        >
          <Route index element={<VendorDashboard />} />

          <Route path="dashboard" element={<VendorDashboard />} />

          <Route path="analytics" element={<Analytics />} />

          <Route path="products" element={<VendorProducts />} />

          <Route path="add-product" element={<AddProduct />} />

          <Route path="orders" element={<VendorOrders />} />

          <Route path="profile" element={<VendorProfile />} />
        </Route>

        {/* =========================
            BECOME VENDOR
        ========================= */}
        <Route
          path="/become-vendor"
          element={
            <ProtectedRoute role="customer">
              <BecomeVendor />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PASSWORD RESET
        ========================= */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* =========================
            FALLBACK
        ========================= */}
        <Route path="*" element={<RoleHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
