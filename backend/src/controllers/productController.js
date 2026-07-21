const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const cloudinary = require("../config/cloudinary");




const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
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
        }
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

      case "latest":
        sortOption = { createdAt: -1 };
        break;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("vendor", "shopName")
      .sort(sortOption)
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage,
      products,
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
        }
      );

      product.images = [result.secure_url];
    }

    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.stock = req.body.stock ?? product.stock;
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

module.exports = {
  createProduct,
  getAllProducts, 
  getSingleProduct,
  updateProduct,
  deleteProduct,
};