import { APPLICATION_JSON } from "../constants/http";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleSessionExpired = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login?session=expired";
};

export const fetchWithAuth = async (path, method = "GET", body = null) => {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL belum diset");
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": APPLICATION_JSON,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (res.status === 401) {
    handleSessionExpired();
    throw new Error("Session expired");
  }

  const text = await res.text();
  const apiResponse = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      apiResponse?.message || `Request failed with status ${res.status}`
    );
  }

  return apiResponse?.data ?? null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};