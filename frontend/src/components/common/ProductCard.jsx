import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { addToCart } from "../../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = async () => {
    try {
      const resultAction = await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
        }),
      );

      if (resultAction.type.endsWith("/rejected")) {
        throw new Error(resultAction.payload?.message || "Failed to add cart");
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
        await dispatch(removeFromWishlist(product._id));

        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(product._id));

        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error(error);

      toast.error("Login first");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition p-4">
      {/* Image Section */}

      <div className="relative">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />

        {/* Wishlist Heart */}

        <button
          onClick={handleAddToWishlist}
          className="
          absolute 
          top-3 
          right-3 
          bg-white 
          rounded-full
          w-fit
          h-fit
          flex 
          items-center 
          justify-center 
          shadow
          hover:scale-110
          transition
          "
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Product Info */}

      <h3 className="text-lg font-semibold mt-4">{product.name}</h3>

      <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>

      <p className="text-sm text-gray-500 mt-1">Stock: {product.stock}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="
          flex-1
          bg-blue-600
          text-white
          py-2
          rounded-lg
          hover:bg-blue-700
          "
        >
          Add Cart
        </button>

        <Link
          to={`/products/${product._id}`}
          className="
          flex-1
          text-center
          bg-gray-800
          text-white
          py-2
          rounded-lg
          hover:bg-gray-900
          "
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
