const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../src/middleware/authMiddleware");
const upload = require("../src/middleware/upload");
const {
  becomeVendor,
  getVendorProfile,
  getVendorRequests,
  approveVendor,
  rejectVendor,
  suspendVendor,
  getVendorDashboard,
  getVendorOrders,
  updateVendorOrderStatus,
  getVendorStats,
  bulkUpdateProducts,
  getVendorAnalytics,
  createProduct,
  getVendorProducts,
  deleteVendorProduct,
  updateVendorProfile,
  changeProductStatus,
} = require("../src/controllers/vendorController");

// =========================
// User Routes
// =========================

// Become Vendor
router.post(
  "/request",
  protect,
  becomeVendor
);



// =========================
// Vendor Routes
// =========================

// Dashboard
router.get(
  "/dashboard",
  protect,
  authorize("vendor"),
  getVendorDashboard
);

// Analytics
router.get(
  "/analytics",
  protect,
  authorize("vendor"),
  getVendorAnalytics
);

// Statistics
router.get(
  "/stats",
  protect,
  authorize("vendor"),
  getVendorStats
);
router.post(
  "/products",
  protect,
  authorize("vendor"),
  upload.array("images", 5),
  createProduct
);
// Products
router.get(
  "/products",
  protect,
  authorize("vendor"),
  getVendorProducts
);

// Delete Product
router.delete(
  "/products/:id",
  protect,
  authorize("vendor"),
  deleteVendorProduct
);

// Change Product Status
router.patch(
  "/products/:id/status",
  protect,
  authorize("vendor"),
  changeProductStatus
);

// Bulk Product Update
router.patch(
  "/products/bulk",
  protect,
  authorize("vendor"),
  bulkUpdateProducts
);

// Vendor Orders
router.get(
  "/orders",
  protect,
  authorize("vendor"),
  getVendorOrders
);

// Update Order Status
router.put(
  "/orders/:id/status",
  protect,
  authorize("vendor"),
  updateVendorOrderStatus
);

// Get Vendor Profile
router.get(
  "/profile",
  protect,
  authorize("vendor"),
  getVendorProfile
);

// Update Vendor Profile
router.put(
  "/profile",
  protect,
  authorize("vendor"),
  updateVendorProfile
);

// =========================
// Admin Routes
// =========================

// Pending Requests
router.get(
  "/requests",
  protect,
  authorize("admin"),
  getVendorRequests
);

// Approve Vendor
router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveVendor
);

// Reject Vendor
router.put(
  "/reject/:id",
  protect,
  authorize("admin"),
  rejectVendor
);

// Suspend Vendor
router.patch(
  "/suspend/:id",
  protect,
  authorize("admin"),
  suspendVendor
);

module.exports = router;