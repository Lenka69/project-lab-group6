import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/product";
import { addProductToCart } from "../services/cart";
import Layout from "../components/Layout";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleAddToCart = async () => {
    if (!user.id) {
      alert("Silakan login terlebih dahulu untuk berbelanja.");
      navigate("/login");
      return;
    }

    try {
      setAdding(true);

      const productId = product._id || product.id;
      await addProductToCart(user.id, productId, 1);

      alert("Produk berhasil ditambahkan ke Cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message || "Gagal menambahkan produk ke Cart.");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <section className="page-section loading-state">
          <h2>Loading...</h2>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="page-section error-state">
          <h2>Produk tidak ditemukan</h2>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="page-section">
        <div className="product-content">
          <div className="product-detail">
            <img src={product.img} alt={product.name} />

            <div className="product-detail-info">
              <h1>{product.name}</h1>
              <p className="product-detail-price">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <p>
                <b>Stock:</b> {product.stock}
              </p>
              <p className="product-detail-desc">{product.description}</p>

              <div className="product-actions">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
