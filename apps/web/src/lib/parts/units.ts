/** A value in base SI units (V, A, Ω, m, F, H, C, W, %) so "35 mΩ" and "0.035 Ω" compare equal. */
export interface Measure {
  value: number;
  unit: string;
}

const baseUnits: Record<string, { unit: string; scale: number }> = {
  V: { unit: "V", scale: 1 },
  A: { unit: "A", scale: 1 },
  W: { unit: "W", scale: 1 },
  F: { unit: "F", scale: 1 },
  H: { unit: "H", scale: 1 },
  C: { unit: "C", scale: 1 },
  Ω: { unit: "Ω", scale: 1 },
  ohm: { unit: "Ω", scale: 1 },
  ohms: { unit: "Ω", scale: 1 },
  m: { unit: "m", scale: 1 },
  in: { unit: "m", scale: 0.0254 },
  "%": { unit: "%", scale: 1 },
};

const prefixes: Record<string, number> = {
  p: 1e-12,
  n: 1e-9,
  u: 1e-6,
  µ: 1e-6,
  μ: 1e-6,
  m: 1e-3,
  c: 1e-2,
  k: 1e3,
  M: 1e6,
  G: 1e9,
};

function resolveUnit(token: string) {
  const direct = baseUnits[token];
  if (direct) return direct;
  const prefix = prefixes[token[0] ?? ""];
  const rest = baseUnits[token.slice(1)];
  if (prefix && rest) return { unit: rest.unit, scale: prefix * rest.scale };
  return null;
}

/** Parses "−3.7 A", "35 mΩ", "10 mm", "0.394 in" or "1%". Returns null for anything else. */
export function parseMeasure(text: string): Measure | null {
  const match = text
    .trim()
    .replace(/[−–]/g, "-")
    .replace(/Ω/g, "Ω")
    .replace(/,/g, "")
    .match(/^([+-]?(?:\d+\.?\d*|\.\d+))\s*([a-zA-ZΩµμ%]+)$/);
  if (!match) return null;
  const unit = resolveUnit(match[2]!);
  if (!unit) return null;
  return { value: Number(match[1]) * unit.scale, unit: unit.unit };
}

function normalizeText(text: string) {
  return text.toLowerCase().replace(/[×✕]/g, "x").replace(/[−–]/g, "-").replace(/\s+/g, "");
}

export type SpecValue = string | number | null;

/** True when two spec values are the same after unit normalization. Missing on both sides matches. */
export function sameSpec(a: SpecValue, b: SpecValue) {
  if (a === null || b === null) return a === b;
  if (typeof a === "number" || typeof b === "number") return Number(a) === Number(b);
  const ma = parseMeasure(a);
  const mb = parseMeasure(b);
  if (ma && mb) {
    if (ma.unit !== mb.unit) return false;
    const scale = Math.max(Math.abs(ma.value), Math.abs(mb.value), Number.MIN_VALUE);
    return Math.abs(ma.value - mb.value) <= scale * 1e-9;
  }
  if (ma || mb) return false;
  return normalizeText(a) === normalizeText(b);
}
