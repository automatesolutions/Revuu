import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export async function setTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((t) => localStorage.setItem("revuu-theme", t), theme);
}

/** WCAG 2.2 A and AA. Fails with a readable list of rule ids and targets. */
export async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const summary = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes
        .map((n) => n.target.join(" "))
        .slice(0, 5)
        .join(", ")}`,
  );
  expect(summary, summary.join("\n")).toEqual([]);
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}
