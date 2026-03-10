// All values in JSON are NZD $000 — multiply by 1000 for actual dollars
export const fmt = (val) => {
  const n = val * 1000;
  if (Math.abs(n) >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
};

export const fmtDelta = (val) => {
  const n = val * 1000;
  const sign = n >= 0 ? "+" : "-";
  if (Math.abs(n) >= 1_000_000)
    return `${sign}$${(Math.abs(n) / 1_000_000).toFixed(1)}M`;
  return `${sign}$${(Math.abs(n) / 1_000).toFixed(0)}K`;
};