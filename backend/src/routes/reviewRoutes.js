const express = require("express");
const router = express.Router();

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Create Review
router.post("/", protect, createReview);

// Get Reviews of a Product
router.get("/:productId", getProductReviews);

// Update Review
router.put("/:id", protect, updateReview);

// Delete Review
router.delete("/:id", protect, deleteReview);

module.exports = router;