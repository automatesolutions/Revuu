---
name: design
description: Explore Revuu screens as artboards before implementing them. Renders each screen side by side at 1440, 1024 and 390 px in light and dark themes on one canvas route, using real tokens and components with fixture data. Use when the user runs /design, asks to explore, compare or mock up a screen, or before building any new Revuu page.
user-invocable: true
---

# /design

Artboards are real React screens rendered with Revuu tokens and fixture data, framed at fixed
widths on a single canvas. They replace static mockups: what you approve is what ships.

## Where things live

- Registry: `apps/web/src/artboards/registry.tsx`. One entry per screen:
  `{ id, title, mode: "persuade" | "operate", states?: string[], render(state) }`.
- Screens: `apps/web/src/artboards/screens/<id>.tsx`. Fixture data sits next to the screen.
- Canvas: `/artboards` (index) and `/artboards/<id>` (all widths x themes x states).
- Single frame: `/artboards/<id>/frame/<theme>/<state>`. The canvas embeds these in iframes so
  each frame gets true viewport widths and media queries.

Artboard routes return 404 in production unless `ENABLE_ARTBOARDS=1`.

## Workflow

1. **Brief.** Read `PRODUCT.md`, `DESIGN.md` and `/revuu-tone`. Write a three-line brief in chat:
   the screen's one job, the primary action, and the states it needs (default, empty, loading,
   error, plus any domain states such as "EOL parts present").
2. **Fixtures.** Write realistic engineering data: real-looking MPNs (e.g. `GRM155R71C104KA88D`,
   `TPS62133RGTR`), quantities, designators, prices with units. Never lorem ipsum.
3. **Build the screen** from `@revuu/ui` primitives and tokens only. No raw hex, no ad-hoc spacing.
   If a token is missing, add it to `packages/ui/src/tokens.css` and `DESIGN.md` first.
4. **Register** the screen and its states in the registry.
5. **Review.** Start `pnpm dev`, open `/artboards/<id>`, and screenshot the canvas in the browser.
   Check desktop and mobile frames together in one pass.
6. **Present** the screenshot to the user with the brief and two or three explicit questions
   (hierarchy, density, copy). Do not move the screen into a product route until the user
   approves the artboard.
7. **Promote.** On approval, move the screen into its real route, keeping the artboard as a
   visual-regression fixture. Then run `/impeccable audit <route>` and fix P0 and P1 findings.

## Rules

- One idea per screen. If the brief needs two primary actions, it is two screens.
- Operate screens (app) favor density and scanability. Persuade screens (marketing) may use
  color blocks and display type.
- Every artboard ships with empty, loading and error states, unless the screen cannot have them.
- Status is never color alone: chips carry an icon and a label.
- Use `/tweak` for spacing, type and color fine-tuning on a live artboard, then bake.
