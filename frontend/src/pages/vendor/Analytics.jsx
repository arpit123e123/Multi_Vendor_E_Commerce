import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import vendorService from "../../services/vendorService";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const res = await vendorService.getVendorAnalytics();

        setAnalytics(res.analytics || {});
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Analytics...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="mb-2 text-3xl font-bold">
          Vendor Analytics
        </h1>

        <p className="mb-8 text-gray-500">
          Overview of your business performance.
        </p>

        {/* Cards Start Here */}
        {/* Stats Cards */}
<div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

  {/* Revenue */}
  <div className="rounded-xl bg-white p-6 shadow">
    <p className="text-sm text-gray-500">
      Total Revenue
    </p>

    <h2 className="mt-2 text-3xl font-bold text-green-600">
      ₹{analytics.totalRevenue || 0}
    </h2>
  </div>

  {/* Orders */}
  <div className="rounded-xl bg-white p-6 shadow">
    <p className="text-sm text-gray-500">
      Total Orders
    </p>

    <h2 className="mt-2 text-3xl font-bold text-blue-600">
      {analytics.totalOrders || 0}
    </h2>
  </div>

  {/* Products */}
  <div className="rounded-xl bg-white p-6 shadow">
    <p className="text-sm text-gray-500">
      Total Products
    </p>

    <h2 className="mt-2 text-3xl font-bold text-purple-600">
      {analytics.totalProducts || 0}
    </h2>
  </div>

  {/* Average Rating */}
  <div className="rounded-xl bg-white p-6 shadow">
    <p className="text-sm text-gray-500">
      Average Rating
    </p>

    <h2 className="mt-2 text-3xl font-bold text-yellow-500">
      ⭐ {analytics.averageRating || 0}
    </h2>
  </div>

</div>

{/* Revenue Summary */}
<div className="mb-8 rounded-xl bg-white p-6 shadow">

  <h2 className="mb-4 text-xl font-bold">
    Revenue Summary
  </h2>

  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

    <div>
      <p className="text-gray-500">
        This Month
      </p>

      <h3 className="mt-2 text-2xl font-bold text-green-600">
        ₹{analytics.thisMonthRevenue || 0}
      </h3>
    </div>

    <div>
      <p className="text-gray-500">
        Last Month
      </p>

      <h3 className="mt-2 text-2xl font-bold text-blue-600">
        ₹{analytics.lastMonthRevenue || 0}
      </h3>
    </div>

    <div>
      <p className="text-gray-500">
        Pending Payout
      </p>

      <h3 className="mt-2 text-2xl font-bold text-orange-500">
        ₹{analytics.pendingPayout || 0}
      </h3>
    </div>

  </div>

</div>

{/* Recent Orders */}
<div className="mb-8 rounded-xl bg-white p-6 shadow">

  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-bold">
      Recent Orders
    </h2>
  </div>

  {analytics.recentOrders?.length ? (
    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="border-b bg-gray-100">

          <tr>
            <th className="px-4 py-3 text-left">
              Order ID
            </th>

            <th className="px-4 py-3 text-left">
              Customer
            </th>

            <th className="px-4 py-3 text-left">
              Amount
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-left">
              Date
            </th>
          </tr>

        </thead>

        <tbody>

          {analytics.recentOrders.map((order) => (
            <tr
              key={order._id}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                #{order._id.slice(-6)}
              </td>

              <td className="px-4 py-3">
                {order.user?.name || "Customer"}
              </td>

              <td className="px-4 py-3 font-semibold text-green-600">
                ₹{order.totalAmount}
              </td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  {order.status}
                </span>
              </td>

              <td className="px-4 py-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  ) : (
    <p className="text-gray-500">
      No recent orders found.
    </p>
  )}

</div>

{/* Top Selling Products */}
<div className="rounded-xl bg-white p-6 shadow">

  <h2 className="mb-4 text-xl font-bold">
    Top Selling Products
  </h2>

  {analytics.topProducts?.length ? (

    <div className="space-y-4">

      {analytics.topProducts.map((product) => (

        <div
          key={product._id}
          className="flex items-center justify-between rounded-lg border p-4"
        >

          <div className="flex items-center gap-4">

            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="h-16 w-16 rounded-lg object-cover"
            />

            <div>

              <h3 className="font-semibold">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500">
                ₹{product.price}
              </p>

            </div>

          </div>

          <div className="text-right">

            <p className="font-bold text-green-600">
              Sold {product.totalSold || 0}
            </p>

          </div>

        </div>

      ))}

    </div>

  ) : (

    <p className="text-gray-500">
      No product sales available.
    </p>

  )}

</div>
    </div>

  </div>
);

};

export default Analytics;