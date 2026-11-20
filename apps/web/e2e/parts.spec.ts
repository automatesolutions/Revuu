import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { expectNoAxeViolations, expectNoHorizontalScroll, setTheme } from "./helpers";

const demoCsv = path.join(__dirname, "../src/fixtures/parts/power-board-rev-c-demo.csv");

/** Confirms the guessed columns, sets D2 (no category word) to Electronic, and creates the parts. */
async function confirmColumns(page: Page) {
  await expect(page.getByRole("heading", { level: 1, name: "Confirm the columns" })).toBeVisible();
  await expect(page.getByLabel("Manufacturer Part Number")).toHaveValue("mpn");
  await expect(page.getByLabel("Category", { exact: true })).toHaveValue("category");
  await expect(page.getByLabel("Footprint")).toHaveValue("");
  const create = page.getByRole("button", { name: "Create 11 parts" });
  await expect(create).toBeDisabled();
  await page
    .getByRole("group", { name: /Category for D2/ })
    .getByText("Electronic")
    .click();
  await expect(create).toBeEnabled();
  await create.click();
  await expect(page.getByRole("heading", { level: 1, name: "Parts" })).toBeVisible();
  await expect(page.getByText("11 parts created")).toBeVisible();
  await expect(page.getByText("1 skipped.", { exact: false })).toBeVisible();
  await expect(page.getByText(/Row 13\s*TP1–TP4: skipped, missing MPN\./)).toBeVisible();
}

for (const theme of ["light", "dark"] as const) {
  test(`demo list imports and Q3 compares with three alternates (${theme})`, async ({ page }) => {
    await setTheme(page, theme);
    await page.goto("/app/parts");
    await expect(page.getByRole("heading", { name: "No parts list yet." })).toBeVisible();
    await expectNoAxeViolations(page);

    await page.getByRole("button", { name: "Load Power board Rev C, demo" }).click();
    await expect(page.getByText("Demo data").filter({ visible: true })).toBeVisible();
    await expectNoAxeViolations(page);
    await confirmColumns(page);
    await expect(page.getByRole("radio", { name: "Mechanical 3" })).toBeVisible();
    await expectNoHorizontalScroll(page);

    // Enter on a row opens the comparison.
    await page.getByRole("gridcell", { name: "Q3", exact: true }).click();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/app\/parts\/row-6$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Alternates for IRLML6402TRPBF" }),
    ).toBeVisible();
    await expect(page.getByText("Demo data").filter({ visible: true })).toBeVisible();

    const table = page.getByRole("table");
    await expect(table.getByRole("columnheader")).toHaveCount(4);
    for (const mpn of ["DMP2035U-7", "SI2343CDS-T1-GE3", "AO3401A"]) {
      await expect(table.getByRole("columnheader", { name: new RegExp(mpn) })).toBeVisible();
    }
    await expect(
      table.getByRole("img", { name: "Differs from the original" }).first(),
    ).toBeVisible();
    await expect(
      table.getByText(
        "Vds is −30 V against a −20 V original. Confirm the gate threshold at your gate drive voltage.",
      ),
    ).toHaveCount(2);
    await expect(
      table.getByText(
        "Current (Id) is −3.6 A against a −3.7 A original. Confirm the peak load current.",
      ),
    ).toBeVisible();

    // Package dimensions, functional specs and a drawn outline for every part.
    await expect(table.getByRole("rowheader", { name: "Lead pitch" })).toBeVisible();
    await expect(table.getByRole("rowheader", { name: "Vgs(th), max" })).toBeVisible();
    await expect(table.getByRole("img", { name: /^Top view outline of / })).toHaveCount(4);

    // Each alternate has a judgement, checks to run and a cost difference.
    // Once in the column header, once in the judgement row.
    await expect(table.getByText("Drop-in", { exact: true })).toHaveCount(6);
    await expect(table.getByRole("rowheader", { name: "Checks to run" })).toBeVisible();
    await expect(
      table.getByText("Overlay both land patterns from the datasheets before you change the BOM."),
    ).toHaveCount(3);
    await expect(table.getByText("−$0.31 per unit (−82 %)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Print report" })).toBeVisible();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download sheet" }).click();
    expect((await download).suggestedFilename()).toBe(
      "compare_IRLML6402TRPBF_vs_DMP2035U-7_vs_SI2343CDS-T1-GE3_vs_AO3401A.csv",
    );

    // Diodes Inc. email comes from the imported list; Vishay's from the vendor record.
    const diodesEmail = table.getByRole("link", { name: "sales@diodes.example" });
    await expect(diodesEmail).toBeVisible();
    await expect(diodesEmail.locator("xpath=..")).toContainText("Imported list");
    await expect(table.getByRole("link", { name: "sales@vishay.example" })).toBeVisible();

    // Q3's own line has no vendor email in the file.
    await expect(
      page.getByText("No vendor email in this list.").filter({ visible: true }),
    ).toBeVisible();
    await expectNoHorizontalScroll(page);
    await expectNoAxeViolations(page);
  });
}

test("a PDF is rejected with the parts list message", async ({ page, request }) => {
  await page.goto("/app/parts");
  await page.getByLabel("Parts list file").setInputFiles({
    name: "power-board-schematic.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.7\n"),
  });
  await expect(page.getByText("Revuu reads a CSV or Excel parts list.")).toBeVisible();
  await expect(
    page.getByText("Export it from Altium, KiCad, OrCAD, or your mechanical spreadsheet."),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "No parts list yet." })).toBeVisible();

  // The server refuses it too.
  const response = await request.post("/api/parts/import", {
    multipart: {
      file: { name: "board.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.7\n") },
    },
  });
  expect(response.status()).toBe(415);
  expect((await response.json()).error).toBe(
    "Revuu reads a CSV or Excel parts list. Export it from Altium, KiCad, OrCAD, or your mechanical spreadsheet.",
  );
});

test("an uploaded CSV line with no vendor email says so", async ({ page }) => {
  await page.goto("/app/parts");
  await page.getByLabel("Parts list file").setInputFiles(demoCsv);
  await confirmColumns(page);

  // Find alternates works with exactly one line selected.
  const findAlternates = page.getByRole("button", { name: "Find alternates" });
  await expect(findAlternates).toBeDisabled();
  await page
    .getByRole("row")
    .filter({ hasText: "TPS62133RGTR" })
    .getByRole("gridcell", { name: "Not selected" })
    .click();
  await findAlternates.click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Alternates for TPS62133RGTR" }),
  ).toBeVisible();
  await expect(
    page.getByText("No vendor email in this list.").filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "No alternates for this MPN yet." }),
  ).toBeVisible();
});

test("the mechanical standoff has two Rework alternates", async ({ page }) => {
  await page.goto("/app/parts");
  await page.getByRole("button", { name: "Load Power board Rev C, demo" }).click();
  await confirmColumns(page);
  await page.getByRole("radio", { name: /Mechanical/ }).click();
  await page.getByRole("gridcell", { name: "SO1–SO4", exact: true }).dblclick();
  await expect(
    page.getByRole("heading", { level: 1, name: "Alternates for HSO-M3X10-BR-NI" }),
  ).toBeVisible();
  const table = page.getByRole("table");
  await expect(table.getByText("Rework", { exact: true })).toHaveCount(4);
  await expect(table.getByRole("img", { name: /^Side view outline of HSO-M3X12/ })).toBeVisible();
  await expect(
    table.getByText("Length is 12 mm against a 10 mm original. Confirm the stack height."),
  ).toBeVisible();
  // The standoff line has no email, but the vendor record for Calder Supply does.
  await expect(
    page.getByText("No vendor email in this list.").filter({ visible: true }),
  ).toBeVisible();
  const calder = table.getByRole("link", { name: "quotes@calder.example" });
  await expect(calder.locator("xpath=..")).toContainText("Vendor record");
});

test("a new comparison checks every part before it can run", async ({ page }) => {
  await page.goto("/app/parts/new");
  await expect(page.getByRole("heading", { level: 1, name: "Compare parts" })).toBeVisible();
  await page.getByRole("button", { name: "Check comparison" }).click();
  await expect(page.getByText("Enter the MPN of the original.")).toBeVisible();
  await expect(page.getByText("Enter the MPN of candidate 1.")).toBeVisible();

  const original = page.getByRole("group", { name: "Original" });
  await original.getByLabel("MPN").fill("IRLML6402TRPBF");
  await original.getByLabel("Maker").fill("Infineon");
  const candidate = page.getByRole("group", { name: "Candidate 1" });
  await candidate.getByLabel("MPN").fill("DMP2035U-7");
  await candidate.getByLabel("Maker").fill("Diodes Inc.");
  await page.getByRole("button", { name: "Check comparison" }).click();

  await expect(
    page.getByRole("heading", { name: "The comparison is complete and ready to run" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Run comparison" })).toBeDisabled();
  await expect(page.getByText("Revuu called no model and read no datasheet.")).toBeVisible();
  await expectNoAxeViolations(page);
});
