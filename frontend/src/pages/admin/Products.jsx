import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products");

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">📦 Manage Products</h1>

        {loading ? (
          <p className="text-xl">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-10 text-center">
            No Products Found
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white shadow rounded-xl p-5">
                <img
                  src={
                    product.images?.[0] ||
                    "/no-imagdata:image/webp;base64,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e.png"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <h2 className="font-bold text-lg mt-4">{product.name}</h2>

                <p className="text-blue-600 font-semibold mt-2">
                  ₹{product.price}
                </p>

                <p className="mt-2">Stock: {product.stock}</p>

                <p className="text-sm text-gray-500 mt-2">
                  Vendor: {product.vendor?.shopName || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Products;
