import api from "./axios";

const wishlistService = {
  addToWishlist: async (productId) => {
    const { data } = await api.post("/wishlist", { productId });
    return data;
  },

  getWishlist: async () => {
    const { data } = await api.get("/wishlist");
    return data;
  },

  removeFromWishlist: async (productId) => {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return data;
  },

  clearWishlist: async () => {
    const { data } = await api.delete(`/wishlist/clear/all`);
    return data;
  },
};

export default wishlistService;
