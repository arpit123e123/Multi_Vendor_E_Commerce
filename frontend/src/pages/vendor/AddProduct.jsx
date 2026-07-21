import { useState } from "react";
import { toast } from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/axios";

function AddProduct() {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);

      if (image) {
        data.append("image", image);
      }


      await api.post("/products/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      toast.success("Product Added Successfully");


      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });

      setImage(null);


    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to add product"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <MainLayout>

      <div className="max-w-3xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          ➕ Add New Product
        </h1>


        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-5"
        >


          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            rows="4"
            required
          />


          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <input
            type="text"
            name="category"
            placeholder="Category ID"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setImage(e.target.files[0])}
            className="w-full"
          />


          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {loading
            ? "Adding..."
            : "Add Product"}

          </button>


        </form>


      </div>

    </MainLayout>
  );
}


export default AddProduct;