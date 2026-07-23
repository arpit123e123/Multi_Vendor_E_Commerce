const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getDashboardAnalytics,
  getTopProducts,
  getRecentOrders,
  getAllVendors,
  updateUserStatus,
  deleteUser,
} = require("../controllers/adminController");

router.get("/orders", protect, authorize("admin"), getAllOrders);
router.patch("/orders/:id", protect, authorize("admin"), updateOrderStatus);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/analytics", protect, authorize("admin"), getDashboardAnalytics);
router.get("/recent-orders", protect, authorize("admin"), getRecentOrders);
router.get("/vendors", protect, authorize("admin"), getAllVendors);
router.patch("/users/:id", protect, authorize("admin"), updateUserStatus);

router.delete("/users/:id", protect, authorize("admin"), deleteUser);

router.get("/top-products", protect, authorize("admin"), getTopProducts);

module.exports = router;
