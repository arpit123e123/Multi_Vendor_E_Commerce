import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useState, useEffect } from "react";
import { getWishlist } from "../../redux/slices/wishlistSlice";

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const wishlistCount = useSelector(
    (state) => state.wishlist?.items?.length || 0,
  );
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold text-blue-600">
          ShopHub
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="relative text-xl">
            <FaHeart />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-xl">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg"
              >
                <FaUser /> <span>{user.name?.split(" ")[0]}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-40">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                  {user?.role === "user" && (
                    <Link
                      to="/become-vendor"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Become Vendor
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </Link>
              <Link to="/profile" className="hover:text-blue-600 font-medium">
                Profile
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
