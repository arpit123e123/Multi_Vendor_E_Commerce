const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
} = require("../src/controllers/categoryController");

const {
  protect,
  authorize,
} = require("../src/middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("vendor"),
  createCategory
);

router.get("/", getCategories);

module.exports = router;