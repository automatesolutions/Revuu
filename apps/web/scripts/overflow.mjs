// Usage: node scripts/overflow.mjs [baseUrl]. Reports artboard frames that scroll sideways.
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3200";
const boards = {
  "marketing-home": ["default"],
  pricing: ["default"],
  "app-shell": ["default", "command-palette", "placeholder-page"],
  dashboard: ["default", "empty", "loading", "error", "stale"],
};

const browser = await chromium.launch();
let problems = 0;
for (const width of [390, 1024]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const [id, states] of Object.entries(boards)) {
    for (const state of states) {
      await page.goto(`${base}/artboards/${id}/frame/light/${state}`, { waitUntil: "networkidle" });
      const { scroll, client, culprit } = await page.evaluate(() => {
        const client = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll("body *")].find(
          (el) =>
            el.getBoundingClientRect().right > client + 1 &&
            !el.closest("[class*=overflow-x-auto]"),
        );
        return {
          scroll: document.documentElement.scrollWidth,
          client,
          culprit: wide
            ? `${wide.tagName.toLowerCase()}.${String(wide.className).slice(0, 80)}`
            : "",
        };
      });
      if (scroll > client) {
        problems++;
        console.log(`overflow ${width}px ${id}/${state}: ${scroll} > ${client} ${culprit}`);
      }
    }
  }
  await page.close();
}
await browser.close();
console.log(problems ? `${problems} frame(s) overflow` : "No horizontal overflow.");
process.exit(problems ? 1 : 0);
