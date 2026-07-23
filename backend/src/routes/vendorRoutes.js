const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  becomeVendor,
  getVendorProfile,
  getVendorRequests,
  approveVendor,
  rejectVendor,
  suspendVendor,
} = require("../controllers/vendorController");

// =========================
// User Routes
// =========================

// User becomes a vendor
router.post("/request", protect, becomeVendor);

// Logged in vendor profile
router.get("/profile", protect, getVendorProfile);

// =========================
// Admin Routes
// =========================

// Get all pending vendor requests
router.get("/requests", protect, authorize("admin"), getVendorRequests);

// Approve vendor
router.put("/approve/:id", protect, authorize("admin"), approveVendor);

// Reject vendor
router.put("/reject/:id", protect, authorize("admin"), rejectVendor);
router.patch(
  "/suspend/:id",
  protect,
  authorize("admin"),
  suspendVendor
);

module.exports = router;
