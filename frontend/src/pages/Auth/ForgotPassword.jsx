import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const data = await authService.forgotPassword(cleanEmail);

      if (data?.success) {
        toast.success(data.message || "OTP sent to your email");

        navigate("/reset-password", {
          state: {
            email: cleanEmail,
          },
        });
      } else {
        toast.error(data?.message || "Unable to send OTP");
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* =========================
            LEFT BRANDING
        ========================= */}
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
              🔐
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Secure your
              <br />
              account.
            </h2>

            <p className="text-blue-100 mt-4 max-w-md">
              Enter your registered email and we'll send
              you a verification code to reset your password.
            </p>
          </div>

          <div className="flex gap-4 text-sm text-blue-200">
            <span>Secure</span>
            <span>•</span>
            <span>Private</span>
            <span>•</span>
            <span>Reliable</span>
          </div>
        </div>

        {/* =========================
            RIGHT FORM
        ========================= */}
        <div className="p-7 sm:p-10 lg:p-12 flex items-center">

          <div className="w-full">

            {/* Back */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-gray-500 hover:text-blue-600 font-medium mb-8 transition"
            >
              ← Back to Login
            </button>

            {/* Heading */}
            <div className="mb-8">

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl mb-5">
                🔑
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                Forgot password?
              </h1>

              <p className="text-gray-500 mt-2 leading-relaxed">
                No worries. Enter your registered email and
                we'll send you an OTP to reset your password.
              </p>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  required
                />

              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-semibold transition-all"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

            </form>

            {/* Bottom */}
            <p className="text-center text-gray-500 mt-6">

              Remember your password?{" "}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>

            </p>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;