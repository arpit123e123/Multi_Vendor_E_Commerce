const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authControllers");

// Register
router.post("/register", register);

// Login
router.post("/login", login); 

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
