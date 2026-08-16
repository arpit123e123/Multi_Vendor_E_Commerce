const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
// Routes
const authRoutes = require("./uploads/routes/authRoutes");
const vendorRoutes = require("./uploads/routes/vendorRoutes");
const userRoutes = require("./uploads/routes/userRoutes");
const productRoutes = require("./uploads/routes/productRoutes");
const categoryRoutes = require("./uploads/routes/categoryRoutes");
const cartRoutes = require("./uploads/routes/cartRoutes");
const addressRoutes = require("./uploads/routes/addressRoutes");
const orderRoutes = require("./uploads/routes/orderRoutes");
const paymentRoutes = require("./uploads/routes/paymentRoutes");
const adminRoutes = require("./uploads/routes/adminRoutes");
const reviewRoutes = require("./uploads/routes/reviewRoutes");
const wishlistRoutes = require("./uploads/routes/wishlistRoutes");
const couponRoutes = require("./uploads/routes/couponRoutes");
const aiRoutes = require("../routes/aiRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

/* ===========================
   Middlewares
=========================== */

const allowedOrigins = [
  "http://localhost:5173",

  // Vercel production
  "https://multi-vendor-e-commerce-o58m10dfd-ar8.vercel.app",

  // Previous deployments
  "https://multi-vendor-e-commerce-sand.vercel.app",
  "https://multi-vendor-e-commerce-ar8.vercel.app",
  "https://multi-vendor-e-commerce-git-master-ar8.vercel.app",
];
 
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());

//app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRoutes);
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use("/api/ai", aiRoutes);
/* ===========================
   Routes
=========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Multi Vendor E-Commerce API Running Successfully",
  });
});

app.use("/api/auth", authRoutes);
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

/* ===========================
   404 Route
=========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

/* ===========================
   Global Error Handler
=========================== */

app.use(errorHandler);

module.exports = app;
