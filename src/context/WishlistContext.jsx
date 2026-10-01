import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

import {
  getLocalWishlist,
  addLocalWishlist,
  removeLocalWishlist,
} from "../utils/wishlist";


const WishlistContext =
  createContext(null);


export function WishlistProvider({
  children,
}) {

  const [wishlistIds, setWishlistIds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /*
   * ===============================
   * LOAD WISHLIST
   * ===============================
   */
  const loadWishlist = async () => {

    const token =
      localStorage.getItem(
        "sogasari_token"
      );

    try {

      setLoading(true);

      /*
       * LOGGED USER
       */
      if (token) {

        const ids =
          await getWishlist();

        const normalizedIds =
          (ids || []).map((item) => {

            /*
             * Supports:
             * 12
             * { productId: 12 }
             * { id: 12 }
             */

            if (
              typeof item ===
              "number"
            ) {
              return item;
            }

            return Number(
              item.productId ??
              item.id
            );
          });

        setWishlistIds(
          normalizedIds
        );

      }

      /*
       * GUEST USER
       */
      else {

        setWishlistIds(
          getLocalWishlist()
        );

      }

    } catch (error) {

      console.error(
        "Failed to load wishlist:",
        error
      );

      /*
       * If API fails, don't destroy
       * local guest wishlist.
       */
      setWishlistIds(
        getLocalWishlist()
      );

    } finally {

      setLoading(false);

    }
  };


  /*
   * ===============================
   * INITIAL LOAD
   * ===============================
   */
  useEffect(() => {

    loadWishlist();

  }, []);


  /*
   * ===============================
   * LOGIN / LOGOUT DETECTION
   * ===============================
   */
  useEffect(() => {

    const handleStorageChange = () => {
      loadWishlist();
    };

    const handleWishlistChange = () => {
      loadWishlist();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "sogasari-wishlist-changed",
      handleWishlistChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "sogasari-wishlist-changed",
        handleWishlistChange
      );

    };

  }, []);


  /*
   * ===============================
   * CHECK LIKED
   * ===============================
   */
  const isWishlisted = (
    productId
  ) => {

    return wishlistIds.includes(
      Number(productId)
    );

  };


  /*
   * ===============================
   * TOGGLE WISHLIST
   * ===============================
   */
  const toggleWishlist = async (
    productId
  ) => {

    const id =
      Number(productId);

    const token =
      localStorage.getItem(
        "sogasari_token"
      );


    /*
     * =============================
     * LOGGED USER
     * =============================
     */
    if (token) {

      const alreadyLiked =
        wishlistIds.includes(id);

      /*
       * Optimistic UI
       */
      setWishlistIds((current) => {

        if (alreadyLiked) {

          return current.filter(
            (item) => item !== id
          );

        }

        return [
          ...current,
          id,
        ];

      });


      try {

        if (alreadyLiked) {

          await removeFromWishlist(id);

        } else {

          await addToWishlist(id);

        }

      } catch (error) {

        console.error(
          "Wishlist update failed:",
          error
        );

        /*
         * Revert if API fails
         */
        setWishlistIds((current) => {

          if (alreadyLiked) {

            return [
              ...current,
              id,
            ];

          }

          return current.filter(
            (item) => item !== id
          );

        });

        throw error;
      }

      return;
    }


    /*
     * =============================
     * GUEST USER
     * =============================
     */

    const currentIds =
      wishlistIds;

    const alreadyLiked =
      currentIds.includes(id);

    let updatedIds;

    if (alreadyLiked) {

      updatedIds =
        removeLocalWishlist(id);

    } else {

      updatedIds =
        addLocalWishlist(id);

    }

    setWishlistIds(
      updatedIds
    );
  };


  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        loading,
        isWishlisted,
        toggleWishlist,
        reloadWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}


export const useWishlist = () => {

  const context =
    useContext(
      WishlistContext
    );

  if (!context) {

    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );

  }

  return context;
};