const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// 👇 New Import
const {
  createProductValidation,
} = require("../validators/productValidators");

const validate = require("../middleware/validate");

// 👇 Create Product Route
router.post(
  "/create",
  protect,
  authorize("vendor"),
  upload.single("image"),
 // createProductValidation,
  //validate,
  createProduct
);

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

router.put(
  "/:id",
  protect,
  authorize("vendor"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("vendor"),
  deleteProduct
);

module.exports = router;
