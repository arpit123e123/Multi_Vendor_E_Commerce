import { useState } from "react";
import { forgotPassword } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword(email);

      alert("OTP Sent Successfully");

      navigate("/verify-otp", {
        state: { email },
      });

    } catch (err) {

      alert(err.response?.data?.message);

    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button>Send OTP</button>
    </form>
  );
};

export default ForgotPassword;