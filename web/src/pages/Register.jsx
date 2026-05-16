import React, { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { login, register } from "../services/auth";
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
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    try {
      const { success } = await register(
        form.name,
        form.email,
        form.password,
        form.confirmPassword,
      );

      setSuccess(success);
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
        if (value.length < 6) return "Password minimal 6 karakter";
        return "";
      case "confirmPassword":
        if (value !== allValues.password) return "Password tidak cocok";
        return "";
      case "name":
        if (!value) return "Nama wajib diisi";
        if (value.length < 3) return "Nama minimal 3 karakter";
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
    return error.email || error.password || error.confirmPassword || error.name;
  };

  return (
    <>
      <div className="app-wrapper">
        <main className="main-content">
          <div className={"form-wrapper"}>
            <form action="" onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
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

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
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
                <button disabled={isFormInvalid()}>
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
    </>
  );
};

export default Register;
