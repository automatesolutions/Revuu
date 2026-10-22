import { findAlternates, findRecord, vendorRecords } from "@/fixtures/parts/records";
import { compareAlternates } from "@/lib/parts/compare";
import { guessMapping } from "@/lib/parts/fields";
import { createParts, draftLines, vendorsFromParts } from "@/lib/parts/lines";
import { parsePartsFile, readDemoFile } from "@/lib/parts/parse-file";
import type { ImportResult } from "@/lib/parts/types";
import { PartsCompareBoard, PartsImportBoard, PartsTableBoard } from "./parts-client";

export const partsImportStates = [
  "empty",
  "reading",
  "wrong-file",
  "error",
  "mapping",
  "mapping-ready",
] as const;
export const partsCompareStates = [
  "electrical",
  "mechanical",
  "no-alternates",
  "loading",
  "error",
] as const;

async function demoSheet() {
  const { name, bytes } = await readDemoFile("xlsx");
  const parsed = parsePartsFile(name, bytes, true);
  if (!parsed.ok) throw new Error("The demo parts list did not parse.");
  return parsed.sheet;
}

async function demoResult(): Promise<ImportResult> {
  const sheet = await demoSheet();
  const { drafts, skipped } = draftLines(sheet.rows, guessMapping(sheet.headers));
  const { parts } = createParts(drafts, { "row-9": "electrical" });
  return { fileName: sheet.fileName, demo: true, importedAt: "", parts: parts!, skipped };
}

export async function PartsImportArtboard({ state }: { state: string }) {
  return <PartsImportBoard state={state} sheet={await demoSheet()} />;
}

export async function PartsTableArtboard() {
  return <PartsTableBoard result={await demoResult()} />;
}

const comparePart: Record<string, string> = {
  electrical: "IRLML6402TRPBF",
  mechanical: "HSO-M3X10-BR-NI",
  "no-alternates": "TPS62133RGTR",
  loading: "IRLML6402TRPBF",
  error: "IRLML6402TRPBF",
};

export async function PartsCompareArtboard({ state }: { state: string }) {
  const result = await demoResult();
  const mpn = comparePart[state] ?? "IRLML6402TRPBF";
  const part = result.parts.find((p) => p.mpn === mpn)!;
  const record = findRecord(mpn);
  const alternates = findAlternates(mpn);
  const comparison =
    record && alternates.length
      ? compareAlternates(record, alternates, vendorsFromParts(result.parts), vendorRecords)
      : null;
  return (
    <PartsCompareBoard
      state={state}
      result={result}
      partId={part.id}
      record={record}
      comparison={comparison}
    />
  );
}
