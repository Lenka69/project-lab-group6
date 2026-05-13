import React, { useEffect, useState } from "react";
import "../assets/cart.css";
import Layout from "../components/Layout";
import { getUserCart, removeProductCart } from "../services/cart";

const Cart = () => {
  const [carts, setCarts] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchCart = () => {
    if (!user.id) return setLoading(false);

    getUserCart(user.id)
      .then((res) => {
        setCarts(res.data ? res.data : res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, [user.id]);

  const removeFromCart = async (productId) => {
    try {
      await removeProductCart(user.id, productId);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Gagal menghapus produk dari keranjang.");
    }
  };

  if (loading)
    return (
      <Layout>
        <p style={{ padding: "50px" }}>Loading cart...</p>
      </Layout>
    );

  return (
    <Layout>
      <section className="cart-page">
        <h2>🛒 Cart</h2>

        {!carts || !carts.items || carts.items.length === 0 ? (
          <p className="empty-cart">Belum ada item yang masuk Cart.</p>
        ) : (
          <>
            <div className="cart-list">
              {carts.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item.img} alt={item.name} />

                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>

                  <span style={{ marginRight: "20px" }}>
                    <b>Quantity:</b> {item.quantity}x
                  </span>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>
                Total: Rp {carts.summary?.totalPrice?.toLocaleString("id-ID")}
              </h3>

              <div className="cart-actions">
                <button className="checkout-btn">Checkout</button>
              </div>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
