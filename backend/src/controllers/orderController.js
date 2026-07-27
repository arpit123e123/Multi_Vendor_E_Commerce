const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;

    const selectedPaymentMethod =
      typeof paymentMethod === "string"
        ? paymentMethod.trim().toUpperCase()
        : "";

    // ===========================
    // Validation
    // ===========================

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!selectedPaymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    if (!["COD", "RAZORPAY"].includes(selectedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // ===========================
    // Get Cart
    // ===========================

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      populate: {
        path: "vendor",
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // ===========================
    // Validate Products
    // ===========================

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(404).json({
          success: false,
          message: "One or more products not found",
        });
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} is out of stock`,
        });
      }
    }

    // ===========================
    // Validate Address
    // ===========================

    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // ===========================
    // Prepare Order Items
    // ===========================

    const items = cart.items.map((item) => ({
      product: item.product._id,
      vendor: item.product.vendor._id || item.product.vendor,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // ===========================
    // Create Order
    // ===========================

    const order = await Order.create({
      user: req.user._id,
      items,
      address: address._id,
      totalAmount,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Placed",

      trackingHistory: [
        {
          status: "Placed",
          message: "Order placed successfully",
          updatedAt: new Date(),
        },
      ],
    });

    // ===========================
    // Update Stock
    // ===========================

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) continue;

      product.stock -= item.quantity;
      product.sold += item.quantity;

      if (product.stock <= 0) {
        product.stock = 0;
        product.status = "out_of_stock";
      }

      await product.save();
    }

    // ===========================
    // Clear Cart
    // ===========================

    cart.items = [];
    await cart.save();

    // ===========================
    // Response
    // ===========================

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET MY ORDERS
// =========================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate({
        path: "items.product",
        select:
          "name price discountPrice images brand slug averageRating stock",
      })
      .populate({
        path: "items.vendor",
        select: "shopName logo",
      })
      .populate({
        path: "address",
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
// =========================
// UPDATE ORDER STATUS
// =========================



const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Placed",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
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

    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be updated",
      });
    }

    // =========================
    // Restore Stock if Cancelled
    // =========================

    if (status === "Cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (!product) continue;

        product.stock += item.quantity;
        product.sold = Math.max(0, product.sold - item.quantity);

        if (product.stock > 0) {
          product.status = "active";
        }

        await product.save();
      }

      order.cancelledAt = new Date();
    }

    // =========================
    // Delivered
    // =========================

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }

    // =========================
    // Update Status
    // =========================

    order.orderStatus = status;

    order.trackingHistory.push({
      status,
      message: `Your order is ${status}`,
      updatedAt: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
};