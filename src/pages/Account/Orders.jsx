import React, { useEffect, useState } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getMyOrders } from "../../api/orderApi";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      setOrders(response || []);
    } catch (error) {
      console.error("Failed to load orders:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("sogasari_token");
        localStorage.removeItem("sogasari_user");

        navigate("/account");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    if (!status) {
      return "";
    }

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">

          <div className="orders-loading">
            <div className="orders-spinner"></div>

            <p>
              Loading your orders...
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-container">

        <button
          type="button"
          className="orders-back-button"
          onClick={() => navigate("/account")}
        >
          <ArrowLeft size={18} />
          Back to Account
        </button>

        <div className="orders-heading">

          <div>
            <span className="orders-eyebrow">
              MY ACCOUNT
            </span>

            <h1>
              My Orders
            </h1>

            <p>
              View your recent purchases and
              order details.
            </p>
          </div>

          <div className="orders-count">
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </div>

        </div>

        {error && (
          <div className="orders-error">
            {error}

            <button
              type="button"
              onClick={loadOrders}
            >
              Try Again
            </button>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              <Package size={30} />
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              Your orders will appear here
              once you make a purchase.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>

          </div>
        )}

        {!error && orders.length > 0 && (
          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order.id || order.orderNumber}
              >

                <div className="order-card-header">

                  <div>
                    <span className="order-label">
                      ORDER
                    </span>

                    <h2>
                      {order.orderNumber}
                    </h2>
                  </div>

                  <div className="order-date">
                    {formatDate(
                      order.createdAt
                    )}
                  </div>

                </div>

                <div className="order-card-info">

                  <div className="order-info-item">
                    <span>
                      Order Status
                    </span>

                    <strong
                      className={`order-status ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus || "-"}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span>
                      Payment
                    </span>

                    <strong
                      className={`payment-status ${getStatusClass(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus || "-"}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span>
                      Payment Method
                    </span>

                    <strong>
                      {order.paymentMethod || "-"}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span>
                      Total
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.total || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                </div>

                {order.items?.length > 0 && (
                  <div className="order-items">

                    <h3>
                      Items
                    </h3>

                    {order.items.map(
                      (item, index) => (

                        <div
                          className="order-item"
                          key={
                            item.id ||
                            `${order.orderNumber}-${index}`
                          }
                        >

                          <div className="order-item-details">

                            <strong>
                              {item.productName}
                            </strong>

                            <span>
                              Qty:{" "}
                              {item.quantity}
                            </span>

                            {item.size && (
                              <span>
                                Size:{" "}
                                {item.size}
                              </span>
                            )}

                            {item.color && (
                              <span>
                                Color:{" "}
                                {item.color}
                              </span>
                            )}

                          </div>

                          <strong className="order-item-price">
                            ₹
                            {Number(
                              item.lineTotal ||
                                item.price *
                                  item.quantity ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                      )
                    )}

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Orders;