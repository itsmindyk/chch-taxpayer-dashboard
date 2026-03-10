import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fmt } from "../../utils/formatCurrency";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#f87171","#fb923c","#facc15","#4ade80","#34d399",
  "#22d3ee","#60a5fa","#a78bfa","#f472b6","#94a3b8",
  "#e879f9","f97316","#84cc16","#06b6d4",
];

export default function BudgetDonut({ adjusted }) {
  const data = {
    labels: adjusted.map((d) => d.name),
    datasets: [{
      data: adjusted.map((d) => d.adjusted),
      backgroundColor: COLORS,
      borderColor: "#0f172a",
      borderWidth: 2,
      hoverOffset: 10,
    }],
  };

  const total = adjusted.reduce((s, d) => s + d.adjusted, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-white font-bold text-sm mb-0.5">Operational Expenditure Distribution</h2>
      <p className="text-slate-500 text-xs mb-4">Total: {fmt(total / 1000)} — 2026/27 Annual Plan</p>
      <div className="max-w-sm mx-auto">
        <Doughnut
          data={data}
          options={{
            cutout: "65%",
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: "#94a3b8", font: { size: 10 }, padding: 10, boxWidth: 10 },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const pct = ((ctx.raw / total) * 100).toFixed(1);
                    return ` ${fmt(ctx.raw / 1000)} (${pct}%)`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}