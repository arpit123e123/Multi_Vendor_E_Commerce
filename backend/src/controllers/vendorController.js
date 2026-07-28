const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const becomeVendor = async (req, res) => {
  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const {
      shopName,
      description,
      address,
      phone,
      city,
      state,
      country,
      pincode,
      businessEmail,
      gstNumber,
      panNumber,
      upiId,
    } = req.body;

    if (!shopName?.trim()) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Shop name is required",
      });
    }

    if (!address?.trim()) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!phone?.trim()) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await User.findById(req.user._id).session(session);

    if (!user) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "vendor") {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "You are already a vendor",
      });
    }

    if (user.vendorRequest === "pending") {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Vendor request already submitted",
      });
    }

    const existingVendor = await Vendor.findOne({
      owner: user._id,
    }).session(session);

    if (existingVendor) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: `Application already ${existingVendor.status}`,
      });
    }

    const existingShop = await Vendor.findOne({
      shopSlug: createSlug(shopName),
    }).session(session);

    if (existingShop) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Shop name already exists",
      });
    }

    const vendor = await Vendor.create(
      [
        {
          owner: user._id,

          shopName: shopName.trim(),

          shopSlug: createSlug(shopName),

          description: description || "",

          address,

          city,

          state,

          country,

          pincode,

          businessEmail,

          gstNumber,

          panNumber,

          phone,

          upiId,

          status: "pending",

          isActive: false,
        },
      ],
      {
        session,
      }
    );

    user.vendorRequest = "pending";

    await user.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message:
        "Vendor application submitted successfully. Wait for admin approval.",
      vendor: vendor[0],
    });

  } catch (error) {

    await session.abortTransaction();

    console.error("Become Vendor:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit vendor request",
    });

  } finally {

    session.endSession();

  }
};
const getVendorRequests = async (req, res) => {
  try {

    const { status = "pending" } = req.query;

    const vendors = await Vendor.find({ status })
      .populate(
        "owner",
        "name email phone createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: vendors.length,
      vendors,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor requests",
    });

  }
};
const approveVendor = async (req, res) => {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const vendor = await Vendor.findById(req.params.id).session(session);

    if (!vendor) {

      await session.abortTransaction();

      return res.status(404).json({
        success:false,
        message:"Vendor not found"
      });

    }

    if(vendor.status==="approved"){

      await session.abortTransaction();

      return res.status(400).json({
        success:false,
        message:"Vendor already approved"
      });

    }

    const user = await User.findById(vendor.owner).session(session);

    if(!user){

      await session.abortTransaction();

      return res.status(404).json({
        success:false,
        message:"User not found"
      });

    }

    vendor.status="approved";

    vendor.isActive=true;

    vendor.isVerified=true;

    vendor.approvedAt=new Date();

    vendor.approvedBy=req.user._id;

    user.role="vendor";

    user.vendorRequest="approved";

    user.shopName=vendor.shopName;

    user.shopDescription=vendor.description;

    user.shopLogo=vendor.logo?.url || "";

    await vendor.save({session});

    await user.save({session});

    await session.commitTransaction();

    return res.status(200).json({

      success:true,

      message:"Vendor approved successfully",

      vendor

    });

  } catch(error){

    await session.abortTransaction();

    console.error(error);

    return res.status(500).json({

      success:false,

      message:"Failed to approve vendor"

    });

  } finally{

    session.endSession();

  }

};
const rejectVendor = async (req,res)=>{

const session=await mongoose.startSession();

try{

session.startTransaction();

const {reason}=req.body;

const vendor=await Vendor.findById(req.params.id).session(session);

if(!vendor){

await session.abortTransaction();

return res.status(404).json({

success:false,

message:"Vendor not found"

});

}

vendor.status="rejected";

vendor.rejectReason=reason || "Rejected by admin";

vendor.isActive=false;

await vendor.save({session});

const user=await User.findById(vendor.owner).session(session);

user.vendorRequest="rejected";

await user.save({session});

await session.commitTransaction();

return res.status(200).json({

success:true,

message:"Vendor rejected successfully"

});

}catch(error){

await session.abortTransaction();

console.error(error);

return res.status(500).json({

success:false,

message:"Failed to reject vendor"

});

}finally{

session.endSession();

}

};
const suspendVendor = async (req,res)=>{

try{

const vendor=await Vendor.findById(req.params.id);

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found"

});

}

vendor.status="suspended";

vendor.isActive=false;

await vendor.save();

const user=await User.findById(vendor.owner);

if(user){

user.role="customer";

await user.save();

}

return res.status(200).json({

success:true,

message:"Vendor suspended successfully"

});

}catch(error){

console.error(error);

return res.status(500).json({

success:false,

message:"Failed to suspend vendor"

});

}

};
const getVendorDashboard = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
      status: "approved",
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenue,
      recentOrders,
      topProducts,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments({ vendor: vendor._id }),

      Product.countDocuments({
        vendor: vendor._id,
        isActive: true,
      }),

      Product.countDocuments({
        vendor: vendor._id,
        stock: 0,
      }),

      Order.countDocuments({
        "items.vendor": vendor._id,
      }),

      Order.countDocuments({
        "items.vendor": vendor._id,
        orderStatus: "Pending",
      }),

      Order.countDocuments({
        "items.vendor": vendor._id,
        orderStatus: "Delivered",
      }),

      Order.countDocuments({
        "items.vendor": vendor._id,
        orderStatus: "Cancelled",
      }),

      Order.aggregate([
        {
          $match: {
            "items.vendor": vendor._id,
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
             $sum: "$totalAmount"
            },
          },
        },
      ]),

      Order.find({
        "items.vendor": vendor._id,
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email"),

      Product.find({
        vendor: vendor._id,
      })
        .sort({ sold: -1 })
        .limit(5)
        .select("name sold price images"),

      Product.find({
        vendor: vendor._id,
        stock: {
          $lte: 5,
        },
      }).select("name stock"),
    ]);

    return res.status(200).json({
      success: true,

      dashboard: {
        products: {
          total: totalProducts,
          active: activeProducts,
          outOfStock: outOfStockProducts,
        },

        orders: {
          total: totalOrders,
          pending: pendingOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },

        revenue: revenue[0]?.revenue || 0,

        recentOrders,

        topProducts,

        lowStockProducts,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};
const getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
      status: "approved",
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, paymentStatus, search } = req.query;

    const filter = {
      "items.vendor": vendor._id,
    };

    if (status) {
      filter.orderStatus = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
      ];
    }

    const totalOrders = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor orders",
    });

  }
};
const updateVendorOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatus = [
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(orderStatus)) {
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

    order.orderStatus = orderStatus;

   order.trackingHistory.push({
    status: orderStatus,
    message: `Order ${orderStatus}`,
    updatedAt: new Date(),
});

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });

  }
};
const getVendorAnalytics = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
      status: "approved",
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const monthlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          "items.vendor": vendor._id,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: "$totalAmount",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const topProducts = await Product.find({
      vendor: vendor._id,
    })
      .sort({ sold: -1 })
      .limit(10)
      .select("name sold stock price averageRating");

    const totalRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          "items.vendor": vendor._id,
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,

      analytics: {
        totalRevenue: totalRevenue[0]?.revenue || 0,
        monthlySales,
        topProducts,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load analytics",
    });
  }
};
const getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
      status: "approved",
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const filter = {
      vendor: vendor._id,
    };

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor products",
    });
  }
};
const deleteVendorProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
      status: "approved",
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      vendor: vendor._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;
    product.status = "draft";

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });

  }
};
const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
      status: "approved",
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const fields = [
      "shopName",
      "description",
      "phone",
      "address",
      "city",
      "state",
      "country",
      "pincode",
      "businessEmail",
      "gstNumber",
      "panNumber",
      "upiId",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        vendor[field] = req.body[field];
      }
    });

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      vendor,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update vendor profile",
    });
  }
};
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      discountPrice,
      stock,
    } = req.body;

    if (
      !name ||
      !description ||
      !brand ||
      !category ||
      !price ||
      !stock
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const vendor = await Vendor.findOne({
      owner: req.user._id,
      status: "approved",
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload product images",
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const product = await Product.create({
      name,
      slug,
      description,
      brand,
      category,
      vendor: vendor._id,
      price,
      discountPrice: discountPrice || 0,
      stock,
      images: uploadedImages,
      isActive: true,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Create Product:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};
const changeProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "active",
      "draft",
      "out_of_stock",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product status",
      });
    }

    const vendor = await Vendor.findOne({
      owner: req.user._id,
    });

    const product = await Product.findOne({
      _id: req.params.id,
      vendor: vendor._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.status = status;
    product.isActive = status === "active";

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      product,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product status",
    });

  }
};
const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, action } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide product ids",
      });
    }

    const vendor = await Vendor.findOne({
      owner: req.user._id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    let update = {};

    switch (action) {
      case "activate":
        update = {
          status: "active",
          isActive: true,
        };
        break;

      case "draft":
        update = {
          status: "draft",
          isActive: false,
        };
        break;

      case "out_of_stock":
        update = {
          status: "out_of_stock",
          isActive: false,
        };
        break;

      case "delete":
        update = {
          isActive: false,
          status: "draft",
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action",
        });
    }

    const result = await Product.updateMany(
      {
        _id: {
          $in: productIds,
        },
        vendor: vendor._id,
      },
      {
        $set: update,
      }
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} products updated successfully`,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Bulk update failed",
    });

  }
};
const getVendorStats = async (req, res) => {

    try{

        const vendor = await Vendor.findOne({
            owner:req.user._id
        });

        const stats = await Product.aggregate([

            {
                $match:{
                    vendor:vendor._id
                }
            },

            {
                $group:{

                    _id:null,

                    totalProducts:{
                        $sum:1
                    },

                    totalStock:{
                        $sum:"$stock"
                    },

                    totalSold:{
                        $sum:"$sold"
                    },

                    averageRating:{
                        $avg:"$averageRating"
                    }

                }
            }

        ]);

        return res.status(200).json({

            success:true,

            stats:stats[0] || {}

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Failed to fetch stats"

        });

    }

};

const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user._id,
    }).populate("owner", "name email phone role");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error("Get Vendor Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor profile",
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
  getVendorDashboard,
  getVendorOrders,
  updateVendorOrderStatus,
  getVendorAnalytics,
  getVendorProducts,
  deleteVendorProduct,
  updateVendorProfile,
  changeProductStatus,
  bulkUpdateProducts,
  getVendorStats,
  createProduct,
};