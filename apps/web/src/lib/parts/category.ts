import type { Category } from "./types";

/** The only description words Revuu reads as a category. Anything else goes to the engineer. */
export const categoryWords: Record<Category, string[]> = {
  electrical: ["resistor", "capacitor", "inductor", "mosfet", "ic", "connector"],
  mechanical: ["screw", "standoff", "spacer", "washer", "enclosure", "bracket", "heatsink"],
};

export function categoryFromCell(value: string | null | undefined): Category | null {
  const v = value?.trim().toLowerCase();
  if (v === "electrical") return "electrical";
  if (v === "mechanical") return "mechanical";
  return null;
}

function mentions(description: string, word: string) {
  // Whole words, with a plain plural: "screws", "capacitors", "ICs".
  return new RegExp(`\\b${word}s?\\b`, "i").test(description);
}

/** Returns a category only when the description names words from exactly one category. */
export function categoryFromDescription(description: string | null | undefined): Category | null {
  if (!description) return null;
  const found = (Object.keys(categoryWords) as Category[]).filter((category) =>
    categoryWords[category].some((word) => mentions(description, word)),
  );
  return found.length === 1 ? found[0]! : null;
}
