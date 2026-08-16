const express = require("express");
const router = express.Router();

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../src/controllers/reviewController");

const { protect } = require("../src/middleware/authMiddleware");
const upload = require("../src/middleware/upload");

// Create Review
router.post("/", protect, upload.array("media", 5), createReview);

// Get Reviews of a Product
router.get("/:productId", getProductReviews);

// Update Review
router.put("/:id", protect, upload.array("media", 5), updateReview);

// Delete Review
router.delete("/:id", protect, deleteReview);

module.exports = router;