import { APPLICATION_JSON } from "../constants/http";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HTTP_GET = "GET";
const HTTP_POST = "POST";

const handleSessionExpired = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login?session=expired";
};

export const fetchWithAuth = async (path, method, body) => {
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

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} - ${res.error}`);
  }

  const apiResponse = await res.json();
  return apiResponse.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
