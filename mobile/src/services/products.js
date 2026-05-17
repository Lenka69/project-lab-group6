import { request } from "./api";

export const getProducts = async () => {
  return await request("/products", {
    method: "GET",
  });
};

export const getPopularProducts = async () => {
  return await request("/products/popular", {
    method: "GET",
  });
};