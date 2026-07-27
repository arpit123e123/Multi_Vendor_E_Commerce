import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import vendorService from "../../services/vendorService";

const BecomeVendor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    shopSlug: "",
    description: "",
    businessEmail: "",
    phone: "",
    gstNumber: "",
    panNumber: "",
    upiId: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "shopName") {
      setFormData((prev) => ({
        ...prev,
        shopName: value,
        shopSlug: value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    }
  };

  const validate = () => {
    if (!formData.shopName.trim()) {
      toast.error("Shop name is required");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!formData.businessEmail.trim()) {
      toast.error("Business email is required");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    if (!formData.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (!formData.state.trim()) {
      toast.error("State is required");
      return false;
    }

    if (!formData.pincode.trim()) {
      toast.error("Pincode is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await vendorService.becomeVendor(formData);

      toast.success(res.message || "Vendor request submitted successfully");

      navigate("/vendor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">Become a Vendor</h1>

        <p className="mb-8 text-gray-500">
          Fill in your business information to submit your vendor application.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* JSX form fields continue here */}
          {/* Shop Name */}
          <div>
            <label className="mb-2 block font-medium">Shop Name</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Enter shop name"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Shop Slug */}
          <div>
            <label className="mb-2 block font-medium">Shop Slug</label>
            <input
              type="text"
              name="shopSlug"
              value={formData.shopSlug}
              readOnly
              className="w-full rounded-lg border bg-gray-100 p-3"
            />
          </div>

          {/* Business Email */}
          <div>
            <label className="mb-2 block font-medium">Business Email</label>
            <input
              type="email"
              name="businessEmail"
              value={formData.businessEmail}
              onChange={handleChange}
              placeholder="business@example.com"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">Description</label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about your shop..."
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* GST */}
          <div>
            <label className="mb-2 block font-medium">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PAN */}
          <div>
            <label className="mb-2 block font-medium">PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* UPI */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="shop@upi"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Address */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">Address</label>
            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete business address"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-2 block font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Lucknow"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* State */}
          <div>
            <label className="mb-2 block font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Uttar Pradesh"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 block font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="mb-2 block font-medium">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="226001"
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Become Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeVendor;
