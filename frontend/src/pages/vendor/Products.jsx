import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchVendorProducts();
  }, []);


  const fetchVendorProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/vendor/products");

      setProducts(data.products || []);

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {

    try {

      await api.delete(`/products/${id}`);

      toast.success("Product deleted");

      fetchVendorProducts();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );

    }

  };


  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          📦 My Products
        </h1>


        {loading ? (

          <p className="text-xl">
            Loading products...
          </p>

        ) : products.length === 0 ? (

          <div className="bg-white shadow rounded-xl p-10 text-center">

            <h2 className="text-2xl font-semibold">
              No Products Found
            </h2>

          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-6">

            {products.map((product)=>(

              <div
                key={product._id}
                className="bg-white shadow rounded-xl p-5"
              >

                <img
                  src={
                    product.images?.[0] ||
                    "/no-image.png"
                  }
                  className="w-full h-48 object-cover rounded-lg"
                />


                <h2 className="text-xl font-bold mt-4">
                  {product.name}
                </h2>


                <p className="text-blue-600 font-semibold">
                  ₹{product.price}
                </p>


                <p>
                  Stock: {product.stock}
                </p>


                <button
                  onClick={()=>handleDelete(product._id)}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </MainLayout>
  );
}


export default VendorProducts;