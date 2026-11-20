import { categories, categoryLabel, type Category } from "./types";

/**
 * What an engineer gives for one comparison: the original and 1 to 4 candidates. Shared by the
 * form and the route handler, so the server checks the same rules the form shows.
 */
export interface PartInput {
  mpn: string;
  maker: string;
  /** File name of the datasheet PDF. The file itself is not uploaded in this milestone. */
  datasheet: string | null;
}

export interface ComparisonRequest {
  category: Category;
  original: PartInput;
  candidates: PartInput[];
  /** The board or assembly the original sits on, and anything the engineer wants checked. */
  context: string;
  /** Value engineering: compare unit prices when they exist. */
  costComparison: boolean;
}

export const maxCandidates = 4;

export const emptyPart = (): PartInput => ({ mpn: "", maker: "", datasheet: null });

export const emptyRequest = (): ComparisonRequest => ({
  category: "electronic",
  original: emptyPart(),
  candidates: [emptyPart()],
  context: "",
  costComparison: false,
});

/** Error messages keyed by field path: "original.mpn", "candidates.1.maker", "candidates". */
export type RequestErrors = Partial<Record<string, string>>;

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function cleanPart(input: unknown): PartInput {
  const p = (input ?? {}) as Record<string, unknown>;
  const datasheet = clean(p.datasheet, 260);
  return { mpn: clean(p.mpn, 80), maker: clean(p.maker, 120), datasheet: datasheet || null };
}

/** Coerces untrusted JSON into a request. Unknown fields are dropped. */
export function cleanRequest(input: unknown): ComparisonRequest {
  const r = (input ?? {}) as Record<string, unknown>;
  const category = categories.includes(r.category as Category)
    ? (r.category as Category)
    : "electronic";
  const candidates = Array.isArray(r.candidates)
    ? r.candidates.slice(0, maxCandidates).map(cleanPart)
    : [];
  return {
    category,
    original: cleanPart(r.original),
    candidates,
    context: clean(r.context, 4000),
    costComparison: r.costComparison === true,
  };
}

export function validateRequest(request: ComparisonRequest): RequestErrors {
  const errors: RequestErrors = {};
  const check = (part: PartInput, path: string, name: string) => {
    if (!part.mpn) errors[`${path}.mpn`] = `Enter the MPN of ${name}.`;
    if (!part.maker) errors[`${path}.maker`] = `Enter the maker of ${name}.`;
  };
  check(request.original, "original", "the original");
  request.candidates.forEach((c, i) => check(c, `candidates.${i}`, `candidate ${i + 1}`));
  if (request.candidates.length === 0) errors.candidates = "Add at least 1 candidate.";
  const seen = new Set([request.original.mpn.toUpperCase()]);
  request.candidates.forEach((c, i) => {
    const key = c.mpn.toUpperCase();
    if (!key) return;
    if (seen.has(key)) errors[`candidates.${i}.mpn`] = `${c.mpn} is already in this comparison.`;
    seen.add(key);
  });
  return errors;
}

/** Parts with no datasheet file. Revuu fetches these from the manufacturer by MPN. */
export function partsToFetch(request: ComparisonRequest) {
  return [request.original, ...request.candidates].filter((p) => !p.datasheet && p.mpn);
}

const describe = (p: PartInput) =>
  `${p.mpn} (${p.maker}). Datasheet: ${p.datasheet ?? "not given; fetch the manufacturer's datasheet for this MPN and record title, revision, date and URL"}.`;

/**
 * The prompt for a replacement comparison. The datasheet pages reach the model through retrieval,
 * so the prompt states the rules and the context, not the datasheet text.
 */
export function comparisonPrompt(request: ComparisonRequest) {
  const { category, original, candidates } = request;
  const method =
    category === "electronic"
      ? "Compare as for PCB-mounted electronic parts: absolute maximum ratings, recommended operating conditions, every electrical table, thermal, package and land pattern, pinout, compliance."
      : "Compare as for mechanical and miscellaneous parts: interface features (holes, bore, shaft, thread, envelope, lengths), material and finish, load and life ratings, temperature, compliance.";
  return [
    "Task: replacement check. Decide whether each candidate can replace the original in the existing design without changing it, and what must be checked or changed first.",
    `Category: ${categoryLabel[category]}. ${method}`,
    `Original (pinned, already in the design): ${describe(original)}`,
    ...candidates.map((c, i) => `Candidate ${i + 1}: ${describe(c)}`),
    `Design context from the engineer: ${request.context || "none given. State every assumption as a scenario."}`,
    request.costComparison
      ? "Cost: compare unit prices only where the engineer or a distributor record gives them. Never estimate a price."
      : "Cost: not requested.",
    "Rules:",
    "- Use only numbers from the retrieved datasheet pages. Cite the document and page for every number.",
    "- If a value is not in the datasheet, mark it not specified. Never invent or estimate it.",
    "- Keep test conditions with every value. Flag rows where the parts were measured under different conditions.",
    "- Keep min, typ and max separate. One unit per row.",
    "- Judge each candidate as Drop-in, Rework or Not acceptable, with the reason.",
    "- List the checks to run as concrete tests with numbers and conditions, for example 'Measure Vgs(th) at 4.5 V gate drive'. Never write 'verify thoroughly'.",
    "- State confidence (High, Medium, Low) and why.",
  ].join("\n");
}

/** About 4 characters per token for English prose. An estimate, shown as one. */
export const estimateTokens = (text: string) => Math.ceil(text.length / 4);
