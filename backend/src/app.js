const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ===========================
// Routes
// ===========================

const authRoutes = require("../routes/authRoutes");
const vendorRoutes = require("../routes/vendorRoutes");
const userRoutes = require("../routes/userRoutes");
const productRoutes = require("../routes/productRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const cartRoutes = require("../routes/cartRoutes");
const addressRoutes = require("../routes/addressRoutes");
const orderRoutes = require("../routes/orderRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const adminRoutes = require("../routes/adminRoutes");
const reviewRoutes = require("../routes/reviewRoutes");
const wishlistRoutes = require("../routes/wishlistRoutes");
const couponRoutes = require("../routes/couponRoutes");
const aiRoutes = require("../routes/aiRoutes");

// ===========================
// Middleware
// ===========================

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ===========================
// Allowed Origins
// ===========================

const allowedOrigins = [
  "http://localhost:5173",

  // Main Vercel production URL
  "https://multi-vendor-e-commerce-ar8.vercel.app",

  // Previous Vercel deployments
  "https://multi-vendor-e-commerce-sand.vercel.app",
  "https://multi-vendor-e-commerce-git-master-ar8.vercel.app",

  // Backend configured frontend URL
  process.env.CLIENT_URL,
].filter(Boolean);

// Check whether an origin is allowed
const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  // Exact allowed origins
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Allow Vercel deployment URLs for this project
  // Example:
  // https://multi-vendor-e-commerce-gfd9v1xy0-ar8.vercel.app
  if (
    /^https:\/\/multi-vendor-e-commerce-[a-z0-9-]+-ar8\.vercel\.app$/i.test(
      origin
    )
  ) {
    return true;
  }

  return false;
};

// ===========================
// CORS
// ===========================

app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS blocked origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

// ===========================
// Security
// ===========================

app.use(helmet());

// Mongo sanitize disabled for now
// app.use(mongoSanitize());

// ===========================
// Rate Limiter
// ===========================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);

// ===========================
// Body Parsers
// ===========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===========================
// Logger
// ===========================

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ===========================
// AI
// ===========================

app.use("/api/ai", aiRoutes);

// ===========================
// Root
// ===========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Multi Vendor E-Commerce API Running Successfully",
  });
});

// ===========================
// API Routes
// ===========================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);
app.use("/api/users", userRoutes);

app.use("/api/vendor", vendorRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/address", addressRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/coupon", couponRoutes);

// ===========================
// 404
// ===========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ===========================
// Global Error Handler
// ===========================

app.use(errorHandler);

module.exports = app;