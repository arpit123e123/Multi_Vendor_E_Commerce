import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/authService";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await verifyOtp(email, otp);

      alert("OTP Verified Successfully");

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });

    } catch (err) {
      alert(err.response?.data?.message || "OTP Verification Failed");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Verify OTP</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
      />

      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default VerifyOtp;