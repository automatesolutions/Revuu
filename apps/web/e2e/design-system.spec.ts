import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./helpers";

test("design system page has no axe violations", async ({ page }) => {
  await page.goto("/design-system");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Revuu design system");
  await expectNoAxeViolations(page);
});

test("BOM grid works from the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "Dense grid keyboard model is for pointer layouts");
  await page.goto("/design-system");
  const grid = page.getByRole("grid", { name: "Demo BOM, power board Rev C" });
  await grid.scrollIntoViewIfNeeded();

  await page.locator('[data-cell="0:0"]').focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(":focus")).toHaveText("GRM155R71C104KA88D");

  await page.keyboard.press("Space");
  await expect(grid.getByRole("row").nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("1 selected")).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.getByText("Part detail ships in M3.")).toBeVisible();

  await page.keyboard.press("Control+End");
  await expect(page.locator(":focus")).toHaveAttribute("data-cell", "8:9");

  await page.locator("body").press("/");
  await expect(page.getByRole("searchbox", { name: /Filter/ })).toBeFocused();
  await page.keyboard.type("EOL");
  await expect(grid.getByRole("row")).toHaveCount(2);
});
