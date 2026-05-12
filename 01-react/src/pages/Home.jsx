import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import "./home.css";
import axios from "axios";
import { API_URL } from "../utils/api.js";
import React, { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);

      try {
        const res = await axios.get(API_URL + "/products");

        // Ambil 4 produk pertama
        setFeatured(res.data.slice(0, 4));
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="home-section">
      <div className="stars"></div>
      <div className="glow-circle glow1"></div>
      <div className="glow-circle glow2"></div>

      {/* Hero Section */}
      <div className="hero">
        <span className="hero-badge">🚀 Marketplace Masa Depan</span>

        <h1>
          Explore The <span>Future</span> of Shopping
        </h1>

        <p>
          Jelajahi produk premium dari seluruh galaksi dengan teknologi belanja modern.
          Here all Goods are good.
        </p>

        <div className="hero-buttons">
          <button
            className="hero-btn primary"
            onClick={() => navigate("/products")}
          >
            Belanja Sekarang
          </button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="featured-section">
        <h2>🌌 Produk Unggulan</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="featured-grid">
            {featured.map((p) => (
              <ProductCard
                key={p._id}
                {...p}
                onClick={() => navigate(`/products/${p._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}