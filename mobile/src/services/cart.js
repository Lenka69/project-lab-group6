import { request } from "./api";

export const getCart = async (userId) => {
  return await request(`/cart/${userId}`, {
    method: "GET",
  });
};

export const addToCart = async ({ userId, productId, quantity }) => {
  return await request("/cart/add-product", {
    method: "POST",
    body: JSON.stringify({
      userId,
      productId,
      quantity,
    }),
  });
};

export const removeFromCart = async ({ userId, productId }) => {
  return await request("/cart/remove-product", {
    method: "PATCH",
    body: JSON.stringify({
      userId,
      productId,
    }),
  });
};