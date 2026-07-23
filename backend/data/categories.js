const slugify = (name) =>
  name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");

const categories = [
  "Mobiles",
  "Laptops",
  "Tablets",
  "Smart Watches",
  "Earbuds",
  "Headphones",
  "Televisions",
  "Cameras",
  "Gaming",
  "Men Fashion",
  "Women Fashion",
  "Kids Fashion",
  "Shoes",
  "Beauty",
  "Health",
  "Grocery",
  "Furniture",
  "Home Decor",
  "Kitchen",
  "Sports",
  "Books",
  "Automotive",
  "Pet Supplies",
  "Toys",
  "Office Supplies",
];

module.exports = categories.map((name) => ({
  name,
  slug: slugify(name),
  image: "",
  isActive: true,
}));