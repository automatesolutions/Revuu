# Revuu

Design review and sign-off for electronics hardware teams. Reviewers check the schematic, PCB
layout and parts of a revision against checklists, with live part data from DigiKey and Mouser.
The revision ships only after every review is approved.

**Status:** milestone M0 (foundations). The marketing site, design system, app shell and a demo
dashboard are live with sample data. Accounts, projects and real reviews arrive in M1 and later.

Live: https://revuu-web-228506430673.asia-southeast1.run.app

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
| `apps/web`        | The Next.js app: marketing site, app shell, artboards             |
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
- `/app`: demo dashboard with sample data.
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

Distributor API keys (Mouser, DigiKey) arrive in M3. They stay on the server and live in
Secret Manager, never in the client bundle or in this repository.

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

## Licences

Cabinet Grotesk and Satoshi are from Fontshare (ITF Free Font License). JetBrains Mono is under
the SIL Open Font License. See `licenses/`.
