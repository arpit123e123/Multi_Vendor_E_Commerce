const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpire: {
      type: Date,
      default: null,
    },
    vendorRequest: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    shopName: {
      type: String,
      default: "",
      trim: true,
    },

    shopDescription: {
      type: String,
      default: "",
      trim: true,
    },
    emailVerificationToken: {
      type: String,
    },

    emailVerificationExpire: {
      type: Date,
    },
    shopLogo: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      default: "",
      match: [/^\d{6}$/, "Please enter a valid pincode"],
    },
  },
  {
    timestamps: true,
  },
);

// Hash Password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
