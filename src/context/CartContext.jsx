import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCart,
  addToCartApi,
  updateCartQuantity,
  removeFromCartApi,
  clearCartApi,
} from "../api/cartApi";

const CartContext = createContext();

const LOCAL_CART_KEY = "sogasari_guest_cart";


/* =====================================================
   GET TOKEN
===================================================== */

const getToken = () => {
  return localStorage.getItem(
    "sogasari_token"
  );
};


/* =====================================================
   LOCAL GUEST CART
===================================================== */

const getLocalCart = () => {

  try {

    const saved =
      localStorage.getItem(
        LOCAL_CART_KEY
      );

    if (!saved) {
      return [];
    }

    const cart =
      JSON.parse(saved);

    return Array.isArray(cart)
      ? cart
      : [];

  } catch (error) {

    console.error(
      "Failed to load guest cart:",
      error
    );

    return [];
  }
};


const saveLocalCart = (items) => {

  localStorage.setItem(
    LOCAL_CART_KEY,
    JSON.stringify(items)
  );

  window.dispatchEvent(
    new CustomEvent(
      "sogasari-cart-changed"
    )
  );
};


const clearLocalCart = () => {

  localStorage.removeItem(
    LOCAL_CART_KEY
  );

  window.dispatchEvent(
    new CustomEvent(
      "sogasari-cart-changed"
    )
  );
};


/* =====================================================
   NORMALIZE BACKEND CART
===================================================== */

const normalizeBackendCart = (
  items
) => {

  return items.map((item) => ({
    cartId: item.id,

    productId: item.productId,

    name: item.name,

    category:
      item.category || "",

    image:
      item.image || "",

    price:
      Number(item.price) || 0,

    originalPrice:
      Number(item.originalPrice) || 0,

    color:
      item.color || null,

    size:
      item.size || null,

    quantity:
      Number(item.quantity) || 1,
  }));
};


/* =====================================================
   LOCAL CART FORMAT
===================================================== */

const normalizeLocalCart = (
  items
) => {

  return items.map((item) => ({
    cartId:
      item.cartId ||
      `${item.productId}-guest`,

    productId:
      Number(item.productId),

    name:
      item.name || "",

    category:
      item.category || "",

    image:
      item.image || "",

    price:
      Number(item.price) || 0,

    originalPrice:
      Number(item.originalPrice) || 0,

    color:
      item.color || null,

    size:
      item.size || null,

    quantity:
      Number(item.quantity) || 1,
  }));
};


export function CartProvider({
  children,
}) {

  const [cartItems, setCartItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  /* =====================================================
     LOAD CART
  ===================================================== */

  const loadCart = async () => {

    const token = getToken();

    /*
     * Guest user
     */
    if (!token) {

      const localCart =
        normalizeLocalCart(
          getLocalCart()
        );

      setCartItems(localCart);

      return;
    }


    /*
     * Logged-in user
     */

    try {

      setLoading(true);

      const items =
        await getCart();

      setCartItems(
        normalizeBackendCart(
          items
        )
      );

    } catch (error) {

      console.error(
        "Failed to load cart:",
        error
      );

      setCartItems([]);

    } finally {

      setLoading(false);
    }
  };


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadCart();

  }, []);


  /* =====================================================
     SYNC GUEST CART AFTER LOGIN
  ===================================================== */

  const syncGuestCart = async () => {

    const token = getToken();

    if (!token) {
      return;
    }

    const guestCart =
      normalizeLocalCart(
        getLocalCart()
      );

    if (
      guestCart.length === 0
    ) {
      return;
    }

    try {

      setLoading(true);

      /*
       * Send every guest cart item
       * to backend.
       */

      for (
        const item of guestCart
      ) {

        await addToCartApi(
          item.productId,
          item.quantity
        );
      }


      /*
       * Backend now contains
       * guest cart.
       */

      clearLocalCart();


      /*
       * Reload backend cart.
       */

      const items =
        await getCart();

      setCartItems(
        normalizeBackendCart(
          items
        )
      );

    } catch (error) {

      console.error(
        "Failed to sync guest cart:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  /* =====================================================
     WATCH LOGIN
  ===================================================== */

  useEffect(() => {

    const handleAuthChanged =
      () => {

        const token =
          getToken();

        if (token) {

          syncGuestCart();

        } else {

          loadCart();

        }
      };


    window.addEventListener(
      "sogasari-auth-changed",
      handleAuthChanged
    );


    return () => {

      window.removeEventListener(
        "sogasari-auth-changed",
        handleAuthChanged
      );

    };

  }, []);


  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = async (
    product,
    selectedColor = null,
    selectedSize = null,
    quantity = 1
  ) => {

    const token =
      getToken();


    /* =================================
       GUEST
    ================================= */

    if (!token) {

      setCartItems(
        (currentItems) => {

          const existingItem =
            currentItems.find(
              (item) =>
                item.productId ===
                  product.id &&
                item.color ===
                  selectedColor &&
                item.size ===
                  selectedSize
            );


          if (existingItem) {

            const updated =
              currentItems.map(
                (item) =>
                  item.cartId ===
                  existingItem.cartId
                    ? {
                        ...item,

                        quantity:
                          item.quantity +
                          quantity,
                      }
                    : item
              );

            saveLocalCart(
              updated
            );

            return updated;
          }


          /*
           * Product image
           */

          let image =
            product.image ||
            "";


          if (
            !image &&
            Array.isArray(
              product.images
            ) &&
            product.images.length
          ) {

            const primary =
              product.images.find(
                (item) =>
                  item.primaryImage
              );

            image =
              primary?.imageUrl ||
              product.images[0]
                ?.imageUrl ||
              "";
          }


          const newItem = {

            cartId:
              `${product.id}-${Date.now()}`,

            productId:
              product.id,

            name:
              product.name,

            category:
              product.category ||
              product.categoryName ||
              "",

            image,

            price:
              Number(
                product.price
              ) || 0,

            originalPrice:
              Number(
                product.originalPrice
              ) || 0,

            color:
              selectedColor,

            size:
              selectedSize,

            quantity,
          };


          const updated = [
            ...currentItems,
            newItem,
          ];


          saveLocalCart(
            updated
          );


          return updated;
        }
      );


      return;
    }


    /* =================================
       LOGGED-IN USER
    ================================= */

    try {

      await addToCartApi(
        product.id,
        quantity
      );

      await loadCart();

    } catch (error) {

      console.error(
        "Failed to add to cart:",
        error
      );

      throw error;
    }
  };


  /* =====================================================
     REMOVE FROM CART
  ===================================================== */

  const removeFromCart = async (
    cartId
  ) => {

    const item =
      cartItems.find(
        (item) =>
          item.cartId === cartId
      );

    if (!item) {
      return;
    }


    const token =
      getToken();


    /*
     * Guest
     */

    if (!token) {

      const updated =
        cartItems.filter(
          (item) =>
            item.cartId !== cartId
        );

      setCartItems(updated);

      saveLocalCart(updated);

      return;
    }


    /*
     * Logged in
     */

    try {

      await removeFromCartApi(
        item.productId
      );

      setCartItems(
        (currentItems) =>
          currentItems.filter(
            (item) =>
              item.cartId !== cartId
          )
      );

    } catch (error) {

      console.error(
        "Failed to remove cart item:",
        error
      );

      throw error;
    }
  };


  /* =====================================================
     UPDATE QUANTITY
  ===================================================== */

  const updateQuantity = async (
    cartId,
    quantity
  ) => {

    if (quantity < 1) {
      return;
    }


    const item =
      cartItems.find(
        (item) =>
          item.cartId === cartId
      );

    if (!item) {
      return;
    }


    const token =
      getToken();


    /*
     * Guest
     */

    if (!token) {

      const updated =
        cartItems.map(
          (cartItem) =>
            cartItem.cartId ===
            cartId
              ? {
                  ...cartItem,
                  quantity,
                }
              : cartItem
        );

      setCartItems(updated);

      saveLocalCart(updated);

      return;
    }


    /*
     * Logged in
     */

    try {

      await updateCartQuantity(
        item.productId,
        quantity
      );

      setCartItems(
        (currentItems) =>
          currentItems.map(
            (cartItem) =>
              cartItem.cartId ===
              cartId
                ? {
                    ...cartItem,
                    quantity,
                  }
                : cartItem
          )
      );

    } catch (error) {

      console.error(
        "Failed to update quantity:",
        error
      );

      throw error;
    }
  };


  /* =====================================================
     CLEAR CART
  ===================================================== */

  const clearCart = async () => {

    const token =
      getToken();


    if (!token) {

      setCartItems([]);

      clearLocalCart();

      return;
    }


    try {

      await clearCartApi();

      setCartItems([]);

    } catch (error) {

      console.error(
        "Failed to clear cart:",
        error
      );

      throw error;
    }
  };


  /* =====================================================
     CART COUNT
  ===================================================== */

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );


  /* =====================================================
     CHECK PRODUCT IN CART
  ===================================================== */

  const isInCart = (
    productId
  ) => {

    return cartItems.some(
      (item) =>
        Number(item.productId) ===
        Number(productId)
    );
  };


  /* =====================================================
     SUBTOTAL
  ===================================================== */

  const subtotal =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );


  /* =====================================================
     SHIPPING
  ===================================================== */

  const shipping =
    subtotal === 0 ||
    subtotal >= 999
      ? 0
      : 99;


  /* =====================================================
     TOTAL
  ===================================================== */

  const total =
    subtotal + shipping;


  return (
    <CartContext.Provider
      value={{
        cartItems,

        loading,

        addToCart,

        removeFromCart,

        updateQuantity,

        clearCart,

        cartCount,

        isInCart,

        subtotal,

        shipping,

        total,

        loadCart,

        syncGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


/* =====================================================
   USE CART
===================================================== */

export function useCart() {

  const context =
    useContext(CartContext);

  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}