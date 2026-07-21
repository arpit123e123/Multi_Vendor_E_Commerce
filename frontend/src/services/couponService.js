import api from "./axios";

const couponService = {
  // Get all coupons (Admin)
  getCoupons: async () => {
    const { data } = await api.get("/coupon");
    return data;
  },

  // Create coupon (Admin)
  createCoupon: async (couponData) => {
    const { data } = await api.post("/coupon", couponData);
    return data;
  },

  // Update coupon (Admin)
  updateCoupon: async (id, couponData) => {
    const { data } = await api.put(`/coupon/${id}`, couponData);
    return data;
  },

  // Delete coupon (Admin)
  deleteCoupon: async (id) => {
    const { data } = await api.delete(`/coupon/${id}`);
    return data;
  },

  // Apply coupon (User)
  applyCoupon: async (couponData) => {
    const { data } = await api.post("/coupon/apply", couponData);
    return data;
  },
};

export default couponService;