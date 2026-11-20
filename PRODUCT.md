# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Confirmed by Jonel (2026-10-07): Next.js App Router + TypeScript, Tailwind CSS v4 + shadcn/ui
conventions, Supabase (Postgres, Auth, Storage, Realtime, row-level security) with Drizzle,
GCP Cloud Run + Cloud Tasks + Cloud Scheduler + Secret Manager + KMS, Stripe billing.
pnpm workspace: `apps/web`, `packages/ui`, `packages/config` (later `packages/db`,
`packages/parts`, `apps/worker`, `apps/renderer`).

## Users

Engineers who keep hardware in production and must change parts in it:

- **Component engineers** who find a second source or an alternate for an EOL, NRND or
  short-supply part, and must say whether it fits the existing board.
- **Hardware and mechanical engineers** who own the board or assembly the part sits on, and run
  the checks before a change is accepted.
- **QA and purchasing** who need written evidence and a cost difference before they accept an
  alternate part.
- **Hardware engineers starting a new board** who want one production-usable first design from a
  complete brief (secondary).

Their job, in order:

1. Decide whether a candidate part can replace the original in an existing design, and what must be
   checked or changed first.
2. Less often: turn a full product brief into one schematic, PCB and enclosure deliverable.

## Product Purpose

Revuu has two functions. The first is the product.

1. **Part comparison.** The engineer gives an original part and 1 to 4 candidates (MPN, maker,
   datasheet PDF). Revuu reads the datasheets with retrieval over the extracted pages, on the
   engineer's own Anthropic key, and returns a side-by-side comparison with a judgement for each
   candidate: Drop-in, Rework or Not acceptable. Every number cites a datasheet page. Each
   judgement lists concrete checks to run. A cost comparison appears when prices exist. The report
   prints to PDF, and the sheet and source documents download.
2. **Hardware design.** The engineer fills in a complete brief once: project, specification,
   reference designs, PCB size, stack-up, the constraints that matter, part size limits, enclosure
   size, standards and the outputs they need. Revuu checks the brief is complete, shows the size and
   risk of the run, then makes one run on the engineer's own OpenAI or Astra key. The result is only
   what they asked for: KiCad schematic, KiCad PCB (BOM, POS, Gerber), Onshape enclosure and a
   design document with decisions and remaining risks. There is no iteration inside the product.

Success: an engineer can answer "can this part replace that one, and what do I check?" from
cited datasheet evidence in one sitting, and a design run is never wasted on an incomplete brief.

## Positioning

A datasheet-first replacement check that sits beside any ECAD tool, not another ECAD suite or a
PLM. Replacement is the default question, the original is always pinned, and no number appears
without its page. Hardware design is a secondary, gated feature that runs on the engineer's own
model keys; Revuu does not resell model usage under its own key for design.

## Operating Context

- Function 1 flow: Parts > import a parts list or start a comparison > pick the original >
  add 1 to 4 candidates with datasheets > comparison with judgement, checks and cost > print or
  download.
- Function 2 flow: Design > wizard (project, board and enclosure, outputs and standards) >
  confirm one run with its size and risk > results with downloads per output.
- Categories: electronic, mechanical, miscellaneous. Electronic follows the `/compare-parts`
  method; mechanical and miscellaneous follow `/compare-mech-parts`.
- Engineers live in dense data: BOM tables, MPNs, designators, datasheets, parametric specs.
  Keyboard use is common.
- Model keys belong to the engineer and stay server-side (Secret Manager). They are never sent to
  the client and never logged.
- Parts data from Mouser and DigiKey is planned; distributor daily quotas are a hard constraint.

## Capabilities and Constraints

- Today (M0): marketing, design system, app shell, BOM import and demo comparisons on sample part
  records, and a design wizard that validates inputs and builds the prompt without calling a model.
- Later: datasheet extraction and RAG, key storage, live comparison runs, printable reports from
  real datasheets, and design runs that return real KiCad and Onshape files.
- Replacement judgement words: Drop-in, Rework, Not acceptable.
- Status words: Approved, Pending, Warning, NRND, EOL, Obsolete, Rejected, Restricted, Proposed.
- Never invent prices, stock or datasheet numbers. Missing values are shown as missing.
- Undecided: pricing amounts, any Revuu fee on design runs, data residency region.

## Brand Commitments

- Name: Revuu (always this casing).
- Inspired by the editorial confidence of figma.com, but with a distinct identity: no Figma logo,
  brand assets, icons, fonts or copy.
- Voice: `/revuu-tone` skill (plain engineering language, one idea per screen, no AI filler).

## Evidence on Hand

None yet. No customers, logos, testimonials, metrics or case studies exist. Do not fabricate
them; use clearly marked placeholders.

## Product Principles

1. The original is the reference. Every candidate is judged against the design it must fit.
2. Every number has a source page. Missing is shown as missing, never estimated.
3. A judgement comes with the checks that prove it, written as tests an engineer can run.
4. Dense, not cluttered: engineers prefer more data per screen when it is aligned and scannable.
5. Expensive runs happen once, and only on a complete brief.
6. Data shows its source and age; never present stale distributor data as live.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast on every token pair, visible focus, full keyboard operation of dense tables,
status never conveyed by color alone, reduced-motion support.
