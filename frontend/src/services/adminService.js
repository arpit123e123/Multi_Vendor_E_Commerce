import axiosInstance from "./axiosInstance";

const getUsers = async () => {
  const { data } = await axiosInstance.get("/admin/users");
  return data;
};

const blockUser = async (id, isBlocked) => {
  const { data } = await axiosInstance.patch(`/admin/users/${id}`, {
    isBlocked,
  });

  return data;
};

const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/users/${id}`);
  return data;
};

const getVendors = async () => {
  const { data } = await axiosInstance.get("/admin/vendors");
  return data;
};

const getOrders = async () => {
  const { data } = await axiosInstance.get("/admin/orders");
  return data;
};

const getAnalytics = async () => {
  const { data } = await axiosInstance.get("/admin/analytics");
  return data;
};

const getRecentOrders = async () => {
  const { data } = await axiosInstance.get("/admin/recent-orders");
  return data;
};

const getTopProducts = async () => {
  const { data } = await axiosInstance.get("/admin/top-products");
  return data;
};

export default {
  getUsers,
  blockUser,
  deleteUser,
  getVendors,
  getOrders,
  getAnalytics,
  getRecentOrders,
  getTopProducts,
};