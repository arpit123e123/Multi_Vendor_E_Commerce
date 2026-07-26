const User = require("../models/User");
const Vendor = require("../models/Vendor");

/* ===========================
   Become Vendor
=========================== */
const becomeVendor = async (req, res) => {
  try {
    const {
      shopName,
      description,
      address,
      phone,
      logo,
    } = req.body;

    // Validation
    if (!shopName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shop name is required",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already vendor
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
        message: `Your request is currently ${existingVendor.status}`,
      });
    }

    const vendor = await Vendor.create({
      owner: user._id,
      shopName: shopName.trim(),
      description: description?.trim() || "",
      address: address.trim(),
      phone: phone.trim(),
      logo: logo || {},
      status: "pending",
    });

    user.vendorRequest = "pending";
    await user.save();

    return res.status(201).json({
      success: true,
      message:
        "Vendor application submitted successfully. Please wait for admin approval.",
      vendor,
    });
  } catch (error) {
    console.error("Become Vendor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
    }).populate("owner", "name email role");

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

/* ===========================
   Get Vendor Requests
=========================== */
const getVendorRequests = async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: "pending" }).populate(
      "owner",
      "name email phone",
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

/* ===========================
   Approve Vendor
=========================== */
const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    if (vendor.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Vendor already approved",
      });
    }

    vendor.status = "approved";
    await vendor.save();

    const user = await User.findById(vendor.owner);

    user.role = "vendor";
    user.vendorRequest = "approved";
    user.shopName = vendor.shopName;
    user.shopDescription = vendor.description || "";
    user.shopLogo = vendor.logo || "";

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

/* ===========================
   Reject Vendor
=========================== */
const rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    if (vendor.status === "rejected") {
  return res.status(400).json({
    success: false,
    message: "Vendor already rejected",
  });
}

    vendor.status = "rejected";
    await vendor.save();

    const user = await User.findById(vendor.owner);

    user.vendorRequest = "rejected";
    await user.save();

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

const suspendVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.status = "suspended";
    await vendor.save();

    const user = await User.findById(vendor.owner);

    if (user) {
      user.role = "customer";
      user.vendorRequest = "approved";
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Vendor suspended successfully",
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
  suspendVendor,                                                 
};
