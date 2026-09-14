const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Vendor = require("../models/Vendor");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");

const uploadReviewMedia = async (files = []) => {
  if (!files || files.length === 0) return [];

  const uploadedMedia = [];

  for (const file of files) {
    const resourceType = file.mimetype?.startsWith("video/")
      ? "video"
      : "image";

    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: "product-reviews",
        resource_type: resourceType,
      }
    );

    uploadedMedia.push({
      public_id: result.public_id,
      url: result.secure_url,
      type: resourceType,
    });
  }

  return uploadedMedia;
};

const updateProductRating = async (product) => {
  if (product.reviews.length === 0) {
    product.averageRating = 0;
    product.numReviews = 0;
  } else {
    product.numReviews = product.reviews.length;

    const total = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    product.averageRating = Number(
      (total / product.reviews.length).toFixed(1)
    );
  }

  await product.save();
};

/**
 * CREATE PRODUCT
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      discountPrice,
    } = req.body;

    if (
      !name ||
      !description ||
      !brand ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder: "products",
          }
        );

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const product = await Product.create({
      vendor: vendor._id,
      name: name.trim(),
      description: description.trim(),
      brand: brand.trim(),
      slug,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      stock: Number(stock),
      category,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

/**
 * GET ALL PRODUCTS
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      vendor,
      page = 1,
      limit = 10,
      sort,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);

    // Prevent extremely large requests
    const pageSize = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const query = {
      isActive: true,
    };

    /**
     * KEYWORD SEARCH
     */
    if (keyword && keyword.trim()) {
      const cleanKeyword = keyword.trim();

      query.$or = [
        {
          name: {
            $regex: cleanKeyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: cleanKeyword,
            $options: "i",
          },
        },
      ];
    }

    /**
     * CATEGORY FILTER
     *
     * Frontend can send:
     * - MongoDB ObjectId
     * - category name
     * - category slug
     */
    if (category && category.trim()) {
      const cleanCategory = category.trim();

      let categoryId = null;

      // If frontend already sends ObjectId
      if (mongoose.Types.ObjectId.isValid(cleanCategory)) {
        categoryId = cleanCategory;
      } else {
        // Otherwise resolve name / slug
        const categoryDoc = await Category.findOne({
          $or: [
            {
              name: {
                $regex: `^${cleanCategory.replace(
                  /[.*+?^${}()|[\]\\]/g,
                  "\\$&"
                )}$`,
                $options: "i",
              },
            },
            {
              slug: cleanCategory.toLowerCase(),
            },
          ],
          isActive: true,
        })
          .select("_id")
          .lean();

        if (!categoryDoc) {
          return res.status(200).json({
            success: true,
            products: [],
            totalProducts: 0,
            currentPage,
            pageSize,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: currentPage > 1,
          });
        }

        categoryId = categoryDoc._id;
      }

      query.category = categoryId;
    }

    /**
     * PRICE FILTER
     */
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice !== "" && minPrice !== undefined) {
        const parsedMinPrice = Number(minPrice);

        if (Number.isFinite(parsedMinPrice) && parsedMinPrice >= 0) {
          query.price.$gte = parsedMinPrice;
        }
      }

      if (maxPrice !== "" && maxPrice !== undefined) {
        const parsedMaxPrice = Number(maxPrice);

        if (Number.isFinite(parsedMaxPrice) && parsedMaxPrice >= 0) {
          query.price.$lte = parsedMaxPrice;
        }
      }

      // Remove empty price object
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    /**
     * RATING FILTER
     */
    if (minRating !== "" && minRating !== undefined) {
      const parsedRating = Number(minRating);

      if (
        Number.isFinite(parsedRating) &&
        parsedRating >= 0 &&
        parsedRating <= 5
      ) {
        query.averageRating = {
          $gte: parsedRating,
        };
      }
    }

    /**
     * STOCK FILTER
     */
    if (inStock === "true") {
      query.stock = {
        $gt: 0,
      };
    }

    /**
     * VENDOR FILTER
     */
    if (vendor && vendor.trim()) {
      const cleanVendor = vendor.trim();

      if (mongoose.Types.ObjectId.isValid(cleanVendor)) {
        query.vendor = cleanVendor;
      }
    }

    /**
     * SORT
     */
    let sortOption = {
      createdAt: -1,
      _id: -1,
    };

    switch (sort) {
      case "priceLow":
        sortOption = {
          price: 1,
          _id: 1,
        };
        break;

      case "priceHigh":
        sortOption = {
          price: -1,
          _id: -1,
        };
        break;

      case "rating":
        sortOption = {
          averageRating: -1,
          numReviews: -1,
          _id: -1,
        };
        break;

      case "popular":
        sortOption = {
          numReviews: -1,
          averageRating: -1,
          _id: -1,
        };
        break;

      case "latest":
      default:
        sortOption = {
          createdAt: -1,
          _id: -1,
        };
        break;
    }

    /**
     * COUNT + PRODUCTS
     */
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select(
        "name price images averageRating numReviews stock vendor category createdAt"
      )
      .populate("category", "name slug")
      .populate("vendor", "shopName")
      .sort(sortOption)
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalPages = Math.ceil(totalProducts / pageSize);

    return res.status(200).json({
      success: true,
      products,
      totalProducts,
      currentPage,
      pageSize,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

/**
 * GET SINGLE PRODUCT
 */
const getSingleProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id)
      .populate("vendor")
      .populate("category", "name slug")
      .populate({
        path: "reviews.user",
        select: "name email",
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.reviews = [...(product.reviews || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("========== ERROR ==========");
    console.error(error);
    console.error("===========================");

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

/**
 * GET RELATED PRODUCTS
 */
const getRelatedProducts = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id)
      .select("category")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .select(
        "name price images averageRating numReviews stock vendor category createdAt"
      )
      .populate("category", "name slug")
      .populate("vendor", "shopName")
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(4)
      .lean();

    return res.status(200).json({
      success: true,
      relatedProducts,
    });
  } catch (error) {
    console.error("RELATED PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE PRODUCT
 */
const updateProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this product",
      });
    }

    const nextPrice =
      req.body.price !== undefined
        ? Number(req.body.price)
        : product.price;

    const nextDiscountPrice =
      req.body.discountPrice !== undefined
        ? Number(req.body.discountPrice)
        : product.discountPrice;

    if (nextDiscountPrice && nextDiscountPrice >= nextPrice) {
      return res.status(400).json({
        success: false,
        message: "Discount price must be less than actual price",
      });
    }

    if (req.body.brand) {
      product.brand = req.body.brand.trim();
    }

    if (req.body.name) {
      product.slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      });
    }

    if (req.body.discountPrice !== undefined) {
      product.discountPrice = Number(req.body.discountPrice);
    }

    if (req.files && req.files.length > 0) {
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      product.images = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder: "products",
          }
        );

        product.images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.price = nextPrice;

    product.stock =
      req.body.stock !== undefined
        ? Number(req.body.stock)
        : product.stock;

    /**
     * CATEGORY UPDATE
     *
     * Supports ObjectId, name and slug.
     */
    if (req.body.category) {
      const cleanCategory = req.body.category.trim();

      if (mongoose.Types.ObjectId.isValid(cleanCategory)) {
        product.category = cleanCategory;
      } else {
        const categoryDoc = await Category.findOne({
          $or: [
            {
              name: {
                $regex: `^${cleanCategory.replace(
                  /[.*+?^${}()|[\]\\]/g,
                  "\\$&"
                )}$`,
                $options: "i",
              },
            },
            {
              slug: cleanCategory.toLowerCase(),
            },
          ],
          isActive: true,
        }).select("_id");

        if (!categoryDoc) {
          return res.status(400).json({
            success: false,
            message: "Category not found",
          });
        }

        product.category = categoryDoc._id;
      }
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

/**
 * DELETE PRODUCT
 */
const deleteProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this product",
      });
    }

    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

/**
 * ADD REVIEW
 */
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const parsedRating = Number(rating);

    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const cleanComment =
      typeof comment === "string" ? comment.trim() : "";

    const mediaFiles = Array.isArray(req.files) ? req.files : [];

    if (!cleanComment && mediaFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please add a review comment or upload a photo/video",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (review) =>
        review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const uploadedMedia = await uploadReviewMedia(mediaFiles);

    product.reviews.push({
      user: req.user._id,
      rating: parsedRating,
      comment: cleanComment,
      media: uploadedMedia,
    });

    await updateProductRating(product);

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      reviews: product.reviews,
      averageRating: product.averageRating,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE REVIEW
 */
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const parsedRating = Number(rating);

    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const cleanComment =
      typeof comment === "string" ? comment.trim() : "";

    const mediaFiles = Array.isArray(req.files) ? req.files : [];

    if (!cleanComment && mediaFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please add a review comment or upload a photo/video",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.find(
      (review) =>
        review.user.toString() === req.user._id.toString()
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.rating = parsedRating;
    review.comment = cleanComment;

    if (mediaFiles.length > 0) {
      review.media = await uploadReviewMedia(mediaFiles);
    }

    await updateProductRating(product);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE REVIEW
 */
const deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.reviews = product.reviews.filter(
      (review) =>
        review.user.toString() !== req.user._id.toString()
    );

    await updateProductRating(product);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addReview,
  updateReview,
  deleteReview,
  getRelatedProducts,
};