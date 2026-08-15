import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import vendorService from "../../services/vendorService";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    shopSlug: "",
    businessEmail: "",
    phone: "",
    description: "",
    gstNumber: "",
    panNumber: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await vendorService.getVendorProfile();

        const vendor = res.vendor || {};

        setFormData({
          shopName: vendor.shopName || "",
          shopSlug: vendor.shopSlug || "",
          businessEmail: vendor.businessEmail || "",
          phone: vendor.phone || "",
          description: vendor.description || "",
          gstNumber: vendor.gstNumber || "",
          panNumber: vendor.panNumber || "",
          upiId: vendor.upiId || "",
          bankName: vendor.bankDetails?.bankName || "",
          accountNumber: vendor.bankDetails?.accountNumber || "",
          ifscCode: vendor.bankDetails?.ifscCode || "",
          address: vendor.address || "",
          city: vendor.city || "",
          state: vendor.state || "",
          country: vendor.country || "",
          pincode: vendor.pincode || "",
        });

      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await vendorService.updateVendorProfile(formData);

      toast.success("Profile updated successfully");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">
          Vendor Profile
        </h1>

        <p className="mb-8 text-gray-500">
          Update your business information.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Form Fields Continue Here */}
          {/* Shop Name */}
<div>
  <label className="mb-2 block font-medium">
    Shop Name
  </label>

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
  <label className="mb-2 block font-medium">
    Shop Slug
  </label>

  <input
    type="text"
    name="shopSlug"
    value={formData.shopSlug}
    onChange={handleChange}
    placeholder="my-shop"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Business Email */}
<div>
  <label className="mb-2 block font-medium">
    Business Email
  </label>

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
  <label className="mb-2 block font-medium">
    Phone Number
  </label>

  <input
    type="text"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="+91 9876543210"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Description */}
<div className="md:col-span-2">
  <label className="mb-2 block font-medium">
    Shop Description
  </label>

  <textarea
    rows={5}
    name="description"
    value={formData.description}
    onChange={handleChange}
    placeholder="Write a short description about your shop..."
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
{/* GST Number */}
<div>
  <label className="mb-2 block font-medium">
    GST Number
  </label>

  <input
    type="text"
    name="gstNumber"
    value={formData.gstNumber}
    onChange={handleChange}
    placeholder="22AAAAA0000A1Z5"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* PAN Number */}
<div>
  <label className="mb-2 block font-medium">
    PAN Number
  </label>

  <input
    type="text"
    name="panNumber"
    value={formData.panNumber}
    onChange={handleChange}
    placeholder="ABCDE1234F"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* UPI ID */}
<div>
  <label className="mb-2 block font-medium">
    UPI ID
  </label>

  <input
    type="text"
    name="upiId"
    value={formData.upiId}
    onChange={handleChange}
    placeholder="example@upi"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Bank Name */}
<div>
  <label className="mb-2 block font-medium">
    Bank Name
  </label>

  <input
    type="text"
    name="bankName"
    value={formData.bankName}
    onChange={handleChange}
    placeholder="State Bank of India"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Account Number */}
<div>
  <label className="mb-2 block font-medium">
    Account Number
  </label>

  <input
    type="text"
    name="accountNumber"
    value={formData.accountNumber}
    onChange={handleChange}
    placeholder="123456789012"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* IFSC Code */}
<div>
  <label className="mb-2 block font-medium">
    IFSC Code
  </label>

  <input
    type="text"
    name="ifscCode"
    value={formData.ifscCode}
    onChange={handleChange}
    placeholder="SBIN0001234"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
{/* Address */}
<div className="md:col-span-2">
  <label className="mb-2 block font-medium">
    Address
  </label>

  <textarea
    rows={3}
    name="address"
    value={formData.address}
    onChange={handleChange}
    placeholder="Enter complete business address"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* City */}
<div>
  <label className="mb-2 block font-medium">
    City
  </label>

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
  <label className="mb-2 block font-medium">
    State
  </label>

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
  <label className="mb-2 block font-medium">
    Country
  </label>

  <input
    type="text"
    name="country"
    value={formData.country}
    onChange={handleChange}
    placeholder="India"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Pincode */}
<div>
  <label className="mb-2 block font-medium">
    Pincode
  </label>

  <input
    type="text"
    name="pincode"
    value={formData.pincode}
    onChange={handleChange}
    placeholder="226001"
    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* Save Button */}
<div className="md:col-span-2 flex justify-end">
  <button
    type="submit"
    disabled={saving}
    className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>
</div>

</form>

</div>

</div>
);
};

export default Profile;