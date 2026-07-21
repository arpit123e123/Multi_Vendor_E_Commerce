const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");



// User create order
router.post(
  "/",
  protect,
  createOrder
);



// User get own orders
router.get(
  "/",
  protect,
  getMyOrders
);



// Admin/Vendor update order status
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "vendor"),
  updateOrderStatus
);


module.exports = router;