const Coupon = require("../models/Coupon");

// Create Coupon

const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,

      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Get Coupons

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.status(200).json({
      success: true,

      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Apply Coupon

const applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),

      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,

        message: "Invalid coupon",
      });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({
        success: false,

        message: "Coupon expired",
      });
    }

    if (totalAmount < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,

        message: "Minimum amount not reached",
      });
    }

    let discount = 0;

    if (coupon.discountType === "PERCENTAGE") {
      discount = (totalAmount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,

      discount,

      finalAmount: totalAmount - discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,

        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,

      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};



module.exports = {
  createCoupon,

  getCoupons,

  applyCoupon,
  deleteCoupon,

};
