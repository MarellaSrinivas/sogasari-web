import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import {
  getCustomerByPhone,
  createOrUpdateCustomer,
} from "../../api/customerApi";
import {
  createOrder,
  createPaymentOrder,
  verifyPayment,
} from "../../api/orderApi";
import { loadRazorpay } from "../../utils/loadRazorpay";
import Header from "../../components/Header/Header";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
  useState("COD");

const [paymentLoading, setPaymentLoading] =
  useState(false);

  const {
    cartItems,
    subtotal,
    shipping,
    total,
    clearCart,
  } = useCart();

  const [phone, setPhone] = useState("");

  const [customer, setCustomer] =
    useState(null);

  const [loadingCustomer, setLoadingCustomer] =
    useState(false);

  const [customerNotFound, setCustomerNotFound] =
    useState(false);

  const [customerChecked, setCustomerChecked] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [savingCustomer, setSavingCustomer] =
    useState(false);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] = useState("");


  // ==========================================
  // PHONE LOOKUP
  // ==========================================

  const handlePhoneLookup = async () => {

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setError(
        "Enter a valid 10 digit mobile number."
      );
      return;
    }

    try {

      setError("");
      setLoadingCustomer(true);

      const data =
        await getCustomerByPhone(phone);

      setCustomer(data);

      setCustomerNotFound(false);
      setCustomerChecked(true);

      setName(data.name || "");
      setEmail(data.email || "");

      const defaultAddress =
        data.addresses?.find(
          (item) =>
            item.defaultAddress
        );

      if (defaultAddress) {

        setSelectedAddressId(
          defaultAddress.id
        );

        setAddress({
          fullName:
            defaultAddress.fullName || "",

          phone:
            defaultAddress.phone ||
            phone,

          addressLine1:
            defaultAddress.addressLine1 ||
            "",

          addressLine2:
            defaultAddress.addressLine2 ||
            "",

          city:
            defaultAddress.city ||
            "",

          state:
            defaultAddress.state ||
            "",

          pincode:
            defaultAddress.pincode ||
            "",
        });
      }

    } catch (error) {

      if (
        error.response?.status === 404
      ) {

        setCustomer(null);
        setCustomerNotFound(true);
        setCustomerChecked(true);

        setAddress({
          fullName: "",
          phone,
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
        });

      } else {

        console.error(
          "Customer lookup failed:",
          error
        );

        setError(
          "Unable to check customer. Please try again."
        );
      }

    } finally {

      setLoadingCustomer(false);
    }
  };


  // ==========================================
  // ADDRESS CHANGE
  // ==========================================

  const handleAddressChange = (
    field,
    value
  ) => {

    setAddress((current) => ({
      ...current,
      [field]: value,
    }));

    setSelectedAddressId(null);
  };


  // ==========================================
  // SELECT SAVED ADDRESS
  // ==========================================

  const handleSelectAddress = (
    savedAddress
  ) => {

    setSelectedAddressId(
      savedAddress.id
    );

    setAddress({
      fullName:
        savedAddress.fullName || "",

      phone:
        savedAddress.phone || phone,

      addressLine1:
        savedAddress.addressLine1 || "",

      addressLine2:
        savedAddress.addressLine2 || "",

      city:
        savedAddress.city || "",

      state:
        savedAddress.state || "",

      pincode:
        savedAddress.pincode || "",
    });
  };


  // ==========================================
  // VALIDATE ADDRESS
  // ==========================================

  const validateAddress = () => {

    if (!name.trim()) {
      setError("Enter your name.");
      return false;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setError(
        "Enter a valid email address."
      );
      return false;
    }

    if (!address.fullName.trim()) {
      setError(
        "Enter the full name for delivery."
      );
      return false;
    }

    if (!address.addressLine1.trim()) {
      setError(
        "Enter your address."
      );
      return false;
    }

    if (!address.city.trim()) {
      setError("Enter your city.");
      return false;
    }

    if (!address.state.trim()) {
      setError("Enter your state.");
      return false;
    }

    if (
      !/^[1-9][0-9]{5}$/.test(
        address.pincode
      )
    ) {
      setError(
        "Enter a valid 6 digit pincode."
      );
      return false;
    }

    return true;
  };


  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async () => {
  try {
    setError("");

    if (!validateAddress()) {
      return;
    }

    setPaymentLoading(true);

    let customerData =
      customer;


    // =====================================================
    // CREATE / UPDATE CUSTOMER
    // =====================================================

    if (customerNotFound) {

      customerData =
        await createOrUpdateCustomer({
          phone,
          name,
          email: email || null,
          address: {
            ...address,
            phone,
            defaultAddress: true,
          },
        });

      setCustomer(
        customerData
      );
    }


    // =====================================================
    // SAVE NEW ADDRESS FOR EXISTING CUSTOMER
    // =====================================================

    if (
      customerData &&
      !selectedAddressId
    ) {

      customerData =
        await createOrUpdateCustomer({
          phone,
          name,
          email: email || null,
          address: {
            ...address,
            phone,
            defaultAddress: false,
          },
        });

      setCustomer(
        customerData
      );
    }


    // =====================================================
    // FIND ADDRESS ID
    // =====================================================

    let addressId =
      selectedAddressId;


    if (!addressId) {

      const latestAddress =
        customerData?.addresses?.[
          customerData.addresses.length - 1
        ];

      addressId =
        latestAddress?.id;
    }


    if (!addressId) {

      setError(
        "Please select or add a delivery address."
      );

      return;
    }


    // =====================================================
    // CREATE ORDER ITEMS
    // =====================================================

    const items =
      cartItems.map((item) => ({
        productId:
          item.productId,

        color:
          item.color || null,

        size:
          item.size || null,

        quantity:
          item.quantity,
      }));


    // =====================================================
    // CREATE ORDER
    // =====================================================

    const order =
      await createOrder({
        phone,

        addressId,

        paymentMethod,

        items,
      });


    console.log(
      "Created order:",
      order
    );


    // =====================================================
    // COD
    // =====================================================

    if (paymentMethod === "COD") {

      clearCart();

      navigate(
        `/order-success?orderNumber=${order.orderNumber}`
      );

      return;
    }


    // =====================================================
    // ONLINE PAYMENT
    // =====================================================

    const razorpayLoaded =
      await loadRazorpay();


    if (!razorpayLoaded) {

      setError(
        "Unable to load payment gateway. Please try again."
      );

      return;
    }


    // =====================================================
    // CREATE RAZORPAY ORDER
    // =====================================================

    const paymentOrder =
      await createPaymentOrder(
        order.orderNumber
      );


    // =====================================================
    // RAZORPAY CHECKOUT
    // =====================================================

    const options = {

      key:
        paymentOrder.keyId,

      amount:
        paymentOrder.amount,

      currency:
        paymentOrder.currency,

      name:
        "Sogasari",

      description:
        `Order ${order.orderNumber}`,

      order_id:
        paymentOrder.razorpayOrderId,


      handler:
        async function (response) {

          try {

            setPaymentLoading(
              true
            );

            // =============================================
            // VERIFY PAYMENT
            // =============================================

            const verifiedOrder =
              await verifyPayment({
                orderNumber:
                  order.orderNumber,

                razorpayOrderId:
                  response.razorpay_order_id,

                razorpayPaymentId:
                  response.razorpay_payment_id,

                razorpaySignature:
                  response.razorpay_signature,
              });


            console.log(
              "Payment verified:",
              verifiedOrder
            );


            // =============================================
            // PAYMENT SUCCESS
            // =============================================

            if (
              verifiedOrder.paymentStatus ===
                "PAID" &&
              verifiedOrder.orderStatus ===
                "CONFIRMED"
            ) {

              clearCart();

              navigate(
                `/order-success?orderNumber=${order.orderNumber}`
              );

            } else {

              setError(
                "Payment verification failed."
              );
            }

          } catch (error) {

            console.error(
              "Payment verification failed:",
              error
            );

            setError(
              error.response?.data?.message ||
              "Payment verification failed. Please contact support."
            );

          } finally {

            setPaymentLoading(
              false
            );
          }
        },


      modal: {

        ondismiss: function () {

          setPaymentLoading(
            false
          );

          setError(
            "Payment was cancelled. Your order is still pending."
          );
        },

      },


      prefill: {

        name:
          name || address.fullName,

        email:
          email || "",

        contact:
          phone,
      },


      theme: {

        color:
          "#7d1d2b",
      },
    };


    const razorpay =
      new window.Razorpay(
        options
      );


    razorpay.on(
      "payment.failed",
      function (response) {

        console.error(
          "Razorpay payment failed:",
          response
        );

        setPaymentLoading(
          false
        );

        setError(
          response.error?.description ||
          "Payment failed. Please try again."
        );
      }
    );


    razorpay.open();


  } catch (error) {

    console.error(
      "Order/payment failed:",
      error
    );

    setError(
      error.response?.data?.message ||
      "Unable to process your order. Please try again."
    );

  } finally {

    setPaymentLoading(
      false
    );
  }
};


  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!cartItems.length) {

    return (
      <div className="checkout-empty">

        <h2>Your cart is empty</h2>

        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
        >
          Continue Shopping
        </button>

      </div>
    );
  }


  return (

<div>          <Header />

    <div className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-main">

          <h1>Checkout</h1>


          {/* ================================
              PHONE
          ================================= */}

          <section className="checkout-section">

            <h2>
              Contact Information
            </h2>

            <div className="checkout-phone-row">

              <input
                type="tel"
                value={phone}
                maxLength={10}
                placeholder="Enter mobile number"
                onChange={(event) => {
                  setPhone(
                    event.target.value
                      .replace(/\D/g, "")
                  );

                  setCustomerChecked(false);
                  setCustomerNotFound(false);
                  setCustomer(null);
                }}
              />

              <button
                type="button"
                onClick={
                  handlePhoneLookup
                }
                disabled={
                  loadingCustomer
                }
              >
                {loadingCustomer
                  ? "Checking..."
                  : "Continue"}
              </button>

            </div>

          </section>


          {/* ================================
              CUSTOMER DETAILS
          ================================= */}

          {customerChecked && (

            <section className="checkout-section">

              <h2>
                Customer Details
              </h2>

              <div className="checkout-field">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  placeholder="Your name"
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="checkout-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  placeholder="Email address"
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                />

              </div>

            </section>
          )}


          {/* ================================
              SAVED ADDRESSES
          ================================= */}

          {customer &&
            customer.addresses?.length > 0 && (

              <section className="checkout-section">

                <h2>
                  Delivery Address
                </h2>

                <div className="saved-addresses">

                  {customer.addresses.map(
                    (savedAddress) => (

                      <button
                        key={
                          savedAddress.id
                        }
                        type="button"
                        className={
                          `saved-address ${
                            selectedAddressId ===
                            savedAddress.id
                              ? "selected"
                              : ""
                          }`
                        }
                        onClick={() =>
                          handleSelectAddress(
                            savedAddress
                          )
                        }
                      >

                        <strong>
                          {
                            savedAddress.fullName
                          }
                        </strong>

                        <span>
                          {
                            savedAddress.addressLine1
                          }
                        </span>

                        {savedAddress.addressLine2 && (
                          <span>
                            {
                              savedAddress.addressLine2
                            }
                          </span>
                        )}

                        <span>
                          {
                            savedAddress.city
                          }
                          ,{" "}
                          {
                            savedAddress.state
                          }{" "}
                          -{" "}
                          {
                            savedAddress.pincode
                          }
                        </span>

                        <span>
                          {
                            savedAddress.phone
                          }
                        </span>

                      </button>

                    )
                  )}

                </div>

              </section>
            )}


          {/* ================================
              ADDRESS FORM
          ================================= */}

          {customerChecked && (

            <section className="checkout-section">

              <h2>
                {customer
                  ? "Delivery Address"
                  : "Add Delivery Address"}
              </h2>

              <div className="checkout-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={
                    address.fullName
                  }
                  onChange={(event) =>
                    handleAddressChange(
                      "fullName",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="checkout-field">

                <label>
                  Address Line 1
                </label>

                <input
                  type="text"
                  value={
                    address.addressLine1
                  }
                  onChange={(event) =>
                    handleAddressChange(
                      "addressLine1",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="checkout-field">

                <label>
                  Address Line 2
                </label>

                <input
                  type="text"
                  value={
                    address.addressLine2
                  }
                  onChange={(event) =>
                    handleAddressChange(
                      "addressLine2",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="checkout-row">

                <div className="checkout-field">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    value={
                      address.city
                    }
                    onChange={(event) =>
                      handleAddressChange(
                        "city",
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    value={
                      address.state
                    }
                    onChange={(event) =>
                      handleAddressChange(
                        "state",
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              <div className="checkout-field">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  maxLength={6}
                  value={
                    address.pincode
                  }
                  onChange={(event) =>
                    handleAddressChange(
                      "pincode",
                      event.target.value
                        .replace(/\D/g, "")
                    )
                  }
                />

              </div>

              

            </section>
          )}

          <section className="checkout-section">
  <h2>Payment Method</h2>

  <div className="payment-methods">

    <button
      type="button"
      className={`payment-method ${
        paymentMethod === "COD"
          ? "selected"
          : ""
      }`}
      onClick={() =>
        setPaymentMethod("COD")
      }
    >
      <span className="payment-radio">
        {paymentMethod === "COD" && (
          <span />
        )}
      </span>

      <span className="payment-method-content">
        <strong>
          Cash on Delivery
        </strong>

        <small>
          Pay when your order is delivered
        </small>
      </span>
    </button>


    <button
      type="button"
      className={`payment-method ${
        paymentMethod === "UPI"
          ? "selected"
          : ""
      }`}
      onClick={() =>
        setPaymentMethod("UPI")
      }
    >
      <span className="payment-radio">
        {paymentMethod === "UPI" && (
          <span />
        )}
      </span>

      <span className="payment-method-content">
        <strong>
          UPI
        </strong>

        <small>
          Pay securely using UPI
        </small>
      </span>
    </button>


    <button
      type="button"
      className={`payment-method ${
        paymentMethod === "CARD"
          ? "selected"
          : ""
      }`}
      onClick={() =>
        setPaymentMethod("CARD")
      }
    >
      <span className="payment-radio">
        {paymentMethod === "CARD" && (
          <span />
        )}
      </span>

      <span className="payment-method-content">
        <strong>
          Credit / Debit Card
        </strong>

        <small>
          Pay securely using your card
        </small>
      </span>
    </button>

  </div>
</section>




          {error && (

            <div className="checkout-error">
              {error}
            </div>

          )}


          {customerChecked && (

            <button
  className="place-order-button"
  type="button"
  onClick={handlePlaceOrder}
  disabled={
    placingOrder ||
    paymentLoading
  }
>
  {paymentLoading
    ? "Processing..."
    : paymentMethod === "COD"
    ? "Place Order"
    : `Pay ₹${total.toLocaleString(
        "en-IN"
      )}`}
</button>

          )}

        </div>


        {/* ================================
            ORDER SUMMARY
        ================================= */}

        <aside className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          {cartItems.map((item) => (

            <div
              className="checkout-summary-item"
              key={item.cartId}
            >

              <div>

                <strong>
                  {item.name}
                </strong>

                <span>
                  Qty: {item.quantity}
                </span>

                {item.color && (
                  <span>
                    Color: {item.color}
                  </span>
                )}

                {item.size && (
                  <span>
                    Size: {item.size}
                  </span>
                )}

              </div>

              <strong>
                ₹
                {(
                  item.price *
                  item.quantity
                ).toLocaleString("en-IN")}
              </strong>

            </div>

          ))}


          <div className="checkout-summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          <div className="checkout-summary-row">

            <span>
              Shipping
            </span>

            <strong>
              {shipping === 0
                ? "FREE"
                : `₹${shipping.toLocaleString(
                    "en-IN"
                  )}`}
            </strong>

          </div>


          <div className="checkout-summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </aside>

      </div>

    </div>

    </div>
  );
}

export default Checkout;