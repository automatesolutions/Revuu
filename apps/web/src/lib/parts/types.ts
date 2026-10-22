export type Category = "electrical" | "mechanical";

export const categoryLabel: Record<Category, string> = {
  electrical: "Electrical",
  mechanical: "Mechanical",
};

export type PartField =
  | "designator"
  | "mpn"
  | "manufacturer"
  | "description"
  | "quantity"
  | "category"
  | "vendor"
  | "vendorEmail"
  | "vendorPhone"
  | "vendorUrl";

/** Which file column (by index) feeds each Revuu field. null = not mapped. */
export type ColumnMapping = Record<PartField, number | null>;

/** A parsed sheet: the first row is the header row, every cell is text. */
export interface ParsedSheet {
  fileName: string;
  headers: string[];
  rows: string[][];
  demo: boolean;
}

export interface Part {
  /** Stable for one import: "row-6" is spreadsheet row 6. */
  id: string;
  row: number;
  designator: string | null;
  mpn: string;
  manufacturer: string | null;
  description: string | null;
  quantity: number | null;
  category: Category;
  categorySource: "column" | "description" | "engineer";
  vendor: string | null;
  vendorEmail: string | null;
  vendorPhone: string | null;
  vendorUrl: string | null;
}

export interface SkippedLine {
  row: number;
  designator: string | null;
  reason: "Missing MPN";
}

export interface ImportResult {
  fileName: string;
  demo: boolean;
  importedAt: string;
  parts: Part[];
  skipped: SkippedLine[];
}

/** Contact details for one vendor, as the imported list gives them. */
export interface VendorContact {
  name: string;
  email: string | null;
  phone: string | null;
  url: string | null;
}
