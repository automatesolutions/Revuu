# Third-party assets and code

| Asset | Source | Licence | Where used | Notes |
| --- | --- | --- | --- | --- |
| Cabinet Grotesk (variable woff2) | fontshare.com | ITF Free Font License 2.0 (`fonts/ITF-FFL-CabinetGrotesk.txt`) | Web app and marketing site | Official file, unmodified. No subsetting or conversion. Not offered to customers as a selectable font. |
| Satoshi (variable woff2, roman + italic) | fontshare.com | ITF Free Font License 2.0 (`fonts/ITF-FFL-Satoshi.txt`) | Web app and marketing site | Same restrictions as above. |
| JetBrains Mono (variable, latin) | Fontsource (`@fontsource-variable/jetbrains-mono`) | SIL OFL 1.1 (`fonts/OFL-JetBrainsMono.txt`) | MPNs, designators, data | |
| Lucide icons | `@iconify-json/lucide` | ISC | All UI icons | Single icon pack. |
| GSAP + ScrollTrigger | `gsap` | GSAP Standard "No Charge" License | Marketing routes only | Free for commercial use. |
| Next.js, React, Tailwind CSS | npm | MIT | Everywhere | |
| class-variance-authority, clsx, tailwind-merge | npm | Apache-2.0 / MIT / MIT | `packages/ui` | |

## Component sources reviewed (Oct 2026)

- **reactbits.dev**: MIT + Commons Clause. Allowed inside Revuu; the components themselves may not be
  resold or redistributed. No React Bits component is vendored yet; the marketing hero and logo strip
  were authored in-house because the GSAP scene is product-specific.
- **21st.dev**: no blanket licence; each component carries its own. Vendor only components whose
  upstream source is MIT, and list each one here with its author and URL.
