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
import { register } from "../services/auth";
import { useResponsive } from "../utils/responsive";

export default function RegisterScreen({ navigation }) {
  const { pagePadding, authCardMaxWidth } = useResponsive();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Validasi gagal", "Semua field wajib diisi.");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Validasi gagal", "Password minimal 6 karakter.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Validasi gagal", "Password tidak cocok.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      Alert.alert("Berhasil", "Registrasi berhasil. Silakan login.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      Alert.alert("Register gagal", error.message);
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
        <Text style={styles.title}>Daftar Akun</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(value) => handleChange("name", value)}
          placeholder="John Doe"
        />

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

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={form.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          placeholder="••••••••"
          secureTextEntry
        />

        <Pressable
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Memproses..." : "Daftar"}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Sudah punya akun? Masuk</Text>
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
    width: "100%",
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 22,
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
    marginBottom: 14,
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