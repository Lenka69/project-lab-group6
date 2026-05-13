import React, { useState, useEffect } from "react";
import "../assets/transactions.css";
import Layout from "../components/Layout";
import { getUserTransactionHistory } from "../services/transaction";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (!user.id) {
      setLoading(false);
      return;
    }

    getUserTransactionHistory(user.id)
      .then((res) => {
        const data = res.data ? res.data : res;
        setTransactions(data);
      })
      .catch((err) => console.error("Error fetching transactions:", err))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <Layout>
        <section
          className="checkout-page loading-history"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h2>Loading History...</h2>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="checkout-page">
        <h2 style={{ marginBottom: "20px" }}>📜 Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="empty-checkout">Belum ada transaksi.</p>
        ) : (
          <div className="checkout-list">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="transaction-card">
                <div className="transaction-header">
                  <span>
                    <b>Order ID:</b> {transaction._id}
                  </span>
                  <span>
                    <b>Date:</b>{" "}
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "id-ID",
                    )}
                  </span>
                </div>

                <div className="transaction-items">
                  {transaction.items.map((item) => (
                    <div key={item.productId} className="checkout-item">
                      <img src={item.img} alt={item.name} />

                      <div className="checkout-info">
                        <h4>{item.name}</h4>
                        <p>
                          {item.quantity}x @ Rp{" "}
                          {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="item-total">
                        Rp{" "}
                        {(item.quantity * item.price).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="transaction-footer">
                  <h3>
                    Total Pembayaran: Rp{" "}
                    {transaction.totalAmount.toLocaleString("id-ID")}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default TransactionHistory;
