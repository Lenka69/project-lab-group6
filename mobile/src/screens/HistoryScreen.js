import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentUser } from "../services/auth";
import { getTransactionHistory } from "../services/transactions";

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        try {
          setLoading(true);

          const user = await getCurrentUser();

          if (!user?.id) {
            throw new Error("User tidak ditemukan.");
          }

          const data = await getTransactionHistory(user.id);
          setTransactions(data || []);
        } catch (error) {
          Alert.alert("Gagal memuat riwayat", error.message);
        } finally {
          setLoading(false);
        }
      };

      run();
    }, [])
  );

  const renderTransaction = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString("id-ID")}
      </Text>

      {(item.items || []).map((product, index) => (
        <View key={`${product.productId}-${index}`} style={styles.productRow}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productQty}>x{product.quantity}</Text>
        </View>
      ))}

      <Text style={styles.total}>
        Total: Rp {Number(item.totalAmount || 0).toLocaleString("id-ID")}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Memuat riwayat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Riwayat Transaksi</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={renderTransaction}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada transaksi.</Text>
        }
      />
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
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  date: {
    color: "#94a3b8",
    marginBottom: 12,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  productName: {
    color: "#fff",
    fontWeight: "700",
  },
  productQty: {
    color: "#cbd5e1",
  },
  total: {
    color: "#38bdf8",
    fontWeight: "800",
    marginTop: 12,
  },
  empty: {
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 40,
  },
});