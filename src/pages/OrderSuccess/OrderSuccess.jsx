import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";

import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <div className="order-success-page">

      <Header />

      <main className="order-success">

        <div className="success-icon">
          <Check size={34} />
        </div>

        <span className="success-eyebrow">
          ORDER CONFIRMED
        </span>

        <h1>
          Thank You For Your Order
        </h1>

        <p>
          Your order has been successfully placed.
          We'll send your order confirmation and
          delivery updates to your email and mobile
          number.
        </p>

        <div className="success-order-number">
          Order #SGS-{Date.now().toString().slice(-6)}
        </div>

        <Link
          to="/"
          className="success-home-button"
        >
          Continue Shopping
          <ArrowRight size={16} />
        </Link>

      </main>

    </div>
  );
}

export default OrderSuccess;