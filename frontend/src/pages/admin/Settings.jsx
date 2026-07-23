import { useState } from "react";
import { toast } from "react-hot-toast";

function Settings() {
  const [form, setForm] = useState({
    siteName: "Multi Vendor Store",
    supportEmail: "support@example.com",
    contactNumber: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Backend API later
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white shadow rounded-xl p-6 space-y-5"
      >

        <div>
          <label className="block mb-2 font-medium">
            Site Name
          </label>

          <input
            name="siteName"
            value={form.siteName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Support Email
          </label>

          <input
            name="supportEmail"
            value={form.supportEmail}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Contact Number
          </label>

          <input
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Save Settings
        </button>

      </form>
    </div>
  );
}

export default Settings;