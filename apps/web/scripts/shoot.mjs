// Usage: node scripts/shoot.mjs <url> <out.png> [light|dark] [width] [full|viewport|<css selector>]
import { chromium } from "@playwright/test";

const [url, out, theme = "light", width = "1440", target = "full"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
  colorScheme: theme,
  deviceScaleFactor: target === "full" ? 1 : 2,
});
await page.addInitScript((t) => localStorage.setItem("revuu-theme", t), theme);
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url, { waitUntil: "networkidle" });
await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
await page.waitForTimeout(400);
if (target === "full") {
  // Trigger scroll reveals, then return to the top so the pinned hero sits at its first step.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}
if (target.startsWith("scroll:")) {
  await page.evaluate((top) => window.scrollTo(0, top), Number(target.slice(7)));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: out });
} else if (target === "full" || target === "viewport") {
  await page.screenshot({ path: out, fullPage: target === "full" });
} else {
  const el = page.locator(target).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await el.screenshot({ path: out });
}
if (errors.length) console.log("console errors:\n" + errors.join("\n"));
await browser.close();
