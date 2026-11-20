import { estimateTokens } from "@/lib/parts/request";

/**
 * The hardware-design brief. One run, one output: every field is collected and checked before any
 * model call, so the first deliverable can be used. Shared by the wizard and the route handler.
 */
export type DesignOutput = "schematic" | "pcb" | "enclosure" | "document";
export type Provider = "openai" | "astra";
export type FocusArea = "impedance" | "safety" | "thermal" | "emi";

export const outputs: { id: DesignOutput; label: string; detail: string }[] = [
  {
    id: "schematic",
    label: "KiCad schematic",
    detail: "Hierarchical sheets, net names, ERC clean.",
  },
  {
    id: "pcb",
    label: "KiCad PCB",
    detail: "Layout with BOM, pick-and-place (POS) and Gerber files.",
  },
  { id: "enclosure", label: "Onshape enclosure", detail: "Mechanical enclosure with board fit." },
  {
    id: "document",
    label: "Design document",
    detail: "Decisions, calculations and the risks that remain.",
  },
];

export const focusAreas: { id: FocusArea; label: string }[] = [
  { id: "impedance", label: "Controlled impedance" },
  { id: "safety", label: "Safety (creepage, clearance, isolation)" },
  { id: "thermal", label: "Thermal" },
  { id: "emi", label: "EMI and EMC" },
];

export const standardOptions = [
  "IEC 62368-1",
  "IEC 61010-1",
  "IEC 60601-1",
  "UL 94",
  "IPC-2221",
  "IPC-2152",
  "IPC-7351",
  "IPC-A-610",
  "CISPR 32",
] as const;

export const providers: { id: Provider; label: string }[] = [
  { id: "openai", label: "OpenAI API key" },
  { id: "astra", label: "Astra MCP or API key" },
];

export interface DesignBrief {
  title: string;
  description: string;
  specification: string;
  /** File names only. Files are not uploaded in this milestone. */
  referenceFiles: string[];
  referenceLinks: string;
  pcbSize: string;
  layers: string;
  stackup: string;
  focus: FocusArea[];
  otherConstraints: string;
  partLimits: string;
  enclosureSize: string;
  outputs: DesignOutput[];
  standards: string[];
  standardsNotes: string;
  provider: Provider | null;
}

export const emptyBrief = (): DesignBrief => ({
  title: "",
  description: "",
  specification: "",
  referenceFiles: [],
  referenceLinks: "",
  pcbSize: "",
  layers: "",
  stackup: "",
  focus: [],
  otherConstraints: "",
  partLimits: "",
  enclosureSize: "",
  outputs: [],
  standards: [],
  standardsNotes: "",
  provider: null,
});

export type BriefField = keyof DesignBrief;
export type BriefErrors = Partial<Record<BriefField, string>>;

/** Which wizard step owns each field, so an error can send the engineer to the right step. */
export const fieldStep: Record<BriefField, 0 | 1 | 2> = {
  title: 0,
  description: 0,
  specification: 0,
  referenceFiles: 0,
  referenceLinks: 0,
  pcbSize: 1,
  layers: 1,
  stackup: 1,
  focus: 1,
  otherConstraints: 1,
  partLimits: 1,
  enclosureSize: 1,
  outputs: 2,
  standards: 2,
  standardsNotes: 2,
  provider: 2,
};

/** Required fields for the chosen outputs. A run is refused until each one is filled. */
export function validateBrief(brief: DesignBrief): BriefErrors {
  const errors: BriefErrors = {};
  const need = (field: BriefField, message: string) => {
    const value = brief[field];
    const empty = Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim();
    if (empty && !errors[field]) errors[field] = message;
  };
  const wants = (o: DesignOutput) => brief.outputs.includes(o);

  need("title", "Enter a project title.");
  need("description", "Describe what the product does.");
  need("specification", "Add the product specification.");
  need("outputs", "Choose at least 1 output.");
  need("provider", "Choose whose key pays for the run.");
  if (wants("pcb") || wants("enclosure")) need("pcbSize", "Enter the PCB size.");
  if (wants("pcb")) {
    need("layers", "Enter the layer count.");
    need("partLimits", "Enter the part size limits.");
  }
  if (wants("pcb") && brief.focus.includes("impedance")) {
    need("stackup", "Add stack-up notes. Controlled impedance needs them.");
  }
  if (wants("enclosure")) need("enclosureSize", "Enter the enclosure size.");
  if (brief.focus.includes("safety")) {
    need("standards", "Choose the safety standard. Safety is one of your focus areas.");
  }
  return errors;
}

const list = (items: string[], none: string) => (items.length ? items.join(", ") : none);

/**
 * The one prompt for a design run. It carries every field and names the problems a first design
 * usually fails on, so the model handles them before the engineer sees the files.
 */
export function designPrompt(brief: DesignBrief) {
  const chosen = outputs.filter((o) => brief.outputs.includes(o.id));
  const focus = focusAreas.filter((f) => brief.focus.includes(f.id)).map((f) => f.label);
  const field = (label: string, value: string) => `${label}: ${value.trim() || "not given"}`;
  return [
    "Task: one production-ready hardware design run. There is no second run, so resolve every open question with a stated assumption and list it as a risk.",
    field("Project title", brief.title),
    field("Project description", brief.description),
    field("Product specification", brief.specification),
    field(
      "Reference designs",
      [...brief.referenceFiles, ...brief.referenceLinks.split(/\s+/).filter(Boolean)].join(", "),
    ),
    field("PCB size", brief.pcbSize),
    field("Layer count", brief.layers),
    field("Stack-up notes", brief.stackup),
    `Focus areas: ${list(focus, "none named")}`,
    field("Other constraints", brief.otherConstraints),
    field("Part size limits", brief.partLimits),
    field("Enclosure size", brief.enclosureSize),
    `Standards: ${list(brief.standards, "none chosen")}`,
    field("Standards notes", brief.standardsNotes),
    `Deliver only: ${chosen.map((o) => `${o.label} (${o.detail})`).join("; ")}`,
    "Before you deliver, check and report on each of these:",
    "- DRC and ERC: zero errors; list every waived warning with the reason.",
    "- Creepage and clearance for every voltage domain, against the chosen standards.",
    "- Stack-up and controlled-impedance traces, with the calculated widths and gaps.",
    "- Thermal: the hottest parts, their power, and how the heat leaves the board.",
    "- EMI: return paths, loop areas, filtering and shielding at connectors.",
    "- Enclosure fit: board outline, mounting holes, connector cut-outs and part heights.",
    "- BOM availability: every part active, with a second source where one exists.",
    "Use only the reference designs, specification and standards notes provided. Cite them. Do not invent part ratings.",
  ].join("\n");
}

export const estimateBriefTokens = (brief: DesignBrief) => estimateTokens(designPrompt(brief));

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function pick<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((v): v is T => allowed.includes(v as T)))]
    : [];
}

/** Coerces untrusted JSON into a brief. Unknown fields and values are dropped. */
export function cleanBrief(input: unknown): DesignBrief {
  const b = (input ?? {}) as Record<string, unknown>;
  return {
    title: text(b.title, 160),
    description: text(b.description, 4000),
    specification: text(b.specification, 20000),
    referenceFiles: Array.isArray(b.referenceFiles)
      ? b.referenceFiles
          .map((f) => text(f, 260))
          .filter(Boolean)
          .slice(0, 20)
      : [],
    referenceLinks: text(b.referenceLinks, 4000),
    pcbSize: text(b.pcbSize, 120),
    layers: text(b.layers, 40),
    stackup: text(b.stackup, 4000),
    focus: pick(
      b.focus,
      focusAreas.map((f) => f.id),
    ),
    otherConstraints: text(b.otherConstraints, 4000),
    partLimits: text(b.partLimits, 1000),
    enclosureSize: text(b.enclosureSize, 120),
    outputs: pick(
      b.outputs,
      outputs.map((o) => o.id),
    ),
    standards: pick(b.standards, standardOptions),
    standardsNotes: text(b.standardsNotes, 4000),
    provider: providers.some((p) => p.id === b.provider) ? (b.provider as Provider) : null,
  };
}

/** What the run endpoint returns. In this milestone no model is called and no file is made. */
export interface DesignRun {
  id: string;
  title: string;
  createdAt: string;
  provider: Provider;
  promptTokens: number;
  modelCalled: false;
  deliverables: { output: DesignOutput; files: string[] }[];
}

/** The files each output will contain once generation exists. Names only; nothing is made. */
export const deliverableFiles: Record<DesignOutput, string[]> = {
  schematic: ["Schematic (.kicad_sch)", "Schematic PDF"],
  pcb: ["PCB (.kicad_pcb)", "Gerber and drill files", "BOM (CSV)", "Pick-and-place (POS)"],
  enclosure: ["Onshape document link", "STEP export"],
  document: ["Design document (PDF)"],
};
