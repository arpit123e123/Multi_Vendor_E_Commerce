import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import vendorService from "../../services/vendorService";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await vendorService.getVendorDashboard();

      setStats({
        totalProducts: res.totalProducts || 0,
        totalOrders: res.totalOrders || 0,
        totalRevenue: res.totalRevenue || 0,
        pendingOrders: res.pendingOrders || 0,
      });

      setRecentOrders(res.recentOrders || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="mb-8 text-3xl font-bold">
        Vendor Dashboard
      </h1>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Products
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stats.totalProducts}
              </h2>

            </div>

            <Package size={42}/>
          </div>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Orders
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stats.totalOrders}
              </h2>

            </div>

            <ShoppingCart size={42}/>
          </div>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Revenue
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                ₹{stats.totalRevenue}
              </h2>

            </div>

            <IndianRupee size={42}/>
          </div>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Pending
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stats.pendingOrders}
              </h2>

            </div>

            <BarChart3 size={42}/>
          </div>

        </div>

      </div>

      {/* Recent Orders */}

      <div className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Recent Orders
        </h2>

        {
          recentOrders.length === 0
          ? (
            <p className="text-gray-500">
              No recent orders found.
            </p>
          )
          : (
            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="p-3 text-left">
                    Order ID
                  </th>

                  <th className="p-3 text-left">
                    Customer
                  </th>

                  <th className="p-3 text-left">
                    Amount
                  </th>

                  <th className="p-3 text-left">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  recentOrders.map((order) => (

                    <tr
                      key={order._id}
                      className="border-b"
                    >

                      <td className="p-3">
                        {order._id.slice(-6)}
                      </td>

                      <td className="p-3">
                        {order.user?.name}
                      </td>

                      <td className="p-3">
                        ₹{order.totalAmount}
                      </td>

                      <td className="p-3">
                        {order.status}
                      </td>

                    </tr>

                  ))
                }

              </tbody>

            </table>
          )
        }

      </div>

    </div>
  );
};

export default Dashboard;