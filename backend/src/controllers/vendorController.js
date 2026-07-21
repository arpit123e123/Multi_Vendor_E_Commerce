const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Order = require("../models/Order");

const createVendor = async (req, res) => {
  try {
    const existingVendor = await Vendor.findOne({
      owner: req.user._id,
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists",
      });
    }

    const vendor = await Vendor.create({
      owner: req.user._id,
      shopName: req.body.shopName,
      description: req.body.description,
      address: req.body.address,
      phone: req.body.phone,
    });

    res.status(201).json({
      success: true,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getVendorDashboard = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const totalProducts = await Product.countDocuments({
      vendor: vendor._id,
    });

    const orders = await Order.find({
      "items.vendor": vendor._id,
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getVendorProducts = async (req, res) => {
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


    const products = await Product.find({
      vendor: vendor._id,
    }).populate("category");


    res.status(200).json({
      success: true,
      products,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = { createVendor , getVendorDashboard , getVendorProducts };