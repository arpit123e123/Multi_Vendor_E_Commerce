const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    shopSlug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    businessEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      default: "",
    },

    logo: {
      public_id: String,
      url: String,
    },

    banner: {
      public_id: String,
      url: String,
    },

    gstNumber: {
      type: String,
      default: "",
      uppercase: true,
    },

    panNumber: {
      type: String,
      default: "",
      uppercase: true,
    },

    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },

    upiId: {
      type: String,
      default: "",
    },

    socialLinks: {
      website: String,
      facebook: String,
      instagram: String,
      youtube: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },

    rejectReason: {
      type: String,
      default: "",
    },

    approvedAt: Date,

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    totalRevenue: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

vendorSchema.pre("save", function () {
  if (!this.shopSlug && this.shopName) {
    this.shopSlug = this.shopName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

module.exports = mongoose.model("Vendor", vendorSchema);
