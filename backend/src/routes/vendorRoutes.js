const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  becomeVendor,
  getVendorProfile,
} = require("../controllers/vendorController");

router.post("/request", protect, becomeVendor);

router.get("/profile", protect, getVendorProfile);

module.exports = router;