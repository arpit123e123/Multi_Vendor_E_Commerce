import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../../redux/slices/wishlistSlice";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getSingleProduct ,  getRelatedProducts, } from "../../services/productService";
import cartService from "../../services/cartService";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";



function ProductDetails() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
  const submitReview = async () => {
  try {
    setLoading(true);

    await axios.post(
      `${import.meta.env.VITE_API_URL}/products/${product._id}/review`,
      {
        rating,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success("Review Added");

    setComment("");
    setRating(5);

  const fetchProduct = async () => {
  try {
    const data = await getSingleProduct(id);
    setProduct(data.product);

    const related = await getRelatedProducts(id);
    setRelatedProducts(related.relatedProducts);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load product");
  }
};
  } finally {
    setLoading(false);
  }
};

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
            <h1 className="text-4xl font-bold">{product.name}</h1>

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
                <strong>Category :</strong> {product.category?.name}
              </p>

              <p>
                <strong>Seller :</strong> {product.vendor?.shopName}
              </p>

              <p>
                <strong>Status :</strong>{" "}
                <span
                  className={`font-semibold ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
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
      {/* ================= Reviews ================= */}

<div className="mt-16">

  <h2 className="text-3xl font-bold mb-8">
    Customer Reviews
  </h2>

  {user && (

    <div className="bg-white shadow rounded-xl p-6 mb-10">

      <h3 className="font-semibold text-xl mb-4">
        Write a Review
      </h3>

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value={5}>⭐⭐⭐⭐⭐</option>
        <option value={4}>⭐⭐⭐⭐</option>
        <option value={3}>⭐⭐⭐</option>
        <option value={2}>⭐⭐</option>
        <option value={1}>⭐</option>
      </select>

      <textarea
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="border rounded w-full p-3"
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

    </div>

  )}

  {product.reviews?.length > 0 ? (

    product.reviews.map((review) => (

      <div
        key={review._id}
        className="border rounded-xl p-5 mb-5"
      >
        <h4 className="font-semibold">
          ⭐ {review.rating}/5
        </h4>

        <p className="mt-2">
          {review.comment}
        </p>

      </div>

    ))

  ) : (

    <p>No Reviews Yet.</p>

  )}

</div>
{/* ================= Related Products ================= */}

<div className="mt-20">

  <h2 className="text-3xl font-bold mb-8">
    Related Products
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    {relatedProducts.map((item) => (

      <div
        key={item._id}
        className="border rounded-xl shadow hover:shadow-lg transition p-4"
      >

        <img
          src={item.images?.[0] || "/no-image.png"}
          alt={item.name}
          className="h-48 w-full object-cover rounded-lg"
        />

        <h3 className="font-semibold mt-4">
          {item.name}
        </h3>

        <p className="text-blue-600 font-bold mt-2">
          ₹{item.price}
        </p>

        <p className="text-yellow-500">
          ⭐ {item.averageRating?.toFixed(1)}
        </p>

        <a
          href={`/product/${item._id}`}
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Details
        </a>

      </div>

    ))}

  </div>

</div>
    </MainLayout>
  );
}

export default ProductDetails;
