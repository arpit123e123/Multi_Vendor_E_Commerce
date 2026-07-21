import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCart,
  updateCart,
  removeItem,
} from "../../redux/slices/cartSlice";
import MainLayout from "../../layouts/MainLayout";

const Cart = () => {
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const increaseQty = (item) => {
    if (item.quantity >= item.product.stock) return;

    dispatch(
      updateCart({
        productId: item.product._id,
        quantity: item.quantity + 1,
      })
    );
  };

  const decreaseQty = (item) => {
    if (item.quantity === 1) return;

    dispatch(
      updateCart({
        productId: item.product._id,
        quantity: item.quantity - 1,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(removeItem(item.product._id));
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold animate-pulse">
            Loading Cart...
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          🛒 My Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">

            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/products"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items */}

            <div className="lg:col-span-2 space-y-5">

              {items.map((item) => (

                <div
                  key={item.product._id}
                  className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row justify-between gap-5"
                >
                  <div className="flex gap-5">

                    <img
                      src={
                        item.product.images?.[0] ||
                        "/no-image.png"
                      }
                      alt={item.product.name}
                      className="w-28 h-28 object-cover rounded-lg"
                    />

                    <div>

                      <h2 className="text-xl font-bold">
                        {item.product.name}
                      </h2>

                      <p className="text-blue-600 text-lg font-semibold mt-2">
                        ₹{Number(item.product.price).toLocaleString("en-IN")}
                      </p>

                      <p
                        className={`mt-2 ${
                          item.product.stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.product.stock > 0
                          ? `In Stock (${item.product.stock})`
                          : "Out of Stock"}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-col justify-between items-end">

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => decreaseQty(item)}
                        className="bg-gray-200 w-8 h-8 rounded"
                      >
                        -
                      </button>

                      <span className="font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item)}
                        className="bg-gray-200 w-8 h-8 rounded"
                      >
                        +
                      </button>

                    </div>

                    <button
                      onClick={() => handleRemove(item)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Remove
                    </button>

                  </div>
                </div>

              ))}

            </div>

            {/* Order Summary */}

            <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-24">

              <h2 className="text-2xl font-bold mb-5">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Total</span>

                <span className="font-bold text-xl">
                  ₹{Number(total).toLocaleString("en-IN")}
                </span>
              </div>

              <hr className="my-5" />

              <Link
                to="/checkout"
                className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                Proceed To Checkout
              </Link>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Cart;