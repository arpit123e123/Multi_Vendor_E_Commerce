import api from "./axios";

export const getProducts = async () => {
  try {
    const { data } = await api.get("/products");
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const getSingleProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};