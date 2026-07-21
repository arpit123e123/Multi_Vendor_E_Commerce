const User = require("../models/User");

/* ===========================
   Become Vendor
=========================== */

const becomeVendor = async (req, res) => {
  try {
    const { shopName, shopDescription, address, city, state, country, pincode } = req.body;

    if (!shopName) {
      return res.status(400).json({
        success: false,
        message: "Shop name is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "vendor") {
      return res.status(400).json({
        success: false,
        message: "You are already a vendor",
      });
    }

    if (user.vendorRequest === "pending") {
      return res.status(400).json({
        success: false,
        message: "Vendor request already pending",
      });
    }

    user.shopName = shopName;
    user.shopDescription = shopDescription || "";
    user.address = address || "";
    user.city = city || "";
    user.state = state || "";
    user.country = country || "India";
    user.pincode = pincode || "";

    user.vendorRequest = "pending";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor request submitted successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Get Vendor Profile
=========================== */

const getVendorProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.user.id).select("-password");

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

module.exports = {
  becomeVendor,
  getVendorProfile,
};