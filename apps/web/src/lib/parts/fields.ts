import type { ColumnMapping, PartField } from "./types";

export const partFields: {
  id: PartField;
  label: string;
  required?: boolean;
  synonyms: string[];
}[] = [
  {
    id: "designator",
    label: "Designator",
    synonyms: ["designator", "designators", "refdes", "ref des", "reference", "references", "refs"],
  },
  {
    id: "mpn",
    label: "MPN",
    required: true,
    synonyms: [
      "mpn",
      "manufacturer part number",
      "manufacturer part no",
      "manufacturer pn",
      "mfr part number",
      "mfr part no",
      "mfr pn",
      "mfg part number",
      "mfg pn",
      "part number",
    ],
  },
  {
    id: "manufacturer",
    label: "Manufacturer",
    synonyms: ["manufacturer", "manufacturer name", "mfr", "mfg", "maker"],
  },
  {
    id: "description",
    label: "Description",
    synonyms: ["description", "desc", "part description"],
  },
  { id: "quantity", label: "Quantity", synonyms: ["quantity", "qty", "qty per board", "count"] },
  {
    id: "category",
    label: "Category",
    required: true,
    synonyms: ["category", "part category", "part type", "domain"],
  },
  {
    id: "vendor",
    label: "Vendor",
    synonyms: ["vendor", "vendor name", "supplier", "supplier name", "distributor"],
  },
  {
    id: "vendorEmail",
    label: "Vendor email",
    synonyms: ["vendor email", "supplier email", "distributor email", "email", "e mail"],
  },
  {
    id: "vendorPhone",
    label: "Vendor phone",
    synonyms: ["vendor phone", "supplier phone", "distributor phone", "phone", "telephone"],
  },
  {
    id: "vendorUrl",
    label: "Vendor URL",
    synonyms: [
      "vendor url",
      "vendor website",
      "supplier url",
      "supplier website",
      "distributor url",
      "url",
      "website",
    ],
  },
];

export const fieldLabel = Object.fromEntries(partFields.map((f) => [f.id, f.label])) as Record<
  PartField,
  string
>;

export function emptyMapping(): ColumnMapping {
  return Object.fromEntries(partFields.map((f) => [f.id, null])) as ColumnMapping;
}

export function normalizeHeader(header: string) {
  return header
    .toLowerCase()
    .replace(/[#]/g, " no ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Guesses a column for each field from exact header synonyms only. Unknown headers stay
 * unmapped, and a column feeds at most one field.
 */
export function guessMapping(headers: string[]): ColumnMapping {
  const mapping = emptyMapping();
  const normalized = headers.map(normalizeHeader);
  const taken = new Set<number>();
  for (const field of partFields) {
    const index = normalized.findIndex((h, i) => !taken.has(i) && field.synonyms.includes(h));
    if (index !== -1) {
      mapping[field.id] = index;
      taken.add(index);
    }
  }
  return mapping;
}

/** Points one file column at a field, or at nothing. A field keeps a single column. */
export function assignColumn(
  mapping: ColumnMapping,
  column: number,
  field: PartField | null,
): ColumnMapping {
  const next = { ...mapping };
  for (const key of Object.keys(next) as PartField[]) {
    if (next[key] === column) next[key] = null;
  }
  if (field) next[field] = column;
  return next;
}
