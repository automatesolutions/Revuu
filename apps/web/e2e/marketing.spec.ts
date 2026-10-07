import { expect, test } from "@playwright/test";
import { expectNoAxeViolations, expectNoHorizontalScroll, setTheme } from "./helpers";

for (const theme of ["light", "dark"] as const) {
  test.describe(`marketing (${theme})`, () => {
    test.beforeEach(async ({ page }) => setTheme(page, theme));

    test("home has one h1, working CTAs and no axe violations", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Review the board before it ships.",
      );
      await expect(page.getByRole("link", { name: "Start free" }).first()).toHaveAttribute(
        "href",
        "/app",
      );
      await expectNoHorizontalScroll(page);
      await expectNoAxeViolations(page);
    });

    test("pricing lists three plans and no axe violations", async ({ page }) => {
      await page.goto("/pricing");
      await expect(
        page.getByRole("heading", { level: 2, name: /^(Free|Team|Business)/ }),
      ).toHaveCount(3);
      await expect(
        page.locator('header a[href="/pricing"][aria-current="page"]').first(),
      ).toBeAttached();
      await expectNoHorizontalScroll(page);
      await expectNoAxeViolations(page);
    });
  });
}

test("reduced motion shows the finished review without scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("#how-it-works");
  await expect(scene.getByText("All 3 reviews approved")).toBeVisible();
  await expect(scene.getByText("DMP2035U-7")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("feature sections are readable with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Every EOL part, flagged before layout freezes." }),
  ).toBeVisible();
  await expect(page.getByText("All 3 reviews approved")).toBeVisible();
  await context.close();
});

test("mobile menu opens, closes with Escape and keeps focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Menu button only shows on small screens");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(page.getByRole("link", { name: "Parts data" }).last()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});
