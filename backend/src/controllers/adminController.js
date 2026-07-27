const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

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
const getVendorDetails = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate(
      "owner",
      "name email phone role vendorRequest",
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
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
const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.status = "approved";
    vendor.isActive = true;
    vendor.isVerified = true;
    vendor.approvedAt = new Date();
    vendor.approvedBy = req.user._id;

    await vendor.save();

    const user = await User.findById(vendor.owner);

    user.role = "vendor";
    user.vendorRequest = "approved";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const rejectVendor = async (req, res) => {
  try {
    const { reason } = req.body;

    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.status = "rejected";
    vendor.rejectReason = reason || "";

    await vendor.save();

    const user = await User.findById(vendor.owner);

    user.vendorRequest = "rejected";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor rejected successfully",
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

    const validStatuses = [
      "Placed",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered" || order.orderStatus === "Cancelled")
      if (status === "Cancelled") {
        for (const item of order.items) {
          const product = await Product.findById(item.product);

          product.stock += item.quantity;
          product.sold -= item.quantity;

          await product.save();
        }
      }
    {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be updated",
      });
    }

    order.orderStatus = status;

    order.trackingHistory.push({
      status,
      message: `Your order is ${status}`,
      updatedAt: Date.now(),
    });

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    if (status === "Cancelled") {
      order.cancelledAt = Date.now();
    }

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
    const users = await User.find().select("-password").sort({ createdAt: -1 });

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

const updateUserStatus = async (req, res) => {
  try {
    const { isBlocked } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
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
  getVendorDetails,
  approveVendor,
  rejectVendor,
  updateUserStatus,
  deleteUser,
};
