import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getProducts } from "../services/products";
import { addToCart } from "../services/cart";
import { getCurrentUser, logout } from "../services/auth";
import { useResponsive } from "../utils/responsive";

export default function ProductListScreen({ navigation }) {
  const { productColumns, pagePadding } = useResponsive();

  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    const productData = await getProducts();
    setProducts(productData || []);
  };

  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        try {
          setLoading(true);
          await loadData();
        } catch (error) {
          Alert.alert("Gagal memuat produk", error.message);
        } finally {
          setLoading(false);
        }
      };

      run();
    }, [])
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error) {
      Alert.alert("Gagal refresh", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddToCart = async (product) => {
    const userId = user?.id || user?._id;

    if (!userId) {
      Alert.alert("Error", "User tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      await addToCart({
        userId,
        productId: product._id,
        quantity: 1,
      });

      Alert.alert("Berhasil", `${product.name} ditambahkan ke keranjang.`);
    } catch (error) {
      Alert.alert("Gagal menambah keranjang", error.message);
    }
  };

  const handleLogout = async () => {
    await logout();

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const renderProduct = ({ item }) => {
    const imageUrl = item.img || item.image || item.imageUrl;

    return (
      <View style={styles.productCard}>
        {!!imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}

        <View style={styles.productContent}>
          <Text style={styles.productName}>{item.name}</Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.description || "Tidak ada deskripsi"}
          </Text>

          <Text style={styles.price}>
            Rp {Number(item.price || 0).toLocaleString("id-ID")}
          </Text>

          <Text style={styles.stock}>Stok: {item.stock ?? 0}</Text>

          <Pressable
            style={styles.smallButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.smallButtonText}>Tambah ke Cart</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Memuat produk...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.page, { padding: pagePadding }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Produk</Text>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerButton}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.headerButtonText}>Cart</Text>
          </Pressable>

          <Pressable
            style={styles.headerButton}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={styles.headerButtonText}>History</Text>
          </Pressable>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.headerButtonText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        key={productColumns}
        data={products}
        numColumns={productColumns}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        columnWrapperStyle={
          productColumns > 1 ? styles.columnWrapper : undefined
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada produk.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#020617",
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
  header: {
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  headerButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  headerButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  list: {
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#1f2937",
  },
  productContent: {
    flex: 1,
  },
  productName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  description: {
    color: "#94a3b8",
    marginTop: 4,
  },
  price: {
    color: "#38bdf8",
    fontWeight: "800",
    marginTop: 6,
  },
  stock: {
    color: "#cbd5e1",
    marginTop: 3,
  },
  smallButton: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 10,
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  empty: {
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 40,
  },
});