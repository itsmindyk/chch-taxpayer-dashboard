import { fmt, fmtDelta } from "../../utils/formatCurrency";
import { OPEX } from "../../hooks/useBudgetModel";

const COLORS = [
  "#f87171","#fb923c","#facc15","#4ade80","#34d399",
  "#22d3ee","#60a5fa","#a78bfa","#f472b6","#94a3b8",
  "#e879f9","#f97316","#84cc16","#06b6d4",
];

export default function SliderPanel({ cuts, setCuts, adjusted, resetCuts }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-bold text-sm">⚖️ What-If Scenarios</h2>
          <p className="text-slate-500 text-xs mt-0.5">Drag to cut each activity's budget</p>
        </div>
        <button
          onClick={resetCuts}
          className="text-xs text-slate-500 hover:text-cyan-400 border border-slate-700 hover:border-cyan-700 rounded-lg px-3 py-1.5 transition-colors"
        >
          ↩ Reset
        </button>
      </div>

      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {OPEX.map((dept, i) => {
          const color = COLORS[i % COLORS.length];
          const saving = adjusted[i]?.saving ?? 0;
          return (
            <div key={dept.name}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-slate-300 text-xs font-medium truncate max-w-[160px]" title={dept.name}>
                  {dept.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: dept.variance > 0 ? "#f87171" : "#4ade80" }}
                  >
                    {dept.variance > 0 ? "▲" : "▼"} LTP
                  </span>
                  <span
                    className="text-xs font-bold min-w-[28px] text-right"
                    style={{ color: cuts[i] > 0 ? "#fb923c" : "#475569" }}
                  >
                    {cuts[i]}%
                  </span>
                </div>
              </div>
              <input
                type="range" min={0} max={20} step={1}
                value={cuts[i]}
                onChange={(e) =>
                  setCuts((prev) => prev.map((v, j) => (j === i ? +e.target.value : v)))
                }
                className="w-full h-1 rounded cursor-pointer appearance-none"
                style={{ accentColor: color }}
              />
              <p className="text-slate-600 text-xs mt-0.5">
                {fmt(dept.current / 1000)} budget
                {saving > 0 && (
                  <span className="text-emerald-500"> · saves {fmt(saving / 1000)}</span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}