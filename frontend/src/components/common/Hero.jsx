import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    id: 1,
    eyebrow: "New arrivals",
    title: "Upgrade your everyday tech.",
    description:
      "Discover smartphones, wearables and smart accessories from trusted vendors.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85",
    alt: "Modern smartphone",
  },
  {
    id: 2,
    eyebrow: "Audio essentials",
    title: "Sound that fits your day.",
    description:
      "Explore headphones and audio gear made for work, travel and everything in between.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85",
    alt: "Wireless headphones",
  },
  {
    id: 3,
    eyebrow: "Smart living",
    title: "Technology, made simpler.",
    description:
      "Find smart devices and accessories designed to make everyday life easier.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85",
    alt: "Smartwatch",
  },
  {
    id: 4,
    eyebrow: "Work essentials",
    title: "Build your perfect setup.",
    description:
      "Shop laptops, accessories and everyday essentials for work and study.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=85",
    alt: "Laptop",
  },
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  const currentSlide = slides[activeSlide];

  return (
    <section className="bg-[#f7f8fa] border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-sm">

          {/* ================= SLIDE ================= */}

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] min-h-[480px]">

            {/* Content */}

            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">

              <p className="inline-flex w-fit items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                {currentSlide.eyebrow}
              </p>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.08] text-gray-950">
                {currentSlide.title}
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-8 text-gray-600 max-w-lg">
                {currentSlide.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-sm"
                >
                  Shop products
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold transition"
                >
                  Explore collection
                </Link>

              </div>

              <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                <span>✓ Trusted vendors</span>
                <span>✓ Secure checkout</span>
                <span>✓ Wide selection</span>
              </div>

            </div>

            {/* Image */}

            <div className="relative min-h-[300px] lg:min-h-full bg-gray-100">

              <img
                key={currentSlide.id}
                src={currentSlide.image}
                alt={currentSlide.alt}
                className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_500ms_ease-in-out]"
              />

              {/* Image overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* Slide number */}

              <div className="absolute right-5 top-5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700">
                {String(activeSlide + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </div>

            </div>

          </div>

          {/* ================= ARROWS ================= */}

          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 transition"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 transition"
          >
            <FaChevronRight className="text-sm" />
          </button>

          {/* ================= DOTS ================= */}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-100">

            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeSlide
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;