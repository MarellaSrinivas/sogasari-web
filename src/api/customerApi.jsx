import api from "./api";

export const getCustomerByPhone = async (phone) => {
  const response = await api.get(
    `/customers/phone/${phone}`
  );

  return response.data;
};

export const createOrUpdateCustomer = async (data) => {
  const response = await api.post(
    "/customers/checkout",
    data
  );

  return response.data;
};