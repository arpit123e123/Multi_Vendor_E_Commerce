import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProductCard from "../../components/common/ProductCard";
import { getProducts } from "../../services/productService";
import { useSearchParams } from "react-router-dom";
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, sort, page, minPrice, maxPrice, rating, inStock, category]);

 const fetchProducts = async () => {
  try {
    setLoading(true);

   const res = await getProducts({
  keyword: search,
  category,
  sort,
  page,
  limit: 12,
  minPrice,
  maxPrice,
  minRating: rating,
  inStock,
});

    alert(JSON.stringify(res));
    console.log(res);

    setProducts(res.products || []);
    setTotalPages(res.totalPages || 1);
  } catch (err) {
    console.log("ERROR:", err);
    console.log("ERROR RESPONSE:", err.response);
  } finally {
    console.log("Loading false");

    setLoading(false);
  }
  const [searchParams] = useSearchParams();

const category = searchParams.get("category");
};

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-2">
          All Products
        </h1>
<p>
  Loading: {loading.toString()} | Products: {products.length}
</p>
        <p className="text-gray-600 mb-8">
          Total Products : {products.length}
        </p>

        <div className="grid lg:grid-cols-4 gap-8">

          <div className="space-y-6">

            <input
              type="text"
              placeholder="Search Products..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full border rounded-lg p-3"
            />

            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value);
              }}
              className="w-full border rounded-lg p-3"
            >
              <option value="latest">Latest</option>
              <option value="priceLow">Price Low To High</option>
              <option value="priceHigh">Price High To Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => {
                setPage(1);
                setMinPrice(e.target.value);
              }}
              className="w-full border rounded-lg p-3"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => {
                setPage(1);
                setMaxPrice(e.target.value);
              }}
              className="w-full border rounded-lg p-3"
            />
                        <select
              value={rating}
              onChange={(e) => {
                setPage(1);
                setRating(e.target.value);
              }}
              className="w-full border rounded-lg p-3"
            >
              <option value="">All Ratings</option>
              <option value="4">4★ & Above</option>
              <option value="3">3★ & Above</option>
              <option value="2">2★ & Above</option>
              <option value="1">1★ & Above</option>
            </select>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => {
                  setPage(1);
                  setInStock(e.target.checked);
                }}
              />

              <span>In Stock Only</span>

            </label>

          </div>

          <div className="lg:col-span-3">

            {loading ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 rounded-xl bg-gray-200 animate-pulse"
                  />
                ))}

              </div>

            ) : products.length === 0 ? (

              <div className="text-center py-20">

                <h2 className="text-3xl font-bold">
                  No Products Found
                </h2>

                <p className="text-gray-500 mt-3">
                  Try changing search or filters.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}

              </div>

            )}
                        <div className="flex justify-center items-center gap-3 mt-10">

              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg border ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={`px-4 py-2 rounded-lg border ${
                    page === index + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Next
              </button>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Products;