import { request } from "./api";

export const checkout = async (userId) => {
  return await request("/transactions/checkout", {
    method: "POST",
    body: JSON.stringify({
      userId,
    }),
  });
};

export const getTransactionHistory = async (userId) => {
  return await request(`/transactions/${userId}`, {
    method: "GET",
  });
};