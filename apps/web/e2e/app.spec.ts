import { expect, test } from "@playwright/test";
import { expectNoAxeViolations, expectNoHorizontalScroll, setTheme } from "./helpers";

for (const theme of ["light", "dark"] as const) {
  test(`dashboard renders with no axe violations (${theme})`, async ({ page }) => {
    await setTheme(page, theme);
    await page.goto("/app");
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Open comparisons" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Parts that need an alternate" })).toBeVisible();
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
  await expect(palette.getByRole("option")).toHaveCount(3);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/app\/parts$/);
  await expect(page.getByRole("heading", { name: "No parts list yet." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Parts", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("the nav has two jobs, settings render and removed sections 404", async ({ page }) => {
  await page.goto("/app/settings");
  await expect(page.getByRole("heading", { level: 1, name: "Settings" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save key" }).first()).toBeDisabled();
  await expectNoAxeViolations(page);
  // The product is part comparison plus hardware design; there is no review or AVL module.
  for (const name of ["Reviews", "Projects", "Approved Parts List"]) {
    await expect(page.getByRole("link", { name })).toHaveCount(0);
  }
  // The app shell streams first, so Next keeps a 200 and marks the page noindex.
  await page.goto("/app/avl");
  await expect(page.getByRole("heading", { name: "This page doesn’t exist" })).toBeVisible();
  await page.goto("/app/reviews");
  await expect(page.getByRole("heading", { name: "This page doesn’t exist" })).toBeVisible();
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
  await drawer.getByRole("link", { name: "Design" }).click();
  await expect(page).toHaveURL(/\/app\/design$/);
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

test("a design run is refused until the brief is complete, then runs once", async ({ page }) => {
  await page.goto("/app/design");
  await expect(page.getByRole("heading", { name: "No design run yet." })).toBeVisible();
  await page.getByRole("link", { name: "Start a design" }).first().click();
  await expect(page).toHaveURL(/\/app\/design\/new$/);

  await page.getByRole("button", { name: /Confirm run/ }).click();
  const run = page.getByRole("button", { name: "Run design once" });
  await expect(run).toBeDisabled();
  await expect(page.getByText("Revuu will not run until these are filled")).toBeVisible();

  await page.getByRole("button", { name: /^1 Project/ }).click();
  await page.getByLabel("Project title (required)").fill("Sensor hub Rev B");
  await page.getByLabel("Project description (required)").fill("Reads 4 sensors.");
  await page.getByLabel("Product specification (required)").fill("24 V in, RS-485.");
  await page.getByRole("button", { name: /^3 Outputs and standards/ }).click();
  await page.getByText("KiCad schematic", { exact: true }).click();
  await page.getByText("OpenAI API key", { exact: true }).click();
  await page.getByRole("button", { name: "Next: confirm run" }).click();

  await expect(page.getByText("Every field the chosen outputs need is filled.")).toBeVisible();
  await expectNoAxeViolations(page);
  await run.click();
  await expect(
    page.getByRole("heading", { name: "Sensor hub Rev B: brief accepted, no files made" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Download KiCad schematic" })).toBeDisabled();

  // The server refuses an incomplete brief too.
  const response = await page.request.post("/api/design/runs", { data: { title: "x" } });
  expect(response.status()).toBe(422);
});
