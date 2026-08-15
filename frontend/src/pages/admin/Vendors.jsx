import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [actionLoading, setActionLoading] = useState("");

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/vendors");

      setVendors(data.vendors || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch vendors"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadVendors = async () => {
      await fetchVendors();
    };

    loadVendors();
  }, [fetchVendors]);

  const filteredVendors = useMemo(() => {
    const keyword = search.toLowerCase();

    return vendors.filter((vendor) => {
      return (
        vendor.shopName?.toLowerCase().includes(keyword) ||
        vendor.owner?.name?.toLowerCase().includes(keyword) ||
        vendor.owner?.email?.toLowerCase().includes(keyword)
      );
    });
  }, [vendors, search]);

  const viewVendor = async (id) => {
    try {
      const { data } = await api.get(`/admin/vendors/${id}`);

      setSelectedVendor(data.vendor);

      setShowModal(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load vendor details"
      );
    }
  };

  const approveVendor = async (id) => {
    if (!window.confirm("Approve this vendor?")) return;

    try {
      setActionLoading(id);

      await api.patch(`/admin/vendors/${id}/approve`);

      toast.success("Vendor Approved Successfully");

      fetchVendors();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Approval Failed"
      );
    } finally {
      setActionLoading("");
    }
  };

  const rejectVendor = async (id) => {
    const reason = prompt("Enter Reject Reason");

    if (reason === null) return;

    try {
      setActionLoading(id);

      await api.patch(
        `/admin/vendors/${id}/reject`,
        {
          reason,
        }
      );

      toast.success("Vendor Rejected");

      fetchVendors();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Reject Failed"
      );
    } finally {
      setActionLoading("");
    }
  };

  return (
        <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Vendors Management
        </h1>

        <button
          onClick={fetchVendors}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Refresh
        </button>

      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-gray-500">Total</p>
          <h2 className="text-3xl font-bold">
            {vendors.length}
          </h2>
        </div>

        <div className="bg-green-100 rounded-lg p-5">
          <p>Approved</p>
          <h2 className="text-3xl font-bold">
            {
              vendors.filter(
                (v) => v.status === "approved"
              ).length
            }
          </h2>
        </div>

        <div className="bg-yellow-100 rounded-lg p-5">
          <p>Pending</p>
          <h2 className="text-3xl font-bold">
            {
              vendors.filter(
                (v) => v.status === "pending"
              ).length
            }
          </h2>
        </div>

        <div className="bg-red-100 rounded-lg p-5">
          <p>Rejected</p>
          <h2 className="text-3xl font-bold">
            {
              vendors.filter(
                (v) => v.status === "rejected"
              ).length
            }
          </h2>
        </div>

      </div>

      <input
        type="text"
        placeholder="Search Vendor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full mb-6"
      />

      {loading ? (

        <div className="text-center py-10 text-lg">
          Loading...
        </div>

      ) : (

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Shop
                </th>

                <th className="p-4 text-left">
                  Owner
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Address
                </th>

                <th className="p-4 text-center">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredVendors.map((vendor) => (

                <tr
                  key={vendor._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-semibold">
                    {vendor.shopName}
                  </td>

                  <td className="p-4">
                    {vendor.owner?.name}
                  </td>

                  <td className="p-4">
                    {vendor.owner?.email}
                  </td>

                  <td className="p-4">
                    {vendor.phone}
                  </td>

                  <td className="p-4">
                    {vendor.address}
                  </td>

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

                  <td className="p-4">

                    <div className="flex justify-center gap-2">
                                            <button
                        onClick={() =>
                          viewVendor(vendor._id)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      <button
                        disabled={
                          actionLoading ===
                            vendor._id ||
                          vendor.status ===
                            "approved"
                        }
                        onClick={() =>
                          approveVendor(
                            vendor._id
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        {actionLoading ===
                        vendor._id
                          ? "Loading..."
                          : "Approve"}
                      </button>

                      <button
                        disabled={
                          actionLoading ===
                            vendor._id ||
                          vendor.status ===
                            "rejected"
                        }
                        onClick={() =>
                          rejectVendor(
                            vendor._id
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        {actionLoading ===
                        vendor._id
                          ? "Loading..."
                          : "Reject"}
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

                       {showModal && selectedVendor && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Vendor Details
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedVendor(null);
                }}
                className="text-red-600 text-2xl"
              >
                ✕
              </button>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div>
                <p className="font-semibold">
                  Shop Name
                </p>
                <p>{selectedVendor.shopName}</p>
              </div>

              <div>
                <p className="font-semibold">
                  Owner
                </p>
                <p>{selectedVendor.owner?.name}</p>
              </div>

              <div>
                <p className="font-semibold">
                  Email
                </p>
                <p>{selectedVendor.owner?.email}</p>
              </div>

              <div>
                <p className="font-semibold">
                  Phone
                </p>
                <p>{selectedVendor.phone}</p>
              </div>

              <div>
                <p className="font-semibold">
                  Address
                </p>
                <p>{selectedVendor.address}</p>
              </div>

              <div>
                <p className="font-semibold">
                  Status
                </p>
                <p>{selectedVendor.status}</p>
              </div>

              <div>
                <p className="font-semibold">
                  GST Number
                </p>
                <p>{selectedVendor.gstNumber || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold">
                  PAN Number
                </p>
                <p>{selectedVendor.panNumber || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold">
                  Bank Name
                </p>
                <p>{selectedVendor.bankName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold">
                  Account Number
                </p>
                <p>{selectedVendor.accountNumber || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold">
                  IFSC Code
                </p>
                <p>{selectedVendor.ifscCode || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold">
                  UPI ID
                </p>
                <p>{selectedVendor.upiId || "N/A"}</p>
              </div>

            </div>

            <div className="mt-6">

              <p className="font-semibold mb-2">
                Description
              </p>

              <p className="text-gray-700">
                {selectedVendor.description || "No Description"}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Vendors;