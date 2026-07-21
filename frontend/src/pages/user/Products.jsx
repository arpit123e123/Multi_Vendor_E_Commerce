import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProductCard from "../../components/common/ProductCard";
import { getProducts } from "../../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();

      if (response?.products) {
        setProducts(response.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-2">All Products</h1>

        <p className="mb-8 text-gray-600">Total Products: {products.length}</p>

        {loading ? (
          <h2 className="text-xl">Loading...</h2>
        ) : products.length === 0 ? (
          <h2 className="text-red-500 text-xl">No Products Found</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Products;