import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = useMemo(() => {
    const password = form.password;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }, [form.password]);

  const strengthText = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Excellent",
  ];

  const strengthColor = [
    "bg-red-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-green-600",
  ];

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await resetPassword(
        token,
        form.password,
        form.confirmPassword,
      );

      toast.success(res.message);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={70} />

          <h2 className="text-3xl font-bold">Password Updated</h2>

          <p className="text-gray-500 mt-3">Redirecting to Login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>

        <p className="text-center text-gray-500 mb-7">
          Create a new secure password.
        </p>

        <form onSubmit={submitHandler}>
          <div className="relative mb-5">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={changeHandler}
              placeholder="New Password"
              className="w-full border rounded-lg p-3 pr-12"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded mb-2">
            <div
              className={`h-2 rounded ${strengthColor[passwordStrength]}`}
              style={{
                width: `${passwordStrength * 20}%`,
              }}
            />
          </div>

          <p className="text-sm mb-5 text-gray-500">
            Strength: {strengthText[passwordStrength]}
          </p>

          <div className="relative mb-6">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={changeHandler}
              placeholder="Confirm Password"
              className="w-full border rounded-lg p-3 pr-12"
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-4"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 transition"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
