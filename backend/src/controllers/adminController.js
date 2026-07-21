const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");



const getAllVendors = async (req, res) => {
  try {

    const vendors = await Vendor.find()
      .populate("owner", "name email");


    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalVendors = await Vendor.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const paidOrders = await Order.find({
      paymentStatus: "Paid",
    });

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalVendors,
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
const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({
        averageRating: -1,
        numReviews: -1,
      })
      .limit(5);

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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getDashboardAnalytics,
  getTopProducts,
  getRecentOrders,
  getAllVendors,  
};
