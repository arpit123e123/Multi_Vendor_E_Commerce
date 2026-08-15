import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
  },
  {
    id: 2,
    name: "Mobiles",
    image: "https://cdn-icons-png.flaticon.com/512/545/545245.png",
  },
  {
    id: 3,
    name: "Laptops",
    image: "https://cdn-icons-png.flaticon.com/512/3474/3474360.png",
  },
  {
    id: 4,
    name: "Fashion",
    image: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
  },
  {
    id: 5,
    name: "Men's Fashion",
    image: "https://cdn-icons-png.flaticon.com/512/3531/3531648.png",
  },
  {
    id: 6,
    name: "Women's Fashion",
    image: "https://cdn-icons-png.flaticon.com/512/3050/3050255.png",
  },
  {
    id: 7,
    name: "Footwear",
    image: "https://cdn-icons-png.flaticon.com/512/2589/2589903.png",
  },
  {
    id: 8,
    name: "Furniture",
    image: "https://cdn-icons-png.flaticon.com/512/2554/2554814.png",
  },
  {
    id: 9,
    name: "Home & Kitchen",
    image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
  },
  {
    id: 10,
    name: "Beauty",
    image: "https://cdn-icons-png.flaticon.com/512/3050/3050239.png",
  },
  {
    id: 11,
    name: "Groceries",
    image: "https://cdn-icons-png.flaticon.com/512/3082/3082037.png",
  },
  {
    id: 12,
    name: "Sports",
    image: "https://cdn-icons-png.flaticon.com/512/857/857418.png",
  },
  {
    id: 13,
    name: "Toys",
    image: "https://cdn-icons-png.flaticon.com/512/3082/3082060.png",
  },
  {
    id: 14,
    name: "Books",
    image: "https://cdn-icons-png.flaticon.com/512/2702/2702134.png",
  },
  {
    id: 15,
    name: "Automotive",
    image: "https://cdn-icons-png.flaticon.com/512/741/741407.png",
  },
  {
    id: 16,
    name: "Health",
    image: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",
  },
];

function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Browse collection
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Shop by category
          </h2>

          <p className="mt-2 text-gray-500 text-sm sm:text-base">
            Explore products across different categories.
          </p>
        </div>

        <Link
          to="/products"
          className="hidden sm:inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">

        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="group"
          >
            <div className="h-full bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 transition duration-200 hover:border-blue-200 hover:shadow-md">

              <div className="h-28 sm:h-32 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Explore products
                  </p>
                </div>

                <span className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition">
                  →
                </span>
              </div>

            </div>
          </Link>
        ))}

      </div>

      <Link
        to="/products"
        className="sm:hidden flex items-center justify-center mt-6 text-sm font-semibold text-blue-600"
      >
        View all products →
      </Link>

    </section>
  );
}

export default Categories;