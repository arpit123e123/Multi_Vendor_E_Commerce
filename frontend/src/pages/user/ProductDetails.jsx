import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../../redux/slices/wishlistSlice";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getSingleProduct } from "../../services/productService";
import cartService from "../../services/cartService";
import { toast } from "react-hot-toast";

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getSingleProduct(id);
      setProduct(data.product);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    }
  };

  const handleAddToCart = async () => {
    try {
      if (product.stock === 0) {
        return toast.error("Product is out of stock");
      }

      await cartService.addToCart({
        productId: product._id,
        quantity: 1,
      });

      toast.success("Product added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Login First");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await dispatch(addToWishlist(product._id));
      toast.success("Added to Wishlist");
    } catch (error) {
      console.error(error);
      toast.error("Login First");
    }
  };

  if (!product) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold animate-pulse">
            Loading Product...
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-2 gap-12">

          {/* Image */}

          <div>
            <img
              src={product.images?.[0] || "/no-image.png"}
              alt={product.name}
              className="w-full h-500px object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Details */}

          <div>

            <h1 className="text-4xl font-bold">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-4">

              <span className="text-yellow-500 text-lg">
                ⭐ {product.averageRating?.toFixed(1) || "0.0"}
              </span>

              <span className="text-gray-500">
                ({product.numReviews || 0} Reviews)
              </span>

            </div>

            <h2 className="text-4xl font-bold text-blue-600 mt-5">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </h2>

            <p className="text-gray-700 leading-7 mt-6">
              {product.description}
            </p>

            <div className="mt-8 space-y-3">

              <p>
                <strong>Category :</strong>{" "}
                {product.category?.name}
              </p>

              <p>
                <strong>Seller :</strong>{" "}
                {product.vendor?.shopName}
              </p>

              <p>
                <strong>Status :</strong>{" "}
                <span
                  className={`font-semibold ${
                    product.stock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </span>
              </p>

            </div>

            <div className="flex gap-4 mt-10">

              <button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className={`px-8 py-3 rounded-lg text-white font-semibold transition ${
                  product.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Add To Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                className="px-8 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
              >
                ❤️ Wishlist
              </button>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default ProductDetails;