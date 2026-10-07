---
name: revuu-tone
description: Revuu's voice for every user-facing string, including marketing pages, app UI, buttons, empty states, errors, emails, release report text and docs. Use when the user runs /revuu-tone, when writing or reviewing any copy in the Revuu repo, or when the user corrects Revuu wording (record the correction here).
user-invocable: true
---

# /revuu-tone

Revuu is a design review tool for electronics hardware teams. Readers are hardware, layout,
component and compliance engineers. They read datasheets for a living and distrust marketing.

Apply the layers in order. When two layers disagree, the earlier one wins.

1. Jonel's base voice: read `~/.claude/skills/my-tone/SKILL.md` and apply its banned words,
   ASD-STE100, Google tone and Apple style rules. Ignore its Kumpooni vocabulary ("car owners",
   "service shops", pesos). Revuu vocabulary below replaces it.
2. The Revuu rules in this file.
3. The copy rules section of `DESIGN.md` (kept in sync with this file).

## Revuu rules

- **One idea per screen.** Each screen, section and dialog has one job. The heading says that job.
- **Plain engineering language.** Name the real object: "BOM line", "MPN", "revision", "sign-off".
  Engineers trust the noun they already use.
- **Verb first on actions.** Buttons say what happens: "Import BOM", "Request review",
  "Sign off revision B". Never "Submit", "OK", "Continue" when a specific verb fits.
- **Numbers are data.** Use numerals for quantities, prices, part counts and revisions.
  Keep units with values ("10 µF", "0.8 mm", "$0.042 @ 1k").
- **No AI filler.** No "seamless", "powerful", "next-generation", "AI-powered" (unless a feature
  truly is), "supercharge", "streamline your workflow", "in one place" used as a whole headline.
- **Claims must be checkable.** Say what the product does, not how it feels. No invented
  customer counts, logos, quotes or benchmarks. Use clearly marked placeholders until real
  evidence exists.
- **Errors name the cause and the fix.** "DigiKey did not respond. Revuu retries in 2 minutes.
  Prices shown are from 06:40." Never blame the user.
- **Empty states teach the next step.** Say why it is empty, then give one action.
- **Status words are fixed.** Use exactly: Approved, Pending, Warning, NRND, EOL, Obsolete,
  Rejected, Restricted, Proposed. Never synonyms ("OK", "Bad", "Deprecated").
- **Sentence case** everywhere in UI, including buttons and headings. Product and standard
  names keep their own casing: Revuu, DigiKey, Mouser, LCSC, Octopart, UL 62368-1, IEC, RoHS, REACH.
- **US English**, contractions allowed, Oxford comma.

## Vocabulary

| Use                                    | Avoid                                                |
| -------------------------------------- | ---------------------------------------------------- |
| reviewer, designer, engineer, team     | user, stakeholder, resource                          |
| BOM line                               | item, row (in copy)                                  |
| MPN (manufacturer part number)         | part code, SKU (unless distributor SKU)              |
| revision (Rev A, Rev B)                | version, iteration                                   |
| sign-off, sign off (verb)              | approval flow, green-light                           |
| lifecycle: Active, NRND, EOL, Obsolete | discontinued (unless quoting a source)               |
| alternate part                         | replacement, substitute (except DigiKey's own label) |
| Approved Parts List (AVL)              | whitelist, preferred list                            |
| release report                         | export, summary doc                                  |
| checklist item                         | task, todo                                           |

## What the category does (researched Oct 2026)

- Altium 365: "Design the future with Altium 365." Vague and aspirational, then an app list.
- Flux: "Design PCBs with AI. Free to start." Verb, concrete object, risk-free offer.
- Arena PLM, SiliconExpert: category labels and enterprise phrases ("mitigate risk",
  "single platform", "digital thread").
- Octopart: the search box is the hero. The first screen is the product.

Take from the winners: name the task and the object in under eight words, show the real
product above the fold, offer a free start. Avoid vague futurism and enterprise filler.

## Patterns

- Hero headline: task + object + outcome. "Review the board before it ships."
- Subhead: one sentence, who and how. "Schematic, layout and parts reviews with sign-off,
  for hardware teams that release on a schedule."
- Primary CTA: "Start free". Secondary: "See a sample review".
- Section headings: a statement an engineer would agree with, not a slogan.
  "Every EOL part, flagged before layout freezes."

## Checklist (run on every string)

- Does the heading state this screen's one job?
- Does the button say exactly what happens?
- Is every claim true today, with no invented proof?
- Any banned word from my-tone or the filler list above?
- Are units, status words and product names exact?

## Corrections log

When Jonel corrects Revuu wording, add `YYYY-MM-DD · "before" → "after" · rule` here in the same
turn, and add the general rule above if one is implied.

<!-- YYYY-MM-DD · "before" → "after" · rule -->
