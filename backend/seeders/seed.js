const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const connectDB = require("../src/config/db");

const User = require("../src/models/User");
const Vendor = require("../src/models/Vendor");
const Category = require("../src/models/Category");
const Product = require("../src/models/Product");

const TOTAL_VENDORS = 100;
const PRODUCTS_PER_VENDOR = 20;

// ======================================================
// CATEGORY DATA
// ======================================================

const categoryData = [
  {
    name: "Mobiles",
    brands: ["Apple", "Samsung", "OnePlus", "Xiaomi"],
    types: ["Smartphone", "5G Phone", "Pro Phone", "Ultra Phone", "Budget Phone"],
    min: 9999,
    max: 149999,
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd9?w=800",
  },
  {
    name: "Laptops",
    brands: ["Apple", "Dell", "HP", "Lenovo", "ASUS"],
    types: ["Laptop", "Gaming Laptop", "Business Laptop", "Ultrabook"],
    min: 39999,
    max: 249999,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
  },
  {
    name: "Headphones",
    brands: ["Sony", "JBL", "Boat", "Sennheiser", "Bose"],
    types: ["Wireless Headphones", "Earbuds", "ANC Headphones", "Gaming Headset"],
    min: 999,
    max: 29999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  },
  {
    name: "Smart Watches",
    brands: ["Apple", "Samsung", "Noise", "Boat", "Garmin"],
    types: ["Smart Watch", "Fitness Watch", "GPS Watch", "Sports Watch"],
    min: 1999,
    max: 69999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  },
  {
    name: "Cameras",
    brands: ["Canon", "Nikon", "Sony", "Fujifilm"],
    types: ["Mirrorless Camera", "DSLR Camera", "Action Camera", "Digital Camera"],
    min: 24999,
    max: 299999,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
  },
  {
    name: "Televisions",
    brands: ["Sony", "Samsung", "LG", "OnePlus", "TCL"],
    types: ["Smart TV", "4K TV", "OLED TV", "QLED TV"],
    min: 19999,
    max: 199999,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
  },
  {
    name: "Tablets",
    brands: ["Apple", "Samsung", "Lenovo", "Xiaomi"],
    types: ["Tablet", "Android Tablet", "Gaming Tablet", "Pro Tablet"],
    min: 9999,
    max: 99999,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
  },
  {
    name: "Gaming",
    brands: ["Sony", "Microsoft", "ASUS", "Logitech", "Razer"],
    types: ["Gaming Console", "Gaming Controller", "Gaming Mouse", "Gaming Keyboard"],
    min: 1999,
    max: 79999,
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800",
  },
  {
    name: "Computer Accessories",
    brands: ["Logitech", "HP", "Dell", "Lenovo", "Microsoft"],
    types: ["Keyboard", "Mouse", "Webcam", "Monitor", "USB Hub"],
    min: 499,
    max: 49999,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
  },
  {
    name: "Printers",
    brands: ["HP", "Canon", "Epson", "Brother"],
    types: ["Inkjet Printer", "Laser Printer", "All-in-One Printer"],
    min: 4999,
    max: 49999,
    image:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800",
  },

  // ==================================================
  // FASHION
  // ==================================================

  {
    name: "Men Clothing",
    brands: ["Levis", "Puma", "Adidas", "Nike", "Roadster"],
    types: ["T-Shirt", "Shirt", "Jeans", "Hoodie", "Jacket"],
    min: 499,
    max: 9999,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800",
  },
  {
    name: "Women Clothing",
    brands: ["H&M", "Zara", "Levis", "Biba", "Roadster"],
    types: ["Top", "Dress", "Jeans", "Kurti", "Jacket"],
    min: 499,
    max: 9999,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
  },
  {
    name: "Shoes",
    brands: ["Nike", "Adidas", "Puma", "Reebok", "Skechers"],
    types: ["Running Shoes", "Sneakers", "Casual Shoes", "Sports Shoes"],
    min: 999,
    max: 19999,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  },
  {
    name: "Watches",
    brands: ["Titan", "Casio", "Fossil", "Timex", "Sonata"],
    types: ["Analog Watch", "Chronograph Watch", "Digital Watch", "Luxury Watch"],
    min: 999,
    max: 49999,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
  },
  {
    name: "Bags",
    brands: ["American Tourister", "Skybags", "Wildcraft", "Puma"],
    types: ["Backpack", "Laptop Bag", "Travel Bag", "Duffel Bag"],
    min: 799,
    max: 9999,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
  },

  // ==================================================
  // HOME
  // ==================================================

  {
    name: "Furniture",
    brands: ["IKEA", "Wakefit", "Pepperfry", "Home Centre"],
    types: ["Sofa", "Chair", "Table", "Bed", "Bookshelf"],
    min: 1999,
    max: 99999,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  },
  {
    name: "Home Appliances",
    brands: ["LG", "Samsung", "Whirlpool", "IFB", "Godrej"],
    types: ["Refrigerator", "Washing Machine", "Microwave", "Air Conditioner"],
    min: 7999,
    max: 129999,
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
  },
  {
    name: "Kitchen",
    brands: ["Prestige", "Bajaj", "Philips", "Havells"],
    types: ["Mixer Grinder", "Air Fryer", "Cooker", "Electric Kettle"],
    min: 799,
    max: 19999,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
  },
  {
    name: "Home Decor",
    brands: ["Home Centre", "IKEA", "Spaces", "Chumbak"],
    types: ["Wall Decor", "Lamp", "Cushion", "Vase", "Clock"],
    min: 299,
    max: 9999,
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
  },

  // ==================================================
  // OTHER
  // ==================================================

  {
    name: "Books",
    brands: ["Penguin", "HarperCollins", "Oxford", "McGraw Hill"],
    types: ["Programming Book", "Fiction Book", "Business Book", "Academic Book"],
    min: 199,
    max: 3999,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
  },
  {
    name: "Sports",
    brands: ["Nike", "Adidas", "Puma", "Yonex", "Cosco"],
    types: ["Football", "Cricket Bat", "Badminton Racket", "Sports Shoes"],
    min: 499,
    max: 24999,
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
  },
  {
    name: "Beauty",
    brands: ["Lakme", "Maybelline", "Nivea", "L'Oreal"],
    types: ["Face Cream", "Lipstick", "Perfume", "Makeup Kit"],
    min: 199,
    max: 9999,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
  },
  {
    name: "Grocery",
    brands: ["Tata", "Fortune", "Aashirvaad", "India Gate"],
    types: ["Rice", "Atta", "Cooking Oil", "Dal", "Spices"],
    min: 99,
    max: 1999,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
  },
];

// ======================================================
// HELPERS
// ======================================================

const slugify = (value) => {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomDiscountPrice = (price) => {
  const discount = randomNumber(5, 25);

  return Math.round(price - (price * discount) / 100);
};

// ======================================================
// VENDOR NAMES
// ======================================================

const vendorPrefixes = [
  "Tech",
  "Smart",
  "Prime",
  "Urban",
  "Elite",
  "Digital",
  "NextGen",
  "Mega",
  "Super",
  "Global",
  "Modern",
  "Royal",
  "Premium",
  "Quick",
  "Value",
  "Trend",
  "Nova",
  "Pro",
  "Star",
  "Best",
];

const vendorSuffixes = [
  "Mart",
  "Store",
  "Hub",
  "World",
  "Zone",
  "Point",
  "Kart",
  "Shop",
  "House",
  "Bazaar",
];

// ======================================================
// CREATE ADMIN
// ======================================================

const createAdmin = async () => {
  let admin = await User.findOne({
    email: "admin@demo.local",
  }).select("+password");

  if (!admin) {
    admin = await User.create({
      name: "Demo Admin",
      email: "admin@demo.local",
      password: "Admin@12345",
      role: "admin",
      phone: "9000000000",
      isVerified: true,
      vendorRequest: "none",
    });

    console.log("✅ Demo admin created");
  }

  return admin;
};

// ======================================================
// CREATE CATEGORIES
// ======================================================

const createCategories = async () => {
  const categories = [];

  for (const item of categoryData) {
    categories.push({
      name: item.name,
      slug: slugify(item.name),
      image: item.image,
      isActive: true,
    });
  }

  const inserted = [];

  for (const category of categories) {
    const existing = await Category.findOne({
      slug: category.slug,
    });

    if (existing) {
      inserted.push(existing);
    } else {
      inserted.push(await Category.create(category));
    }
  }

  return inserted;
};

// ======================================================
// CREATE 100 REGISTERED VENDORS
// ======================================================

const createVendors = async (admin) => {
  const vendors = [];

  for (let i = 0; i < TOTAL_VENDORS; i++) {
    const vendorNumber = String(i + 1).padStart(3, "0");

    const category = categoryData[i % categoryData.length];

    const prefix = vendorPrefixes[i % vendorPrefixes.length];

    const suffix =
      vendorSuffixes[Math.floor(i / vendorPrefixes.length) % vendorSuffixes.length];

    const shopName = `${prefix} ${category.name} ${suffix}`;

    const email = `vendor${vendorNumber}@demo.local`;

    // --------------------------------------------------
    // USER
    // --------------------------------------------------

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      user = await User.create({
        name: `Demo Vendor ${vendorNumber}`,
        email,
        password: "Vendor@12345",
        role: "vendor",
        phone: `98${String(10000000 + i).slice(-8)}`,
        isVerified: true,
        vendorRequest: "approved",

        shopName,
        shopDescription: `Official ${category.name} seller on our marketplace.`,
        shopLogo: category.image,
        address: `${100 + i} Marketplace Road`,
        city: i % 2 === 0 ? "Lucknow" : "Noida",
        state: "Uttar Pradesh",
        country: "India",
        pincode: String(226000 + ((i % 99) + 1)).padStart(6, "0"),
      });
    } else {
      user.role = "vendor";
      user.vendorRequest = "approved";
      user.isVerified = true;
      user.shopName = shopName;
      user.shopDescription = `Official ${category.name} seller on our marketplace.`;

      await user.save();
    }

    // --------------------------------------------------
    // VENDOR PROFILE
    // --------------------------------------------------

    let vendor = await Vendor.findOne({
      owner: user._id,
    });

    if (!vendor) {
      vendor = await Vendor.create({
        owner: user._id,

        shopName,

        shopSlug: `demo-${slugify(shopName)}-${vendorNumber}`,

        businessEmail: email,

        phone: user.phone,

        description: `Trusted seller specializing in ${category.name}.`,

        address: user.address,

        city: user.city,

        state: user.state,

        country: "India",

        pincode: user.pincode,

        logo: {
          public_id: `demo-vendors/${vendorNumber}`,
          url: category.image,
        },

        banner: {
          public_id: `demo-vendors/banner-${vendorNumber}`,
          url: category.image,
        },

        status: "approved",

        approvedAt: new Date(),

        approvedBy: admin._id,

        commissionRate: 10,

        isVerified: true,

        isActive: true,
      });
    } else {
      vendor.status = "approved";
      vendor.isActive = true;
      vendor.isVerified = true;
      vendor.approvedAt = vendor.approvedAt || new Date();
      vendor.approvedBy = admin._id;

      await vendor.save();
    }

    vendors.push({
      vendor,
      category,
      user,
      number: vendorNumber,
    });
  }

  return vendors;
};

// ======================================================
// GENERATE PRODUCTS
// ======================================================

const generateProducts = (vendors, categories) => {
  const products = [];

  let productCounter = 1;

  for (const vendorData of vendors) {
    const categoryIndex = categoryData.findIndex(
      (item) => item.name === vendorData.category.name
    );

    const category = categories[categoryIndex];

    const config = vendorData.category;

    for (let i = 0; i < PRODUCTS_PER_VENDOR; i++) {
      const brand = config.brands[i % config.brands.length];

      const type = config.types[i % config.types.length];

      const variantNumber = i + 1;

      const name = `${brand} ${type} Series ${variantNumber}`;

      const price = randomNumber(config.min, config.max);

      const discountPrice = randomDiscountPrice(price);

      const stock = randomNumber(5, 250);

      const slug = `demo-${slugify(name)}-${vendorData.number}-${productCounter}`;

      const rating = Number(
        (3.5 + Math.random() * 1.5).toFixed(1)
      );

      products.push({
        vendor: vendorData.vendor._id,

        name,

        description: `Buy the ${brand} ${type} from ${vendorData.vendor.shopName}. This demo marketplace product includes realistic pricing, inventory, category information and product specifications for testing the e-commerce platform.`,

        price,

        stock,

        brand,

        slug,

        discountPrice,

        sold: randomNumber(0, 500),

        isFeatured: Math.random() < 0.08,

        status: "active",

        specifications: [
          {
            key: "Brand",
            value: brand,
          },
          {
            key: "Category",
            value: config.name,
          },
          {
            key: "Model",
            value: `${type} ${variantNumber}`,
          },
          {
            key: "Warranty",
            value: "1 Year Manufacturer Warranty",
          },
        ],

        category: category._id,

        averageRating: rating,

        numReviews: randomNumber(5, 150),

        images: [
          {
            public_id: `demo-products/${slug}`,
            url: config.image,
          },
          {
            public_id: `demo-products/${slug}-2`,
            url: config.image,
          },
        ],

        isActive: true,
      });

      productCounter++;
    }
  }

  return products;
};

// ======================================================
// MAIN SEED
// ======================================================

const seedDatabase = async () => {
  try {
    console.log("\n🚀 Starting Production Demo Seeder...\n");

    await connectDB();

    // --------------------------------------------------
    // ADMIN
    // --------------------------------------------------

    const admin = await createAdmin();

    // --------------------------------------------------
    // REMOVE ONLY PREVIOUS DEMO DATA
    // --------------------------------------------------

    console.log("🗑 Removing previous demo products...");

    await Product.deleteMany({
      slug: /^demo-/,
    });

    console.log("🗑 Removing previous demo vendors...");

    const oldDemoVendors = await Vendor.find({
      shopSlug: /^demo-/,
    }).select("_id owner");

    const oldVendorIds = oldDemoVendors.map((vendor) => vendor._id);

    if (oldVendorIds.length) {
      await Product.deleteMany({
        vendor: {
          $in: oldVendorIds,
        },
      });
    }

    await Vendor.deleteMany({
      shopSlug: /^demo-/,
    });

    await User.deleteMany({
      email: /^vendor\d+@demo\.local$/,
    });

    // --------------------------------------------------
    // CATEGORIES
    // --------------------------------------------------

    console.log("📂 Creating categories...");

    const categories = await createCategories();

    console.log(`✅ ${categories.length} categories ready`);

    // --------------------------------------------------
    // VENDORS
    // --------------------------------------------------

    console.log("🏪 Creating 100 registered vendors...");

    const vendors = await createVendors(admin);

    console.log(`✅ ${vendors.length} registered vendors ready`);

    // --------------------------------------------------
    // PRODUCTS
    // --------------------------------------------------

    console.log("📦 Generating products...");

    const products = generateProducts(vendors, categories);

    console.log(`📦 ${products.length} products generated`);

    // --------------------------------------------------
    // INSERT IN BATCHES
    // --------------------------------------------------

    const BATCH_SIZE = 500;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      await Product.insertMany(batch, {
        ordered: false,
      });

      console.log(
        `✅ Inserted ${Math.min(i + BATCH_SIZE, products.length)} / ${
          products.length
        } products`
      );
    }

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    console.log("\n======================================");
    console.log("🎉 DEMO MARKETPLACE SEEDED");
    console.log("======================================");

    console.log(`👤 Vendors      : ${vendors.length}`);
    console.log(`📂 Categories   : ${categories.length}`);
    console.log(`📦 Products     : ${products.length}`);

    console.log("\n🔐 Demo Admin");
    console.log("Email    : admin@demo.local");
    console.log("Password : Admin@12345");

    console.log("\n🏪 Demo Vendor Login");
    console.log("Email    : vendor001@demo.local");
    console.log("Password : Vendor@12345");

    console.log("\n🏪 Vendor Login Range");
    console.log("vendor001@demo.local");
    console.log("vendor002@demo.local");
    console.log("...");
    console.log("vendor100@demo.local");
    console.log("Password: Vendor@12345");

    console.log("\n======================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ SEED FAILED");
    console.error(error);

    process.exit(1);
  }
};

seedDatabase();