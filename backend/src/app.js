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

  // Vercel production
  "https://multi-vendor-e-commerce-o58m10dfd-ar8.vercel.app",

  // Previous deployments
  "https://multi-vendor-e-commerce-sand.vercel.app",
  "https://multi-vendor-e-commerce-ar8.vercel.app",
  "https://multi-vendor-e-commerce-git-master-ar8.vercel.app",
];

// ===========================
// CORS
// ===========================

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // Example: Postman, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
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