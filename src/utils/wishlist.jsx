const WISHLIST_KEY = "sogasari_wishlist";


/*
 * ===============================
 * GET LOCAL WISHLIST
 * ===============================
 */
export const getLocalWishlist = () => {
  try {
    const stored = localStorage.getItem(
      WISHLIST_KEY
    );

    if (!stored) {
      return [];
    }

    const ids = JSON.parse(stored);

    return Array.isArray(ids)
      ? ids.map(Number)
      : [];

  } catch (error) {
    console.error(
      "Failed to read wishlist:",
      error
    );

    return [];
  }
};


/*
 * ===============================
 * SAVE LOCAL WISHLIST
 * ===============================
 */
export const saveLocalWishlist = (ids) => {
  const uniqueIds = [
    ...new Set(
      ids.map(Number)
    ),
  ];

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(uniqueIds)
  );

  window.dispatchEvent(
    new CustomEvent(
      "sogasari-wishlist-changed"
    )
  );
};


/*
 * ===============================
 * ADD LOCAL
 * ===============================
 */
export const addLocalWishlist = (
  productId
) => {
  const ids = getLocalWishlist();

  const id = Number(productId);

  if (!ids.includes(id)) {
    ids.push(id);
  }

  saveLocalWishlist(ids);

  return ids;
};


/*
 * ===============================
 * REMOVE LOCAL
 * ===============================
 */
export const removeLocalWishlist = (
  productId
) => {
  const id = Number(productId);

  const ids =
    getLocalWishlist().filter(
      (wishlistId) =>
        wishlistId !== id
    );

  saveLocalWishlist(ids);

  return ids;
};


/*
 * ===============================
 * TOGGLE LOCAL
 * ===============================
 */
export const toggleLocalWishlist = (
  productId
) => {
  const id = Number(productId);

  const ids = getLocalWishlist();

  if (ids.includes(id)) {
    return removeLocalWishlist(id);
  }

  return addLocalWishlist(id);
};