const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const cloudinary = require("../config/cloudinary");

const updateProductRating = async (product) => {
  if (product.reviews.length === 0) {
    product.averageRating = 0;
    product.numReviews = 0;
  } else {
    product.numReviews = product.reviews.length;

    const total = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    product.averageRating = Number((total / product.reviews.length).toFixed(1));
  }

  await product.save();
};
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
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

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "products",
        },
      );

      images.push(result.secure_url);
    }

    const product = await Product.create({
      vendor: vendor._id,
      name: name.trim(),
      description,
      price: Number(price),
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

    const currentPage = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);

    let query = {
      isActive: true,
    };

    if (keyword) {
      query.$or = [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }
    if (minRating) {
      query.averageRating = {
        $gte: Number(minRating),
      };
    }

    if (inStock === "true") {
      query.stock = {
        $gt: 0,
      };
    }

    if (vendor) {
      query.vendor = vendor;
    }

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "priceLow":
        sortOption = { price: 1 };
        break;

      case "priceHigh":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { averageRating: -1 };
        break;
      case "popular":
        sortOption = {
          numReviews: -1,
          averageRating: -1,
        };
        break;
      case "latest":
        sortOption = { createdAt: -1 };
        break;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
    
      .select(
        "name price images averageRating numReviews stock vendor category createdAt",
      )
      .populate("category", "name")
      .populate("vendor", "shopName")
      .sort(sortOption)
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      products,
      totalProducts,
      currentPage,
      pageSize,
      totalPages: Math.ceil(totalProducts / pageSize),
      hasNextPage: currentPage < Math.ceil(totalProducts / pageSize),
      hasPrevPage: currentPage > 1,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
  
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendor")
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

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
      .populate("category", "name")
      .populate("vendor", "shopName")
      .limit(4);

    res.status(200).json({
      success: true,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "products",
        },
      );

      product.images = [result.secure_url];
    }

    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.price =
      req.body.price !== undefined ? Number(req.body.price) : product.price;

    product.stock =
      req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.category = req.body.category ?? product.category;

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

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
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
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    product.reviews.push({
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    await updateProductRating(product);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      reviews: product.reviews,
      averageRating: product.averageRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
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
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.rating = Number(rating);
    review.comment = comment;

    await updateProductRating(product);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.reviews = product.reviews.filter(
      (review) => review.user.toString() !== req.user._id.toString(),
    );

    await updateProductRating(product);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
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
