import React from "react";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
import Header from "../../components/Header/Header";
import { useCart } from "../../context/CartContext";

import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    shipping,
    total,
  } = useCart();

  return (
    <div className="cart-page">

      <Header />

      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <div className="cart-container">
          Home / Shopping Bag
        </div>
      </div>

      <main className="cart-container">

        <div className="cart-heading">
          <span>YOUR SHOPPING BAG</span>
          <h1>Shopping Bag</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">

            <ShoppingBag size={50} />

            <h2>Your bag is empty</h2>

            <p>
              Looks like you haven't added anything to
              your bag yet.
            </p>

            <Link
              to="/"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="cart-layout">

            {/* =====================
                CART ITEMS
            ===================== */}
            <div className="cart-items">

              {cartItems.map((item) => (
                <div
                  className="cart-item"
                  key={item.cartId}
                >

                  <div className="cart-item-image">
                   <img
  src={getImageUrl(item.image)}
  alt={item.name}
/>
                  </div>

                  <div className="cart-item-details">

                    <span className="cart-item-category">
                      {item.category}
                    </span>

                    <h3>{item.name}</h3>

                    {item.color && (
                      <p>
                        Color: <strong>{item.color}</strong>
                      </p>
                    )}

                    {item.size && (
                      <p>
                        Size: <strong>{item.size}</strong>
                      </p>
                    )}

                    <div className="cart-item-price">
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>

                    <div className="cart-item-bottom">

                      <div className="cart-quantity">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.cartId,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.cartId,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus size={14} />
                        </button>

                      </div>

                      <button
                        type="button"
                        className="remove-cart-item"
                        onClick={() =>
                          removeFromCart(item.cartId)
                        }
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>

                    </div>

                  </div>

                  <div className="cart-item-total">
                    ₹
                    {(
                      item.price * item.quantity
                    ).toLocaleString("en-IN")}
                  </div>

                </div>
              ))}

              <Link
                to="/"
                className="continue-shopping"
              >
                ← Continue Shopping
              </Link>

            </div>

            {/* =====================
                ORDER SUMMARY
            ===================== */}
            <aside className="cart-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>

                <span>
                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping.toLocaleString("en-IN")}`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="shipping-note">
                  Add ₹
                  {(999 - subtotal).toLocaleString("en-IN")}
                  {" "}more for free shipping.
                </p>
              )}

              <div className="summary-total">
                <span>Total</span>

                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>

              <button
                type="button"
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight size={17} />
              </button>

              <div className="secure-checkout">
                Secure & encrypted checkout
              </div>

            </aside>

          </div>
        )}

      </main>
    </div>
  );
}

export default Cart;