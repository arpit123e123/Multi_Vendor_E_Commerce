import api from "./axios";

const paymentService = {
  createPaymentOrder: async (orderId) => {
    const { data } = await api.post("/payment/create-order", { orderId });
    return data;
  },

  verifyPayment: async (payload) => {
    const { data } = await api.post("/payment/verify", payload);
    return data;
  },
};

export default paymentService;
