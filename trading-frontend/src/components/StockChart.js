import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

// ✅ IMPORTANT
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function StockChart({ dataPoints }) {
  const data = {
    labels: dataPoints.map((_, i) => i + 1),
    datasets: [
      {
        label: "Stock Price",
        data: dataPoints,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} />;
}