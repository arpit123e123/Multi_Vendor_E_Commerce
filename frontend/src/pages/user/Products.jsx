import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import ProductCard from "../../components/common/ProductCard";
import { getProducts } from "../../services/productService";

const categories = [
  "All",
  "Electronics",
  "Mobiles",
  "Laptops",
  "Fashion",
  "Men's Fashion",
  "Women's Fashion",
  "Footwear",
  "Furniture",
  "Home & Kitchen",
  "Beauty",
  "Groceries",
  "Sports",
  "Toys",
  "Books",
  "Automotive",
  "Health",
];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [inStock, setInStock] = useState(false);

  const [mobileFilters, setMobileFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

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

        setProducts(res?.products || []);
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        console.error("Products fetch error:", err);

        setProducts([]);
        setTotalPages(1);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [
    search,
    category,
    sort,
    page,
    minPrice,
    maxPrice,
    rating,
    inStock,
  ]);

  // ==========================================
  // CATEGORY
  // ==========================================

  const handleCategoryChange = (selectedCategory) => {
    setPage(1);

    const params = new URLSearchParams(searchParams);

    if (selectedCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }

    setSearchParams(params);
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setSort("latest");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setInStock(false);
    setPage(1);

    const params = new URLSearchParams(searchParams);
    params.delete("category");

    setSearchParams(params);
  };

  // ==========================================
  // FILTER STATUS
  // ==========================================

  const hasFilters =
    search !== "" ||
    category !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    rating !== "" ||
    inStock;

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    setPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // PAGINATION NUMBERS
  // ==========================================

  const getPageNumbers = () => {
    const pages = [];

    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f7f8fa]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <div className="mb-7">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

              <div>

                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Marketplace
                </p>

                <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                  All Products
                </h1>

                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Discover products from trusted vendors.
                </p>

              </div>

              {!loading && !error && (
                <div className="text-sm text-gray-500">
                  {products.length} products
                </div>
              )}

            </div>

          </div>

          {/* ==========================================
              SEARCH + SORT
          ========================================== */}

          <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 mb-5">

            <div className="flex flex-col md:flex-row gap-3">

              {/* SEARCH */}

              <div className="relative flex-1">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search products..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}

              </div>

              {/* SORT */}

              <div className="flex gap-2">

                <select
                  value={sort}
                  onChange={(e) => {
                    setPage(1);
                    setSort(e.target.value);
                  }}
                  className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="latest">Latest</option>
                  <option value="priceLow">
                    Price: Low to High
                  </option>
                  <option value="priceHigh">
                    Price: High to Low
                  </option>
                  <option value="rating">
                    Highest Rated
                  </option>
                  <option value="popular">
                    Most Popular
                  </option>
                </select>

                {/* MOBILE FILTER BUTTON */}

                <button
                  type="button"
                  onClick={() => setMobileFilters(true)}
                  className="md:hidden h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <FaSlidersH />
                  Filters
                </button>

              </div>

            </div>

          </div>

          {/* ==========================================
              CATEGORY BAR
          ========================================== */}

          <div className="mb-7 overflow-x-auto">

            <div className="flex gap-2 min-w-max">

              {categories.map((item) => {

                const isActive =
                  item === "All"
                    ? category === ""
                    : category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleCategoryChange(item)}
                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium whitespace-nowrap transition ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

            </div>

          </div>

          {/* ==========================================
              MAIN CONTENT
          ========================================== */}

          <div className="flex gap-6">

            {/* ========================================
                DESKTOP FILTER SIDEBAR
            ======================================== */}

            <aside className="hidden md:block w-60 shrink-0">

              <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-5">

                {/* FILTER HEADER */}

                <div className="flex items-center justify-between mb-5">

                  <h2 className="font-semibold text-gray-900">
                    Filters
                  </h2>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Clear all
                    </button>
                  )}

                </div>

                {/* PRICE */}

                <div className="pb-5 border-b border-gray-100">

                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Price
                  </h3>

                  <div className="grid grid-cols-2 gap-2">

                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      placeholder="Min"
                      onChange={(e) => {
                        setPage(1);
                        setMinPrice(e.target.value);
                      }}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />

                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      placeholder="Max"
                      onChange={(e) => {
                        setPage(1);
                        setMaxPrice(e.target.value);
                      }}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />

                  </div>

                </div>

                {/* RATING */}

                <div className="py-5 border-b border-gray-100">

                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Customer Rating
                  </h3>

                  <div className="space-y-3">

                    {["4", "3", "2", "1"].map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer"
                      >

                        <input
                          type="radio"
                          name="desktop-rating"
                          value={value}
                          checked={rating === value}
                          onChange={(e) => {
                            setPage(1);
                            setRating(e.target.value);
                          }}
                          className="w-4 h-4 accent-blue-600"
                        />

                        <span>
                          {value}★ & above
                        </span>

                      </label>
                    ))}

                  </div>

                </div>

                {/* STOCK */}

                <div className="pt-5">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => {
                        setPage(1);
                        setInStock(e.target.checked);
                      }}
                      className="w-4 h-4 accent-blue-600"
                    />

                    <span className="text-sm text-gray-700">
                      In stock only
                    </span>

                  </label>

                </div>

              </div>

            </aside>

            {/* ========================================
                PRODUCT AREA
            ======================================== */}

            <div className="flex-1 min-w-0">

              {/* ACTIVE FILTERS */}

              {hasFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-5">

                  <span className="text-sm text-gray-500">
                    Active:
                  </span>

                  {category && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {category}
                    </span>
                  )}

                  {minPrice && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                      Min ₹{minPrice}
                    </span>
                  )}

                  {maxPrice && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                      Max ₹{maxPrice}
                    </span>
                  )}

                  {rating && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {rating}★+
                    </span>
                  )}

                  {inStock && (
                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs">
                      In stock
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>

                </div>
              )}

              {/* ======================================
                  LOADING
              ====================================== */}

              {loading && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse"
                    >

                      <div className="h-52 bg-gray-200" />

                      <div className="p-4 space-y-3">

                        <div className="h-4 bg-gray-200 rounded w-4/5" />

                        <div className="h-4 bg-gray-200 rounded w-3/5" />

                        <div className="h-6 bg-gray-200 rounded w-2/5" />

                        <div className="h-10 bg-gray-200 rounded" />

                      </div>

                    </div>
                  ))}

                </div>
              )}

              {/* ======================================
                  ERROR
              ====================================== */}

              {!loading && error && (
                <div className="bg-white border border-gray-200 rounded-2xl py-20 px-6 text-center">

                  <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                    <FaTimes className="text-red-500" />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-gray-900">
                    Something went wrong
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() => setPage(page)}
                    className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                  >
                    Try again
                  </button>

                </div>
              )}

              {/* ======================================
                  EMPTY
              ====================================== */}

              {!loading &&
                !error &&
                products.length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl py-20 px-6 text-center">

                    <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                      <FaSearch className="text-gray-400" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-gray-900">
                      No products found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                      We couldn't find any products matching your current search or filters.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      Clear filters
                    </button>

                  </div>
                )}

              {/* ======================================
                  PRODUCTS
              ====================================== */}

              {!loading &&
                !error &&
                products.length > 0 && (
                  <>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                      {products.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                        />
                      ))}

                    </div>

                    {/* ==================================
                        PAGINATION
                    ================================== */}

                    {totalPages > 1 && (
                      <div className="mt-10 flex items-center justify-center gap-2">

                        {/* PREVIOUS */}

                        <button
                          type="button"
                          disabled={page === 1}
                          onClick={() => goToPage(page - 1)}
                          className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          aria-label="Previous page"
                        >
                          <FaChevronLeft className="text-xs" />
                        </button>

                        {/* PAGE NUMBERS */}

                        {getPageNumbers().map((pageNumber, index) => {

                          if (pageNumber === "...") {
                            return (
                              <span
                                key={`dots-${index}`}
                                className="w-8 text-center text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={pageNumber}
                              type="button"
                              onClick={() => goToPage(pageNumber)}
                              className={`w-10 h-10 rounded-lg border text-sm font-semibold transition ${
                                page === pageNumber
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-200 hover:text-blue-600"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}

                        {/* NEXT */}

                        <button
                          type="button"
                          disabled={page === totalPages}
                          onClick={() => goToPage(page + 1)}
                          className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          aria-label="Next page"
                        >
                          <FaChevronRight className="text-xs" />
                        </button>

                      </div>
                    )}

                  </>
                )}

            </div>

          </div>

        </div>

        {/* ==========================================
            MOBILE FILTER DRAWER
        ========================================== */}

        {mobileFilters && (
          <div className="fixed inset-0 z-[60] md:hidden">

            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setMobileFilters(false)}
              className="absolute inset-0 w-full h-full bg-black/40 cursor-default"
            />

            {/* DRAWER */}

            <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto">

              {/* DRAWER HEADER */}

              <div className="flex items-center justify-between p-5 border-b border-gray-200">

                <h2 className="font-semibold text-gray-900">
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={() => setMobileFilters(false)}
                  className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                  aria-label="Close filters"
                >
                  <FaTimes />
                </button>

              </div>

              <div className="p-5">

                {/* MOBILE PRICE */}

                <div className="pb-5 border-b border-gray-100">

                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Price
                  </h3>

                  <div className="grid grid-cols-2 gap-2">

                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      placeholder="Min"
                      onChange={(e) => {
                        setPage(1);
                        setMinPrice(e.target.value);
                      }}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />

                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      placeholder="Max"
                      onChange={(e) => {
                        setPage(1);
                        setMaxPrice(e.target.value);
                      }}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />

                  </div>

                </div>

                {/* MOBILE RATING */}

                <div className="py-5 border-b border-gray-100">

                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Customer Rating
                  </h3>

                  <div className="space-y-3">

                    {["4", "3", "2", "1"].map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer"
                      >

                        <input
                          type="radio"
                          name="mobile-rating"
                          value={value}
                          checked={rating === value}
                          onChange={(e) => {
                            setPage(1);
                            setRating(e.target.value);
                          }}
                          className="w-4 h-4 accent-blue-600"
                        />

                        <span>
                          {value}★ & above
                        </span>

                      </label>
                    ))}

                  </div>

                </div>

                {/* MOBILE STOCK */}

                <div className="py-5">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => {
                        setPage(1);
                        setInStock(e.target.checked);
                      }}
                      className="w-4 h-4 accent-blue-600"
                    />

                    <span className="text-sm text-gray-700">
                      In stock only
                    </span>

                  </label>

                </div>

                {/* APPLY */}

                <button
                  type="button"
                  onClick={() => setMobileFilters(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Apply filters
                </button>

                {/* CLEAR */}

                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      clearFilters();
                      setMobileFilters(false);
                    }}
                    className="w-full mt-2 py-3 text-red-500 hover:text-red-600 text-sm font-semibold"
                  >
                    Clear all filters
                  </button>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default Products;