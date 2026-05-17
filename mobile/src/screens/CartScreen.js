import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentUser } from "../services/auth";
import { getCart, removeFromCart } from "../services/cart";
import { checkout } from "../services/transactions";

export default function CartScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    if (!currentUser?.id) {
      throw new Error("User tidak ditemukan.");
    }

    const cartData = await getCart(currentUser.id);
    setCart(cartData);
  };

  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        try {
          setLoading(true);
          await loadCart();
        } catch (error) {
          Alert.alert("Gagal memuat cart", error.message);
        } finally {
          setLoading(false);
        }
      };

      run();
    }, [])
  );

  const handleRemove = async (productId) => {
    try {
      await removeFromCart({
        userId: user.id,
        productId,
      });

      await loadCart();
    } catch (error) {
      Alert.alert("Gagal menghapus produk", error.message);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout(user.id);

      Alert.alert("Berhasil", "Checkout berhasil.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("History"),
        },
      ]);
    } catch (error) {
      Alert.alert("Checkout gagal", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      {!!item.img && <Image source={{ uri: item.img }} style={styles.image} />}

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.text}>Qty: {item.quantity}</Text>
        <Text style={styles.price}>
          Rp {Number(item.price || 0).toLocaleString("id-ID")}
        </Text>

        <Pressable style={styles.removeButton} onPress={() => handleRemove(item._id)}>
          <Text style={styles.buttonText}>Hapus</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Memuat keranjang...</Text>
      </View>
    );
  }

  const items = cart?.items || [];
  const totalPrice = cart?.summary?.totalPrice || 0;

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Keranjang</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Keranjang masih kosong.</Text>
        }
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>
          Total: Rp {Number(totalPrice).toLocaleString("id-ID")}
        </Text>

        <Pressable
          style={[styles.checkoutButton, items.length === 0 && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={items.length === 0}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#e5e7eb",
    marginTop: 12,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  name: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  text: {
    color: "#cbd5e1",
    marginTop: 4,
  },
  price: {
    color: "#38bdf8",
    fontWeight: "800",
    marginTop: 6,
  },
  removeButton: {
    backgroundColor: "#dc2626",
    padding: 9,
    borderRadius: 9,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
  },
  total: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "800",
  },
  empty: {
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 40,
  },
});