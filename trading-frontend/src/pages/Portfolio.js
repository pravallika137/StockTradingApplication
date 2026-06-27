import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Portfolio.css";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const userId = 1;

  const fetchPortfolio = () => {
    axios
      .get(`http://localhost:8080/api/transactions/portfolio/${userId}`)
      .then((res) => setPortfolio(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalInvestment = portfolio.reduce(
    (sum, stock) => sum + stock.totalInvestment,
    0
  );

  const currentValue = portfolio.reduce(
    (sum, stock) => sum + stock.currentValue,
    0
  );

  const totalProfit = currentValue - totalInvestment;

  return (
    <div className="portfolio-wrapper">
      <motion.div
        className="portfolio-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="portfolio-title">My Portfolio</h1>

        {/* Summary */}
        <div className="summary-section">
          <SummaryCard title="Investment" value={totalInvestment} />
          <SummaryCard title="Current Value" value={currentValue} />
          <SummaryCard
            title="Total P/L"
            value={totalProfit}
            highlight
          />
        </div>

        {/* Stocks */}
        <div className="stocks-grid">
          {portfolio.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              className="stock-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="stock-top">
                <h3>{stock.symbol}</h3>
                <span className="qty">Qty {stock.quantity}</span>
              </div>

              <div className="stock-middle">
                <div>
                  <small>Current Value</small>
                  <p>₹{stock.currentValue.toFixed(2)}</p>
                </div>
              </div>

              <div
                className={`stock-profit ${
                  stock.profitLoss >= 0 ? "profit" : "loss"
                }`}
              >
                ₹{stock.profitLoss.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SummaryCard({ title, value, highlight }) {
  return (
    <motion.div
      className={`summary-card ${highlight ? "highlight" : ""}`}
      whileHover={{ scale: 1.05 }}
    >
      <p>{title}</p>
      <h2>₹{value.toFixed(2)}</h2>
    </motion.div>
  );
}