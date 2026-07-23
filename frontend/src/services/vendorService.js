import api from "./axios";

const becomeVendor = async (vendorData) => {
  const { data } = await api.post("/vendor/request", vendorData);
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

const approveVendor = async (id) => {
  const { data } = await api.put(`/vendor/approve/${id}`);
  return data;
};

const rejectVendor = async (id) => {
  const { data } = await api.put(`/vendor/reject/${id}`);
  return data;
};

export default {
  becomeVendor,
  getVendorProfile,
  getVendorRequests,
  approveVendor,
  rejectVendor,
};