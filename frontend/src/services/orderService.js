import api from "./axios";

const orderService = {
  createOrder: async (orderData) => {
    const { data } = await api.post("/orders", orderData);
    return data;
  },

  getMyOrders: async () => {
    const { data } = await api.get("/orders");
    return data;
  },
};

export default orderService;
