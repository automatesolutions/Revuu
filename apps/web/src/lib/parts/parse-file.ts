/** Server-only: reads an uploaded CSV or Excel parts list into text rows. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";
import { hasAcceptedExtension } from "./messages";
import type { ParsedSheet } from "./types";

export type ParseResult =
  { ok: true; sheet: ParsedSheet } | { ok: false; reason: "wrong-type" | "no-header" };

/** RFC 4180 CSV: quoted fields, doubled quotes, CRLF or LF, optional UTF-8 BOM. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const input = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"' && field === "") quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function readExcel(bytes: Uint8Array): string[][] {
  const book = XLSX.read(bytes, { type: "array", dense: true });
  const first = book.SheetNames[0];
  if (!first) return [];
  // raw: false keeps what the engineer sees in the cell ("0402", not 402).
  return XLSX.utils.sheet_to_json<string[]>(book.Sheets[first]!, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });
}

function toSheet(fileName: string, table: string[][], demo: boolean): ParseResult {
  const cells = table.map((r) => r.map((c) => String(c ?? "").trim()));
  const [headerRow, ...data] = cells;
  const named = headerRow?.filter(Boolean).length ?? 0;
  // A header row needs at least two named columns and at least one data row below it.
  if (!headerRow || named < 2 || !data.some((r) => r.some(Boolean))) {
    return { ok: false, reason: "no-header" };
  }
  const width = Math.max(headerRow.length, ...data.map((r) => r.length));
  const pad = (r: string[]) => Array.from({ length: width }, (_, i) => r[i] ?? "");
  return {
    ok: true,
    sheet: { fileName, headers: pad(headerRow), rows: data.map(pad), demo },
  };
}

export function parsePartsFile(fileName: string, bytes: Uint8Array, demo = false): ParseResult {
  if (!hasAcceptedExtension(fileName)) return { ok: false, reason: "wrong-type" };
  try {
    const table = fileName.toLowerCase().endsWith(".csv")
      ? parseCsv(new TextDecoder("utf-8").decode(bytes))
      : readExcel(bytes);
    return toSheet(fileName, table, demo);
  } catch {
    return { ok: false, reason: "no-header" };
  }
}

export const demoFiles = {
  xlsx: "power-board-rev-c-demo.xlsx",
  csv: "power-board-rev-c-demo.csv",
} as const;

export async function readDemoFile(format: keyof typeof demoFiles) {
  const name = demoFiles[format];
  const bytes = await readFile(path.join(process.cwd(), "src/fixtures/parts", name));
  return { name, bytes: new Uint8Array(bytes) };
}
