import { useEffect, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/vendor/dashboard");

      setStats(data.stats);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Products",
      value: stats.totalProducts,
      color: "bg-blue-500",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue}`,
      color: "bg-purple-500",
    },
    {
      title: "Pending",
      value: stats.pendingOrders,
      color: "bg-yellow-500",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-20 text-lg">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Vendor Dashboard
        </h1>

        <button
          onClick={fetchDashboard}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Refresh
        </button>

      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} text-white rounded-xl p-6 shadow`}
          >
            <p className="text-lg">{card.title}</p>

            <h2 className="text-3xl font-bold mt-3">
              {card.value}
            </h2>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;