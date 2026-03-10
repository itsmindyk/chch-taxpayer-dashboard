export default function Header() {
  return (
    <header className="bg-slate-950 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-cyan-400 rounded-full" />
          <div>
            <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
              Christchurch City Council · 2026/27
            </p>
            <h1 className="text-white text-xl font-black tracking-tight leading-tight">
              Ratepayer Transparency Tool
            </h1>
          </div>
        </div>
        <span className="hidden sm:block text-slate-500 text-xs text-right max-w-xs">
          Explore where your rates go.<br />Model trade-offs in real time.
        </span>
      </div>
    </header>
  );
}