import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import couponService from "../../services/couponService";
import { toast } from "react-hot-toast";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumAmount: "",
    expiryDate: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const data = await couponService.getCoupons();

      setCoupons(data.coupons || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createCoupon = async (e) => {
    e.preventDefault();

    try {
      await couponService.createCoupon(form);

      toast.success("Coupon Created");

      setForm({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minimumAmount: "",
        expiryDate: "",
      });

      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;

    try {
      await couponService.deleteCoupon(id);

      toast.success("Coupon Deleted");

      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">🎟 Coupon Management</h1>

        <form
          onSubmit={createCoupon}
          className="bg-white shadow rounded-xl p-6 grid md:grid-cols-5 gap-4"
        >
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Coupon Code"
            className="border rounded-lg p-3"
            required
          />

          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FLAT">Flat</option>
          </select>

          <input
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            placeholder="Discount"
            className="border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="minimumAmount"
            value={form.minimumAmount}
            onChange={handleChange}
            placeholder="Minimum Amount"
            className="border rounded-lg p-3"
          />

          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <button className="md:col-span-5 bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700">
            Create Coupon
          </button>
        </form>

        <div className="mt-10 bg-white shadow rounded-xl overflow-hidden">
          {loading ? (
            <p className="p-6">Loading...</p>
          ) : coupons.length === 0 ? (
            <p className="p-6">No Coupons Found</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Code</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Minimum</th>
                  <th className="p-4">Expiry</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-t">
                    <td className="p-4 font-semibold">{coupon.code}</td>

                    <td className="text-center">{coupon.discountType}</td>

                    <td className="text-center">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>

                    <td className="text-center">₹{coupon.minimumAmount}</td>

                    <td className="text-center">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>

                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => deleteCoupon(coupon._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Coupons;
