import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

export const request = async (path, options = {}) => {
  if (!BASE_URL) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL belum diset.");
  }

  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || `Request gagal. Status: ${response.status}`);
  }

  return data?.data ?? data;
};