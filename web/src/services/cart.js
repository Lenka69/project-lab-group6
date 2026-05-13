import { HTTP_GET, HTTP_PATCH } from "../constants/http";
import { BASE_URL, fetchWithAuth } from "./api";

export const getUserCart = (userId) =>
  fetchWithAuth(`/cart/${userId}`, HTTP_GET);

export const removeProductCart = async (userId, productId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/cart/remove-product`, {
    method: HTTP_PATCH,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, productId }),
  });

  if (!res.ok) throw new Error("Failed to remove product from cart");
  return res.json();
};

export const addProductToCart = async (userId, productId, quantity = 1) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/cart/add-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, productId, quantity }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add product to cart");
  }

  return res.json();
};
