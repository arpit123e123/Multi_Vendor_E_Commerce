import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= MAIN FOOTER ================= */}

        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand */}

          <div className="lg:col-span-2">

            <Link
              to="/"
              className="inline-flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                S
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Shop<span className="text-blue-500">Hub</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-6 text-gray-400 max-w-md">
              A multi-vendor marketplace built to make discovering,
              comparing, and purchasing products simple and convenient.
            </p>

            {/* Social */}

            <div className="flex items-center gap-2 mt-6">

              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition"
              >
                <FaFacebookF className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition"
              >
                <FaInstagram className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition"
              >
                <FaLinkedinIn className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition"
              >
                <FaGithub className="text-sm" />
              </a>

            </div>

          </div>

          {/* Shop */}

          <div>

            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Shop
            </h3>

            <ul className="mt-5 space-y-3 text-sm">

              <li>
                <Link
                  to="/products"
                  className="hover:text-white transition"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="hover:text-white transition"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="hover:text-white transition"
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-white transition"
                >
                  Wishlist
                </Link>
              </li>

            </ul>

          </div>

          {/* Account */}

          <div>

            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Account
            </h3>

            <ul className="mt-5 space-y-3 text-sm">

              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="hover:text-white transition"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition"
                >
                  My Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="hover:text-white transition"
                >
                  My Orders
                </Link>
              </li>

            </ul>

          </div>

        </div>

        {/* ================= BOTTOM BAR ================= */}

        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-gray-500">

            <button
              type="button"
              className="hover:text-gray-300 transition"
            >
              Privacy
            </button>

            <button
              type="button"
              className="hover:text-gray-300 transition"
            >
              Terms
            </button>

            <button
              type="button"
              className="hover:text-gray-300 transition"
            >
              Help
            </button>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;