import { useState } from "react";
import Header from "../components/layout/Header";
import StatCard from "../components/ui/StatCard";
import SliderPanel from "../components/ui/SliderPanel";
import InsightBox from "../components/ui/InsightBox";
import BudgetDonut from "../components/charts/BudgetDonut";
import BudgetBar from "../components/charts/BudgetBar";
import TradeoffD3 from "../components/charts/TradeoffD3";
import { useBudgetModel, TOTAL_OPEX, TOTAL_CAPEX_PROPOSED } from "../hooks/useBudgetModel";
import { fmt, fmtDelta } from "../utils/formatCurrency";

const TABS = ["Distribution", "Comparison", "Trade-offs"];

export default function Dashboard() {
  const { cuts, setCuts, adjusted, totalSaving, resetCuts } = useBudgetModel();
  const [tab, setTab] = useState(0);
  const [barView, setBarView] = useState("opex");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200" style={{ fontFamily: "'DM Mono', 'Fira Code', monospace" }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Opex 2026/27" value={fmt(TOTAL_OPEX / 1000)} sub="Annual Plan" accent="#22d3ee" />
          <StatCard label="Total Capex Proposed" value={fmt(TOTAL_CAPEX_PROPOSED / 1000)} sub="Capital Programme" accent="#4ade80" />
          <StatCard
            label="Your Savings Applied"
            value={totalSaving > 0 ? fmt(totalSaving / 1000) : "$0"}
            sub="from slider cuts"
            accent={totalSaving > 0 ? "#fb923c" : "#334155"}
          />
          <StatCard
            label="Net Opex After Cuts"
            value={fmt((TOTAL_OPEX - totalSaving) / 1000)}
            sub={totalSaving > 0 ? fmtDelta(-totalSaving / 1000) + " vs plan" : "no cuts applied"}
            accent="#a78bfa"
          />
        </div>

        {/* Insight */}
        <InsightBox adjusted={adjusted} totalSaving={totalSaving} />

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                tab === i
                  ? "bg-slate-700 text-cyan-300"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div className={`grid grid-cols-1 gap-4 ${tab === 2 ? "lg:grid-cols-3" : ""}`}>

          {/* Chart panel */}
          <div className={tab === 2 ? "lg:col-span-2" : ""}>
            {tab === 0 && <BudgetDonut adjusted={adjusted} />}
            {tab === 1 && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {["opex", "capex"].map((v) => (
                    <button key={v} onClick={() => setBarView(v)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
                        barView === v
                          ? "border-cyan-700 text-cyan-300 bg-slate-800"
                          : "border-slate-700 text-slate-500"
                      }`}>
                      {v.toUpperCase()}
                    </button>
                  ))}
                </div>
                <BudgetBar adjusted={adjusted} view={barView} />
              </div>
            )}
            {tab === 2 && <TradeoffD3 adjusted={adjusted} />}
          </div>

          {/* Slider panel — only on Trade-offs tab */}
          {tab === 2 && (
            <div className="lg:col-span-1">
              <SliderPanel
                cuts={cuts}
                setCuts={setCuts}
                adjusted={adjusted}
                resetCuts={resetCuts}
              />
            </div>
          )}
        </div>

        <footer className="text-center text-slate-700 text-xs pt-2 pb-4">
          Source: Christchurch City Council Draft Annual Plan 2026/27 · For civic engagement only ·{" "}
          <a href="https://ccc.govt.nz" target="_blank" rel="noreferrer" className="text-cyan-900 hover:text-cyan-600 transition-colors">
            ccc.govt.nz
          </a>
        </footer>
      </main>
    </div>
  );
}