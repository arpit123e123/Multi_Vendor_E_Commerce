const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeItem,
  clearCart,
} = require("../controllers/cartController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update/:productId", protect, updateCart);
router.delete("/remove/:productId", protect, removeItem);
router.delete("/clear", protect, clearCart);

module.exports = router;