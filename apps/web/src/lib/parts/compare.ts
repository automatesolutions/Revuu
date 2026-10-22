import type { Lifecycle } from "@revuu/ui/components/status-chip";
import { vendorKey } from "./lines";
import type { Category, VendorContact } from "./types";
import { sameSpec, type SpecValue } from "./units";

export type ElectricalSpec =
  | "voltage"
  | "current"
  | "resistance"
  | "tolerance"
  | "polarity"
  | "package"
  | "pins"
  | "bodyLength"
  | "bodyWidth"
  | "height"
  | "pitch"
  | "threshold"
  | "gateCharge"
  | "power"
  | "temperature";
export type MechanicalSpec =
  "thread" | "length" | "material" | "acrossFlats" | "threadDepth" | "finish" | "drive" | "torque";
export type SpecKey = ElectricalSpec | MechanicalSpec;

export type SpecGroup = "Ratings" | "Package and dimensions" | "Functional" | "Fit" | "Dimensions";

interface SpecDef {
  key: SpecKey;
  group: SpecGroup;
  label: string;
  check: string;
  /** Lowercase text values inside a sentence ("aluminum", not "Aluminum"). */
  lowercaseInProse?: boolean;
}

/** Specs that change the outline drawing. A difference in any of them marks the drawing. */
export const dimensionKeys: SpecKey[] = [
  "package",
  "pins",
  "bodyLength",
  "bodyWidth",
  "height",
  "pitch",
  "thread",
  "length",
  "acrossFlats",
  "threadDepth",
];

export const specRows: Record<Category, SpecDef[]> = {
  electrical: [
    {
      key: "voltage",
      group: "Ratings",
      label: "Voltage rating",
      check: "Confirm the voltage margin in this circuit.",
    },
    { key: "current", group: "Ratings", label: "Current", check: "Confirm the peak load current." },
    {
      key: "resistance",
      group: "Ratings",
      label: "Resistance",
      check: "Confirm the circuit value.",
    },
    { key: "tolerance", group: "Ratings", label: "Tolerance", check: "Confirm the error budget." },
    {
      key: "polarity",
      group: "Ratings",
      label: "Polarity",
      check: "Confirm the circuit topology.",
    },
    {
      key: "package",
      group: "Package and dimensions",
      label: "Package",
      check: "Confirm the footprint on the board.",
    },
    {
      key: "pins",
      group: "Package and dimensions",
      label: "Pin count",
      check: "Confirm the footprint and pinout.",
    },
    {
      key: "bodyLength",
      group: "Package and dimensions",
      label: "Body length",
      check: "Confirm the courtyard on the footprint.",
    },
    {
      key: "bodyWidth",
      group: "Package and dimensions",
      label: "Body width",
      check: "Confirm the courtyard on the footprint.",
    },
    {
      key: "height",
      group: "Package and dimensions",
      label: "Height, max",
      check: "Confirm the clearance to the enclosure.",
    },
    {
      key: "pitch",
      group: "Package and dimensions",
      label: "Lead pitch",
      check: "Confirm the pad spacing on the footprint.",
    },
    {
      key: "threshold",
      group: "Functional",
      label: "Threshold voltage",
      check: "Confirm it turns on fully at your drive voltage.",
    },
    {
      key: "gateCharge",
      group: "Functional",
      label: "Gate charge",
      check: "Confirm the switching speed with your driver.",
    },
    {
      key: "power",
      group: "Functional",
      label: "Power dissipation",
      check: "Confirm the thermal margin at full load.",
    },
    {
      key: "temperature",
      group: "Functional",
      label: "Operating temperature",
      check: "Confirm the product's temperature range.",
    },
  ],
  mechanical: [
    { key: "thread", group: "Fit", label: "Thread or size", check: "Confirm the mating thread." },
    { key: "length", group: "Fit", label: "Length", check: "Confirm the stack height." },
    {
      key: "material",
      group: "Fit",
      label: "Material",
      check: "Confirm the load rating and the ground path.",
      lowercaseInProse: true,
    },
    {
      key: "acrossFlats",
      group: "Dimensions",
      label: "Hex across flats",
      check: "Confirm the wrench size and the keep-out around the hole.",
    },
    {
      key: "threadDepth",
      group: "Dimensions",
      label: "Thread depth",
      check: "Confirm the screw length engages enough thread.",
    },
    {
      key: "finish",
      group: "Functional",
      label: "Finish",
      check: "Confirm conductivity where it touches ground.",
      lowercaseInProse: true,
    },
    {
      key: "drive",
      group: "Functional",
      label: "Drive or head",
      check: "Confirm the assembly tools.",
    },
    {
      key: "torque",
      group: "Functional",
      label: "Max torque",
      check: "Confirm the assembly torque setting.",
    },
  ],
};

/** Drop-in needs these to match exactly. Anything else is Functional. */
export const fitKeys: Record<Category, SpecKey[]> = {
  electrical: ["package", "pins", "polarity"],
  mechanical: ["thread", "length", "material"],
};

export interface PartRecord {
  mpn: string;
  manufacturer: string;
  category: Category;
  specs: Partial<Record<SpecKey, SpecValue>>;
  /** Part-specific row labels and checks, e.g. "Vds" for a MOSFET. */
  labels?: Partial<Record<SpecKey, string>>;
  checks?: Partial<Record<SpecKey, string>>;
  lifecycle: Lifecycle;
  stock: number | null;
  unitPrice: number | null;
  datasheet: string | null;
  vendor: string | null;
  /** Where the record came from and how old it is, e.g. "Vendor record", "2 d ago". */
  source: string;
  age: string;
}

export interface VendorRecord {
  name: string;
  email: string | null;
  phone: string | null;
  url: string | null;
}

export type ContactSource = "Imported list" | "Vendor record";
export type ContactField =
  | { value: string; source: ContactSource; missing?: never }
  | { value: null; source?: never; missing: string };

export interface VendorBlock {
  name: string | null;
  email: ContactField;
  phone: ContactField;
  url: ContactField;
}

export type Fit = "Drop-in" | "Functional";

export interface ComparedAlternate extends PartRecord {
  fit: Fit;
  remark: string;
  vendorBlock: VendorBlock;
  /** True when any dimension row differs, so the outline drawing differs too. */
  dimensionsDiffer: boolean;
}

export interface ComparisonRow {
  key: SpecKey;
  group: SpecGroup;
  label: string;
  baseline: SpecValue;
  alternates: { value: SpecValue; differs: boolean }[];
}

export interface Comparison {
  baseline: PartRecord;
  rows: ComparisonRow[];
  alternates: ComparedAlternate[];
}

const contactWords = { email: "email", phone: "phone number", url: "URL" } as const;

function contact(
  field: keyof typeof contactWords,
  imported: VendorContact | undefined,
  record: VendorRecord | undefined,
): ContactField {
  const fromList = imported?.[field];
  if (fromList) return { value: fromList, source: "Imported list" };
  const fromRecord = record?.[field];
  if (fromRecord) return { value: fromRecord, source: "Vendor record" };
  return {
    value: null,
    missing: `No vendor ${contactWords[field]} in this list or the vendor record.`,
  };
}

export function vendorBlock(
  name: string | null,
  imported: VendorContact[],
  records: VendorRecord[],
): VendorBlock {
  const key = name ? vendorKey(name) : null;
  const fromList = key ? imported.find((v) => vendorKey(v.name) === key) : undefined;
  const fromRecord = key ? records.find((v) => vendorKey(v.name) === key) : undefined;
  return {
    name,
    email: contact("email", fromList, fromRecord),
    phone: contact("phone", fromList, fromRecord),
    url: contact("url", fromList, fromRecord),
  };
}

function prose(value: SpecValue, def: SpecDef) {
  const text = String(value);
  return def.lowercaseInProse ? text.toLowerCase() : text;
}

function differenceRemark(
  def: SpecDef,
  label: string,
  base: SpecValue,
  alt: SpecValue,
  check: string,
) {
  if (alt === null) return `${label} is not in the vendor record. ${check}`;
  if (base === null) return `${label} is not in the baseline record. ${check}`;
  return `${label} is ${prose(alt, def)} against a ${prose(base, def)} baseline. ${check}`;
}

export function compareAlternates(
  baseline: PartRecord,
  alternates: PartRecord[],
  imported: VendorContact[],
  vendors: VendorRecord[],
): Comparison {
  const defs = specRows[baseline.category].map((def) => ({
    ...def,
    label: baseline.labels?.[def.key] ?? def.label,
    check: baseline.checks?.[def.key] ?? def.check,
  }));
  const shown = alternates.slice(0, 3);

  const rows: ComparisonRow[] = defs.map((def) => {
    const base = baseline.specs[def.key] ?? null;
    return {
      key: def.key,
      group: def.group,
      label: def.label,
      baseline: base,
      alternates: shown.map((alt) => {
        const value = alt.specs[def.key] ?? null;
        return { value, differs: !sameSpec(base, value) };
      }),
    };
  });

  const compared = shown.map((alt, i): ComparedAlternate => {
    const block = vendorBlock(alt.vendor, imported, vendors);
    const differing = defs.filter((_, r) => rows[r]!.alternates[i]!.differs);
    const fitMiss = differing.find((def) => fitKeys[baseline.category].includes(def.key));
    // A fit field missing on both sides cannot prove a drop-in either.
    const fitUnknown = fitKeys[baseline.category].find(
      (key) => (baseline.specs[key] ?? null) === null,
    );
    const fit: Fit = fitMiss || fitUnknown ? "Functional" : "Drop-in";
    const first = fitMiss ?? differing[0];
    let remark: string;
    if (first) {
      remark = differenceRemark(
        first,
        first.label,
        baseline.specs[first.key] ?? null,
        alt.specs[first.key] ?? null,
        first.check,
      );
    } else if (fitUnknown) {
      const def = defs.find((d) => d.key === fitUnknown)!;
      remark = `${def.label} is not in either record. ${def.check}`;
    } else if (block.email.value) {
      const from =
        block.email.source === "Imported list" ? "the imported list" : "the vendor record";
      remark = `Vendor email is ${block.email.value}, from ${from}.`;
    } else {
      remark = "Specs match the baseline. Ask the vendor for an email contact before you order.";
    }
    const dimensionsDiffer = rows.some(
      (row) => dimensionKeys.includes(row.key) && row.alternates[i]!.differs,
    );
    return { ...alt, fit, remark, vendorBlock: block, dimensionsDiffer };
  });

  return { baseline, rows, alternates: compared };
}
