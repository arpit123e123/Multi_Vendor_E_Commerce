const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("vendor"),
  createCategory
);

router.get("/", getCategories);

module.exports = router;