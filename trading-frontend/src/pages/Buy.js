import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "./Buy.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function Buy() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartType, setChartType] = useState("line");

  const [searchSymbol, setSearchSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // Load existing stocks
  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = () => {
    API.get("/api/stocks")
      .then((res) => setStocks(res.data || []))
      .catch((err) => console.error(err));
  };

  // 🔍 SEARCH & ADD NEW STOCK
  const searchAndAddStock = async () => {
  if (!searchSymbol.trim()) return;

  try {
    setMessage("");

    const symbol = searchSymbol.toUpperCase();

    // 1️⃣ Get stock (auto-create)
    const stockRes = await API.get(`/api/stocks/${symbol}`);
    const stockData = stockRes.data;

    // 2️⃣ Get live price
    const priceRes = await API.get(`/api/stocks/${symbol}/price`);
    const livePrice = priceRes.data.price;

    const updatedStock = {
      ...stockData,
      lastKnownPrice: livePrice,
    };

    const exists = stocks.some(
      (s) => s.symbol === updatedStock.symbol
    );

    if (!exists) {
      setStocks([...stocks, updatedStock]);
    }

    setSelectedStock(updatedStock);
    setSearchSymbol("");
    setMessage("Stock loaded successfully!");

  } catch (err) {
    console.error(err);
    setMessage("Unable to fetch stock.");
  }
};

  // 💰 BUY STOCK
  const buy = async () => {
    if (!selectedStock || quantity <= 0) return;

    try {
      await API.post("/api/transactions/buy", {
        userId: user.id,
        symbol: selectedStock.symbol,
        quantity: quantity,
      });

      setMessage("Stock Purchased Successfully!");
      setQuantity(1);
    } catch {
      setMessage("Purchase failed.");
    }
  };

  // Fake chart data
  const generateChartData = (price) => {
    const points = Array.from({ length: 20 }, () =>
      (price * (0.9 + Math.random() * 0.2)).toFixed(2)
    );

    return {
      labels: Array.from({ length: 20 }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: selectedStock?.symbol,
          data: points,
          borderColor: "#2563eb",
          backgroundColor:
            chartType === "area"
              ? "rgba(37,99,235,0.2)"
              : "rgba(37,99,235,0.6)",
          tension: 0.4,
          fill: chartType === "area",
        },
      ],
    };
  };

  const renderChart = () => {
    if (!selectedStock) return null;

    const data = generateChartData(selectedStock.lastKnownPrice);

    if (chartType === "bar") {
      return <Bar data={data} />;
    }

    return <Line data={data} />;
  };

  return (
    <div className="buy-page">
      <Navbar />

      <div className="buy-container">
        <h1>Stock Market</h1>

        {/* SEARCH SECTION */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Enter stock symbol (e.g. AAPL)"
            value={searchSymbol}
            onChange={(e) =>
              setSearchSymbol(e.target.value.toUpperCase())
            }
          />
          <button onClick={searchAndAddStock}>
            Search & Add
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        {/* STOCK LIST */}
        <div className="stock-list">
          {stocks.map((s) => (
            <div
              key={s.id}
              className={`stock-row ${
                selectedStock?.id === s.id ? "active" : ""
              }`}
              onClick={() => setSelectedStock(s)}
            >
              <span>{s.symbol}</span>
              <span>₹{s.lastKnownPrice}</span>
            </div>
          ))}
        </div>

        {/* CHART + BUY SECTION */}
        {selectedStock && (
          <motion.div
            className="chart-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>
              {selectedStock.symbol} — ₹
              {selectedStock.lastKnownPrice}
            </h2>

            {/* Chart Type Selector */}
            <div className="chart-selector">
              <label>Select Graph Type:</label>
              <select
                value={chartType}
                onChange={(e) =>
                  setChartType(e.target.value)
                }
              >
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="area">Area</option>
              </select>
            </div>

            <div className="big-chart">
              {renderChart()}
            </div>

            {/* BUY CONTROLS */}
            <div className="buy-controls">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(parseInt(e.target.value))
                }
              />

              <div className="total-preview">
                Total: ₹
                {(
                  selectedStock.lastKnownPrice * quantity
                ).toFixed(2)}
              </div>

              <button className="buy-btn" onClick={buy}>
                Buy {selectedStock.symbol}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}