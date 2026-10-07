// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable, type Column } from "./data-table";

type Line = { id: string; ref: string; mpn: string; qty: number };

const rows: Line[] = [
  { id: "1", ref: "C1", mpn: "GRM155R71C104KA88D", qty: 12 },
  { id: "2", ref: "R4", mpn: "RC0402FR-0710KL", qty: 30 },
  { id: "3", ref: "U2", mpn: "TPS62133RGTR", qty: 1 },
];

const columns: Column<Line>[] = [
  { id: "ref", header: "Ref", cell: (r) => r.ref, value: (r) => r.ref },
  { id: "mpn", header: "MPN", cell: (r) => r.mpn, value: (r) => r.mpn, mono: true },
  { id: "qty", header: "Qty", cell: (r) => r.qty, value: (r) => r.qty, align: "end" },
];

const flush = () => act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(null))));

function setup(props: Partial<React.ComponentProps<typeof DataTable<Line>>> = {}) {
  render(
    <DataTable label="BOM lines" columns={columns} rows={rows} getRowId={(r) => r.id} {...props} />,
  );
  return screen.getByRole("grid", { name: "BOM lines" });
}

afterEach(cleanup);

describe("DataTable", () => {
  it("exposes grid semantics with one tab stop", () => {
    const grid = setup();
    expect(grid).toHaveAttribute("aria-rowcount", "4");
    const tabbable = grid.querySelectorAll('[tabindex="0"]');
    expect(tabbable).toHaveLength(1);
  });

  it("moves focus with arrow, Home/End and Ctrl+End keys", async () => {
    const grid = setup();
    const first = grid.querySelector<HTMLElement>('[data-cell="0:0"]')!;
    act(() => first.focus());

    fireEvent.keyDown(grid, { key: "ArrowDown" });
    await flush();
    expect(document.activeElement).toHaveTextContent("C1");

    fireEvent.keyDown(grid, { key: "ArrowRight" });
    await flush();
    expect(document.activeElement).toHaveTextContent("GRM155R71C104KA88D");

    fireEvent.keyDown(grid, { key: "End" });
    await flush();
    expect(document.activeElement).toHaveTextContent("12");

    fireEvent.keyDown(grid, { key: "End", ctrlKey: true });
    await flush();
    expect(document.activeElement).toHaveTextContent("1");
    expect(document.activeElement?.getAttribute("data-cell")).toBe("3:2");

    fireEvent.keyDown(grid, { key: "Home" });
    await flush();
    expect(document.activeElement).toHaveTextContent("U2");
  });

  it("sorts with Enter on a header and reports aria-sort", async () => {
    const grid = setup();
    const qtyHeader = within(grid).getByRole("columnheader", { name: /Qty/ });
    act(() => qtyHeader.focus());
    fireEvent.keyDown(grid, { key: "Enter" });
    expect(qtyHeader).toHaveAttribute("aria-sort", "ascending");
    const firstCells = within(grid)
      .getAllByRole("row")
      .slice(1)
      .map((row) => row.textContent);
    expect(firstCells[0]).toContain("U2");

    fireEvent.keyDown(grid, { key: "Enter" });
    expect(qtyHeader).toHaveAttribute("aria-sort", "descending");
  });

  it("opens a row with Enter and toggles selection with Space", async () => {
    const onRowOpen = vi.fn();
    const grid = setup({ onRowOpen, selectable: true });
    act(() => grid.querySelector<HTMLElement>('[data-cell="2:1"]')!.focus());

    fireEvent.keyDown(grid, { key: "Enter" });
    expect(onRowOpen).toHaveBeenCalledWith(rows[1]);

    fireEvent.keyDown(grid, { key: " " });
    const row = within(grid).getAllByRole("row")[2]!;
    expect(row).toHaveAttribute("aria-selected", "true");
  });

  it("filters rows and focuses the filter with /", () => {
    setup({ filterPlaceholder: "Filter by MPN or ref" });
    fireEvent.keyDown(window, { key: "/" });
    const input = screen.getByPlaceholderText("Filter by MPN or ref");
    expect(document.activeElement).toBe(input);
    fireEvent.change(input, { target: { value: "tps" } });
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });
});
