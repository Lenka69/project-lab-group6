import React, { useState } from "react";
import "../assets/checkout.css";
import Layout from "../components/Layout";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  return (
    <Layout>
      <section className="checkout-page">
        <h2>🛒 Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="empty-checkout">Belum ada item yang kamu Checkout.</p>
        ) : (
          <>
            <div className="checkout-list">
              {transactions.map((item) => (
                <div key={item._id} className="checkout-item">
                  <img src={item.image} alt={item.name} />

                  <div className="checkout-info">
                    <h3>{item.name}</h3>
                    <p>Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCheckout(item.checkoutId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="checkout-summary">
              <h3>Total: Rp {totalPrice.toLocaleString("id-ID")}</h3>

              <div className="checkout-actions">
                <button className="clear-btn" onClick={clearCheckout}>
                  Clear Checkout
                </button>

                <button className="confirm-btn">Confirm</button>
              </div>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default TransactionHistory;
