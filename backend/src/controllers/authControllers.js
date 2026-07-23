const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");

// ==========================
// Register User
// ==========================
const register = async (req, res) => {
  try {
    let { name, email, password, phone, role } = req.body;

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    email = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Prevent admin registration from frontend

    if (!["customer", "vendor"].includes(role)) {
      role = "customer";
    }
    const user = await User.create({
      name: name.trim(),
      email,
      password,
      phone,
      role,
    });
    // Auto assign admin role
    if (user.email === process.env.ADMIN_EMAIL) {
      user.role = "admin";
      await user.save();
    }

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Login User
// ==========================
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // Ensure configured admin always remains admin
    if (user.email === process.env.ADMIN_EMAIL && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }
    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ==========================
// Forgot Password (Send OTP)
// ==========================

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const html = `
      <div style="font-family:Arial">
        <h2>Password Reset OTP</h2>

        <p>Hello <b>${user.name}</b>,</p>

        <p>Your OTP is:</p>

        <h1 style="letter-spacing:5px">${otp}</h1>

        <p>This OTP will expire in 10 minutes.</p>

        <p>If you didn't request this, ignore this email.</p>
      </div>
    `;

    await sendEmail(user.email, "Password Reset OTP", html);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================
// Verify OTP
// ==========================

const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetOtp || !user.resetOtpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    if (Date.now() > user.resetOtpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================
// Reset Password
// ==========================

const resetPassword = async (req, res) => {
  try {
    let { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and password are required",
      });
    }

    email = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetOtp || !user.resetOtpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    if (Date.now() > user.resetOtpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.password = password;

    user.resetOtp = null;
    user.resetOtpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const crypto = require("crypto");

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { forgotPasswordTemplate } = require("../utils/emailTemplates");
const generateResetToken = require("../utils/generateResetToken");
const { logout } = require("../../../frontend/src/redux/slices/authSlice");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Prevent Email Enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const {
      resetToken,
      hashedToken,
      expiresAt,
    } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expiresAt;

    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your ShopHub Password",
        html: forgotPasswordTemplate(resetLink),
      });

      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      throw emailError;
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process request.",
    });
  }
};
module.exports = {
  register,
  login,
  logout  ,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
