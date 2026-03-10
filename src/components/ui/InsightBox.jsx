import { fmt } from "../../utils/formatCurrency";
import { OPEX } from "../../hooks/useBudgetModel";

export default function InsightBox({ adjusted, totalSaving }) {
  const transport = adjusted.find((d) => d.name === "Transport");
  const transportSaving = transport ? transport.saving : 0;
  const transportVariance = transport ? transport.variance : 0;

  if (totalSaving === 0)
    return (
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-sm text-slate-500">
        💡 Use the sliders to model budget cuts and instantly see the civic trade-offs below.
      </div>
    );

  const coversPct = transportVariance > 0
    ? Math.min(100, (transportSaving / transportVariance) * 100).toFixed(0)
    : null;

  return (
    <div className="rounded-xl bg-slate-900 border border-cyan-900 p-4 text-sm text-slate-300 leading-relaxed">
      <span className="text-cyan-400 font-bold">🔍 Insight — </span>
      Applying {fmt(totalSaving / 1000)} in cuts across selected activities frees up resources.
      {coversPct !== null && (
        <> The Transport savings alone could cover <span className="text-cyan-300 font-semibold">{coversPct}%</span> of its LTP variance gap.</>
      )}
      {" "}Consider that cuts to <span className="text-amber-400">Communities &amp; Citizens</span> or <span className="text-amber-400">Parks</span> reduce social services for residents.
    </div>
  );
}