import api from "./api";

export const sendOtp = async (phone) => {
  const response = await api.post(
    "/auth/otp/send",
    {
      phone,
    }
  );

  return response.data;
};

export const verifyOtp = async (
  phone,
  otp
) => {
  const response = await api.post(
    "/auth/otp/verify",
    {
      phone,
      otp,
    }
  );

  return response.data;
};