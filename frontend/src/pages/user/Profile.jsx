import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

import {
  getProfile,
  updateProfile,
  changePassword,
  clearUserState,
} from "../../redux/slices/userSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const {
    user,
    loading,
    success,
    error,
  } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    role: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        pincode: user.pincode || "",
        role: user.role || "customer",
      });
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      alert(success);
      dispatch(clearUserState());
    }

    if (error) {
      alert(error);
      dispatch(clearUserState());
    }
  }, [success, error, dispatch]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    dispatch(updateProfile(profile));

    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      return alert("All fields are required");
    }

    if (password.newPassword !== password.confirmPassword) {
      return alert("Passwords do not match");
    }

    if (password.newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    dispatch(changePassword(password));

    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <h2 className="text-xl font-semibold">
            Loading Profile...
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
  <div className="max-w-5xl mx-auto px-6 py-10">

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <div className="bg-linear-gradient-to-r from-blue-600 to-indigo-600 h-36"></div>

      <div className="px-8 pb-8">

        <div className="-mt-16 flex flex-col md:flex-row md:items-end gap-6">

          <img
            src={
              user?.avatar ||
              "https://ui-avatars.com/api/?background=2563eb&color=fff&name=" +
                encodeURIComponent(profile.name || "User")
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover shadow-lg"
          />

          <div className="flex-1">

            <h1 className="text-3xl font-bold">
              {profile.name}
            </h1>

            <p className="text-gray-500 mt-2">
              {profile.email}
            </p>

            <span className="inline-block mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full capitalize">
              {profile.role}
            </span>

          </div>

        </div>

        <form
          onSubmit={handleProfileUpdate}
          className="mt-10"
        >

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                type="text"
                value={profile.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                className={`w-full border rounded-lg px-4 py-3 ${
                  isEditing
                    ? "bg-white"
                    : "bg-gray-100"
                }`}
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />

            </div>
                        <div>

              <label className="block mb-2 font-medium">
                Phone
              </label>

              <input
                type="text"
                value={profile.phone}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                className={`w-full border rounded-lg px-4 py-3 ${
                  isEditing
                    ? "bg-white"
                    : "bg-gray-100"
                }`}
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Address
              </label>

              <input
                type="text"
                value={profile.address}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    address: e.target.value,
                  })
                }
                className={`w-full border rounded-lg px-4 py-3 ${
                  isEditing
                    ? "bg-white"
                    : "bg-gray-100"
                }`}
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                City
              </label>

              <input
                type="text"
                value={profile.city}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    city: e.target.value,
                  })
                }
                className={`w-full border rounded-lg px-4 py-3 ${
                  isEditing
                    ? "bg-white"
                    : "bg-gray-100"
                }`}
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                State
              </label>

              <input
                type="text"
                value={profile.state}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    state: e.target.value,
                  })
                }
                className={`w-full border rounded-lg px-4 py-3 ${
                  isEditing
                    ? "bg-white"
                    : "bg-gray-100"
                }`}
              />

            </div>
                        <div>

              <label className="block mb-2 font-medium">
                Country
              </label>

              <input
                type="text"
                value={profile.country}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    country: e.target.value,
                  })
                }
                className={`w-full border rounded-lg px-4 py-3 ${
                  isEditing
                    ? "bg-white"
                    : "bg-gray-100"
                }`}
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Pincode
              </label>

              <input
                type="text"
                maxLength={6}
                value={profile.pincode}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    pincode: e.target.value,
                  })
                }
                className={`w-full border rounded-lg px-4 py-3 ${
                  isEditing
                    ? "bg-white"
                    : "bg-gray-100"
                }`}
              />

            </div>

          </div>

          <div className="flex gap-4 mt-8">

            {!isEditing ? (

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Edit Profile
              </button>

            ) : (

              <>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);

                    setProfile({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      address: user.address || "",
                      city: user.city || "",
                      state: user.state || "",
                      country: user.country || "",
                      pincode: user.pincode || "",
                      role: user.role || "customer",
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>

              </>

            )}

            <Link
              to="/products"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              Continue Shopping
            </Link>

          </div>

          <hr className="my-10" />
                    <div>

            <h2 className="text-2xl font-bold mb-6">
              Change Password
            </h2>

            <form
              onSubmit={handlePasswordChange}
              className="space-y-5"
            >

              <input
                type="password"
                placeholder="Current Password"
                value={password.currentPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="password"
                placeholder="New Password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    newPassword: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={password.confirmPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
              >
                {loading
                  ? "Updating..."
                  : "Change Password"}
              </button>

            </form>

          </div>
 </form>
        </div>

      </div>

    </div>
);
};

export default Profile;