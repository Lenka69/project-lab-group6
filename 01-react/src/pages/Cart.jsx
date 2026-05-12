import React from "react";
import { useCart } from "../context/CartContext";
import "./cart.css";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  return (
    <section className="cart-page">
      <h2>🛒 Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">
          Belum ada item yang masuk Cart.
        </p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.cartId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>
              Total: Rp{" "}
              {totalPrice.toLocaleString("id-ID")}
            </h3>

            <div className="cart-actions">
              <button
                className="clear-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>

              <button className="checkout-btn">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}