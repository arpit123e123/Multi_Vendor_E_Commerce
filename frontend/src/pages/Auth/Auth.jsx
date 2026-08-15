import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { login } from "../../redux/slices/authSlice";
import { getCart } from "../../redux/slices/cartSlice";
import authService from "../../services/authService";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  // ==========================
  // LOGIN INPUT
  // ==========================

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================
  // REGISTER INPUT
  // ==========================

  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================
  // LOGIN
  // ==========================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const result = await dispatch(login(loginData));

      if (login.fulfilled.match(result)) {
        await dispatch(getCart());

        const user = result.payload?.user;

        toast.success("Login successful");

        if (user?.role === "admin") {
          navigate("/admin");
        } else if (user?.role === "vendor") {
          navigate("/vendor");
        } else {
          navigate("/");
        }
      } else {
        toast.error(
          result.payload?.message || "Invalid email or password"
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // REGISTER
  // ==========================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.phone ||
      !registerData.password
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const data = await authService.register(registerData);

      if (data?.success) {
        toast.success("Registration successful");

        setRegisterData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "customer",
        });

        setIsLogin(true);
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ==========================
            LEFT BRANDING SECTION
        ========================== */}

        <div className="hidden md:flex bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white p-12 flex-col justify-between">

          <div>
            <div className="text-3xl font-bold tracking-tight">
              MultiVendor
            </div>

            <p className="text-blue-100 mt-4 text-lg leading-relaxed max-w-md">
              One marketplace. Multiple vendors.
              Everything you need in one place.
            </p>
          </div>

          <div>
            <div className="text-6xl mb-6">
              🛒
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Shop smarter.
              <br />
              Shop better.
            </h2>

            <p className="text-blue-100 mt-4 max-w-md">
              Discover products from multiple vendors and
              manage your shopping experience from one account.
            </p>
          </div>

          <div className="flex gap-4 text-sm text-blue-200">
            <span>Secure</span>
            <span>•</span>
            <span>Fast</span>
            <span>•</span>
            <span>Reliable</span>
          </div>
        </div>

        {/* ==========================
            RIGHT AUTH SECTION
        ========================== */}

        <div className="p-7 sm:p-10 lg:p-12">

          {/* LOGIN / REGISTER TOGGLE */}

          <div className="bg-gray-100 p-1.5 rounded-xl flex mb-8">

            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isLogin
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                !isLogin
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>

          </div>

          {/* ==========================
              LOGIN FORM
          ========================== */}

          {isLogin ? (
            <form onSubmit={handleLogin}>

              <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back
                </h1>

                <p className="text-gray-500 mt-2">
                  Login to continue to your account.
                </p>

              </div>

              <div className="space-y-5">

                {/* EMAIL */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />

                </div>

              </div>

              {/* FORGOT PASSWORD */}

              <div className="flex justify-end mt-3">

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-semibold transition-all"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* SWITCH */}

              <p className="text-center text-gray-500 mt-6">

                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create account
                </button>

              </p>

            </form>
          ) : (

            /* ==========================
               REGISTER FORM
            ========================== */

            <form onSubmit={handleRegister}>

              <div className="mb-7">

                <h1 className="text-3xl font-bold text-gray-900">
                  Create account
                </h1>

                <p className="text-gray-500 mt-2">
                  Create your account and start shopping.
                </p>

              </div>

              <div className="space-y-4">

                {/* NAME */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />

                  <p className="text-xs text-gray-400 mt-2">
                    Password must be at least 6 characters.
                  </p>

                </div>

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-semibold transition-all"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>

              {/* SWITCH */}

              <p className="text-center text-gray-500 mt-6">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </button>

              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Auth;