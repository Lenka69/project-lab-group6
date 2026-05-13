import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import "../assets/products.css";
import Layout from "../components/Layout";
import { getProducts } from "../services/product";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const navigate = useNavigate();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <section className="page-section">
        <div className="toolbar">
          <h2>Semua Produk</h2>
        </div>
        {loading ? (
          <p style={{ color: "white" }}>Loading Products..</p>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                {...p}
                onClick={() => navigate(`/products/${p._id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Products;
