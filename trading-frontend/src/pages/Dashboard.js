import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profitChange, setProfitChange] = useState("");

  const previousProfit = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await API.get(`/api/transactions/portfolio/${user.id}`);
        const uRes = await API.get(`/users/${user.id}`);

        const newPortfolio = pRes.data || [];
        const newBalance = uRes.data.balance || 0;

        setPortfolio(newPortfolio);
        setBalance(newBalance);

        const totalInvestment = newPortfolio.reduce(
          (s, p) => s + p.totalInvestment,
          0
        );

        const currentValue = newPortfolio.reduce(
          (s, p) => s + p.currentValue,
          0
        );

        const newProfit = parseFloat(
          (currentValue - totalInvestment).toFixed(2)
        );

        if (newProfit > previousProfit.current) {
          setProfitChange("up");
        } else if (newProfit < previousProfit.current) {
          setProfitChange("down");
        }

        previousProfit.current = newProfit;

        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader />;

  const totalInvestment = portfolio.reduce(
    (s, p) => s + p.totalInvestment,
    0
  );

  const currentValue = portfolio.reduce(
    (s, p) => s + p.currentValue,
    0
  );

  const profit = parseFloat(
    (currentValue - totalInvestment).toFixed(2)
  );

  const profitPercentage =
    totalInvestment > 0
      ? parseFloat(((profit / totalInvestment) * 100).toFixed(2))
      : 0;

  const chartData = {
    labels: ["Start", "Mid", "Now"],
    datasets: [
      {
        label: "Portfolio Growth",
        data:
          profit === 0
            ? [0, 0, 0]
            : [0, profit / 2, profit],
        borderColor:
          profit > 0
            ? "#16a34a"
            : profit < 0
            ? "#dc2626"
            : "#6b7280",
        backgroundColor:
          profit > 0
            ? "rgba(22,163,74,0.2)"
            : profit < 0
            ? "rgba(220,38,38,0.2)"
            : "rgba(107,114,128,0.2)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    animation: { duration: 1200 },
    scales: {
      y: {
        ticks: {
          callback: (value) => "₹" + value
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">
        <div className="card">
          <h3>Balance</h3>
          <p>₹{balance.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Total Investment</h3>
          <p>₹{totalInvestment.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Current Value</h3>
          <p>₹{currentValue.toFixed(2)}</p>
        </div>

        <div
          className={`card ${
            profit > 0
              ? "profit"
              : profit < 0
              ? "loss"
              : ""
          } ${profitChange === "up"
              ? "flash-green"
              : profitChange === "down"
              ? "flash-red"
              : ""}`}
        >
          <h3>Profit / Loss</h3>

          <p>
            ₹{profit.toFixed(2)}{" "}
            <span
              className={
                profit > 0
                  ? "percent-green"
                  : profit < 0
                  ? "percent-red"
                  : "percent-neutral"
              }
            >
              ({profitPercentage >= 0 ? "+" : ""}
              {profitPercentage}%)
            </span>
          </p>
        </div>
      </div>

      <div className="center-chart">
        <h3>Portfolio Performance</h3>
        <div className="chart-box">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}