import api from "./api";

export const getAllProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

export const getNewArrivals = async () => {
  const response = await api.get("/products/new-arrivals");

  return response.data;
};

export const getBestSellers = async () => {
  const response = await api.get("/products/best-sellers");

  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get("/products/featured");

  return response.data;
};

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);

  return response.data;
};

export const getProductsByCategory = async (slug) => {
  const response = await api.get(
    `/products/category/${slug}`
  );

  return response.data;
};

export const searchProducts = async (search) => {
  const response = await api.get("/products/search", {
    params: {
      search,
    },
  });

  return response.data;
};

 
export const getProductById = async (productId) => {
  const response = await api.get(`/products/id/${productId}`);

  return response.data;
};