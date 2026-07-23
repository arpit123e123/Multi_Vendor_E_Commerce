import { useEffect, useMemo, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products");

      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);

      toast.success("Product deleted");

      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase();

      return (
        product.name?.toLowerCase().includes(keyword) ||
        product.vendor?.shopName?.toLowerCase().includes(keyword)
      );
    });
  }, [products, search]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>

        <button
          onClick={fetchProducts}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      <input
        className="border rounded-lg px-4 py-2 w-full mb-6"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          No Products Found
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={
                  product.images?.[0] ||
                  "https://placehold.co/400x400?text=No+Image"
                }
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />

              <div className="p-4">
                <h2 className="font-bold text-lg">{product.name}</h2>

                <p className="text-blue-600 font-semibold mt-2">
                  ₹{product.price}
                </p>

                <p className="mt-2">
                  Vendor : {product.vendor?.shopName || "N/A"}
                </p>

                <p className="mt-2">
                  Category : {product.category?.name || "N/A"}
                </p>

                <div className="mt-3">
                  {product.stock > 0 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-5">
                  <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
