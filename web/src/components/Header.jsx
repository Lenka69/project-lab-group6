import React from "react";
import { Link } from "react-router-dom";
import "../assets/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-icon">🛒</span>
        e-Goods
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}
