import { useEffect, useMemo, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/vendors");

      setVendors(data.vendors || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const keyword = search.toLowerCase();

      return (
        vendor.shopName?.toLowerCase().includes(keyword) ||
        vendor.owner?.name?.toLowerCase().includes(keyword) ||
        vendor.owner?.email?.toLowerCase().includes(keyword)
      );
    });
  }, [vendors, search]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendors Management</h1>

        <button
          onClick={fetchVendors}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search vendor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full mb-6"
      />

      {loading ? (
        <div className="text-center py-10 text-lg">Loading...</div>
      ) : filteredVendors.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          No Vendors Found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Shop</th>

                <th className="p-4 text-left">Owner</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Phone</th>

                <th className="p-4 text-left">Address</th>

                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{vendor.shopName}</td>

                  <td className="p-4">{vendor.owner?.name}</td>

                  <td className="p-4">{vendor.owner?.email}</td>

                  <td className="p-4">{vendor.phone}</td>

                  <td className="p-4">{vendor.address}</td>

                  <td className="p-4 text-center">
                    {vendor.status === "approved" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Approved
                      </span>
                    ) : vendor.status === "rejected" ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Rejected
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Vendors;
