import api from "./api";

const getToken = () => {
  return localStorage.getItem("sogasari_token");
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getCart = async () => {
  const response = await api.get(
    "/cart",
    authConfig()
  );

  return response.data || [];
};

export const addToCartApi = async (
  productId,
  quantity = 1
) => {
  const response = await api.post(
    `/cart/${productId}`,
    {},
    {
      ...authConfig(),
      params: {
        quantity,
      },
    }
  );

  return response.data;
};

export const updateCartQuantity = async (
  productId,
  quantity
) => {
  const response = await api.put(
    `/cart/${productId}`,
    {},
    {
      ...authConfig(),
      params: {
        quantity,
      },
    }
  );

  return response.data;
};

export const removeFromCartApi = async (
  productId
) => {
  await api.delete(
    `/cart/${productId}`,
    authConfig()
  );
};

export const clearCartApi = async () => {
  await api.delete(
    "/cart",
    authConfig()
  );
};