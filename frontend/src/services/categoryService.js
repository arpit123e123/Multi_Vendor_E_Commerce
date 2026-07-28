import api from "./axios";

const getAllCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

const getCategoryById = async (id) => {
  const { data } = await api.get(`/categories/${id}`);
  return data;
};

export default {
  getAllCategories,
  getCategoryById,
};