import api from "./axios";

const cartService = {
  addToCart: async ({ productId, quantity }) => {
    const { data } = await api.post("/cart/add", {
      productId,
      quantity,
    });
    return data;
  },

  getCart: async () => {
    const { data } = await api.get("/cart");
    return data;
  },

  updateCart: async (productId, quantity) => {
    const { data } = await api.put(`/cart/update/${productId}`, {
      quantity,
    });
    return data;
  },

  removeItem: async (productId) => {
    const { data } = await api.delete(`/cart/remove/${productId}`);
    return data;
  },

  clearCart: async () => {
    const { data } = await api.delete("/cart/clear");
    return data;
  },
};

export default cartService;
