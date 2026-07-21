const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,

      required: true,

      unique: true,

      uppercase: true,
    },

    discountType: {
      type: String,

      enum: ["PERCENTAGE", "FLAT"],

      default: "PERCENTAGE",
    },

    discountValue: {
      type: Number,

      required: true,
    },

    minimumAmount: {
      type: Number,

      default: 0,
    },

    expiryDate: {
      type: Date,

      required: true,
    },

    isActive: {
      type: Boolean,

      default: true,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Coupon", couponSchema);
