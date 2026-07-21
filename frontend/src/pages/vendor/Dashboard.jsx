import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

function VendorDashboard() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          🏪 Vendor Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-gray-500">
              Total Products
            </h2>
            <p className="text-3xl font-bold mt-3">
              0
            </p>
          </div>


          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-gray-500">
              Total Orders
            </h2>
            <p className="text-3xl font-bold mt-3">
              0
            </p>
          </div>


          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-gray-500">
              Total Sales
            </h2>
            <p className="text-3xl font-bold mt-3">
              ₹0
            </p>
          </div>

        </div>


        <div className="mt-10 grid md:grid-cols-3 gap-6">

          <Link
            to="/vendor/add-product"
            className="bg-blue-600 text-white p-6 rounded-xl text-center hover:bg-blue-700"
          >
            ➕ Add Product
          </Link>


          <Link
            to="/vendor/products"
            className="bg-gray-900 text-white p-6 rounded-xl text-center hover:bg-black"
          >
            📦 Manage Products
          </Link>


          <Link
            to="/vendor/orders"
            className="bg-green-600 text-white p-6 rounded-xl text-center hover:bg-green-700"
          >
            🛒 View Orders
          </Link>

        </div>


        <div className="mt-10 bg-white shadow rounded-xl p-6">

          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>

          <p className="text-gray-500 mt-3">
            No recent orders found.
          </p>

        </div>


      </div>
    </MainLayout>
  );
}

export default VendorDashboard;