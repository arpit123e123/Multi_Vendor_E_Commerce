import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";

import { addToCart } from "../../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  const isWishlisted = wishlistItems.some(
    (item) => item?._id === product?._id
  );

  const isOutOfStock = product?.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      const resultAction = await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
        })
      );

      if (resultAction.type.endsWith("/rejected")) {
        throw new Error(
          resultAction.payload?.message || "Failed to add to cart"
        );
      }

      toast.success("Added to cart");
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Login first");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (isWishlisted) {
        const resultAction = await dispatch(
          removeFromWishlist(product._id)
        );

        if (resultAction.type.endsWith("/rejected")) {
          throw new Error(
            resultAction.payload?.message ||
              "Failed to remove from wishlist"
          );
        }

        toast.success("Removed from wishlist");
      } else {
        const resultAction = await dispatch(
          addToWishlist(product._id)
        );

        if (resultAction.type.endsWith("/rejected")) {
          throw new Error(
            resultAction.payload?.message ||
              "Failed to add to wishlist"
          );
        }

        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Login first");
    }
  };

  return (
    <article className="group bg-white border border-gray-200 rounded-2xl overflow-hidden transition duration-200 hover:border-gray-300 hover:shadow-lg">

      {/* ================= IMAGE ================= */}

      <div className="relative bg-gray-50 overflow-hidden">

        <Link
          to={`/products/${product?._id}`}
          className="block"
        >
          <div className="h-56 sm:h-60 flex items-center justify-center p-5">

            <img
              src={
                product?.images?.[0]?.url ||
                "https://placehold.co/600x600?text=No+Image"
              }
              alt={product?.name || "Product"}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />

          </div>
        </Link>

        {/* Stock badge */}

        {isOutOfStock ? (
          <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md">
            Out of stock
          </span>
        ) : product?.stock <= 5 ? (
          <span className="absolute top-3 left-3 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1.5 rounded-md">
            Only {product.stock} left
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1.5 rounded-md">
            In stock
          </span>
        )}

        {/* Wishlist */}

        <button
          type="button"
          onClick={handleAddToWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border transition ${
            isWishlisted
              ? "bg-white border-red-100 text-red-500"
              : "bg-white/95 border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-100"
          }`}
        >
          {isWishlisted ? (
            <FaHeart className="text-sm" />
          ) : (
            <FaRegHeart className="text-sm" />
          )}
        </button>

      </div>

      {/* ================= PRODUCT INFO ================= */}

      <div className="p-4">

        <Link
          to={`/products/${product?._id}`}
          className="block"
        >
          <h3 className="font-semibold text-gray-900 leading-5 line-clamp-2 min-h-10 hover:text-blue-600 transition">
            {product?.name}
          </h3>
        </Link>

        {/* Price */}

        <div className="mt-3 flex items-center justify-between gap-3">

          <p className="text-xl font-bold text-gray-900">
            ₹{Number(product?.price || 0).toLocaleString("en-IN")}
          </p>

          {!isOutOfStock && (
            <span className="text-xs text-gray-500">
              {product.stock} available
            </span>
          )}

        </div>

        {/* Actions */}

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 px-3 rounded-lg text-sm font-semibold transition"
          >
            <FaShoppingBag className="text-xs" />

            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </button>

          <Link
            to={`/products/${product?._id}`}
            className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-sm font-semibold transition"
          >
            View
          </Link>
      
        </div>

      </div>
    </article>
  );
}

export default ProductCard;