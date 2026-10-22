// Usage: node scripts/shoot-frames.mjs <base url> <out dir> <board:state,...> [widths] [themes]
// Screenshots artboard frames at true viewport widths and reports horizontal overflow.
import { chromium } from "@playwright/test";

const [base, out, list, widths = "1440,1024,390", themes = "light,dark"] = process.argv.slice(2);
const browser = await chromium.launch();
for (const item of list.split(",")) {
  const [board, state] = item.split(":");
  for (const theme of themes.split(",")) {
    for (const width of widths.split(",").map(Number)) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      await page.goto(`${base}/artboards/${board}/frame/${theme}/${state}`, {
        waitUntil: "networkidle",
      });
      await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      const file = `${out}/${board}-${state}-${theme}-${width}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(
        `${file} overflow=${overflow}${errors.length ? " errors=" + errors.join(" | ") : ""}`,
      );
      await page.close();
    }
  }
}
await browser.close();
