const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

router.post("/", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/:productId", protect, removeFromWishlist);
router.delete("/clear/all", protect, clearWishlist);

module.exports = router;