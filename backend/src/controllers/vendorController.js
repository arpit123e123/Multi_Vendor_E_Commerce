const User = require("../models/User");
const Vendor = require("../models/Vendor");
/* ===========================
   Become Vendor
=========================== */

const becomeVendor = async (req, res) => {
  try {
    const { shopName, description, address, phone, logo } = req.body;

    if (!shopName || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Shop name, address and phone are required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already approved vendor
    if (user.role === "vendor") {
      return res.status(400).json({
        success: false,
        message: "You are already a vendor",
      });
    }

    // Existing request
    const existingVendor = await Vendor.findOne({
      owner: user._id,
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: `Vendor request already ${existingVendor.status}`,
      });
    }

    const vendor = await Vendor.create({
      owner: user._id,
      shopName,
      description,
      address,
      phone,
      logo,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Vendor request submitted successfully",
      vendor,
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
    const vendor = await Vendor.findOne({
      owner: req.user.id,
    }).populate("owner", "name email");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
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
const getVendorRequests = async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: "pending" }).populate(
      "owner",
      "name email",
    );

    res.status(200).json({
      success: true,
      vendors,
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
    await vendor.save();
    const user = await User.findById(vendor.owner);
    user.role = "vendor";
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
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.status = "rejected";
    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Vendor request rejected",
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
  getVendorRequests,
  approveVendor,
  rejectVendor,
};
