import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/slices/authSlice";
import { getWishlist } from "../../redux/slices/wishlistSlice";

function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth || {});

  const cartCount = useSelector(
    (state) => state.cart?.items?.length || 0
  );

  const wishlistCount = useSelector(
    (state) => state.wishlist?.items?.length || 0
  );

  const [GIMINI, setGIMINI] = useState(false);
  const [mobileGIMINI, setMobileGIMINI] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  useEffect(() => {
    setGIMINI(false);
    setMobileGIMINI(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    setGIMINI(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-[72px] flex items-center justify-between">

          {/* ================= LOGO ================= */}

          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              S
            </div>

            <span className="text-xl font-bold tracking-tight text-gray-900">
              Shop<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          {/* ================= DESKTOP NAV ================= */}

          <nav className="hidden md:flex items-center gap-8 ml-12 mr-auto">

            <Link
              to="/"
              className={`text-sm font-medium transition ${
                isActive("/")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`text-sm font-medium transition ${
                isActive("/products")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Products
            </Link>

          </nav>

          {/* ================= RIGHT ACTIONS ================= */}

          <div className="flex items-center gap-2 sm:gap-4">

            {/* Wishlist */}

            {user && (
              <Link
                to="/wishlist"
                className="relative w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-red-500 transition"
                aria-label="Wishlist"
              >
                <FaHeart className="text-[17px]" />

                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}

            {user && (
              <Link
                to="/cart"
                className="relative w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
                aria-label="Shopping cart"
              >
                <FaShoppingCart className="text-[17px]" />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* ================= USER ================= */}

            {user ? (
              <div className="relative">

                <button
                  type="button"
                  onClick={() => setGIMINI((prev) => !prev)}
                  className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FaUser className="text-sm" />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {user.name?.split(" ")[0] || "Account"}
                    </p>

                    <p className="text-[11px] text-gray-400 capitalize">
                      {user.role || "customer"}
                    </p>
                  </div>
                </button>

                {/* Dropdown */}

                {GIMINI && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setGIMINI(false)}
                    />

                    <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>

                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">

                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                        >
                          Profile
                        </Link>

                        <Link
                          to="/orders"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                        >
                          My Orders
                        </Link>

                        {user.role !== "vendor" && (
                          <Link
                            to="/become-vendor"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                          >
                            Become a Vendor
                          </Link>
                        )}

                      </div>

                      <div className="border-t border-gray-100 p-1">

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          Logout
                        </button>

                      </div>

                    </div>
                  </>
                )}

              </div>
            ) : (
              <>
                {/* Desktop Auth */}

                <div className="hidden sm:flex items-center gap-2">

                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition shadow-sm"
                  >
                    Get Started
                  </Link>

                </div>
              </>
            )}

            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() => setMobileGIMINI((prev) => !prev)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {mobileGIMINI ? <FaTimes /> : <FaBars />}
            </button>

          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}

        {mobileGIMINI && (
          <div className="md:hidden border-t border-gray-100 py-4">

            <nav className="flex flex-col">

              <Link
                to="/"
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Products
              </Link>

              {user ? (
                <>
                  <Link
                    to="/wishlist"
                    className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-2 text-xs text-red-500">
                        ({wishlistCount})
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-2 text-xs text-blue-600">
                        ({cartCount})
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    My Orders
                  </Link>

                  {user.role !== "vendor" && (
                    <Link
                      to="/become-vendor"
                      className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Become a Vendor
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-3">

                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="flex-1 text-center px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                  >
                    Get Started
                  </Link>

                </div>
              )}

            </nav>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;