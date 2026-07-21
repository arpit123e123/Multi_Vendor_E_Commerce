import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Dashboard() {

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchAnalytics();
  }, []);


  const fetchAnalytics = async () => {
    try {

      setLoading(true);

      const { data } = await api.get("/admin/analytics");

      setAnalytics(data.analytics);

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);

    }
  };


  const cards = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: "👥",
    },
    {
      title: "Total Vendors",
      value: analytics.totalVendors,
      icon: "🏪",
    },
    {
      title: "Products",
      value: analytics.totalProducts,
      icon: "📦",
    },
    {
      title: "Orders",
      value: analytics.totalOrders,
      icon: "🛒",
    },
    {
      title: "Revenue",
      value: `₹${analytics.totalRevenue}`,
      icon: "💰",
    },
  ];


  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          👨‍💼 Admin Dashboard
        </h1>


        {loading ? (

          <p className="text-xl">
            Loading dashboard...
          </p>

        ) : (

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">

            {cards.map((card)=>(

              <div
                key={card.title}
                className="bg-white shadow-lg rounded-2xl p-6"
              >

                <div className="text-3xl">
                  {card.icon}
                </div>

                <h2 className="text-gray-500 mt-4">
                  {card.title}
                </h2>

                <p className="text-3xl font-bold mt-2">
                  {card.value}
                </p>

              </div>

            ))}

          </div>

        )}


      </div>

    </MainLayout>
  );
}

export default Dashboard;