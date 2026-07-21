import api from "./axios";

const addressService = {
  getAddresses: async () => {
    const { data } = await api.get("/address");
    return data;
  },

  addAddress: async (addressData) => {
    const { data } = await api.post("/address", addressData);
    return data;
  },
};

export default addressService;