import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "./Sell.css";

export default function Sell() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [portfolio, setPortfolio] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  // Load user portfolio (owned stocks)
  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = () => {
    API.get(`/api/transactions/portfolio/${user.id}`)
      .then((res) => {
        setPortfolio(res.data || []);
      })
      .catch((err) => console.error("Failed to load portfolio", err));
  };

  // When user selects stock
  const handleStockChange = (symbol) => {
    setSelectedSymbol(symbol);
    const stock = portfolio.find((s) => s.symbol === symbol);
    setSelectedStock(stock);
  };

  const sell = async () => {
    if (!selectedSymbol || !quantity || parseInt(quantity) <= 0) {
      alert("Enter valid details");
      return;
    }

    if (parseInt(quantity) > selectedStock.quantity) {
      alert("You cannot sell more than owned quantity");
      return;
    }

    try {
      await API.post("/api/transactions/sell", {
        userId: user.id,
        symbol: selectedSymbol,
        quantity: parseInt(quantity),
      });

      alert("Stock sold successfully");

      setQuantity("");
      setSelectedSymbol("");
      setSelectedStock(null);
      fetchPortfolio(); // Refresh holdings
    } catch (err) {
      console.error("Sell failed:", err);
      alert(err.response?.data?.message || "Sell failed");
    }
  };

  return (
    <div className="sell-page">
      <Navbar />

      <motion.div
        className="sell-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Sell Stock</h2>

        {portfolio.length === 0 ? (
          <p className="no-stocks">You don’t own any stocks.</p>
        ) : (
          <>
            <div className="form-group">
              <label>Select Stock</label>
              <select
                value={selectedSymbol}
                onChange={(e) => handleStockChange(e.target.value)}
              >
                <option value="">-- Choose Stock --</option>
                {portfolio.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol}
                  </option>
                ))}
              </select>
            </div>

            {selectedStock && (
              <div className="stock-info">
                <p>
                  Owned Quantity: <strong>{selectedStock.quantity}</strong>
                </p>
                <p>
                  Current Value: ₹
                  {selectedStock.currentValue?.toFixed(2)}
                </p>
              </div>
            )}

            <div className="form-group">
              <label>Quantity to Sell</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button className="sell-btn" onClick={sell}>
              Sell Stock
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}