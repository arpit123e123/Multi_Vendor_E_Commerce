const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
  paymentFailed,
  razorpayWebhook,
} = require("../src/controllers/paymentController");

const { protect } = require("../src/middleware/authMiddleware");

// User
router.post("/create-order", protect, createPaymentOrder);

router.post("/verify", protect, verifyPayment);

router.post("/payment-failed", protect, paymentFailed);

// Razorpay
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

module.exports = router;