import { useState } from "react";
import { useDispatch } from "react-redux";
import { getCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRoleHome = (role) => {
    if (role === "admin") {
      return "/admin";
    }

    if (role === "vendor") {
      return "/vendor";
    }

    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const result = await dispatch(
        login({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        })
      );

      if (login.fulfilled.match(result)) {
        const user = result.payload?.user;

        if (!user?.role) {
          toast.error("Invalid account information");
          return;
        }

        // Cart is only required for customer accounts
        if (user.role === "customer") {
          try {
            await dispatch(getCart()).unwrap();
          } catch {
            // Cart failure should not block login
          }
        }

        toast.success("Login Successful");

        // Role based redirect
        navigate(getRoleHome(user.role), {
          replace: true,
        });
      } else {
        toast.error(
          result.payload?.message ||
            "Invalid email or password"
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >

        <h2 className="text-3xl font-bold text-center mb-6">
          Login
        </h2>

        {/* Email */}

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="email"
          required
        />

        {/* Password */}

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="current-password"
          required
        />

        {/* Forgot Password */}

        <div className="flex justify-end mb-6">

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
};

export default Login;