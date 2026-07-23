import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { becomeVendor } from "../../redux/slices/vendorSlice";

function BecomeVendor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    phone: "",
    address: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await dispatch(becomeVendor(formData));

      if (becomeVendor.fulfilled.match(result)) {
        toast.success("Vendor application submitted successfully.");
        navigate("/profile");
      } else {
        toast.error(
          result.payload?.message || "Failed to submit application."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-2">
          Become a Vendor
        </h1>

        <p className="text-gray-500 mb-8">
          Fill in your business details to request vendor access.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            name="businessEmail"
            placeholder="Business Email"
            value={formData.businessEmail}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <textarea
            rows="3"
            name="address"
            placeholder="Business Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <textarea
            rows="5"
            name="description"
            placeholder="Tell us about your business..."
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default BecomeVendor;