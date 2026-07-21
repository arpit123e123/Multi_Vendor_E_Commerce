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

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch products"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          📦 Manage Products
        </h1>


        {loading ? (

          <p className="text-xl">
            Loading products...
          </p>

        ) : products.length === 0 ? (

          <div className="bg-white shadow rounded-xl p-10 text-center">
            No Products Found
          </div>

        ) : (

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

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
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />


                <h2 className="font-bold text-lg mt-4">
                  {product.name}
                </h2>


                <p className="text-blue-600 font-semibold mt-2">
                  ₹{product.price}
                </p>


                <p className="mt-2">
                  Stock: {product.stock}
                </p>


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