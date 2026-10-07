---
name: tweak
description: Fine-tune Revuu spacing, type and color live in the browser, then bake the chosen values into the CSS tokens and DESIGN.md. Use when the user runs /tweak, wants to adjust a token value by eye, compare token values live, or bake tweaked values into tokens.css.
user-invocable: true
---

# /tweak

A dev-only floating panel edits Revuu's CSS custom properties live. Nothing changes in source
until you bake.

## Pieces

- Panel: `apps/web/src/components/dev/tweak-panel.tsx`, mounted by the root layout in development
  only. Toggle it with `Alt+T`, or the "Tweak" button at the bottom right.
- Tweakable tokens: `packages/ui/src/tweakable.ts` lists each token with its control type
  (color, length, number) and range. Add a token there to expose it in the panel.
- Saved values: the panel's "Save" button writes `apps/web/tweaks.json` through the dev-only route
  `POST /api/dev/tweaks`. The route refuses to run outside development.
- Bake: `pnpm tweak:bake` runs `packages/ui/scripts/bake-tweaks.ts`, which writes the values in
  `tweaks.json` into the matching `:root` (light) or `.dark` block of `packages/ui/src/tokens.css`,
  then empties `tweaks.json`.

## Workflow

1. Start `pnpm dev` and open the page or artboard to tune (`/artboards/<id>` is ideal: it shows
   every width and both themes at once).
2. Ask the user what to tune, or let them drive the panel. Values apply instantly, per theme.
3. When the user is happy, they press "Save" (or you call the route with the same JSON).
4. Run `pnpm tweak:bake`, then `pnpm check:contrast`. If contrast fails, report the failing pair
   and suggest the nearest passing value. Do not bake a failing color silently.
5. Update the matching values in `DESIGN.md` (front matter and prose) in the same change.
6. Show the diff of `tokens.css` and `DESIGN.md` to the user.

## Rules

- Tweak tokens, never component classes. If a component needs a new value, add a token first.
- Keep the 4 px spacing grid: lengths snap to 2 px below 16 px, 4 px above.
- Color edits must keep WCAG AA (4.5:1 text, 3:1 large text and UI) against their paired surface.
