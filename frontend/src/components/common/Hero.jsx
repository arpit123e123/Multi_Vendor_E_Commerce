import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className=".bg-gradient-to-r from-blue-600 to-indigo-700 text-black">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between">

        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Discover Amazing Products
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Shop from thousands of products offered by trusted vendors.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 bg-blue-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Shop Now
          </Link>
        </div>

        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
          alt="Shopping"
          className="w-500px rounded-xl mt-10 md:mt-0 shadow-2xl"
        />

      </div>
    </section>
  );
}

export default Hero;