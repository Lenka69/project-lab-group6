import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import "../assets/home.css";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getPopularProducts } from "../services/product";

const Home = () => {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularProducts()
      .then(setFeatured)
      .finally(() => setLoading(false));
  }, []);

  const user = JSON.parse(localStorage.getItem("user")) ?? {};

  return (
    <Layout>
      <section className="home-section">
        <div className="hero">
          <h1>Selamat Datang, {user.name}</h1>

          <p>Cari produk pilihan yang sudah kami pilih khusus buat kamu.</p>

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
          <h2>Produk Unggulan</h2>

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
    </Layout>
  );
};

export default Home;
