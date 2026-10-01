import api from "./api";

export const createOrder = async (data) => {
  const response = await api.post(
    "/orders",
    data
  );

  return response.data;
};

export const getOrderByNumber = async (
  orderNumber
) => {
  const response = await api.get(
    `/orders/${orderNumber}`
  );

  return response.data;
};

export const createPaymentOrder = async (
  orderNumber
) => {
  const response = await api.post(
    "/payments/create",
    {
      orderNumber,
    }
  );

  return response.data;
};

export const verifyPayment = async (
  data
) => {
  const response = await api.post(
    "/payments/verify",
    data
  );

  return response.data;
};




export const getCustomerOrders = async (phone) => {
  const response = await api.get(
    `/orders/customer/${phone}`
  );

  return response.data;
};

/*
=========================================
AUTHENTICATED CUSTOMER ORDERS
=========================================
*/

export const getMyOrders = async () => {
  const response = await api.get(
    "/orders/my-orders"
  );

  return response.data;
};

