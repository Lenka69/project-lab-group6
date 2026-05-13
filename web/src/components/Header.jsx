import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/header.css";
import { logout } from "../services/api";

const Header = () => {
  const token = localStorage.getItem("token");

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-icon">🛒</span>
        E-commerce
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/login" onClick={logout}>
          Logout
        </Link>
      </nav>
    </header>
  );
};

export default Header;
