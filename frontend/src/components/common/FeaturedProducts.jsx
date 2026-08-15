import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (mounted) {
          setProducts(data?.products || []);
        }
      } catch (error) {
        console.error("Featured products error:", error);

        if (mounted) {
          setError("Unable to load products right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

        {/* ================= HEADER ================= */}

        <div className="flex items-end justify-between gap-6 mb-8">

          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Popular picks
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Featured products
            </h2>

            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Take a look at some of the products available in our marketplace.
            </p>
          </div>

          <Link
            to="/products"
            className="hidden sm:inline-flex shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View all →
          </Link>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">

            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-gray-200" />

                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="bg-white border border-red-100 rounded-xl p-8 text-center">

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 text-sm font-semibold text-gray-700 hover:text-blue-600"
            >
              Try again
            </button>

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading && !error && products.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <h3 className="font-semibold text-gray-900">
              No products available yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Products will appear here once vendors add them.
            </p>

            <Link
              to="/products"
              className="inline-flex mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Browse products →
            </Link>

          </div>
        )}

        {/* ================= PRODUCTS ================= */}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">

            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>
        )}

        {/* ================= MOBILE CTA ================= */}

        <Link
          to="/products"
          className="sm:hidden flex items-center justify-center mt-7 text-sm font-semibold text-blue-600"
        >
          View all products →
        </Link>

      </div>
    </section>
  );
}

export default FeaturedProducts;