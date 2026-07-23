import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/orders");

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
  return (

    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">📦 Manage Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-10 text-center">
          No Orders Found
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow rounded-xl p-6">
              <div className="flex justify-between flex-wrap">
                <div>
                  <h2 className="font-bold text-lg">
                    Order #{order._id.slice(-8)}
                  </h2>

                  <p>Customer: {order.user?.name}</p>

                  <p>Email: {order.user?.email}</p>

                  <p>Payment Method: {order.paymentMethod}</p>

                  <p>Payment Status: {order.paymentStatus}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{order.totalAmount}
                  </p>

                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Status Update */}

              <div className="mt-5 flex gap-4 items-center">
                <span className="font-semibold">Status:</span>

                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border rounded-lg p-2"
                >
                  {statusList.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products */}

              <div className="mt-6 border-t pt-5">
                <h3 className="font-bold mb-3">Products</h3>

                {order.items?.map((item) => (
                  <div key={item.product?._id} className="flex gap-4 mb-4">
                    <img
                      src={
                        item.product?.images?.[0] ||
                        "https://via.placeholder.com/100"
                      }
                      className="w-16 h-16 rounded object-cover"
                    />

                    <div>
                      <p className="font-semibold">{item.product?.name}</p>

                      <p>Qty: {item.quantity}</p>

                      <p>Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}

              <div className="border-t pt-5 mt-5">
                <h3 className="font-bold">Delivery Address</h3>

                <p>{order.address?.address}</p>

                <p>{order.address?.city}</p>
              </div>

              {/* Tracking History */}

              <div className="border-t pt-5 mt-5">
                <h3 className="font-bold mb-3">Tracking History</h3>

                {order.trackingHistory?.map((track, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    ✓ {track.status} - {track.message}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
}

export default Orders;
