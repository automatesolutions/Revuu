---
version: alpha
name: Revuu
description: "Lab bench, not boardroom. A warm-white, graphite-ink editorial frame for hardware design review: confident Cabinet Grotesk display type, calm Satoshi UI text, and large color-block panels drawn from PCB materials (solder mask, FR4, silkscreen, copper, board navy). Marketing pages tell the story in blocks; the app is dense, aligned and quiet, with status carried by icon + label chips."

colors:
  canvas: "#FBFAF7"
  surface: "#F3F1EC"
  raised: "#FFFFFF"
  sunken: "#ECE9E2"
  hairline: "#E4E1DA"
  hairline-strong: "#CFCAC0"
  border-input: "#858991"
  ink: "#0F1115"
  ink-muted: "#4A4F59"
  ink-subtle: "#62666F"
  primary: "#0F1115"
  primary-hover: "#2A2E36"
  on-primary: "#FBFAF7"
  accent: "#A84B17"
  accent-strong: "#8C3C0F"
  on-accent: "#FFFFFF"
  focus: "#C2581C"
  block-solder: "#CFE6D2"
  block-fr4: "#EFE6CC"
  block-silk: "#E6E3F5"
  block-copper: "#F4D9C6"
  block-board: "#14213D"
  on-block-board: "#F3F1EC"
  status-approved: "#137137"
  status-approved-bg: "#DDF3E4"
  status-warning: "#7F4B00"
  status-warning-bg: "#FFF0D1"
  status-eol: "#6235C2"
  status-eol-bg: "#ECE5FB"
  status-rejected: "#B42318"
  status-rejected-bg: "#FDE3E1"
  status-pending: "#3B5BA5"
  status-pending-bg: "#E3EAF8"
  dark-canvas: "#0E1014"
  dark-surface: "#161920"
  dark-raised: "#1D2129"
  dark-hairline: "#2A2F38"
  dark-border-input: "#6B727E"
  dark-ink: "#ECEAE4"
  dark-ink-muted: "#B0B4BC"
  dark-ink-subtle: "#8F949D"
  dark-accent: "#F0955C"
  dark-status-approved: "#6AD496"
  dark-status-approved-bg: "#10291A"
  dark-status-warning: "#F2B65A"
  dark-status-warning-bg: "#2D2210"
  dark-status-eol: "#BFA6F7"
  dark-status-eol-bg: "#241A3D"
  dark-status-rejected: "#FF8F85"
  dark-status-rejected-bg: "#351714"
  dark-status-pending: "#97B3F2"
  dark-status-pending-bg: "#16213A"

typography:
  display-xl:
    fontFamily: Cabinet Grotesk
    fontSize: 80px
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Cabinet Grotesk
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: -0.025em
  display-md:
    fontFamily: Cabinet Grotesk
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: -0.025em
  headline:
    fontFamily: Cabinet Grotesk
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  title:
    fontFamily: Cabinet Grotesk
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  page-title:
    fontFamily: Cabinet Grotesk
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Satoshi
    fontSize: 19px
    fontWeight: 450
    lineHeight: 1.5
    letterSpacing: -0.005em
  subtitle:
    fontFamily: Satoshi
    fontSize: 17px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: 0
  body:
    fontFamily: Satoshi
    fontSize: 16px
    fontWeight: 450
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: Satoshi
    fontSize: 14px
    fontWeight: 450
    lineHeight: 1.5
    letterSpacing: 0
  ui:
    fontFamily: Satoshi
    fontSize: 13px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0.005em
  label:
    fontFamily: Satoshi
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.005em
  button:
    fontFamily: Satoshi
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12.5px
    fontWeight: 450
    lineHeight: 20px
    letterSpacing: 0
    fontFeature: zero
  caption:
    fontFamily: Satoshi
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.02em
  micro:
    fontFamily: Satoshi
    fontSize: 11px
    fontWeight: 450
    lineHeight: 16px
    letterSpacing: 0.01em

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 16px
  xl: 24px
  pill: 999px

spacing:
  hair: 1px
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px
  section-lg: 128px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
    height: 36px
  button-primary-marketing:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 22px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
    height: 36px
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-danger:
    backgroundColor: "{colors.status-rejected}"
    textColor: "{colors.raised}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    size: 32px
  text-input:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    height: 36px
  chip-approved:
    backgroundColor: "{colors.status-approved-bg}"
    textColor: "{colors.status-approved}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  chip-warning:
    backgroundColor: "{colors.status-warning-bg}"
    textColor: "{colors.status-warning}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  chip-eol:
    backgroundColor: "{colors.status-eol-bg}"
    textColor: "{colors.status-eol}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  chip-rejected:
    backgroundColor: "{colors.status-rejected-bg}"
    textColor: "{colors.status-rejected}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  chip-pending:
    backgroundColor: "{colors.status-pending-bg}"
    textColor: "{colors.status-pending}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  card:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  data-table-row:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.xs}"
    height: 36px
  data-table-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    height: 32px
  block-solder:
    backgroundColor: "{colors.block-solder}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: 64px
  block-fr4:
    backgroundColor: "{colors.block-fr4}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: 64px
  block-silk:
    backgroundColor: "{colors.block-silk}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: 64px
  block-copper:
    backgroundColor: "{colors.block-copper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: 64px
  block-board:
    backgroundColor: "{colors.block-board}"
    textColor: "{colors.on-block-board}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: 64px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 64px
  app-sidebar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.ui}"
    width: 248px
  focus-ring:
    textColor: "{colors.focus}"
    width: 2px
    offset: 2px
---

# Revuu design system

Source of truth for tokens is `packages/ui/src/tokens.css` (CSS custom properties), mirrored in
`packages/ui/src/tokens.ts` for tooling. `pnpm check:contrast` fails CI when the two drift or when
any paired token misses WCAG AA. Change values with `/tweak`, then bake.

## 1. Reference: Figma design system summary

Read from [VoltAgent awesome-design-md, figma/DESIGN.md](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/figma)
and figma.com (Oct 2026). Inspiration only: no Figma logo, assets, icons, fonts or copy are used.

- **Color:** monochrome core (black `#000` ink and primary, white canvas) with oversized pastel
  color-block sections that carry the story: lime `#dceeb1`, lilac `#c5b0f4`, cream `#f4ecd6`,
  mint `#c8e6cd`, pink `#efd4d4`, coral `#f3c9b6`, navy `#1f1d3d`. One magenta `#ff3d8b` promo CTA per
  page. Hairlines `#e6e6e6` and `#f1f1f1`. No mid-gray body text: weight carries hierarchy.
- **Type:** proprietary variable sans at fine weights (320 to 700), mono for uppercase eyebrows and
  captions. Scale 86 / 64 / 26 / 24 / 20 / 18 / 16 / 12 px. Display tracking -1.72 px at 86 px, line
  height 1.0 to 1.1. Body line height 1.4 to 1.45.
- **Spacing:** 8 px base: 4, 8, 12, 16, 24, 32, 48, 96 (section rhythm). Max content width about 1280 px.
- **Radius:** 2, 6, 8, 24, 32 px, pill (50 px) for every CTA, full circle for icon buttons.
- **Elevation:** flat by default; hairline borders; one soft shadow `0 4px 16px rgba(0,0,0,.06)` for
  menus; scrim behind modals. Color blocks replace shadows as the depth device.
- **Components:** pill primary / secondary / text buttons, 40 px circular icon buttons, pill tab
  toggle (selected = primary surface), 8 px inputs with focus ring, hairline pricing cards,
  color-block sections, black marquee strip, dense footer.
- **Motion:** not documented beyond lazy scroll reveals.

## 2. What Revuu keeps, and what it changes

| Kept from the reference                     | Revuu's own move                                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| Monochrome core with color blocks for story | Warm white `#FBFAF7` and graphite `#0F1115`, never pure black and white             |
| One saturated accent, used rarely           | Copper `#A84B17` for links and focus, from PCB copper                               |
| Pastel blocks                               | Blocks named for board materials: solder mask, FR4, silkscreen, copper, board navy  |
| Weight-led hierarchy                        | Two faces: Cabinet Grotesk (display) + Satoshi (UI), JetBrains Mono only for data   |
| Pills on marketing CTAs                     | App buttons use 8 px radius: dense UI should not feel bubbly                        |
| Uppercase mono eyebrows                     | Dropped. Headings carry their own weight; mono is reserved for MPNs and designators |
| Flat, shadow-light surfaces                 | Same, plus status chips that always pair icon + label                               |

Physical scene: engineers at a desk in an office or lab, daytime light, reading schematics and BOMs
for long stretches next to an ECAD tool. Light theme is the default; dark is a full peer for late
sessions and dark-themed ECAD setups.

## 3. Color

Color strategy: **Restrained** in the app (warm neutrals + copper + status colors doing real jobs),
**Full palette** on marketing (one material block per story section, never two blocks in one viewport).

### Neutrals (light / dark)

| Token             | Light     | Dark      | Use                                          |
| ----------------- | --------- | --------- | -------------------------------------------- |
| `canvas`          | `#FBFAF7` | `#0E1014` | Page background                              |
| `surface`         | `#F3F1EC` | `#161920` | Sidebar, table header, quiet panels          |
| `raised`          | `#FFFFFF` | `#1D2129` | Cards, table body, inputs, popovers          |
| `sunken`          | `#ECE9E2` | `#0A0B0E` | Wells, code, empty-state frames              |
| `hairline`        | `#E4E1DA` | `#2A2F38` | Dividers, card borders (decorative)          |
| `hairline-strong` | `#CFCAC0` | `#3A404B` | Table grid, emphasized dividers              |
| `border-input`    | `#858991` | `#6B727E` | Input and checkbox borders (3:1 UI contrast) |
| `ink`             | `#0F1115` | `#ECEAE4` | Primary text                                 |
| `ink-muted`       | `#4A4F59` | `#B0B4BC` | Secondary text, table headers                |
| `ink-subtle`      | `#62666F` | `#8F949D` | Metadata, timestamps (still 4.5:1)           |

### Brand and interaction

| Token           | Light     | Dark      | Use                                          |
| --------------- | --------- | --------- | -------------------------------------------- |
| `primary`       | `#0F1115` | `#ECEAE4` | Primary buttons, selected tabs               |
| `primary-hover` | `#2A2E36` | `#FFFFFF` | Primary hover                                |
| `accent`        | `#A84B17` | `#F0955C` | Links, active nav marker, key data highlight |
| `focus`         | `#C2581C` | `#F0955C` | 2 px focus ring, 2 px offset                 |

### Material blocks (marketing and onboarding only)

| Token          | Light     | Dark      | Story it carries                |
| -------------- | --------- | --------- | ------------------------------- |
| `block-solder` | `#CFE6D2` | `#18291D` | Reviews and checklists          |
| `block-fr4`    | `#EFE6CC` | `#2A2518` | Parts and BOM intelligence      |
| `block-silk`   | `#E6E3F5` | `#211F38` | Collaboration and comments      |
| `block-copper` | `#F4D9C6` | `#2F1E14` | Sign-off and release            |
| `block-board`  | `#14213D` | `#1A2B4F` | Security, closing CTA (inverse) |

### Status colors

Status is never color alone: every chip carries an icon and its exact word.

| Status           | Icon (Lucide)    | Text light     | Background light | Text dark      | Background dark |
| ---------------- | ---------------- | -------------- | ---------------- | -------------- | --------------- |
| Approved         | `circle-check`   | `#137137`      | `#DDF3E4`        | `#6AD496`      | `#10291A`       |
| Warning / NRND   | `triangle-alert` | `#7F4B00`      | `#FFF0D1`        | `#F2B65A`      | `#2D2210`       |
| EOL / Obsolete   | `hourglass`      | `#6235C2`      | `#ECE5FB`        | `#BFA6F7`      | `#241A3D`       |
| Rejected         | `circle-x`       | `#B42318`      | `#FDE3E1`        | `#FF8F85`      | `#351714`       |
| Pending          | `circle-dashed`  | `#3B5BA5`      | `#E3EAF8`        | `#97B3F2`      | `#16213A`       |
| Restricted (AVL) | `lock`           | warning colors | warning colors   | warning colors | warning colors  |
| Proposed (AVL)   | `circle-dot`     | pending colors | pending colors   | pending colors | pending colors  |

EOL uses violet, not red, because a lifecycle state is a fact about a part, while Rejected is a
decision by the team. The two must never be confused at a glance.

## 4. Typography

Fonts (all self-hosted from the official files, unmodified):

- **Cabinet Grotesk** (Fontshare, ITF Free Font License): display and headings. Weight 700 is the
  house display weight; 500 for large quiet subheads.
- **Satoshi** (Fontshare, ITF FFL): body and UI. Variable 300 to 900. Supports `tnum` (tabular
  figures) and `zero` (slashed zero); numeric table columns use `font-variant-numeric: tabular-nums`.
- **JetBrains Mono** (SIL OFL 1.1): MPNs, designators, net names, file names. Never in prose, never
  as decoration.

Licence notes: the ITF FFL allows commercial use, self-hosting and embedding in our own site and
app. It forbids modifying, subsetting or converting the font files, and offering the fonts to
third parties as selectable fonts. Release report PDFs therefore use OFL fonts (Inter Tight and
JetBrains Mono) until ITF confirms in writing that embedding Cabinet Grotesk or Satoshi in
customer-generated PDFs is covered by section 03. Licence texts live in `licenses/fonts/`.

| Token        | Face            | Size / line | Weight | Tracking | Use                                        |
| ------------ | --------------- | ----------- | ------ | -------- | ------------------------------------------ |
| `display-xl` | Cabinet Grotesk | 80 / 0.98   | 700    | -0.03em  | Marketing hero (clamps to 44 px on mobile) |
| `display-lg` | Cabinet Grotesk | 56 / 1.02   | 700    | -0.025em | Marketing section openers                  |
| `display-md` | Cabinet Grotesk | 44 / 1.04   | 700    | -0.025em | Hero on phones                             |
| `headline`   | Cabinet Grotesk | 32 / 1.1    | 700    | -0.02em  | Block titles, empty-state titles           |
| `page-title` | Cabinet Grotesk | 26 / 1.15   | 700    | -0.015em | App page titles                            |
| `title`      | Cabinet Grotesk | 22 / 1.2    | 700    | -0.01em  | Card and panel titles                      |
| `body-lg`    | Satoshi         | 19 / 1.5    | 450    | -0.005em | Marketing lead paragraphs                  |
| `subtitle`   | Satoshi         | 17 / 28     | 700    | 0        | Step and list-item titles in prose         |
| `body`       | Satoshi         | 16 / 1.55   | 450    | 0        | Default prose                              |
| `body-sm`    | Satoshi         | 14 / 1.5    | 450    | 0        | App prose, comments, forms                 |
| `ui`         | Satoshi         | 13 / 20     | 500    | 0.005em  | Dense tables, sidebars, menus              |
| `label`      | Satoshi         | 13 / 1.3    | 600    | 0.005em  | Field labels, chips                        |
| `button`     | Satoshi         | 15 / 1.2    | 600    | 0        | Buttons (13 px in dense toolbars)          |
| `caption`    | Satoshi         | 12 / 1.3    | 600    | 0.02em   | Table headers, metadata                    |
| `micro`      | Satoshi         | 11 / 16     | 450    | 0.01em   | Key hints, inline mini-labels; never prose |
| `data-mono`  | JetBrains Mono  | 12.5 / 20   | 450    | 0        | MPNs, designators                          |

Rules: prose measure 60 to 72 ch. Headings use `text-wrap: balance`; paragraphs `text-wrap: pretty`.
More space above a heading than below it. No tracking tighter than -0.03em.

## 5. Spacing, layout, radius, elevation

- **Spacing:** 4 px grid. Steps 2, 4, 8, 12, 16, 24, 32, 48, 96, 128 px. Marketing sections are
  96 px apart (128 px around block sections on desktop). App panels use 16 and 24 px.
- **Layout:** marketing max width 1200 px content, 1320 px for block sections; gutters 24 px mobile,
  48 px desktop. App: 248 px sidebar, fluid content, 56 px top bar, tables go full width.
- **Radius:** 4 px chips and table cells, 6 px small controls, 8 px buttons and inputs, 16 px cards
  and popovers, 24 px color blocks, pill for marketing CTAs and segmented toggles only.
- **Elevation:** declare once per element, border or shadow, never both.
  - Level 0: flat (blocks, page).
  - Level 1: 1 px `hairline` border (cards, tables, inputs).
  - Level 2: `0 8px 24px -8px rgb(15 17 21 / 0.18), 0 2px 6px -2px rgb(15 17 21 / 0.08)`, no border
    (menus, popovers, command palette).
  - Level 3: level 2 shadow plus `scrim` behind (dialogs).

## 6. Components

| Component                 | Spec                                                                                                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                    | Variants primary, secondary (raised + hairline-strong border), ghost, accent, danger. Sizes sm 28 px, md 36 px, lg 48 px (marketing, pill). Icon gap 8 px. Loading replaces the icon with a spinner and keeps the label.                                                  |
| IconButton                | 32 px square, 8 px radius, visible label via `aria-label` and tooltip.                                                                                                                                                                                                    |
| Input / Select / Textarea | 36 px, raised background, `border-input` border, 8 px radius, focus ring replaces nothing (border stays). Error: rejected border + message below with icon.                                                                                                               |
| StatusChip                | 22 px tall, 4 px radius, icon 14 px + exact status word. Sizes sm (20 px) for table cells.                                                                                                                                                                                |
| LifecycleBadge            | StatusChip mapped from lifecycle (Active = approved, NRND = warning, LTB = warning, EOL / Obsolete = eol, Unknown = pending) plus source and age in a tooltip ("DigiKey, 3 h ago").                                                                                       |
| Card                      | Raised, 1 px hairline, 16 px radius, 24 px padding. Never nested.                                                                                                                                                                                                         |
| DataTable                 | Dense grid: 36 px rows (32 px compact), sticky surface header with caption type, tabular numerals, mono MPN column, right-aligned numbers, row hover `surface`, selected row 2 px inset accent bar on the first cell only. Full keyboard grid navigation (see section 8). |
| DiffCell                  | Comparison cell; when a value differs from the baseline part, background `status-warning-bg` and a "differs" icon, never color alone.                                                                                                                                     |
| CommentThread             | Avatar 24 px, name + timestamp in caption, body-sm text, mentions in accent, resolved state collapses the thread.                                                                                                                                                         |
| ChecklistItem             | Status chip, title, assignee avatar, comment count; expands inline.                                                                                                                                                                                                       |
| SignoffGate               | List of required reviews with status; primary action disabled with the reason written beside it until all are approved.                                                                                                                                                   |
| EmptyState                | Sunken frame, simple SVG diagram, headline, one sentence, one primary action.                                                                                                                                                                                             |
| ErrorState                | Says what failed, what Revuu does next (retry time), and one action. Shows data age when stale data is still visible.                                                                                                                                                     |
| Skeleton                  | Surface-colored blocks matching the final layout, shimmer disabled under reduced motion.                                                                                                                                                                                  |
| CommandPalette            | Level 2 elevation, 640 px wide, opens with Ctrl/Cmd+K.                                                                                                                                                                                                                    |

## 7. Iconography and illustration

- One icon pack: **Lucide** via Iconify (`@iconify-json/lucide`, ISC licence), rendered as CSS icons
  through `@iconify/tailwind4` (class `icon-[lucide--name]`). 1.5 px stroke look, 16 px in dense UI,
  20 px default. Never mix packs, never emoji or Unicode glyphs as icons.
- Logos, diagrams and illustrations are authored SVG: crisp geometry (board outlines, traces, pads,
  checklists), no sketch effects, no fake 3D.
- The Revuu mark: a rounded board outline with a single check-shaped trace ending in a via.

## 8. Accessibility

- WCAG 2.2 AA on every token pair (checked in CI by `pnpm check:contrast`).
- Focus: 2 px `focus` ring with 2 px offset on every interactive element, via `:focus-visible`.
- Status never by color alone (icon + word).
- Dense tables (`role="grid"`): one tab stop; arrow keys move between cells; Home / End jump to row
  start / end; Ctrl+Home / Ctrl+End to first / last cell; PageUp / PageDown move 10 rows; Enter
  opens the row; Space toggles selection; `/` focuses the table filter. Headers carry `aria-sort`;
  virtualized tables set `aria-rowcount` and `aria-rowindex`.
- Touch targets 44 px minimum on touch viewports; dense 28 to 36 px controls are pointer-only layouts.
- Reduced motion: all non-essential motion and the GSAP pinned hero are disabled.
- Theme browser surfaces: `::selection` uses the accent tint, `caret-color` accent, scrollbars use
  hairline-strong on surface.

## 9. Motion

- **App:** fast and subtle. 80 ms (press), 120 ms (hover, chips), 180 ms (popovers, panels), 280 ms
  (page-level). Easing `cubic-bezier(0.2, 0, 0, 1)` standard, `cubic-bezier(0.16, 1, 0.3, 1)` for
  entrances. Opacity and transform only. No bounce, no parallax.
- **Marketing:** GSAP with ScrollTrigger, marketing routes only. One authored moment: the pinned hero,
  where a revision's review state assembles as you scroll (BOM lines resolve to chips, reviews tick
  to approved, the sign-off gate opens). Elsewhere, sections are visible by default and reveal with
  a short rise, never a hidden-until-JS state.
- `prefers-reduced-motion: reduce` disables the pin and all reveals.

## 10. Copy rules

Full rules live in the `/revuu-tone` skill. The short version:

- One idea per screen. The heading states the screen's one job.
- Plain engineering language: BOM line, MPN, revision, sign-off, NRND, EOL.
- Buttons name the action: "Import BOM", "Request review", "Sign off Rev B".
- No AI filler: no "seamless", "powerful", "next-generation", "supercharge", "unlock", "elevate".
- No invented proof: no fake customers, logos, quotes or numbers. Placeholders are labeled.
- Errors: what failed, what happens next, what you can do.
- Sentence case, US English, numerals for data, units always attached.

Category research (Oct 2026): Altium 365 leads with an aspirational line ("Design the future with
Altium 365"); Flux leads with verb + object + offer ("Design PCBs with AI. Free to start."); Arena PLM
and SiliconExpert lead with category labels and enterprise phrases; Octopart makes the search box the
hero. Revuu takes the direct pattern: task + object, real product above the fold, free start.

## 11. Responsive

| Breakpoint | Width   | Changes                                                                  |
| ---------- | ------- | ------------------------------------------------------------------------ |
| sm         | 640 px  | Single column marketing; CTAs full width; display-xl clamps toward 44 px |
| md         | 768 px  | Blocks lose outer margin and bleed edge to edge                          |
| lg         | 1024 px | App sidebar becomes a drawer below this width                            |
| xl         | 1280 px | Full marketing grid                                                      |

## 12. Do and don't

Do:

- Use one material block per story section, then return to canvas.
- Keep primary buttons scarce: one per view.
- Show data source and age wherever distributor data appears.
- Align numbers right with tabular figures.

Don't:

- Don't put two color blocks in one viewport.
- Don't use eyebrows or kickers above headings.
- Don't nest cards or build pages from identical icon cards.
- Don't use gradient text, glass, or decorative mono.
- Don't use red for EOL or violet for Rejected.
- Don't use raw hex or ad-hoc spacing in components; add a token.

## 13. Known gaps

- Release report PDF typography is pending ITF confirmation (see section 4).
- Gerber and STEP viewer styling is not designed yet (post-launch decision).
- Data visualization palette (price history, stock trends) is not defined yet; due in M4.
