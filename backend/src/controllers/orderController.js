const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");

// CREATE ORDER

const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;

    const selectedPaymentMethod =
      typeof paymentMethod === "string"
        ? paymentMethod.trim().toUpperCase()
        : "";

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

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,

        message: "Cart is empty",
      });
    }

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,

          message: "Product not found",
        });
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,

          message: `${item.product.name} is out of stock`,
        });
      }
    }

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

    const items = cart.items.map((item) => ({
      product: item.product._id,

      quantity: item.quantity,

      price: item.product.price,
    }));

    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,

      0,
    );

    const order = await Order.create({
      user: req.user._id,

      items,

      address: addressId,

      totalAmount,

      paymentMethod: selectedPaymentMethod,

      paymentStatus: "Pending",

      orderStatus: "Placed",

      trackingHistory: [
        {
          status: "Placed",

          message: "Order placed successfully",

          updatedAt: Date.now(),
        },
      ],
    });

    // Reduce stock

    for (const item of cart.items) {
      item.product.stock -= item.quantity;

      await item.product.save();
    }

    // Clear cart

    cart.items = [];

    await cart.save();

    res.status(201).json({
      success: true,

      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// GET MY ORDERS

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })

      .populate("items.product")

      .populate("address")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// UPDATE ORDER STATUS

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

      message: "Order status updated",

      order,
    });
  } catch (error) {
    res.status(500).json({
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
