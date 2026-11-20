# Revuu

Revuu compares an original part with its alternates, from their datasheets. The default question
is replacement: can this alternate take the original's place on the existing board or assembly,
and what must you check or change first? Hardware design is the second, smaller job: one run on
your own model keys that returns the outputs you ask for.

**Status:** milestone M0 (foundations). The marketing site, design system, app shell and demo parts
screens are live with sample data. Live datasheet RAG, bring-your-own keys, printable comparison
reports from real datasheets and hardware-design runs arrive later. They are not in the code today.

Live: https://revuu-web-228506430673.asia-southeast1.run.app

## What it does

### 1. Part comparison (electronic, mechanical, miscellaneous)

This is the main product. It lives at `/app/parts`.

- **Input:** one original part and 1 to 4 candidates, so 2 to 5 parts in all. For each part: the
  MPN, the maker and the datasheet or catalog PDF. If you have only the MPN, Revuu fetches the
  manufacturer's datasheet.
- **Context:** the original is pinned. Every candidate is compared against it, for the board or
  assembly it already sits on. Add design notes, and ask for a cost comparison if you are doing
  value engineering.
- **Model and RAG:** you bring your own Anthropic key. Revuu reads the extracted datasheet pages
  and cites a page for every number. A value the datasheet does not give is shown as not
  specified, never estimated.
- **Result:** a side-by-side table with every difference marked. Each candidate gets a judgement:
  Drop-in, Rework or Not acceptable. The judgement lists the checks to run, for example "Confirm
  Vgs(th) at your 4.5 V gate drive", not "verify thoroughly". When prices exist, the table shows
  the cost difference. You can print the report to PDF and download the sheet and source
  documents.

In M0 the comparison runs on demo part records. No datasheet is read and no model is called.

### 2. Hardware design (secondary, one run)

This lives at `/app/design`. A run is expensive, so Revuu collects everything first and runs once.

- **Input:** project title and description, product specification, reference designs (files or
  links), PCB size, layer count and stack-up notes, the areas that matter (impedance, safety and
  any others you name), part size limits, enclosure size, the standards to consider (IEC, UL, IPC
  and others) and the outputs you need.
- **Outputs you can pick:** KiCad schematic; KiCad PCB with BOM, pick-and-place (POS) and Gerber
  files; Onshape enclosure; and a design document that explains decisions and remaining risks.
- **Model and RAG:** you bring your own OpenAI key or Astra MCP / API key. Revuu never runs a
  design on a key that Revuu owns. One prompt carries every field and asks the model to handle
  DRC, creepage and clearance, stack-up, thermal, EMI, enclosure fit and BOM availability. RAG
  reads your specification, reference designs and standards notes.
- **Gate:** Revuu refuses to run until the fields required for your chosen outputs are filled,
  and shows the size and risk of the run before you confirm.

In M0 the wizard checks the inputs and builds the prompt on the server, but no model is called.
The results page shows where each file will appear. It does not make KiCad or Onshape files.

Model keys stay on the server. They never ship in the client bundle and are never logged.

## Stack

- Next.js 16 (App Router, Cache Components) with TypeScript in strict mode
- Tailwind CSS v4 with design tokens in `packages/ui/src/tokens.css`
- Iconify Lucide icons, GSAP on the marketing pages only
- Vitest for unit tests, Playwright and axe for end-to-end and accessibility tests
- Google Cloud Run in `asia-southeast1`, images in Artifact Registry
- Planned: Supabase (Postgres, Auth, Storage) with Drizzle, Stripe billing

## Repository layout

| Path              | Contents                                                          |
| ----------------- | ----------------------------------------------------------------- |
| `apps/web`        | The Next.js app: marketing site, app shell, parts, design         |
| `packages/ui`     | Tokens, primitives (Button, DataTable, StatusChip) and UI scripts |
| `packages/config` | Shared TypeScript config                                          |
| `DESIGN.md`       | The design system: tokens, components, accessibility, motion      |
| `PRODUCT.md`      | Users, product purpose, constraints and brand commitments         |
| `.cursor/skills`  | Project skills: `/design`, `/tweak` and `/revuu-tone`             |
| `licenses`        | Font licences and third-party notices                             |

## Get started

You need Node.js 22 and pnpm 9.12.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Useful routes:

- `/`: marketing home. `/pricing`: plans.
- `/app`: dashboard with open comparisons and parts that need an alternate. Sample data.
- `/app/parts`: function 1, part comparison. Import the demo parts list or start a comparison.
- `/app/design`: function 2, hardware design. The wizard checks inputs; no run calls a model yet.
- `/app/settings`: where model keys will connect. Key storage is not live yet.
- `/design-system`: every token and primitive on one page.
- `/artboards`: each screen at 1440, 1024 and 390 px in light and dark. Dev only.

In development, press Alt+T to open the tweak panel. It edits spacing, type and color tokens
live. See `.cursor/skills/tweak/SKILL.md` to write the chosen values back into `tokens.css`.

## Scripts

Run these from the repository root.

| Command               | What it does                                         |
| --------------------- | ---------------------------------------------------- |
| `pnpm dev`            | Starts the dev server                                |
| `pnpm build`          | Builds the web app for production                    |
| `pnpm start`          | Serves the production build                          |
| `pnpm lint`           | Runs ESLint and the UI package type check            |
| `pnpm typecheck`      | Generates route types, then runs `tsc`               |
| `pnpm test`           | Runs the Vitest unit tests                           |
| `pnpm e2e`            | Runs Playwright with axe against a production build  |
| `pnpm check:contrast` | Checks every token color pair against WCAG AA        |
| `pnpm tweak:bake`     | Writes values from the tweak panel into `tokens.css` |
| `pnpm format`         | Formats the repository with Prettier                 |

CI (`.github/workflows/ci.yml`) runs format, lint, type check, contrast, unit tests, build and
end-to-end tests on every pull request.

## Environment variables

| Name               | Where      | Purpose                                                  |
| ------------------ | ---------- | -------------------------------------------------------- |
| `ENABLE_ARTBOARDS` | Production | Set to `1` to serve `/artboards`. Off by default         |
| `NEXT_STANDALONE`  | Build      | Set to `1` for standalone output. The Dockerfile sets it |

Model keys belong to the engineer: Anthropic for part comparison, OpenAI or Astra MCP / API for
hardware design. When key storage arrives, they live in Secret Manager on the server, never in the
client bundle, in logs or in this repository. Distributor API keys (Mouser, DigiKey) are planned
and follow the same rule.

## Deploy

The `Dockerfile` at the root builds a standalone Node 22 image. To deploy by hand:

```bash
TAG=asia-southeast1-docker.pkg.dev/revuu-510915/revuu/web:<tag>
docker build --platform linux/amd64 -t $TAG .
docker push $TAG
gcloud run deploy revuu-web --image=$TAG --region=asia-southeast1 --project=revuu-510915
```

On Windows, standalone output needs symlinks, so build it in Docker, not on the host.

`.github/workflows/deploy.yml` deploys after CI passes on `main`. Before it can run, set up
Workload Identity Federation for the GitHub repository and add two repository variables:
`GCP_WIF_PROVIDER` and `GCP_DEPLOY_SA`.

## Design and copy

- Read `DESIGN.md` before changing UI. Use tokens, not raw values.
- Use `/design` to explore a new screen as artboards before building it.
- Write all user-facing text with `/revuu-tone`. No invented customers, logos or metrics.
- Do not claim live RAG, model runs or production KiCad or Onshape files until that code exists.
  Label demo data as demo data.

## Licences

Cabinet Grotesk and Satoshi are from Fontshare (ITF Free Font License). JetBrains Mono is under
the SIL Open Font License. See `licenses/`.
