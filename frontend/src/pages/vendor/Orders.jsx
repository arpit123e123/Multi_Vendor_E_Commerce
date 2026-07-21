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

      const { data } = await api.get("/vendor/orders");

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, {
        status,
      });

      toast.success("Order status updated");

      fetchOrders();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const statusList = [
    "Placed",

    "Confirmed",

    "Packed",

    "Shipped",

    "Out For Delivery",

    "Delivered",

    "Cancelled",
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">🛒 Vendor Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-10 text-center">
            <h2 className="text-2xl font-semibold">No Orders Found</h2>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow rounded-xl p-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold text-lg">
                      Order #{order._id.slice(-8)}
                    </h2>

                    <p>Customer: {order.user?.name}</p>

                    <p>Payment: {order.paymentStatus}</p>
                  </div>

                  <div>
                    <p className="font-bold text-xl text-blue-600">
                      ₹{order.totalAmount}
                    </p>

                    <p>Status: {order.orderStatus}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(
                        order._id,

                        e.target.value,
                      )
                    }
                    className="border p-2 rounded-lg"
                  >
                    {statusList.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Orders;
