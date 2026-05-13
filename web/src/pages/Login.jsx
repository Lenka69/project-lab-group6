import React, { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { login } from "../services/auth";
import "../assets/auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("session") === "expired";
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    try {
      const { accessToken, user } = await login(form.email, form.password);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      if (import.meta.env.PROD) {
        LogRocket.identify(user.id, {
          name: user.name,
          email: user.email,
        });
      }

      navigate("/");
    } catch (err) {
      setErrors({ auth: err.message });
    } finally {
      setLoading(false);
    }
  };

  const validateField = (id, value, allValues) => {
    switch (id) {
      case "email":
        if (!value) return "Email wajib diisi";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Format email tidak valid";
        return "";
      case "password":
        if (!value) return "Password wajib diisi";
        if (value.length <= 6) return "Password tidak boleh dibawah 6 digit";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const nextForm = { ...form, [id]: value };
    setForm(nextForm);

    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value, nextForm),
    }));
  };

  const isFormInvalid = () => {
    return error.email || error.password;
  };

  return (
    <>
      <div className="app-wrapper">
        <main className="main-content">
          <div className={"form-wrapper"}>
            <form action="" onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={form.email}
                  onChange={handleChange}
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
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
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

              <button>Login</button>
              <p className="auth-footer">
                Belum punya akun? <NavLink to="/register">Daftar</NavLink>
              </p>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
