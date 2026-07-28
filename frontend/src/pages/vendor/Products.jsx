import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Trash2,
  Power,
  Package,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import vendorService from "../../services/vendorService";

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await vendorService.getVendorProducts();

      setProducts(res.products || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await vendorService.deleteVendorProduct(id);

      toast.success("Product deleted");

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  const handleStatus = async (product) => {
  try {
    const nextStatus =
      product.status === "active"
        ? "draft"
        : "active";

    await vendorService.changeProductStatus(
      product._id,
      nextStatus
    );

    toast.success("Status updated");

    fetchProducts();
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Status update failed."
    );
  }
};

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            My Products
          </h1>

          <p className="text-gray-500">
            Manage all your products.
          </p>

        </div>

       <Link
  to="/vendor/add-product"
  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
>
  <Plus size={18} />
  Add Product
</Link>

      </div>

      {/* Search */}

      <div className="relative mb-8">

        <Search
          size={20}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border py-3 pl-10 pr-4"
        />

      </div>

      {/* Product Table will continue here */}
      {filteredProducts.length === 0 ? (
  <div className="rounded-xl bg-white p-12 text-center shadow">
    <Package size={60} className="mx-auto mb-4 text-gray-400" />

    <h2 className="text-2xl font-semibold">
      No Products Found
    </h2>

    <p className="mt-2 text-gray-500">
      Start by adding your first product.
    </p>
  </div>
) : (
  <div className="overflow-x-auto rounded-xl bg-white shadow">

    <table className="min-w-full">

      <thead className="bg-gray-100">

        <tr>

          <th className="p-4 text-left">Image</th>

          <th className="p-4 text-left">Product</th>

          <th className="p-4 text-left">Category</th>

          <th className="p-4 text-left">Price</th>

          <th className="p-4 text-left">Stock</th>

          <th className="p-4 text-left">Status</th>

          <th className="p-4 text-center">Actions</th>

        </tr>

      </thead>

      <tbody>

        {filteredProducts.map((product) => (

          <tr
            key={product._id}
            className="border-b hover:bg-gray-50"
          >

            {/* Image */}

            <td className="p-4">

              <img
                src={
                  product.images?.[0]?.url ||
                  "https://via.placeholder.com/60"
                }
                alt={product.name}
                className="h-16 w-16 rounded-lg object-cover"
              />

            </td>

            {/* Name */}

            <td className="p-4">

              <h3 className="font-semibold">
                {product.name}
              </h3>

            </td>

            {/* Category */}

            <td className="p-4">
              {product.category?.name || "-"}
            </td>

            {/* Price */}

            <td className="p-4 font-semibold">
              ₹{product.price}
            </td>

            {/* Stock */}

            <td className="p-4">
              {product.stock}
            </td>

            {/* Status */}

            <td className="p-4">

              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  product.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>

            </td>

            {/* Actions */}

            <td className="p-4">

              <div className="flex items-center justify-center gap-3">

                <button
                  onClick={() =>
                    handleStatus(product)
                  }
                  className="rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                  title="Toggle Status"
                >
                  <Power size={18} />
                </button>

                <button
                  onClick={() =>
                    handleDelete(product._id)
                  }
                  className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                  title="Delete Product"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
)}
    </div>
  );
};

export default Products;