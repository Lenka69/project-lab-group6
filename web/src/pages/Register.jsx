import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { register } from "../services/auth";
import { trackEvent } from "../utils/analytics";
import "../assets/auth.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (id, value, allValues) => {
    switch (id) {
      case "name":
        if (!value) return "Nama wajib diisi";
        if (value.length < 3) return "Nama minimal 3 karakter";
        return "";

      case "email":
        if (!value) return "Email wajib diisi";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Format email tidak valid";
        }
        return "";

      case "password":
        if (!value) return "Password wajib diisi";
        if (value.length < 6) return "Password minimal 6 karakter";
        return "";

      case "confirmPassword":
        if (!value) return "Konfirmasi password wajib diisi";
        if (value !== allValues.password) return "Password tidak cocok";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const nextErrors = {
      name: validateField("name", form.name, form),
      email: validateField("email", form.email, form),
      password: validateField("password", form.password, form),
      confirmPassword: validateField(
        "confirmPassword",
        form.confirmPassword,
        form
      ),
    };

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    const nextForm = {
      ...form,
      [id]: value,
    };

    setForm(nextForm);
    setSuccess(false);

    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value, nextForm),
      auth: "",
    }));
  };

  const isFormInvalid = () => {
    return Boolean(
      loading ||
        error.name ||
        error.email ||
        error.password ||
        error.confirmPassword
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccess(false);

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);

      setSuccess(true);
      setErrors({});
      trackEvent("register_success");
    } catch (err) {
      setSuccess(false);
      trackEvent("register_failed");

      setErrors({
        auth: err.message || "Register failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <main className="main-content">
        <div className="form-wrapper">
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
              {error.name && (
                <span className="field-error">{error.name}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              {error.email && (
                <span className="field-error">{error.email}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              {error.password && (
                <span className="field-error">{error.password}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              {error.confirmPassword && (
                <span className="field-error">{error.confirmPassword}</span>
              )}
            </div>

            {error.auth && <div className="auth-error">{error.auth}</div>}

            {success && (
              <div className="auth-success">
                Registrasi Berhasil. Silahkan Masuk
              </div>
            )}

            {!success && (
              <button type="submit" disabled={isFormInvalid()}>
                {loading ? "Memproses..." : "Daftar"}
              </button>
            )}

            <p className="auth-footer">
              Sudah punya akun? <NavLink to="/login">Masuk</NavLink>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;