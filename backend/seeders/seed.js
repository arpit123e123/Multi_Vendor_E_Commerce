const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const connectDB = require("../src/config/db");

const Category = require("../src/models/Category");
const Product = require("../src/models/Product");
const Vendor = require("../src/models/Vendor");

const categories = require("../data/categories");
const generateProducts = require("../data/products");

const importData = async () => {
  try {
    await connectDB();

    console.log("🗑 Clearing old data...");

    await Product.deleteMany();
    await Category.deleteMany();

    console.log("📂 Importing Categories...");

    const insertedCategories = await Category.insertMany(categories);

    console.log(
      `✅ ${insertedCategories.length} Categories Imported Successfully`
    );

    // ==========================
    // FETCH VENDORS
    // ==========================

    const vendors = await Vendor.find();

    if (!vendors.length) {
      throw new Error(
        "No vendors found. Please seed vendors before products."
      );
    }

    // ==========================
    // GENERATE PRODUCTS
    // ==========================

    const products = generateProducts(insertedCategories, vendors);

    console.log(`📦 Generating ${products.length} products...`);

    await Product.insertMany(products);

    console.log(`✅ ${products.length} Products Imported Successfully`);

    console.log("🎉 Database Seed Completed");

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Category.deleteMany();

    console.log("🗑 Database Cleared");

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}