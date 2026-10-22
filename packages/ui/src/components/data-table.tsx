"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { Icon } from "./icon";

export interface Column<Row> {
  id: string;
  header: string;
  cell: (row: Row) => React.ReactNode;
  /** Value used for sorting and filtering. Omit to make the column unsortable. */
  value?: (row: Row) => string | number | null;
  align?: "start" | "end";
  /** CSS grid track, e.g. "minmax(12rem,2fr)" or "6rem". */
  width?: string;
  mono?: boolean;
}

type SortState = { columnId: string; direction: "ascending" | "descending" } | null;

export interface DataTableProps<Row> {
  label: string;
  columns: Column<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  onRowOpen?: (row: Row) => void;
  selectable?: boolean;
  selected?: Set<string>;
  onSelectedChange?: (next: Set<string>) => void;
  density?: "default" | "compact";
  /** Renders a filter input above the grid. `/` focuses it. */
  filterPlaceholder?: string;
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  className?: string;
}

const PAGE = 10;

export function DataTable<Row>({
  label,
  columns,
  rows,
  getRowId,
  onRowOpen,
  selectable = false,
  selected: selectedProp,
  onSelectedChange,
  density = "default",
  filterPlaceholder,
  toolbar,
  empty,
  className,
}: DataTableProps<Row>) {
  const gridId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const [sort, setSort] = useState<SortState>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());
  const selected = selectedProp ?? internalSelected;
  const setSelected = onSelectedChange ?? setInternalSelected;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = q
      ? rows.filter((row) =>
          columns.some((c) =>
            String(c.value?.(row) ?? "")
              .toLowerCase()
              .includes(q),
          ),
        )
      : rows;
    if (sort) {
      const column = columns.find((c) => c.id === sort.columnId);
      if (column?.value) {
        const dir = sort.direction === "ascending" ? 1 : -1;
        result = [...result].sort((a, b) => {
          const av = column.value!(a);
          const bv = column.value!(b);
          if (av === bv) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return (
            (typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av).localeCompare(String(bv), undefined, { numeric: true })) * dir
          );
        });
      }
    }
    return result;
  }, [rows, columns, query, sort]);

  // Row 0 is the header row; data rows start at 1.
  const rowCount = visible.length + 1;
  const colCount = columns.length + (selectable ? 1 : 0);

  useEffect(() => {
    setActive((a) => ({ row: Math.min(a.row, rowCount - 1), col: Math.min(a.col, colCount - 1) }));
  }, [rowCount, colCount]);

  useEffect(() => {
    if (!filterPlaceholder) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      const typing =
        target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable='true']");
      if (event.key === "/" && !typing) {
        event.preventDefault();
        filterRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filterPlaceholder]);

  const focusCell = useCallback(
    (row: number, col: number) => {
      const next = { row: clamp(row, 0, rowCount - 1), col: clamp(col, 0, colCount - 1) };
      setActive(next);
      requestAnimationFrame(() => {
        gridRef.current
          ?.querySelector<HTMLElement>(`[data-cell="${next.row}:${next.col}"]`)
          ?.focus({ preventScroll: false });
      });
    },
    [rowCount, colCount],
  );

  const toggleRow = useCallback(
    (id: string) => {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelected(next);
    },
    [selected, setSelected],
  );

  const allSelected = visible.length > 0 && visible.every((r) => selected.has(getRowId(r)));
  const someSelected = !allSelected && visible.some((r) => selected.has(getRowId(r)));

  function toggleAll() {
    const next = new Set(selected);
    for (const row of visible) {
      if (allSelected) next.delete(getRowId(row));
      else next.add(getRowId(row));
    }
    setSelected(next);
  }

  function cycleSort(column: Column<Row>) {
    if (!column.value) return;
    setSort((current) => {
      if (current?.columnId !== column.id) return { columnId: column.id, direction: "ascending" };
      if (current.direction === "ascending")
        return { columnId: column.id, direction: "descending" };
      return null;
    });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const { row, col } = active;
    const ctrl = event.ctrlKey || event.metaKey;
    const handled = (fn: () => void) => {
      event.preventDefault();
      fn();
    };
    switch (event.key) {
      case "ArrowDown":
        return handled(() => focusCell(row + 1, col));
      case "ArrowUp":
        return handled(() => focusCell(row - 1, col));
      case "ArrowRight":
        return handled(() => focusCell(row, col + 1));
      case "ArrowLeft":
        return handled(() => focusCell(row, col - 1));
      case "Home":
        return handled(() => focusCell(ctrl ? 1 : row, 0));
      case "End":
        return handled(() => focusCell(ctrl ? rowCount - 1 : row, colCount - 1));
      case "PageDown":
        return handled(() => focusCell(row + PAGE, col));
      case "PageUp":
        return handled(() => focusCell(Math.max(row - PAGE, 1), col));
      case "Enter": {
        if (row === 0) {
          const column = columns[col - (selectable ? 1 : 0)];
          if (column) return handled(() => cycleSort(column));
          return;
        }
        const data = visible[row - 1];
        if (data && onRowOpen) return handled(() => onRowOpen(data));
        return;
      }
      case " ": {
        if (!selectable) return;
        if (row === 0) return handled(toggleAll);
        const data = visible[row - 1];
        if (data) return handled(() => toggleRow(getRowId(data)));
        return;
      }
    }
  }

  const template = [
    selectable ? "2.5rem" : null,
    ...columns.map((c) => c.width ?? "minmax(8rem,1fr)"),
  ]
    .filter(Boolean)
    .join(" ");
  const rowHeight = density === "compact" ? "h-8" : "h-9";

  const cellProps = (row: number, col: number) => ({
    "data-cell": `${row}:${col}`,
    tabIndex: active.row === row && active.col === col ? 0 : -1,
    onFocus: () => setActive({ row, col }),
  });

  return (
    <div className={cn("grid gap-3", className)}>
      {filterPlaceholder || toolbar ? (
        <div className="flex flex-wrap items-center gap-2">
          {filterPlaceholder ? (
            <label className="relative w-full max-w-xs">
              <span className="sr-only">Filter {label}</span>
              <Icon
                name="search"
                className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-subtle"
              />
              <input
                ref={filterRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={filterPlaceholder}
                aria-controls={gridId}
                className="h-8 w-full rounded-md bg-raised pr-8 pl-8 text-ui text-ink shadow-[inset_0_0_0_1px_var(--color-border-input)] placeholder:text-ink-subtle"
              />
              <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded-xs bg-surface px-1.5 font-mono text-micro text-ink-subtle">
                /
              </kbd>
            </label>
          ) : null}
          <span className="sr-only" role="status" aria-live="polite">
            {visible.length} of {rows.length} rows shown
          </span>
          {toolbar ? (
            <div className="ml-auto flex flex-wrap items-center gap-2">{toolbar}</div>
          ) : null}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-md shadow-[inset_0_0_0_1px_var(--color-hairline)]">
        <div
          ref={gridRef}
          id={gridId}
          role="grid"
          aria-label={label}
          aria-rowcount={rowCount}
          aria-colcount={colCount}
          aria-multiselectable={selectable || undefined}
          onKeyDown={onKeyDown}
          className="min-w-full text-ui tabular-nums"
          style={{ display: "grid", gridTemplateColumns: template }}
        >
          <div
            role="row"
            aria-rowindex={1}
            className="sticky top-0 z-10 col-span-full grid grid-cols-subgrid"
          >
            {selectable ? (
              <div
                role="columnheader"
                aria-label={`Select all rows, ${[...selected].length} selected`}
                {...cellProps(0, 0)}
                className={cn(headerCell, "cursor-pointer justify-center")}
                onClick={toggleAll}
              >
                <Checkbox checked={allSelected} mixed={someSelected} />
              </div>
            ) : null}
            {columns.map((column, i) => {
              const col = i + (selectable ? 1 : 0);
              const sorted = sort?.columnId === column.id ? sort.direction : undefined;
              return (
                <div
                  key={column.id}
                  role="columnheader"
                  aria-sort={column.value ? (sorted ?? "none") : undefined}
                  {...cellProps(0, col)}
                  onClick={() => cycleSort(column)}
                  className={cn(
                    headerCell,
                    column.align === "end" && "justify-end text-right",
                    column.value && "cursor-pointer hover:text-ink",
                  )}
                >
                  {column.header}
                  {column.value ? (
                    <Icon
                      name={sorted === "descending" ? "sort-desc" : "sort-asc"}
                      className={cn(
                        "size-3.5",
                        sorted ? "text-ink" : "opacity-0 group-hover:opacity-60",
                      )}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          {visible.map((row, r) => {
            const id = getRowId(row);
            const isSelected = selected.has(id);
            const rowIndex = r + 1;
            return (
              <div
                key={id}
                role="row"
                aria-rowindex={rowIndex + 1}
                aria-selected={selectable ? isSelected : undefined}
                className="group/row col-span-full grid grid-cols-subgrid"
                onDoubleClick={() => onRowOpen?.(row)}
              >
                {selectable ? (
                  <div
                    role="gridcell"
                    aria-label={isSelected ? "Selected" : "Not selected"}
                    {...cellProps(rowIndex, 0)}
                    className={cn(bodyCell(rowHeight, isSelected), "cursor-pointer justify-center")}
                    onClick={() => toggleRow(id)}
                  >
                    <Checkbox checked={isSelected} />
                  </div>
                ) : null}
                {columns.map((column, i) => {
                  const col = i + (selectable ? 1 : 0);
                  return (
                    <div
                      key={column.id}
                      role="gridcell"
                      {...cellProps(rowIndex, col)}
                      className={cn(
                        bodyCell(rowHeight, isSelected),
                        column.align === "end" && "justify-end text-right",
                        column.mono && "mpn",
                        col === 0 && isSelected && "shadow-[inset_2px_0_0_var(--color-accent)]",
                      )}
                    >
                      <span className="min-w-0 truncate">{column.cell(row)}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {visible.length === 0 ? (
          <div className="border-t border-hairline px-4 py-10 text-center text-body-sm text-ink-muted">
            {empty ?? (query ? `No rows match "${query}".` : "No rows yet.")}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const headerCell =
  "group flex h-8 items-center gap-1 bg-surface px-3 text-caption whitespace-nowrap text-ink-muted " +
  "border-b border-hairline-strong select-none outline-offset-[-2px] focus-visible:rounded-none";

function bodyCell(height: string, selected: boolean) {
  return cn(
    "flex items-center border-b border-hairline px-3 outline-offset-[-2px] focus-visible:rounded-none",
    height,
    selected ? "bg-status-pending-bg/45" : "bg-raised group-hover/row:bg-surface",
  );
}

function Checkbox({ checked, mixed = false }: { checked: boolean; mixed?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-xs transition-colors duration-80",
        checked || mixed
          ? "bg-primary text-on-primary"
          : "bg-raised shadow-[inset_0_0_0_1px_var(--color-border-input)]",
      )}
    >
      {checked ? (
        <Icon name="check" className="size-3" />
      ) : mixed ? (
        <span className="h-0.5 w-2 rounded-full bg-on-primary" />
      ) : null}
    </span>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
