import api from "./api";

const getToken = () => {
  return localStorage.getItem("sogasari_token");
};

/*
 * ===============================
 * GET MY WISHLIST
 * ===============================
 */
export const getWishlist = async () => {
  const token = getToken();

  const response = await api.get(
    `/wishlist`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data || [];
};


/*
 * ===============================
 * ADD TO WISHLIST
 * ===============================
 */
export const addToWishlist = async (productId) => {
  const token = getToken();

  const response = await api.post(
    `/wishlist/${productId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


/*
 * ===============================
 * REMOVE FROM WISHLIST
 * ===============================
 */
export const removeFromWishlist = async (productId) => {
  const token = getToken();

  const response = await api.delete(
    `/wishlist/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};