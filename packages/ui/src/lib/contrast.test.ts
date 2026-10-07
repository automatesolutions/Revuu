import { describe, expect, it } from "vitest";
import { color, contrastPairs } from "../tokens";
import { contrastRatio } from "./contrast";

describe("contrastRatio", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#0f1115", "#fbfaf7")).toBe(contrastRatio("#fbfaf7", "#0f1115"));
  });

  it("rejects non-hex input", () => {
    expect(() => contrastRatio("red", "#fff")).toThrow();
  });
});

describe("token pairs", () => {
  for (const theme of ["light", "dark"] as const) {
    it(`meet their minimum contrast in ${theme}`, () => {
      for (const { fg, bg, min } of contrastPairs) {
        expect(
          contrastRatio(color[theme][fg], color[theme][bg]),
          `${fg} on ${bg}`,
        ).toBeGreaterThanOrEqual(min);
      }
    });
  }
});
