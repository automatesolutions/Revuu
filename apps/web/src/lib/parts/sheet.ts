import type { Comparison, CostDelta } from "./compare";
import type { SpecValue } from "./units";

const cell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
const show = (value: SpecValue) => (value === null ? "Not listed" : String(value));

export function formatCost(cost: CostDelta | null) {
  if (!cost) return "No price on record";
  const sign = cost.delta > 0 ? "+" : cost.delta < 0 ? "−" : "";
  const amount = Math.abs(cost.delta).toFixed(Math.abs(cost.delta) < 0.1 ? 3 : 2);
  return `${sign}$${amount} per unit (${sign}${Math.abs(cost.percent).toFixed(0)} %)`;
}

/** The comparison as a CSV sheet: one column per part, the original first. */
export function comparisonCsv(comparison: Comparison) {
  const { baseline, rows, alternates } = comparison;
  const parts = [baseline, ...alternates];
  const lines: string[][] = [
    ["Field", ...parts.map((p, i) => (i === 0 ? `${p.mpn} (original)` : p.mpn))],
    ["Manufacturer", ...parts.map((p) => p.manufacturer)],
    ...rows.map((row) => [
      row.label,
      show(row.baseline),
      ...row.alternates.map((a) => show(a.value) + (a.differs ? " (differs)" : "")),
    ]),
    ["Lifecycle", ...parts.map((p) => `${p.lifecycle.toUpperCase()}, ${p.source} ${p.age}`.trim())],
    ["Stock", ...parts.map((p) => (p.stock === null ? "Not listed" : String(p.stock)))],
    [
      "Unit price (USD)",
      ...parts.map((p) => (p.unitPrice === null ? "Not listed" : String(p.unitPrice))),
    ],
    ["Cost vs original", "Original", ...alternates.map((a) => formatCost(a.cost))],
    ["Replacement judgement", "Original", ...alternates.map((a) => a.fit)],
    ["Reason", "", ...alternates.map((a) => a.remark)],
    ["Checks to run", "", ...alternates.map((a) => a.checksToRun.join(" | "))],
    ["Datasheet", ...parts.map((p) => p.datasheet ?? "No datasheet on record")],
  ];
  return lines.map((line) => line.map(cell).join(",")).join("\r\n") + "\r\n";
}

export const sheetName = (comparison: Comparison) =>
  `compare_${[comparison.baseline, ...comparison.alternates].map((p) => p.mpn).join("_vs_")}.csv`.replace(
    /[^\w.-]+/g,
    "-",
  );
