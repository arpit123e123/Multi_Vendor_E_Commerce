import api from "./axios";

const getProfile = async () => {
  const { data } = await api.get("/user/profile");
  return data;
};

const updateProfile = async (userData) => {
  const { data } = await api.put("/user/profile", userData);
  return data;
};

const changePassword = async (passwordData) => {
  const { data } = await api.put(
    "/user/change-password",
    passwordData
  );
  return data;
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};