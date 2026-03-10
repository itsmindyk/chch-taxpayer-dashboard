export default function StatCard({ label, value, sub, accent = "#38bdf8" }) {
  return (
    <div
      className="rounded-xl p-4 bg-slate-900 border border-slate-800"
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}