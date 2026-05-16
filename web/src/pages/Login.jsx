import React, { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import LogRocket from "logrocket";
import { login } from "../services/auth";
import "../assets/auth.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const sessionExpired = searchParams.get("session") === "expired";
  const navigate = useNavigate();

  const validateField = (id, value) => {
    switch (id) {
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

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    const nextForm = {
      ...form,
      [id]: value,
    };

    setForm(nextForm);

    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value),
      auth: "",
    }));
  };

  const isFormInvalid = () => {
    return Boolean(error.email || error.password || loading);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const nextErrors = {
      email: validateField("email", form.email),
      password: validateField("password", form.password),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const { accessToken, user } = await login(form.email, form.password);

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      const logRocketAppId = import.meta.env.VITE_LOGROCKET_APP_ID;

      if (import.meta.env.PROD && logRocketAppId && user) {
        LogRocket.identify(user.id || user._id || user.email, {
          name: user.name,
          email: user.email,
        });
      }

      navigate("/");
    } catch (err) {
      setErrors({
        auth: err.message || "Login gagal",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <main className="main-content">
        <div className="form-wrapper">
          <form onSubmit={handleLogin}>
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
                autoComplete="current-password"
                required
              />
              {error.password && (
                <span className="field-error">{error.password}</span>
              )}
            </div>

            {error.auth && <div className="auth-error">{error.auth}</div>}

            {sessionExpired && (
              <div className="auth-error">
                Sesi kamu sudah berakhir. Silakan login kembali.
              </div>
            )}

            <button type="submit" disabled={isFormInvalid()}>
              {loading ? "Memproses..." : "Login"}
            </button>

            <p className="auth-footer">
              Belum punya akun? <NavLink to="/register">Daftar</NavLink>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;