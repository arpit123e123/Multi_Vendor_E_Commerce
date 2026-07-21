const express = require("express");
const router = express.Router();

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  createVendor,
  getVendorProducts,
} = require("../controllers/vendorController");


router.post(
  "/create",
  protect,
  authorize("vendor"),
  createVendor
);


router.get(
  "/products",
  protect,
  authorize("vendor"),
  getVendorProducts
);


module.exports = router;