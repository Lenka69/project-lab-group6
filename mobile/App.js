import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProductListScreen from "./src/screens/ProductListScreen";
import CartScreen from "./src/screens/CartScreen";
import HistoryScreen from "./src/screens/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem("token");
      setInitialRoute(token ? "Products" : "Login");
    };

    checkSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Daftar" }}
        />
        <Stack.Screen
          name="Products"
          component={ProductListScreen}
          options={{ title: "Produk" }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: "Keranjang" }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "Riwayat Transaksi" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}