import api from "./axios";

const authService = {
  // =========================
  // LOGIN
  // =========================
  login: async (userData) => {
    const { data } = await api.post("/auth/login", userData);

    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  // =========================
  // REGISTER
  // =========================
  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);

    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  // =========================
  // FORGOT PASSWORD
  // =========================
  forgotPassword: async (email) => {
    const { data } = await api.post("/auth/forgot-password", {
      email,
    });

    return data;
  },

  // =========================
  // RESET PASSWORD
  // =========================
  resetPassword: async (token, password, confirmPassword) => {
    const { data } = await api.post(
      `/auth/reset-password/${token}`,
      {
        password,
        confirmPassword,
      }
    );

    return data;
  },
};

// Named exports bhi rakhe hain
// taaki dono import styles kaam karein.
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;

export default authService;