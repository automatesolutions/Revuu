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

Electronics hardware teams that release boards on a schedule:

- **Designers** (schematic and PCB layout engineers) who prepare a revision and answer review comments.
- **Reviewers** (senior hardware, component, mechanical and compliance engineers) who work through
  checklists, raise issues and sign off.
- **Admins** (engineering leads) who own the org, the Approved Parts List (AVL), checklist templates and
  integrations.
- **Viewers** (operations, purchasing, management) who read status and release reports.

Their job: get a hardware revision reviewed and signed off before release, with a record of every decision.

## Product Purpose

Revuu replaces spreadsheets, email threads and scattered PDFs with one place where a hardware
design is reviewed and signed off before release. Success: every release has a complete,
auditable review (schematic, PCB layout, parts, later mechanical and safety/compliance), no EOL or
unapproved part reaches production unnoticed, and the release report is generated, not assembled.

## Positioning

A review and sign-off layer that sits beside any ECAD tool, rather than another ECAD suite or a
heavyweight PLM. It joins checklist-driven reviews with live parts intelligence from distributor
data (price, stock, lifecycle, specs, alternates) in the same revision, so a parts risk is raised
inside the review where the decision is made.

## Operating Context

- Flow: Project > Revision > upload BOM (CSV/XLSX) and files (schematic PDF, Gerbers, STEP) >
  assign reviewers > run reviews > sign-off gate > release report (PDF).
- Engineers live in dense data: BOM tables of hundreds to thousands of lines, MPNs, designators,
  datasheets, parametric specs. Keyboard use is common.
- Review work is collaborative and asynchronous: threaded comments, mentions, multiple reviewers.
- Parts data comes from Mouser (API key) and DigiKey (OAuth2) first; LCSC via CSV import until
  official partner API access is approved. Distributor daily quotas are a hard constraint.

## Capabilities and Constraints

- Review modules: Schematic, PCB layout and Parts first. Mechanical and Safety/Compliance after launch.
- Parts: BOM import, approval workflow, EOL/NRND alerts, alternates, side-by-side spec comparison.
- AVL statuses: Proposed, Approved, Restricted, Rejected.
- Roles: Admin, Reviewer, Designer, Viewer. Audit trail on every decision.
- All distributor API keys stay server-side.
- Undecided: pricing amounts, data residency region, Gerber/STEP inline viewers before launch.

## Brand Commitments

- Name: Revuu (always this casing).
- Inspired by the editorial confidence of figma.com, but with a distinct identity: no Figma logo,
  brand assets, icons, fonts or copy.
- Voice: `/revuu-tone` skill (plain engineering language, one idea per screen, no AI filler).

## Evidence on Hand

None yet. No customers, logos, testimonials, metrics or case studies exist. Do not fabricate
them; use clearly marked placeholders.

## Product Principles

1. The decision lives where the evidence is: comments, part data and sign-off sit on the same revision.
2. Dense, not cluttered: engineers prefer more data per screen when it is aligned and scannable.
3. Every decision is attributable and reversible only through a new recorded decision.
4. Data shows its source and age; never present stale distributor data as live.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast on every token pair, visible focus, full keyboard operation of dense tables,
status never conveyed by color alone, reduced-motion support.
