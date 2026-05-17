import AsyncStorage from "@react-native-async-storage/async-storage";
import { request } from "./api";

export const register = async ({ name, email, password }) => {
  return await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

export const login = async ({ email, password }) => {
  const result = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  await AsyncStorage.setItem("token", result.accessToken);
  await AsyncStorage.setItem("user", JSON.stringify(result.user));

  return result;
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};