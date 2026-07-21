import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/axios";
import { toast } from "react-hot-toast";

function Vendors() {

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchVendors();
  }, []);


  const fetchVendors = async () => {
    try {

      setLoading(true);

      const { data } = await api.get("/admin/vendors");

      setVendors(data.vendors || []);

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch vendors"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          🏪 Manage Vendors
        </h1>


        {loading ? (

          <p className="text-xl">
            Loading vendors...
          </p>

        ) : vendors.length === 0 ? (

          <div className="bg-white shadow rounded-xl p-10 text-center">
            No Vendors Found
          </div>

        ) : (

          <div className="bg-white shadow rounded-xl overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">
                    Shop Name
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

                </tr>

              </thead>


              <tbody>

                {vendors.map((vendor)=>(

                  <tr
                    key={vendor._id}
                    className="border-t"
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


                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </MainLayout>
  );
}

export default Vendors;