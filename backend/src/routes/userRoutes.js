const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Get Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put("/profile", protect, updateProfile);

// Change Password
router.put("/change-password", protect, changePassword);

module.exports = router;