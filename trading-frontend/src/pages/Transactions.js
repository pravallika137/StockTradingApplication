import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "./Transactions.css";

export default function Transactions() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(
          `/api/transactions/history/${user.id}`
        );
        setTransactions(res.data || []);
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="transactions-page">
      <Navbar />

      <motion.div
        className="transactions-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="page-title">Transaction History</h2>

        {transactions.length === 0 && (
          <p className="no-transactions">No transactions yet.</p>
        )}

        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            className="transaction-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="transaction-header">
              <span
                className={`badge ${
                  tx.action === "BUY" ? "buy" : "sell"
                }`}
              >
                {tx.action}
              </span>

              <span className="symbol">
                {tx.stock?.symbol}
              </span>

              <span className="time">
                {new Date(
                  tx.transactionTime
                ).toLocaleString()}
              </span>
            </div>

            <div className="transaction-body">
              <div>
                <p>Quantity</p>
                <strong>{tx.quantity}</strong>
              </div>

              <div>
                <p>Executed Price</p>
                <strong>
                  ₹{Number(tx.executedPrice).toFixed(2)}
                </strong>
              </div>

              {tx.action === "SELL" && (
                <>
                  <div>
                    <p>Selling Price</p>
                    <strong>
                      ₹{Number(tx.sellingPrice).toFixed(2)}
                    </strong>
                  </div>

                  <div>
                    <p>Profit / Loss</p>
                    <strong
                      className={
                        Number(tx.profitLoss) >= 0
                          ? "profit"
                          : "loss"
                      }
                    >
                      ₹{Number(tx.profitLoss).toFixed(2)}
                    </strong>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}