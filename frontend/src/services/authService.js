import api from "./axios";

const authService = {
  login: async (userData) => {
    const { data } = await api.post("/auth/login", userData);

    if (data.success) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);

    if (data.success) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },
};
export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", {
    email,
  });

  return data;
};

export const verifyOtp = async (email, otp) => {
  const { data } = await api.post("/auth/verify-otp", {
    email,
    otp,
  });

  return data;
};

export const resetPassword = async (email, otp, password) => {
  const { data } = await api.post("/auth/reset-password", {
    email,
    otp,
    password,
  });

  return data;
};
import api from "./axios";

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (
  token,
  password,
  confirmPassword
) => {
  const { data } = await api.post(
    `/auth/reset-password/${token}`,
    {
      password,
      confirmPassword,
    }
  );

  return data;
};

export default authService;