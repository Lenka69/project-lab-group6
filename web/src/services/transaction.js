import { HTTP_GET, APPLICATION_JSON, HTTP_POST } from "../constants/http";
import { BASE_URL, fetchWithAuth } from "./api";

export const getUserTransactionHistory = async (userId) => {
  const res = await fetchWithAuth(`/transactions/${userId}`, HTTP_GET);
  return res;
};

export const checkoutCart = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/transactions/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Failed to checkout product from cart",
    );
  }

  return res.json();
};
