import { useState, useMemo } from "react";
import rawData from "../data/chch_draft_annual_plan_2026_27.json";

// Operational expenditure — flatten into array (values are $000)
export const OPEX = Object.entries(rawData.operational_expenditure_by_activity)
  .filter(([k]) => !k.startsWith("_"))
  .map(([name, v]) => ({
    name,
    prev: v.annual_plan_2025_26,
    current: v.annual_plan_2026_27,
    ltp: v.long_term_plan_2026_27,
    variance: v.variance_to_ltp,
  }));

// Capital programme — flatten into array (values are $000)
export const CAPEX = Object.entries(rawData.capital_programme_summary)
  .filter(([k]) => !k.startsWith("_"))
  .map(([name, v]) => ({
    name,
    current: v.goa_total.current_budget_2026_27,
    proposed: v.goa_total.proposed_budget_2026_27,
    change: v.goa_total.budget_change_2026_27,
  }));

export const TOTAL_OPEX = rawData.operational_expenditure_by_activity._totals
  .total_group_of_activity_expenditure.annual_plan_2026_27;

export const TOTAL_CAPEX_PROPOSED =
  rawData.capital_programme_summary._grand_total.proposed_budget_2026_27;

export function useBudgetModel() {
  // cuts[i] = % cut to apply to OPEX[i].current
  const [cuts, setCuts] = useState(OPEX.map(() => 0));

  const adjusted = useMemo(() =>
    OPEX.map((d, i) => {
      const saving = d.current * (cuts[i] / 100);
      return { ...d, saving, adjusted: d.current - saving };
    }), [cuts]);

  const totalSaving = useMemo(() =>
    adjusted.reduce((s, d) => s + d.saving, 0), [adjusted]);

  const resetCuts = () => setCuts(OPEX.map(() => 0));

  return { cuts, setCuts, adjusted, totalSaving, resetCuts };
}