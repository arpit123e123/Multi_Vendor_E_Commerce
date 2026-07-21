import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getMyOrders } from "../../redux/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch ((status || "").toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "SHIPPED":
        return "bg-blue-100 text-blue-700";

      case "PROCESSING":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toFixed(2)}`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <h2 className="text-xl font-semibold">Loading Orders...</h2>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-16 text-center">
          <h2 className="text-2xl font-semibold text-red-600">
            Failed to load orders
          </h2>

          <p className="text-gray-500 mt-3">{error}</p>

          <button
            onClick={() => dispatch(getMyOrders())}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-20 text-center">
          <h2 className="text-3xl font-bold">No Orders Yet</h2>

          <p className="text-gray-500 mt-4">
            Looks like you haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md border p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    Order #{order._id?.slice(-8)}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus || "Pending"}
                  </span>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.paymentStatus === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border rounded-xl p-4"
                  >
                    <img
                      src={
                        item.product?.images?.[0]?.url ||
                        item.product?.image ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.product?.name || "Product"}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {item.product?.name || "Product"}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        Quantity :
                        <span className="font-medium ml-2">
                          {item.quantity}
                        </span>
                      </p>

                      <p className="text-gray-500 mt-1">
                        Price :
                        <span className="font-medium ml-2">
                          {formatPrice(item.price)}
                        </span>
                      </p>

                      <p className="text-gray-500 mt-1">
                        Subtotal :
                        <span className="font-semibold ml-2">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-6" />

              <div className="grid md:grid-cols-3 gap-5">
                <div className="border rounded-xl p-4 bg-gray-50">
                  <p className="text-sm text-gray-500">Payment Method</p>

                  <h3 className="text-lg font-semibold mt-1">
                    {order.paymentMethod || "COD"}
                  </h3>
                </div>

                <div className="border rounded-xl p-4 bg-gray-50">
                  <p className="text-sm text-gray-500">Payment Status</p>

                  <h3
                    className={`text-lg font-semibold mt-1 ${
                      order.paymentStatus === "PAID"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </h3>
                </div>

                <div className="border rounded-xl p-4 bg-gray-50">
                  <p className="text-sm text-gray-500">Total Amount</p>

                  <h3 className="text-2xl font-bold text-blue-600 mt-1">
                    {formatPrice(order.totalAmount)}
                  </h3>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="mt-6 border rounded-xl p-5 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3">
                    Shipping Address
                  </h3>

                  <p>{order.shippingAddress.fullName}</p>

                  <p>{order.shippingAddress.phone}</p>

                  <p>{order.shippingAddress.address}</p>

                  <p>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Orders;
