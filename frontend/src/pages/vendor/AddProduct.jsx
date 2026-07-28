import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import vendorService from "../../services/vendorService";
import categoryService from "../../services/categoryService";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    images: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.categories || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

  const validate = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!formData.brand.trim()) {
      toast.error("Brand is required");
      return false;
    }

    if (!formData.category) {
      toast.error("Select category");
      return false;
    }

    if (!formData.price) {
      toast.error("Enter product price");
      return false;
    }

    if (!formData.stock) {
      toast.error("Enter stock");
      return false;
    }

    if (formData.images.length === 0) {
      toast.error("Upload product images");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append(
        "discountPrice",
        formData.discountPrice
      );
      data.append("stock", formData.stock);

      formData.images.forEach((image) => {
        data.append("images", image);
      });

      await vendorService.createProduct(data);

      toast.success("Product created successfully");

      navigate("/vendor/products");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          "Failed to create product"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">

        <h1 className="mb-2 text-3xl font-bold">
          Add New Product
        </h1>

        <p className="mb-8 text-gray-500">
          Fill product information below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >

          {/* Form fields continue here */}

          {/* Product Name */}
<div>
  <label className="mb-2 block font-medium">
    Product Name
  </label>

  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Enter product name"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Brand */}
<div>
  <label className="mb-2 block font-medium">
    Brand
  </label>

  <input
    type="text"
    name="brand"
    value={formData.brand}
    onChange={handleChange}
    placeholder="Apple, Samsung..."
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Category */}
<div>
  <label className="mb-2 block font-medium">
    Category
  </label>

  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">
      Select Category
    </option>

    {categories.map((category) => (
      <option
        key={category._id}
        value={category._id}
      >
        {category.name}
      </option>
    ))}
  </select>
</div>

{/* Stock */}
<div>
  <label className="mb-2 block font-medium">
    Stock
  </label>

  <input
    type="number"
    name="stock"
    value={formData.stock}
    onChange={handleChange}
    placeholder="100"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Description */}
<div className="md:col-span-2">
  <label className="mb-2 block font-medium">
    Description
  </label>

  <textarea
    rows={5}
    name="description"
    value={formData.description}
    onChange={handleChange}
    placeholder="Write product description..."
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
{/* Price */}
<div>
  <label className="mb-2 block font-medium">
    Price
  </label>

  <input
    type="number"
    name="price"
    value={formData.price}
    onChange={handleChange}
    placeholder="999"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Discount Price */}
<div>
  <label className="mb-2 block font-medium">
    Discount Price
  </label>

  <input
    type="number"
    name="discountPrice"
    value={formData.discountPrice}
    onChange={handleChange}
    placeholder="799"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Product Images */}
<div className="md:col-span-2">
  <label className="mb-2 block font-medium">
    Product Images
  </label>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleImageChange}
    className="w-full rounded-lg border p-3"
  />
</div>

{/* Image Preview */}
{previewImages.length > 0 && (
  <div className="md:col-span-2">
    <label className="mb-3 block font-medium">
      Preview Images
    </label>

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {previewImages.map((image, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border bg-gray-50"
        >
          <img
            src={image}
            alt={`Preview ${index + 1}`}
            className="h-32 w-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
)}
        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </div>

      </form>

    </div>

  </div>
  );
};

export default AddProduct;