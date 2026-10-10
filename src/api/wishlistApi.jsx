
import api from "./api";

const WISHLIST_KEY = "sogasari_wishlist";
const ACCESS_KEY = "sogasari_token";

// ---------- Local storage helpers ----------

export const getGuestWishlistIds = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(WISHLIST_KEY) || "[]"
    );

    return Array.isArray(saved)
      ? [...new Set(saved.map(Number).filter(Number.isFinite))]
      : [];
  } catch {
    return [];
  }
};

const saveGuestWishlistIds = (ids) => {
  const uniqueIds = [...new Set(ids.map(Number))];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(uniqueIds));

  window.dispatchEvent(
    new CustomEvent("sogasari-wishlist-changed")
  );
};

export const isUserLoggedIn = () =>
  Boolean(localStorage.getItem(ACCESS_KEY));

// ---------- Get wishlist ----------

export const getWishlist = async () => {
  if (!isUserLoggedIn()) {
    return getGuestWishlistProducts();
  }

  const response = await api.get("/wishlist");
  return Array.isArray(response.data) ? response.data : [];
};

// Load product details for guest wishlist IDs.
const getGuestWishlistProducts = async () => {
  const ids = getGuestWishlistIds();

  if (ids.length === 0) return [];

  // Assumes GET /products returns the product list.
  const response = await api.get("/products");

  const data = response.data;
  const allProducts = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : [];

  return allProducts.filter((product) =>
    ids.includes(Number(product.id))
  );
};

// ---------- Add to wishlist ----------

export const addToWishlist = async (productId) => {
  const id = Number(productId);

  if (!isUserLoggedIn()) {
    const ids = getGuestWishlistIds();

    if (!ids.includes(id)) {
      saveGuestWishlistIds([...ids, id]);
    }

    return { success: true, guest: true };
  }

  const response = await api.post(`/wishlist/${id}`, {});
  return response.data;
};

// ---------- Remove from wishlist ----------

export const removeFromWishlist = async (productId) => {
  const id = Number(productId);

  if (!isUserLoggedIn()) {
    saveGuestWishlistIds(
      getGuestWishlistIds().filter((item) => item !== id)
    );

    return { success: true, guest: true };
  }

  const response = await api.delete(`/wishlist/${id}`);
  return response.data;
};

// ---------- Sync guest wishlist after login ----------

export const syncWishlistAfterLogin = async () => {
  if (!isUserLoggedIn()) return;

  const guestIds = getGuestWishlistIds();

  if (guestIds.length === 0) return;

  // Read the logged-in user's existing wishlist.
  const response = await api.get("/wishlist");
  const serverProducts = Array.isArray(response.data)
    ? response.data
    : [];

  const serverIds = new Set(
    serverProducts.map((product) => Number(product.id))
  );

  // Add only products that aren't already saved on the server.
  for (const id of guestIds) {
    if (!serverIds.has(id)) {
      await api.post(`/wishlist/${id}`, {});
    }
  }

  // Keep the merged IDs locally.
  saveGuestWishlistIds([
    ...serverIds,
    ...guestIds,
  ]);
};
