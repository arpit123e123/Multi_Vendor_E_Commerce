const slugify = require("slugify");

// ==========================
// BRANDS
// ==========================

const brands = {
  Mobiles: [
    "Apple",
    "Samsung",
    "OnePlus",
    "Xiaomi",
    "Realme",
    "Vivo",
    "Oppo",
    "Google",
    "Motorola",
    "Nothing",
  ],

  Laptops: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Samsung"],

  Tablets: ["Apple", "Samsung", "Lenovo", "Xiaomi", "Realme"],

  "Smart Watches": ["Apple", "Samsung", "Noise", "boAt", "FireBoltt"],

  Earbuds: ["boAt", "OnePlus", "Realme", "Noise", "Sony", "JBL"],

  Headphones: ["Sony", "JBL", "boAt", "Sennheiser", "Marshall"],

  Televisions: ["Sony", "Samsung", "LG", "Mi", "TCL", "Hisense"],

  Cameras: ["Canon", "Nikon", "Sony", "Fujifilm"],

  Gaming: ["Sony", "Microsoft", "ASUS", "Logitech", "Razer"],

  Shoes: ["Nike", "Adidas", "Puma", "Reebok", "Skechers"],
};

// ==========================
// PRODUCT NAMES
// ==========================

const productTemplates = {
  Mobiles: ["Pro", "Pro Max", "Ultra", "Plus", "Lite", "5G", "Edge"],

  Laptops: [
    "Gaming Laptop",
    "Business Laptop",
    "Ultrabook",
    "Notebook",
    "Creator Edition",
  ],

  Tablets: ["Tablet", "Pad", "Air", "Pro"],

  "Smart Watches": ["Smart Watch", "Watch Pro", "Watch Ultra"],

  Earbuds: ["Wireless Earbuds", "TWS", "Buds Pro"],

  Headphones: ["Wireless Headphones", "Gaming Headset", "Studio Headphones"],

  Televisions: ["4K Smart TV", "OLED TV", "QLED TV"],

  Cameras: ["Mirrorless Camera", "DSLR Camera"],

  Gaming: ["Gaming Mouse", "Gaming Keyboard", "Gaming Monitor"],

  Shoes: ["Running Shoes", "Casual Shoes", "Sports Shoes"],
};

// ==========================
// HELPERS
// ==========================

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateSlug = (brand, name, index) =>
  slugify(`${brand}-${name}-${index}`, {
    lower: true,
    strict: true,
  });

// ==========================
// PRICE
// ==========================

const generatePrice = () => random(499, 199999);

const generateDiscount = (price) => Math.floor((price * random(5, 40)) / 100);

// ==========================
// STOCK
// ==========================

const generateStock = () => random(5, 500);

// ==========================
// RATING
// ==========================

const generateRating = () => (Math.random() * 2 + 3).toFixed(1);

// ==========================
// REVIEWS
// ==========================

const generateReviews = () => random(5, 2500);

// ==========================
// IMAGE PLACEHOLDER
// ==========================

const placeholderImage = {
  public_id: "sample",
  url: "https://dummyimage.com/600x600/e5e7eb/555555&text=Product",
};

// ==========================
// SPECIFICATIONS GENERATOR
// ==========================

const generateSpecifications = (category) => {
  switch (category) {
    case "Mobiles":
      return [
        {
          key: "Display",
          value: `${random(6, 7)}.${random(1, 9)} Inch AMOLED`,
        },
        { key: "RAM", value: `${randomItem([4, 6, 8, 12, 16])} GB` },
        { key: "Storage", value: `${randomItem([64, 128, 256, 512])} GB` },
        { key: "Battery", value: `${random(4000, 6000)} mAh` },
        {
          key: "Processor",
          value: randomItem(["Snapdragon", "Dimensity", "A18 Bionic"]),
        },
      ];

    case "Laptops":
      return [
        {
          key: "Processor",
          value: randomItem(["Intel i5", "Intel i7", "Ryzen 5", "Ryzen 7"]),
        },
        { key: "RAM", value: `${randomItem([8, 16, 32])} GB` },
        { key: "Storage", value: `${randomItem([256, 512, 1024])} GB SSD` },
        {
          key: "Display",
          value: randomItem(["14 Inch", "15.6 Inch", "16 Inch"]),
        },
      ];

    case "Televisions":
      return [
        { key: "Screen", value: `${randomItem([32, 43, 50, 55, 65])} Inch` },
        { key: "Resolution", value: "4K UHD" },
        { key: "Smart TV", value: "Yes" },
      ];

    default:
      return [{ key: "Warranty", value: "1 Year" }];
  }
};

// ==========================
// DESCRIPTION
// ==========================

const generateDescription = (brand, category) => {
  return `${brand} premium ${category.toLowerCase()} with excellent build quality, powerful performance and modern design.`;
};

// ==========================
// PRODUCT OBJECT
// ==========================

const createProduct = ({
  brand,
  category,
  categoryId,
  vendorId,
  template,
  index,
}) => {
  const price = generatePrice();
  const discount = generateDiscount(price);

  const name = `${brand} ${template} ${index}`;

  return {
    vendor: vendorId,

    name,

    slug: generateSlug(brand, name, index),

    brand,

    description: generateDescription(brand, category),

    category: categoryId,

    price,

    discountPrice: price - discount,

    stock: generateStock(),

    averageRating: Number(generateRating()),

    numReviews: generateReviews(),

    specifications: generateSpecifications(category),

    images: [placeholderImage],

    isFeatured: Math.random() > 0.9,

    status: "active",

    isActive: true,
  };
};

// ==========================
// PRODUCTS GENERATOR
// ==========================

const generateProducts = (categories, vendors) => {
  const products = [];

  let productIndex = 1;

  categories.forEach((category) => {
    const categoryName = category.name;

    const categoryBrands = brands[categoryName];

    const templates = productTemplates[categoryName];

    // Agar is category ke liye templates nahi hain to skip
    if (!categoryBrands || !templates) return;

    categoryBrands.forEach((brand) => {
      templates.forEach((template) => {
        // Har brand/template ke 10 products
        for (let i = 1; i <= 10; i++) {
          const randomVendor =
            vendors[Math.floor(Math.random() * vendors.length)];

          products.push(
            createProduct({
              brand,
              category: categoryName,
              categoryId: category._id,
              vendorId: randomVendor._id,
              template,
              index: productIndex++,
            }),
          );
        }
      });
    });
  });

  return products;
};

module.exports = generateProducts;
