import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/api.js";
import React, { use, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const {addToCart} = useCart();
  const {addToCheckout} = useCheckout();

  const handleaddToCart = () => {
    addToCart(product);
    alert("Product added to cart.");
  };

  const handleaddToCheckout = () => {
    addToCheckout(product);
    alert("Product added to checkout.");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(API_URL + "/products/" + id);
        setProduct(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <section className="page-section">Loading...</section>;
  }

  if (!product) {
    return <section className="page-section">Produk tidak ditemukan</section>;
  }

  return (
    <section className="page-section">
      <h2>Detail Produk #{id}</h2>
      <h3>{product.name}</h3>
      <p>Rp {product.price?.toLocaleString("id-ID")}</p>
      <p className="desc">{product.description}</p>

      <div style={{ display: 'flex', gap: '10px' }}>
      <button onClick={handleaddToCart} className="btn btn-primary">
        Add to Cart
      </button>
      
      <button onClick={handleaddToCheckout} className="btn btn-primary">
        Add to Checkout
      </button>
      </div>
    </section>
  );
}