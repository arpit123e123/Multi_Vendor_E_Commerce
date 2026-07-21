const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createCoupon,
  getCoupons,
  applyCoupon,
  deleteCoupon,
  
} = require("../controllers/couponController");

router.post("/", protect, authorize("admin"), createCoupon);

router.get("/", protect, authorize("admin"), getCoupons);

router.post("/apply", protect, applyCoupon);

router.delete("/:id", protect, authorize("admin"), deleteCoupon);

module.exports = router;