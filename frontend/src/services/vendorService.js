import api from "./axios";

const becomeVendor = async (vendorData) => {
  const { data } = await api.post("/vendor/request", vendorData);
  return data;
};

const getVendorDashboard = async () => {
  const { data } = await api.get("/vendor/dashboard");
  return data;
};

const getVendorProfile = async () => {
  const { data } = await api.get("/vendor/profile");
  return data;
};

const getVendorRequests = async () => {
  const { data } = await api.get("/vendor/requests");
  return data;
};
const createProduct = async (formData) => {
  const { data } = await api.post(
    "/vendor/products",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
const approveVendor = async (id) => {
  const { data } = await api.put(`/vendor/approve/${id}`);
  return data;
};

const rejectVendor = async (id) => {
  const { data } = await api.put(`/vendor/reject/${id}`);
  return data;
};

// ================= Products =================

const getVendorProducts = async () => {
  const { data } = await api.get("/vendor/products");
  return data;
};

const deleteVendorProduct = async (id) => {
  const { data } = await api.delete(`/vendor/products/${id}`);
  return data;
};

const changeProductStatus = async (id, status) => {
  const { data } = await api.patch(`/vendor/products/${id}/status`, { status });

  return data;
};
export default {
  becomeVendor,
  getVendorDashboard,
  getVendorProfile,
  getVendorRequests,
  approveVendor,
  rejectVendor,
  getVendorProducts,
  deleteVendorProduct,
  changeProductStatus,
  createProduct,
};
