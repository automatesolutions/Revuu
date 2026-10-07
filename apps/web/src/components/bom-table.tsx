"use client";

import { useState } from "react";
import { DataTable, type Column } from "@revuu/ui/components/data-table";
import { LifecycleBadge, StatusChip } from "@revuu/ui/components/status-chip";
import { Button } from "@revuu/ui/components/button";
import type { BomLine } from "@/fixtures/bom";

const number = new Intl.NumberFormat("en-US");
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const columns: Column<BomLine>[] = [
  {
    id: "refs",
    header: "Refs",
    cell: (r) => r.refs,
    value: (r) => r.refs,
    width: "minmax(7rem,0.8fr)",
  },
  {
    id: "mpn",
    header: "MPN",
    cell: (r) => r.mpn,
    value: (r) => r.mpn,
    mono: true,
    width: "minmax(11rem,1.2fr)",
  },
  {
    id: "mfr",
    header: "Manufacturer",
    cell: (r) => r.manufacturer,
    value: (r) => r.manufacturer,
    width: "minmax(8rem,1fr)",
  },
  {
    id: "description",
    header: "Description",
    cell: (r) => <span className="text-ink-muted">{r.description}</span>,
    value: (r) => r.description,
    width: "minmax(14rem,2fr)",
  },
  {
    id: "qty",
    header: "Qty",
    cell: (r) => r.qty,
    value: (r) => r.qty,
    align: "end",
    width: "4rem",
  },
  {
    id: "lifecycle",
    header: "Lifecycle",
    cell: (r) => (
      <LifecycleBadge
        lifecycle={r.lifecycle}
        source={r.lifecycleSource}
        age={r.lifecycleAge || undefined}
        size="sm"
      />
    ),
    value: (r) => r.lifecycle,
    width: "8rem",
  },
  {
    id: "avl",
    header: "AVL",
    cell: (r) => <StatusChip status={r.avl} size="sm" />,
    value: (r) => r.avl,
    width: "7.5rem",
  },
  {
    id: "stock",
    header: "Stock",
    cell: (r) =>
      r.stock === null ? <span className="text-ink-subtle">No data</span> : number.format(r.stock),
    value: (r) => r.stock,
    align: "end",
    width: "7rem",
  },
  {
    id: "price",
    header: "Unit price",
    cell: (r) =>
      r.unitPrice === null ? (
        <span className="text-ink-subtle">No data</span>
      ) : (
        money.format(r.unitPrice)
      ),
    value: (r) => r.unitPrice,
    align: "end",
    width: "7rem",
  },
];

export function BomTable({ rows, label = "BOM lines" }: { rows: BomLine[]; label?: string }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [opened, setOpened] = useState<BomLine | null>(null);

  return (
    <div className="grid gap-2">
      <DataTable
        label={label}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        onRowOpen={setOpened}
        filterPlaceholder="Filter by MPN, ref or maker"
        toolbar={
          selected.size > 0 ? (
            <>
              <span className="text-ui text-ink-muted tabular-nums">{selected.size} selected</span>
              <Button size="sm" icon="replace">
                Find alternates
              </Button>
            </>
          ) : null
        }
      />
      <p className="text-caption font-medium text-ink-subtle" aria-live="polite">
        {opened ? (
          <>
            Opened <span className="mpn">{opened.mpn}</span>. Part detail ships in M3.
          </>
        ) : (
          "Arrow keys move between cells. Enter opens a line, Space selects it."
        )}
      </p>
    </div>
  );
}
