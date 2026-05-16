import { HTTP_POST, APPLICATION_JSON } from "../constants/http";
import { BASE_URL } from "./api";

export const login = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: HTTP_POST,
      headers: {
        "Content-Type": APPLICATION_JSON,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const text = await res.text();
    const apiResponse = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new Error(apiResponse?.message || "Login failed");
    }

    return apiResponse.data;
  } catch (err) {
    throw new Error(err.message || "Terjadi kesalahan saat login");
  }
};

export const register = async (name, email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: HTTP_POST,
      headers: {
        "Content-Type": APPLICATION_JSON,
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const text = await res.text();
    const apiResponse = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new Error(apiResponse?.message || "Register failed");
    }

    return {
      status: res.status,
      data: apiResponse?.data,
      message: apiResponse?.message,
    };
  } catch (err) {
    throw new Error(err.message || "Terjadi kesalahan saat register");
  }
};