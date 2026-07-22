import api from "./axios";

/**
 * Get All Products
 * Supports:
 * keyword
 * category
 * minPrice
 * maxPrice
 * minRating
 * inStock
 * vendor
 * sort
 * page
 * limit
 */
export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", {
    params,
  });

  return data;
};

/**
 * Get Single Product
 */
export const getSingleProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`);

  return data;
};

/**
 * Get Related Products
 */
export const getRelatedProducts = async (id) => {
  const { data } = await api.get(`/products/${id}/related`);

  return data;
};

/**
 * Create Product
 */
export const createProduct = async (formData) => {
  const { data } = await api.post("/products/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

/**
 * Update Product
 */
export const updateProduct = async (id, formData) => {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

/**
 * Delete Product
 */
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);

  return data;
};

/**
 * Add Review
 */
export const addReview = async (id, reviewData) => {
  const { data } = await api.post(`/products/${id}/review`, reviewData);

  return data;
};

/**
 * Update Review
 */
export const updateReview = async (id, reviewData) => {
  const { data } = await api.put(`/products/${id}/review`, reviewData);

  return data;
};

/**
 * Delete Review
 */
export const deleteReview = async (id) => {
  const { data } = await api.delete(`/products/${id}/review`);

  return data;
};
