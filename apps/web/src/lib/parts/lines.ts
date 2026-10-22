import { categoryFromCell, categoryFromDescription } from "./category";
import type { Category, ColumnMapping, Part, PartField, SkippedLine, VendorContact } from "./types";

export type DraftLine = Omit<Part, "category" | "categorySource"> & {
  category: Category | null;
  categorySource: Part["categorySource"] | null;
};

function cell(row: string[], mapping: ColumnMapping, field: PartField): string | null {
  const index = mapping[field];
  if (index === null) return null;
  const value = row[index]?.trim();
  return value ? value : null;
}

function quantity(value: string | null) {
  if (!value) return null;
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Applies a confirmed mapping to the data rows. Blank rows are ignored; rows without an MPN are
 * skipped with a reason. Category comes from the category column, then from the description
 * words, and stays null when neither is explicit.
 */
export function draftLines(rows: string[][], mapping: ColumnMapping) {
  const drafts: DraftLine[] = [];
  const skipped: SkippedLine[] = [];
  rows.forEach((row, i) => {
    // The header is spreadsheet row 1, so data starts at row 2.
    const rowNumber = i + 2;
    if (row.every((c) => !c?.trim())) return;
    const mpn = cell(row, mapping, "mpn");
    const designator = cell(row, mapping, "designator");
    if (!mpn) {
      skipped.push({ row: rowNumber, designator, reason: "Missing MPN" });
      return;
    }
    const description = cell(row, mapping, "description");
    const fromColumn = categoryFromCell(cell(row, mapping, "category"));
    const fromDescription = fromColumn ? null : categoryFromDescription(description);
    drafts.push({
      id: `row-${rowNumber}`,
      row: rowNumber,
      designator,
      mpn,
      manufacturer: cell(row, mapping, "manufacturer"),
      description,
      quantity: quantity(cell(row, mapping, "quantity")),
      category: fromColumn ?? fromDescription,
      categorySource: fromColumn ? "column" : fromDescription ? "description" : null,
      vendor: cell(row, mapping, "vendor"),
      vendorEmail: cell(row, mapping, "vendorEmail"),
      vendorPhone: cell(row, mapping, "vendorPhone"),
      vendorUrl: cell(row, mapping, "vendorUrl"),
    });
  });
  return { drafts, skipped };
}

/** Lines the engineer still has to categorize. */
export function unresolvedLines(drafts: DraftLine[], chosen: Record<string, Category>) {
  return drafts.filter((d) => !d.category && !chosen[d.id]);
}

export function createParts(drafts: DraftLine[], chosen: Record<string, Category>) {
  const parts: Part[] = [];
  for (const d of drafts) {
    if (d.category && d.categorySource) {
      parts.push({ ...d, category: d.category, categorySource: d.categorySource });
    } else if (chosen[d.id]) {
      parts.push({ ...d, category: chosen[d.id]!, categorySource: "engineer" });
    } else {
      return { parts: null, missingCategory: d };
    }
  }
  return { parts, missingCategory: null };
}

export function vendorKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** First email, phone and URL the imported list gives for each vendor name. */
export function vendorsFromParts(parts: Part[]): VendorContact[] {
  const byKey = new Map<string, VendorContact>();
  for (const p of parts) {
    if (!p.vendor) continue;
    const key = vendorKey(p.vendor);
    const entry = byKey.get(key) ?? { name: p.vendor, email: null, phone: null, url: null };
    entry.email ??= p.vendorEmail;
    entry.phone ??= p.vendorPhone;
    entry.url ??= p.vendorUrl;
    byKey.set(key, entry);
  }
  return [...byKey.values()];
}
