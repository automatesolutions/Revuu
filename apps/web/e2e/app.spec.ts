import { expect, test } from "@playwright/test";
import { expectNoAxeViolations, expectNoHorizontalScroll, setTheme } from "./helpers";

for (const theme of ["light", "dark"] as const) {
  test(`dashboard renders with no axe violations (${theme})`, async ({ page }) => {
    await setTheme(page, theme);
    await page.goto("/app");
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Waiting on you" })).toBeVisible();
    await expect(page.getByText("Demo workspace with sample data.")).toBeVisible();
    await expectNoHorizontalScroll(page);
    await expectNoAxeViolations(page);
  });
}

test("Ctrl+K opens the command palette and Enter navigates", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard shortcut is for pointer layouts");
  await page.goto("/app");
  await page.locator("main").click({ position: { x: 5, y: 5 } });
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Command palette" });
  await expect(palette).toBeVisible();
  await page.keyboard.type("parts");
  await expect(palette.getByRole("option")).toHaveCount(2);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/app\/parts$/);
  await expect(page.getByRole("heading", { name: "Parts arrive in M3" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Parts", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("placeholder sections render and unknown sections 404", async ({ page }) => {
  await page.goto("/app/avl");
  await expect(
    page.getByRole("heading", { name: "Approved Parts List arrives in M3" }),
  ).toBeVisible();
  await expectNoAxeViolations(page);
  // The app shell streams first, so Next keeps a 200 and marks the page noindex.
  await page.goto("/app/not-a-section");
  await expect(page.getByRole("heading", { name: "This page doesn’t exist" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test("unknown marketing URLs return a real 404", async ({ request }) => {
  const response = await request.get("/no-such-page");
  expect(response.status()).toBe(404);
});

test("navigation drawer opens on small screens", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Drawer replaces the sidebar below 1024 px");
  await page.goto("/app");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const drawer = page.getByRole("dialog", { name: "Navigation" });
  await expect(drawer).toBeVisible();
  await drawer.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/app\/projects$/);
  await expect(drawer).toBeHidden();
});

test("first visit is light even when the OS is dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("radio", { name: "Light" })).toHaveAttribute("aria-checked", "true");
});

test("theme toggle switches and persists the theme", async ({ page, isMobile }) => {
  test.skip(isMobile, "Toggle sits in the top bar from 768 px");
  await page.goto("/app");
  await page.evaluate(() => localStorage.setItem("revuu-theme", "light"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
});
