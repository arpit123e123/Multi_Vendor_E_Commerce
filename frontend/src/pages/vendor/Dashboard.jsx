import {
  Package,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";

import DashboardCard from "../../components/vendor/DashboardCard";

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Vendor Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Products"
          value="0"
          icon={Package}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Orders"
          value="0"
          icon={ShoppingCart}
          color="bg-green-600"
        />

        <DashboardCard
          title="Revenue"
          value="₹0"
          icon={IndianRupee}
          color="bg-purple-600"
        />

        <DashboardCard
          title="Low Stock"
          value="0"
          icon={AlertTriangle}
          color="bg-red-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Orders
        </h2>

        <p className="text-gray-500">
          No recent orders found.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;