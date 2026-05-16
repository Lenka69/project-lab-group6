import { HTTP_POST, APPLICATION_JSON } from "../constants/http";
import { BASE_URL } from "./api";

export const login = async (email, password) => {
  try {
    if (!BASE_URL) {
      throw new Error("VITE_API_BASE_URL belum diset");
    }

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
      if (res.status === 401) {
        throw new Error("Email atau password salah, atau akun belum terdaftar.");
      }

      throw new Error(
        apiResponse?.message || `Login gagal. Status: ${res.status}`
      );
    }

    return apiResponse.data;
  } catch (err) {
    throw new Error(err.message || "Terjadi kesalahan saat login");
  }
};

export const register = async (name, email, password) => {
  try {
    if (!BASE_URL) {
      throw new Error("VITE_API_BASE_URL belum diset");
    }

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
      throw new Error(
        apiResponse?.message || `Register gagal. Status: ${res.status}`
      );
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