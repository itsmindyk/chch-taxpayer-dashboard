import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TradeoffD3({ adjusted }) {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const W = el.clientWidth || 600;
    const H = 280;
    const M = { top: 16, right: 16, bottom: 72, left: 64 };

    d3.select(el).selectAll("*").remove();
    const svg = d3.select(el)
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const items = adjusted.map((d) => ({
      name: d.name.split(" ")[0],
      variance: d.variance,       // LTP variance ($000)
      saving: d.saving,           // user-applied saving ($000)
    }));

    const allVals = items.flatMap((d) => [d.variance, d.saving, 0]);
    const y = d3.scaleLinear()
      .domain([Math.min(...allVals) * 1.3, Math.max(...allVals) * 1.4])
      .range([H - M.bottom, M.top]);

    const x = d3.scaleBand()
      .domain(items.map((d) => d.name))
      .range([M.left, W - M.right])
      .padding(0.28);

    // Grid
    svg.append("g")
      .attr("transform", `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat((v) => `$${(v / 1000).toFixed(0)}M`).tickSize(-(W - M.left - M.right)))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", "#1e293b"))
      .call((g) => g.selectAll(".tick text").attr("fill", "#475569").style("font-size", "10px"));

    // Zero line
    svg.append("line")
      .attr("x1", M.left).attr("x2", W - M.right)
      .attr("y1", y(0)).attr("y2", y(0))
      .attr("stroke", "#334155").attr("stroke-dasharray", "4,3");

    // Variance bars
    svg.selectAll(".vbar")
      .data(items).join("rect").attr("class", "vbar")
      .attr("x", (d) => x(d.name))
      .attr("width", x.bandwidth() * 0.5)
      .attr("y", (d) => d.variance >= 0 ? y(d.variance) : y(0))
      .attr("height", (d) => Math.abs(y(d.variance) - y(0)))
      .attr("fill", (d) => d.variance > 0 ? "#ef444480" : "#4ade8080")
      .attr("rx", 2);

    // Saving bars
    svg.selectAll(".sbar")
      .data(items).join("rect").attr("class", "sbar")
      .attr("x", (d) => x(d.name) + x.bandwidth() * 0.52)
      .attr("width", x.bandwidth() * 0.48)
      .attr("y", (d) => d.saving > 0 ? y(d.saving) : y(0))
      .attr("height", (d) => Math.abs(y(d.saving) - y(0)))
      .attr("fill", "#22d3ee99")
      .attr("rx", 2);

    // X axis
    svg.append("g")
      .attr("transform", `translate(0,${H - M.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((g) => g.select(".domain").attr("stroke", "#1e293b"))
      .call((g) =>
        g.selectAll(".tick text")
          .attr("fill", "#475569")
          .style("font-size", "9px")
          .attr("transform", "rotate(-35)")
          .attr("text-anchor", "end")
      );

    // Legend
    const leg = svg.append("g").attr("transform", `translate(${M.left + 4}, ${M.top})`);
    [["LTP Variance", "#ef4444"], ["Budget Saving", "#22d3ee"]].forEach(([l, c], i) => {
      leg.append("rect").attr("x", i * 120).attr("width", 10).attr("height", 10).attr("fill", c).attr("rx", 2);
      leg.append("text").attr("x", i * 120 + 14).attr("y", 9).attr("fill", "#94a3b8").style("font-size", "10px").text(l);
    });
  }, [adjusted]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-white font-bold text-sm mb-0.5">D3 Trade-off: LTP Variance vs Your Cuts</h2>
      <p className="text-slate-500 text-xs mb-4">
        Red = over LTP · Green = under LTP · Cyan = saving you've applied
      </p>
      <svg ref={ref} className="w-full" />
    </div>
  );
}