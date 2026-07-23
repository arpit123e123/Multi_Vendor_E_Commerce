const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { verifyMailConnection } = require("./config/mail");

const PORT = process.env.PORT || 5000;

/* ===========================
   Start Server
=========================== */

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();

/* ===========================
   Handle Unhandled Promise Rejection
=========================== */

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection");
  console.error(err.message);
  process.exit(1);
});

/* ===========================
   Handle Uncaught Exception
=========================== */

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception");
  console.error(err.message);
  process.exit(1);
});