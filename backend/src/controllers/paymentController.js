const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");


const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Razorpay is not configured.",
      });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const dbOrder = await Order.findById(orderId);

    if (!dbOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // User validation
    if (dbOrder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Already Paid
    if (dbOrder.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order has already been paid.",
      });
    }

    // Cancelled Order
    if (dbOrder.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be paid.",
      });
    }

    // Amount validation
    const amount = Number(dbOrder.totalAmount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    // Reuse existing Razorpay Order if available
    if (dbOrder.razorpayOrderId) {
      try {
        const existingOrder = await razorpay.orders.fetch(
          dbOrder.razorpayOrderId
        );

        if (
          existingOrder &&
          existingOrder.status === "created" &&
          existingOrder.amount === amount * 100
        ) {
          return res.status(200).json({
            success: true,
            reused: true,
            order: existingOrder,
            key_id: process.env.RAZORPAY_KEY_ID,
          });
        }
      } catch (err) {
        // Existing Razorpay order doesn't exist anymore.
        dbOrder.razorpayOrderId = undefined;
      }
    }

    // Create fresh Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${dbOrder._id}`,
      notes: {
        orderId: dbOrder._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    dbOrder.razorpayOrderId = razorpayOrder.id;

    await dbOrder.save();

    return res.status(201).json({
      success: true,
      reused: false,
      key_id: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
const verifyPayment = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay is not configured.",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Owner Validation
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Already Paid
    if (order.paymentStatus === "Paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified.",
        order,
      });
    }

    // Razorpay Order Validation
    if (
      order.razorpayOrderId &&
      order.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay Order ID.",
      });
    }

    // Signature Validation
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    // Save Payment Details
    order.paymentStatus = "Paid";
    order.paymentId = razorpay_payment_id;
    order.razorpayOrderId = razorpay_order_id;

    // Auto Confirm Order
    if (order.orderStatus === "Placed") {
      order.orderStatus = "Confirmed";
    }

    // Tracking History
    order.trackingHistory.push({
      status: order.orderStatus,
      message: "Payment received successfully.",
      updatedAt: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      order,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
const paymentFailed = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      reason,
      error_code,
      error_description,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Owner Validation
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Already Paid
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid.",
      });
    }

    order.paymentStatus = "Failed";

    if (razorpay_order_id) {
      order.razorpayOrderId = razorpay_order_id;
    }

    // Store failure reason (optional field)
    order.paymentFailure = {
      reason: reason || "Payment Failed",
      errorCode: error_code || "",
      errorDescription: error_description || "",
      failedAt: new Date(),
    };

    order.trackingHistory.push({
      status: "Payment Failed",
      message: reason || "Online payment failed.",
      updatedAt: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment failure recorded successfully.",
    });
  } catch (error) {
    console.error("Payment Failed Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to record failed payment.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Missing webhook signature.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    const event = req.body.event;

    const payload = req.body.payload;

    switch (event) {

      case "payment.captured": {

        const payment = payload.payment.entity;

        const order = await Order.findOne({
          razorpayOrderId: payment.order_id,
        });

        if (!order) break;

        // Idempotent
        if (order.paymentStatus === "Paid") break;

        order.paymentStatus = "Paid";

        order.paymentId = payment.id;

        if (order.orderStatus === "Placed") {
          order.orderStatus = "Confirmed";
        }

        order.trackingHistory.push({
          status: order.orderStatus,
          message: "Payment captured via Razorpay webhook.",
          updatedAt: new Date(),
        });

        await order.save();

        break;
      }

      case "payment.failed": {

        const payment = payload.payment.entity;

        const order = await Order.findOne({
          razorpayOrderId: payment.order_id,
        });

        if (!order) break;

        if (order.paymentStatus === "Paid") break;

        order.paymentStatus = "Failed";

        order.paymentFailure = {
          reason: payment.error_reason || "Payment Failed",
          errorCode: payment.error_code || "",
          errorDescription: payment.error_description || "",
          failedAt: new Date(),
        };

        order.trackingHistory.push({
          status: "Payment Failed",
          message:
            payment.error_description ||
            "Payment failed from Razorpay.",
          updatedAt: new Date(),
        });

        await order.save();

        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return res.status(200).json({
      success: true,
    });

  } catch (error) {

    console.error("Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  createPaymentOrder,
  paymentFailed,
  verifyPayment,
  razorpayWebhook,
};
