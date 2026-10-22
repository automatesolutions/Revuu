import { emptyMapping, partFields } from "@/lib/parts/fields";
import { createParts, draftLines } from "@/lib/parts/lines";
import type { Category, ColumnMapping, ImportResult, ParsedSheet } from "@/lib/parts/types";

const maxRows = 10_000;

interface CreateBody {
  sheet: ParsedSheet;
  mapping: ColumnMapping;
  chosen: Record<string, Category>;
}

function cleanMapping(input: unknown, width: number): ColumnMapping {
  const mapping = emptyMapping();
  if (!input || typeof input !== "object") return mapping;
  for (const { id } of partFields) {
    const value = (input as Record<string, unknown>)[id];
    if (Number.isInteger(value) && (value as number) >= 0 && (value as number) < width) {
      mapping[id] = value as number;
    }
  }
  return mapping;
}

/** Creates parts from a parsed sheet and the mapping the engineer confirmed. */
export async function POST(request: Request) {
  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return Response.json({ error: "Revuu could not read the confirmed columns." }, { status: 400 });
  }
  const { sheet } = body;
  if (!sheet || !Array.isArray(sheet.headers) || !Array.isArray(sheet.rows)) {
    return Response.json({ error: "Revuu could not read the confirmed columns." }, { status: 400 });
  }
  if (sheet.rows.length > maxRows) {
    return Response.json(
      { error: `Revuu reads up to ${maxRows.toLocaleString("en-US")} lines per list.` },
      { status: 413 },
    );
  }
  const rows = sheet.rows.map((r) => (Array.isArray(r) ? r.map((c) => String(c ?? "")) : []));
  const mapping = cleanMapping(body.mapping, sheet.headers.length);
  if (mapping.mpn === null) {
    return Response.json({ error: "Map a column to MPN, then create the parts." }, { status: 422 });
  }

  const chosen: Record<string, Category> = {};
  for (const [id, value] of Object.entries(body.chosen ?? {})) {
    if (value === "electrical" || value === "mechanical") chosen[id] = value;
  }

  const { drafts, skipped } = draftLines(rows, mapping);
  const { parts, missingCategory } = createParts(drafts, chosen);
  if (!parts) {
    return Response.json(
      {
        error: `Set Electrical or Mechanical for row ${missingCategory.row}, then create the parts.`,
      },
      { status: 422 },
    );
  }

  const result: ImportResult = {
    fileName: String(sheet.fileName ?? "Parts list"),
    demo: sheet.demo === true,
    importedAt: new Date().toISOString(),
    parts,
    skipped,
  };
  return Response.json(result);
}
