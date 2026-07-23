import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  updateProfile,
  changePassword,
  clearUserState,
} from "../redux/slices/userSlice";
import MainLayout from "../layouts/MainLayout";

const Profile = () => {
  const dispatch = useDispatch();

  const {
    user,
    loading,
    success,
    error,
  } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
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
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        pincode: user.pincode || "",
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

  const handleProfile = (e) => {
    e.preventDefault();

    dispatch(updateProfile(form));
  };

  const handlePassword = (e) => {
    e.preventDefault();

    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      return alert("All fields are required");
    }

    if (password.newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (
      password.newPassword !==
      password.confirmPassword
    ) {
      return alert("Passwords do not match");
    }

    dispatch(changePassword(password));

    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
   <div className="max-w-4xl mx-auto py-10 px-4">

  <h1 className="text-3xl font-bold mb-8">
    My Profile
  </h1>

  <div className="bg-white rounded-lg shadow-md p-6 mb-10">

    <h2 className="text-xl font-semibold mb-5">
      Edit Profile
    </h2>

    <form
      onSubmit={handleProfile}
      className="space-y-4"
    >

      <input
        className="border rounded p-3 w-full"
        placeholder="Name"
        value={form.name}
        onChange={(e)=>
          setForm({
            ...form,
            name:e.target.value
          })
        }
      />

      <input
        className="border rounded p-3 w-full"
        placeholder="Phone"
        value={form.phone}
        maxLength={10}
        onChange={(e)=>
          setForm({
            ...form,
            phone:e.target.value
          })
        }
      />

      <input
        className="border rounded p-3 w-full"
        placeholder="Address"
        value={form.address}
        onChange={(e)=>
          setForm({
            ...form,
            address:e.target.value
          })
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          className="border rounded p-3"
          placeholder="City"
          value={form.city}
          onChange={(e)=>
            setForm({
              ...form,
              city:e.target.value
            })
          }
        />

        <input
          className="border rounded p-3"
          placeholder="State"
          value={form.state}
          onChange={(e)=>
            setForm({
              ...form,
              state:e.target.value
            })
          }
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          className="border rounded p-3"
          placeholder="Country"
          value={form.country}
          onChange={(e)=>
            setForm({
              ...form,
              country:e.target.value
            })
          }
        />

        <input
          className="border rounded p-3"
          placeholder="Pincode"
          value={form.pincode}
          maxLength={6}
          onChange={(e)=>
            setForm({
              ...form,
              pincode:e.target.value
            })
          }
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

    </form>

  </div>

  <div className="bg-white rounded-lg shadow-md p-6">

    <h2 className="text-xl font-semibold mb-5">
      Change Password
    </h2>
        <form
      onSubmit={handlePassword}
      className="space-y-4"
    >

      <input
        type="password"
        className="border rounded p-3 w-full"
        placeholder="Current Password"
        value={password.currentPassword}
        onChange={(e)=>
          setPassword({
            ...password,
            currentPassword:e.target.value
          })
        }
      />

      <input
        type="password"
        className="border rounded p-3 w-full"
        placeholder="New Password"
        value={password.newPassword}
        onChange={(e)=>
          setPassword({
            ...password,
            newPassword:e.target.value
          })
        }
      />

      <input
        type="password"
        className="border rounded p-3 w-full"
        placeholder="Confirm New Password"
        value={password.confirmPassword}
        onChange={(e)=>
          setPassword({
            ...password,
            confirmPassword:e.target.value
          })
        }
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {loading ? "Changing..." : "Change Password"}
      </button>

    </form>

  </div>

</div>
  );
};

export default Profile;