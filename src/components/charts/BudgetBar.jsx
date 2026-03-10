import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { OPEX, CAPEX } from "../../hooks/useBudgetModel";
import { fmt } from "../../utils/formatCurrency";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BudgetBar({ adjusted, view = "opex" }) {
  const isOpex = view === "opex";

  const data = isOpex
    ? {
        labels: adjusted.map((d) => d.name.split(" ")[0]),
        datasets: [
          {
            label: "2025/26 Actual",
            data: adjusted.map((d) => +(d.prev / 1000).toFixed(1)),
            backgroundColor: "#334155",
            borderRadius: 3,
          },
          {
            label: "2026/27 Plan",
            data: adjusted.map((d) => +(d.adjusted / 1000).toFixed(1)),
            backgroundColor: "#22d3ee",
            borderRadius: 3,
          },
          {
            label: "LTP Target",
            data: adjusted.map((d) => +(d.ltp / 1000).toFixed(1)),
            backgroundColor: "#f472b640",
            borderColor: "#f472b6",
            borderWidth: 1,
            borderRadius: 3,
          },
        ],
      }
    : {
        labels: CAPEX.map((d) => d.name.split(" ")[0]),
        datasets: [
          {
            label: "Current Budget",
            data: CAPEX.map((d) => +(d.current / 1000).toFixed(1)),
            backgroundColor: "#334155",
            borderRadius: 3,
          },
          {
            label: "Proposed Budget",
            data: CAPEX.map((d) => +(d.proposed / 1000).toFixed(1)),
            backgroundColor: "#4ade80",
            borderRadius: 3,
          },
        ],
      };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-white font-bold text-sm mb-0.5">
        {isOpex ? "Opex: Annual Plan vs LTP" : "Capex: Current vs Proposed"}
      </h2>
      <p className="text-slate-500 text-xs mb-4">NZD $M · hover bars for detail</p>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { labels: { color: "#94a3b8", font: { size: 10 }, boxWidth: 10 } },
            tooltip: { callbacks: { label: (ctx) => ` $${ctx.raw}M` } },
          },
          scales: {
            x: {
              ticks: { color: "#475569", font: { size: 9 } },
              grid: { color: "#1e293b" },
            },
            y: {
              ticks: { color: "#475569", callback: (v) => `$${v}M`, font: { size: 9 } },
              grid: { color: "#1e293b" },
            },
          },
        }}
      />
    </div>
  );
}