"use client";

import { useMemo, useState } from "react";
import { Button } from "@revuu/ui/components/button";
import { DataTable, type Column } from "@revuu/ui/components/data-table";
import { Icon } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import { categoryLabel, type Category, type ImportResult, type Part } from "@/lib/parts/types";
import { ImportError, useFilePicker, type ImportBusy } from "./import-start";
import { CategoryTag, DemoTag, number } from "./parts-ui";

const missing = (text: string) => <span className="text-ink-subtle">{text}</span>;

const columns: Column<Part>[] = [
  {
    id: "designator",
    header: "Designator",
    cell: (p) => p.designator ?? missing("None"),
    value: (p) => p.designator,
    mono: true,
    width: "minmax(7rem,0.8fr)",
  },
  {
    id: "mpn",
    header: "MPN",
    cell: (p) => p.mpn,
    value: (p) => p.mpn,
    mono: true,
    width: "minmax(11rem,1.2fr)",
  },
  {
    id: "manufacturer",
    header: "Manufacturer",
    cell: (p) => p.manufacturer ?? missing("Not given"),
    value: (p) => p.manufacturer,
    width: "minmax(8rem,1fr)",
  },
  {
    id: "description",
    header: "Description",
    cell: (p) => <span className="text-ink-muted">{p.description ?? "No description"}</span>,
    value: (p) => p.description,
    width: "minmax(14rem,2fr)",
  },
  {
    id: "category",
    header: "Category",
    cell: (p) => <CategoryTag category={p.category} />,
    value: (p) => categoryLabel[p.category],
    width: "7.5rem",
  },
  {
    id: "qty",
    header: "Qty",
    cell: (p) => (p.quantity === null ? missing("Not given") : number.format(p.quantity)),
    value: (p) => p.quantity,
    align: "end",
    width: "4.5rem",
  },
  {
    id: "vendor",
    header: "Vendor",
    cell: (p) => p.vendor ?? missing("Not in list"),
    value: (p) => p.vendor,
    width: "minmax(9rem,1fr)",
  },
  {
    id: "email",
    header: "Vendor email",
    cell: (p) => p.vendorEmail ?? missing("Not in list"),
    value: (p) => p.vendorEmail,
    width: "minmax(12rem,1.2fr)",
  },
];

type Filter = "all" | Category;

export function PartsTable({
  result,
  busy = null,
  error,
  onOpen,
  onFile,
  onDismissError,
}: {
  result: ImportResult;
  busy?: ImportBusy;
  error?: string | null;
  onOpen: (part: Part) => void;
  onFile: (file: File) => void;
  onDismissError?: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");
  const picker = useFilePicker(onFile);
  const rows = useMemo(
    () => (filter === "all" ? result.parts : result.parts.filter((p) => p.category === filter)),
    [result.parts, filter],
  );
  const counts = {
    all: result.parts.length,
    electrical: result.parts.filter((p) => p.category === "electrical").length,
    mechanical: result.parts.filter((p) => p.category === "mechanical").length,
  };
  const selectedParts = result.parts.filter((p) => selected.has(p.id));
  const lines = result.parts.length + result.skipped.length;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid min-w-0 gap-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-page-title">Parts</h1>
            {result.demo ? <DemoTag /> : null}
          </div>
          <p className="text-body-sm text-ink-muted">
            From <span className="mpn text-ink">{result.fileName}</span>. Open a line to compare it
            with its alternates.
          </p>
        </div>
        {picker.input}
        <Button icon="upload" loading={busy === "file"} onClick={picker.open}>
          Import another list
        </Button>
      </div>

      {error ? <ImportError message={error} onDismiss={onDismissError} /> : null}

      <div
        role="status"
        className="grid gap-1 rounded-lg bg-surface px-4 py-3 text-body-sm sm:px-5"
      >
        <p className="flex items-start gap-2">
          <Icon name="check-circle" className="mt-0.5 size-4 text-status-approved" />
          <span>
            <span className="font-semibold">
              {result.parts.length} {result.parts.length === 1 ? "part" : "parts"} created
            </span>{" "}
            from {lines} {lines === 1 ? "line" : "lines"}: {counts.electrical} electrical,{" "}
            {counts.mechanical} mechanical. {result.skipped.length} skipped.
          </span>
        </p>
        {result.skipped.length ? (
          <ul className="grid gap-0.5 pl-6 text-ui text-ink-muted">
            {result.skipped.map((s) => (
              <li key={s.row}>
                Row {s.row}
                {s.designator ? <span className="mpn"> {s.designator}</span> : null}: skipped,
                missing MPN.
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <CategoryFilter value={filter} counts={counts} onChange={setFilter} />

      <DataTable
        label="Imported parts"
        columns={columns}
        rows={rows}
        getRowId={(p) => p.id}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        onRowOpen={onOpen}
        filterPlaceholder="Filter by MPN, designator or vendor"
        toolbar={
          <>
            {selectedParts.length > 1 ? (
              <span id="find-blocker" className="text-ui text-ink-muted">
                Select one line to compare.
              </span>
            ) : null}
            <Button
              size="sm"
              icon="replace"
              variant={selectedParts.length === 1 ? "primary" : "secondary"}
              disabled={selectedParts.length !== 1}
              aria-describedby={selectedParts.length > 1 ? "find-blocker" : undefined}
              onClick={() => selectedParts[0] && onOpen(selectedParts[0])}
              className="max-lg:h-11"
            >
              Find alternates
            </Button>
          </>
        }
      />
      <p className="text-caption font-medium text-ink-subtle">
        Arrow keys move between cells. Enter opens the comparison for a line. Space selects it.
      </p>
    </div>
  );
}

function CategoryFilter({
  value,
  counts,
  onChange,
}: {
  value: Filter;
  counts: Record<Filter, number>;
  onChange: (next: Filter) => void;
}) {
  const options: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "electrical", label: "Electrical" },
    { id: "mechanical", label: "Mechanical" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Category"
      className="flex w-fit gap-0.5 rounded-pill bg-surface p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "inline-flex h-7 items-center gap-1 rounded-pill px-2.5 text-ui font-semibold transition-colors duration-120 max-lg:h-11",
            value === o.id ? "bg-primary text-on-primary" : "text-ink-muted hover:text-ink",
          )}
        >
          {o.label} <span className="tabular-nums opacity-80">{counts[o.id]}</span>
        </button>
      ))}
    </div>
  );
}
