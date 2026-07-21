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

export default authService;