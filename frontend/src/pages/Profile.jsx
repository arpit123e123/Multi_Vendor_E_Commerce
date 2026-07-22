import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../redux/slices/userSlice";
import MainLayout from "../layouts/MainLayout";

const Profile = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

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

  const handleProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile(form));
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (!password.currentPassword || !password.newPassword) {
  return;
}

if (password.newPassword.length < 6) {
  return;
}
    dispatch(changePassword(password));
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-10">

        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>

        <form
          onSubmit={handleProfile}
          className="space-y-4"
        >

          <input
            className="border p-3 w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e)=>
              setForm({...form,name:e.target.value})
            }
          />

          <input
            className="border p-3 w-full"
            placeholder="Phone"
            value={form.phone}
            maxLength={10}
            onChange={(e)=>
              setForm({...form,phone:e.target.value})
            }
          />

          <input
            className="border p-3 w-full"
            placeholder="Address"
            value={form.address}
            onChange={(e)=>
              setForm({...form,address:e.target.value})
            }
          />

          <input
            className="border p-3 w-full"
            placeholder="City"
            value={form.city}
            onChange={(e)=>
              setForm({...form,city:e.target.value})
            }
          />

          <input
            className="border p-3 w-full"
            placeholder="State"
            value={form.state}
            onChange={(e)=>
              setForm({...form,state:e.target.value})
            }
          />

          <input
            className="border p-3 w-full"
            placeholder="Country"
            value={form.country}
            onChange={(e)=>
              setForm({...form,country:e.target.value})
            }
          />

          <input
            className="border p-3 w-full"
            placeholder="Pincode"
            value={form.pincode}
            maxLength={6}
            onChange={(e)=>
              setForm({...form,pincode:e.target.value})
            }
          />

          <button
  type="submit"
  disabled={loading}
  className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50"
>
  {loading ? "Updating..." : "Update Profile"}
</button>
        </form>

        <hr className="my-10"/>

        <form
          onSubmit={handlePassword}
          className="space-y-4"
        >

          <input
            type="password"
            className="border p-3 w-full"
            placeholder="Current Password"
            onChange={(e)=>
              setPassword({
                ...password,
                currentPassword:e.target.value
              })
            }
          />

          <input
            type="password"
            className="border p-3 w-full"
            placeholder="New Password"
            onChange={(e)=>
              setPassword({
                ...password,
                newPassword:e.target.value
              })
            }
          />

          <button
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Change Password
          </button>

        </form>

      </div>
    </MainLayout>
  );
};

export default Profile;