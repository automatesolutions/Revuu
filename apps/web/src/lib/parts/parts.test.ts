import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findAlternates, findRecord, vendorRecords } from "@/fixtures/parts/records";
import { categoryFromDescription } from "./category";
import { compareAlternates } from "./compare";
import { assignColumn, guessMapping } from "./fields";
import { createParts, draftLines, unresolvedLines, vendorsFromParts } from "./lines";
import { parseCsv, parsePartsFile } from "./parse-file";
import { parseMeasure, sameSpec } from "./units";

const fixtures = path.join(__dirname, "../../fixtures/parts");
const demo = (ext: "csv" | "xlsx") =>
  new Uint8Array(readFileSync(path.join(fixtures, `power-board-rev-c-demo.${ext}`)));

function demoParts() {
  const parsed = parsePartsFile("demo.xlsx", demo("xlsx"), true);
  if (!parsed.ok) throw new Error("demo did not parse");
  const { drafts, skipped } = draftLines(parsed.sheet.rows, guessMapping(parsed.sheet.headers));
  const { parts } = createParts(drafts, { "row-9": "electrical" });
  return { parts: parts!, skipped, drafts };
}

describe("parsing", () => {
  it("reads quoted CSV fields, doubled quotes and CRLF", () => {
    expect(parseCsv('a,"b, c","say ""hi"""\r\n1,2,3\r\n')).toEqual([
      ["a", "b, c", 'say "hi"'],
      ["1", "2", "3"],
    ]);
  });

  it("drops a UTF-8 byte order mark from the first header", () => {
    expect(parseCsv(`${String.fromCharCode(0xfeff)}MPN,Qty\nAO3401A,1`)).toEqual([
      ["MPN", "Qty"],
      ["AO3401A", "1"],
    ]);
  });

  it("reads the demo list the same from CSV and Excel", () => {
    const csv = parsePartsFile("demo.csv", demo("csv"));
    const xlsx = parsePartsFile("demo.xlsx", demo("xlsx"));
    expect(csv.ok && xlsx.ok).toBe(true);
    if (csv.ok && xlsx.ok) {
      expect(xlsx.sheet.headers).toEqual(csv.sheet.headers);
      expect(xlsx.sheet.rows).toEqual(csv.sheet.rows);
    }
  });

  it("rejects other file types and files with no header row", () => {
    expect(parsePartsFile("schematic.pdf", new Uint8Array([37, 80, 68, 70]))).toEqual({
      ok: false,
      reason: "wrong-type",
    });
    expect(parsePartsFile("empty.csv", new TextEncoder().encode("\n\n"))).toEqual({
      ok: false,
      reason: "no-header",
    });
  });
});

describe("column mapping", () => {
  it("guesses known headers and leaves unknown ones unmapped", () => {
    const mapping = guessMapping([
      "Designator",
      "Mfr Part #",
      "Footprint",
      "Qty",
      "Supplier Email",
    ]);
    expect(mapping).toMatchObject({ designator: 0, mpn: 1, quantity: 3, vendorEmail: 4 });
    expect(Object.values(mapping)).not.toContain(2);
    expect(mapping.category).toBeNull();
  });

  it("moves a field when the engineer assigns it to another column", () => {
    const next = assignColumn(guessMapping(["MPN", "Part number"]), 1, "mpn");
    expect(next.mpn).toBe(1);
  });
});

describe("categories", () => {
  it("reads only the listed description words", () => {
    expect(categoryFromDescription("Washer, flat, M3, nylon 6/6")).toBe("mechanical");
    expect(categoryFromDescription("MOSFET P-ch 20 V")).toBe("electrical");
    expect(categoryFromDescription("TVS 15 V 600 W SMB")).toBeNull();
    expect(categoryFromDescription("Connector screw kit")).toBeNull();
  });

  it("creates demo parts and skips the line with no MPN", () => {
    const parsed = parsePartsFile("demo.csv", demo("csv"));
    if (!parsed.ok) throw new Error("demo did not parse");
    const { drafts, skipped } = draftLines(parsed.sheet.rows, guessMapping(parsed.sheet.headers));
    expect(skipped).toEqual([{ row: 13, designator: "TP1–TP4", reason: "Missing MPN" }]);
    expect(unresolvedLines(drafts, {}).map((d) => d.mpn)).toEqual(["SMBJ15A-13-F"]);
    expect(createParts(drafts, {}).parts).toBeNull();
    const washer = drafts.find((d) => d.mpn === "NW-M3-PA66");
    expect(washer).toMatchObject({ category: "mechanical", categorySource: "description" });
    const { parts } = demoParts();
    expect(parts).toHaveLength(11);
    expect(parts.filter((p) => p.category === "mechanical")).toHaveLength(3);
  });
});

describe("units", () => {
  it("normalizes before comparing", () => {
    expect(sameSpec("35 mΩ", "0.035 Ω")).toBe(true);
    expect(sameSpec("8 mm", "10 mm")).toBe(false);
    expect(sameSpec("10 mm", "10.0 mm")).toBe(true);
    expect(sameSpec("−20 V", "-20 V")).toBe(true);
    expect(sameSpec("M3 × 0.5", "M3 x 0.5")).toBe(true);
    expect(sameSpec("1 A", "1 V")).toBe(false);
    expect(sameSpec(null, null)).toBe(true);
    expect(sameSpec("SOT-23", null)).toBe(false);
    expect(parseMeasure("2.2 µH")).toEqual({ value: 2.2e-6, unit: "H" });
  });
});

describe("comparison", () => {
  const { parts } = demoParts();
  const imported = vendorsFromParts(parts);

  it("compares Q3 with three drop-in alternates and marks differing cells", () => {
    const c = compareAlternates(
      findRecord("IRLML6402TRPBF")!,
      findAlternates("IRLML6402TRPBF"),
      imported,
      vendorRecords,
    );
    expect(c.alternates.map((a) => [a.mpn, a.fit])).toEqual([
      ["DMP2035U-7", "Drop-in"],
      ["SI2343CDS-T1-GE3", "Drop-in"],
      ["AO3401A", "Drop-in"],
    ]);
    const vds = c.rows.find((r) => r.key === "voltage")!;
    expect(vds.alternates.map((a) => a.differs)).toEqual([false, true, true]);
    expect(c.alternates[1]!.remark).toBe(
      "Vds is −30 V against a −20 V baseline. Confirm the gate threshold at your gate drive voltage.",
    );
    // The imported list wins over the vendor record, and says so.
    expect(c.alternates[0]!.vendorBlock.email).toEqual({
      value: "sales@diodes.example",
      source: "Imported list",
    });
    expect(c.alternates[1]!.vendorBlock.email).toEqual({
      value: "sales@vishay.example",
      source: "Vendor record",
    });
    expect(c.alternates[2]!.vendorBlock.email.value).toBeNull();
    // Same SOT-23 outline, different gate threshold.
    expect(c.alternates.map((a) => a.dimensionsDiffer)).toEqual([false, false, false]);
    expect(c.rows.find((r) => r.key === "threshold")!.label).toBe("Vgs(th), max");
    expect([...new Set(c.rows.map((r) => r.group))]).toEqual([
      "Ratings",
      "Package and dimensions",
      "Functional",
    ]);
  });

  it("calls a mechanical part functional when length or material differs", () => {
    const c = compareAlternates(
      findRecord("HSO-M3X10-BR-NI")!,
      findAlternates("HSO-M3X10-BR-NI"),
      imported,
      vendorRecords,
    );
    expect(c.alternates.map((a) => a.fit)).toEqual(["Functional", "Functional"]);
    expect(c.alternates[0]!.remark).toBe(
      "Length is 12 mm against a 10 mm baseline. Confirm the stack height.",
    );
    expect(c.alternates[1]!.remark).toMatch(/^Material is aluminum against a brass baseline\./);
    // "10.0 mm" and "M3 x 0.5" match the baseline once normalized.
    expect(c.alternates.map((a) => a.dimensionsDiffer)).toEqual([true, false]);
    expect(c.rows.find((r) => r.key === "torque")!.alternates.map((a) => a.differs)).toEqual([
      false,
      true,
    ]);
    const length = c.rows.find((r) => r.key === "length")!;
    expect(length.alternates.map((a) => a.differs)).toEqual([true, false]);
  });
});
