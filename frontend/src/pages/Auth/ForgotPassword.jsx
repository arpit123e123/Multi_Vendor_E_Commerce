import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await forgotPassword(email);

      toast.success(res.message);

      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-3">Forgot Password</h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your registered email address.
        </p>

        {sent ? (
          <div className="bg-green-100 text-green-700 rounded-lg p-4">
            If an account exists, we've sent you a reset email.
          </div>
        ) : (
          <form onSubmit={submitHandler}>
            <input
              type="email"
              required
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 mb-5"
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
