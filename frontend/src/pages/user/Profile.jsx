import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "USER",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <h2 className="text-xl font-semibold">Loading Profile...</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={
                user?.avatar ||
                "https://ui-avatars.com/api/?background=2563eb&color=fff&name=" +
                  encodeURIComponent(profile.name || "User")
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile.name}</h1>

              <p className="text-gray-500 mt-2">{profile.email}</p>
              <div className="mt-3 inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
                {profile.role}
              </div>
            </div>
          </div>

          <hr className="my-8" />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={profile.name}
                readOnly
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Mobile Number
              </label>

              <input
                type="text"
                value={profile.phone || "Not Added"}
                readOnly
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Account Type
              </label>

              <input
                type="text"
                value={profile.role}
                readOnly
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-10">
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-default"
            >
              Edit Profile
              <span className="ml-2 text-xs">(Coming Soon)</span>
            </button>

            <button
              type="button"
              className="bg-gray-700 text-white px-6 py-3 rounded-lg cursor-default"
            >
              Change Password
              <span className="ml-2 text-xs">(Coming Soon)</span>
            </button>

            <Link
              to="/products"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
