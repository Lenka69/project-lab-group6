import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { login } from "../services/auth";
import { useResponsive } from "../utils/responsive";

export default function LoginScreen({ navigation }) {
  const { pagePadding, authCardMaxWidth } = useResponsive();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Validasi gagal", "Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Products" }],
      });
    } catch (error) {
      Alert.alert("Login gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.card, { padding: pagePadding, maxWidth: authCardMaxWidth }]}>
        <Text style={styles.title}>Online Shop</Text>
        <Text style={styles.subtitle}>Masuk ke akun Anda</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
          placeholder="john.doe@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={form.password}
          onChangeText={(value) => handleChange("password", value)}
          placeholder="••••••••"
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Memproses..." : "Login"}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Belum punya akun? Daftar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#020617",
  },
  card: {
    
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 6,
  },
  label: {
    color: "#e5e7eb",
    marginBottom: 8,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#e5edf8",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
  link: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 18,
    fontWeight: "700",
  },
});