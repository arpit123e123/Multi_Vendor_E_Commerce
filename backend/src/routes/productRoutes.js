const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getSingleProduct,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  updateReview, deleteReview,
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
upload.array("images", 5),
 // createProductValidation,
  //validate,
  createProduct
);


router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.get(
  "/related/:id",
  getRelatedProducts
);

router.put(
  "/:id",
  protect,
  authorize("vendor"),
  upload.array("images",5),
  updateProduct
);
router.delete(
  "/:id",
  protect,
  authorize("vendor"),
  deleteProduct
);
// ================= Reviews =================

// Add Review
router.post(
  "/:id/review",
  protect,
  addReview
);

// Update Review
router.put(
  "/:id/review",
  protect,
  updateReview
);

// Delete Review
router.delete(
  "/:id/review",
  protect,
  deleteReview
);


module.exports = router;
