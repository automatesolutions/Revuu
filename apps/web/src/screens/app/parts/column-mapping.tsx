"use client";

import { useId, useMemo } from "react";
import { Button } from "@revuu/ui/components/button";
import { Select } from "@revuu/ui/components/field";
import { Icon } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import { assignColumn, fieldLabel, partFields } from "@/lib/parts/fields";
import { draftLines, unresolvedLines, type DraftLine } from "@/lib/parts/lines";
import type { Category, ColumnMapping, ParsedSheet, PartField } from "@/lib/parts/types";
import { ImportError } from "./import-start";
import { DemoTag, panel } from "./parts-ui";

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export function ColumnMapping({
  sheet,
  mapping,
  chosen,
  creating = false,
  error,
  onMappingChange,
  onChoose,
  onCreate,
  onCancel,
}: {
  sheet: ParsedSheet;
  mapping: ColumnMapping;
  chosen: Record<string, Category>;
  creating?: boolean;
  error?: string | null;
  onMappingChange: (next: ColumnMapping) => void;
  onChoose: (lineId: string, category: Category) => void;
  onCreate: () => void;
  onCancel: () => void;
}) {
  const { drafts, skipped } = useMemo(
    () => (mapping.mpn === null ? { drafts: [], skipped: [] } : draftLines(sheet.rows, mapping)),
    [sheet.rows, mapping],
  );
  const unresolved = unresolvedLines(drafts, chosen);
  const categoryOf = (d: DraftLine) => d.category ?? chosen[d.id] ?? null;
  const electrical = drafts.filter((d) => categoryOf(d) === "electrical").length;
  const mechanical = drafts.filter((d) => categoryOf(d) === "mechanical").length;
  const fieldFor = (column: number) => partFields.find((f) => mapping[f.id] === column)?.id ?? null;

  const blocker =
    mapping.mpn === null
      ? "Map a column to MPN to continue."
      : unresolved.length
        ? `Set the category for ${plural(unresolved.length, "line")} to continue.`
        : drafts.length === 0
          ? "No line has an MPN. Check the MPN column."
          : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <h1 className="text-page-title">Confirm the columns</h1>
          <p className="text-body-sm text-ink-muted">
            <span className="mpn text-ink">{sheet.fileName}</span> has{" "}
            {plural(sheet.rows.length, "line")}. Revuu guessed a field for each column. Nothing is
            created until you confirm.
          </p>
        </div>
        {sheet.demo ? <DemoTag /> : null}
      </div>

      <section aria-labelledby="columns-title" className={panel}>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline px-4 py-3 sm:px-5">
          <h2 id="columns-title" className="text-[0.9375rem] font-bold">
            Columns in the file
          </h2>
          <p className="text-caption font-medium text-ink-subtle">
            MPN and category are required. Unknown columns stay unmapped.
          </p>
        </div>
        <div
          className="hidden grid-cols-[minmax(10rem,1fr)_minmax(12rem,1.4fr)_minmax(12rem,1fr)] gap-4 border-b border-hairline bg-surface px-5 py-2 text-caption text-ink-muted md:grid"
          aria-hidden
        >
          <span>Column in file</span>
          <span>First values</span>
          <span>Revuu field</span>
        </div>
        <ul className="divide-y divide-hairline">
          {sheet.headers.map((header, column) => (
            <MappingRow
              key={column}
              header={header}
              samples={sheet.rows
                .map((r) => r[column] ?? "")
                .filter(Boolean)
                .slice(0, 2)}
              field={fieldFor(column)}
              onChange={(field) => onMappingChange(assignColumn(mapping, column, field))}
            />
          ))}
        </ul>
        <RequiredStatus mapping={mapping} headers={sheet.headers} />
      </section>

      {unresolved.length || Object.keys(chosen).length ? (
        <CategoryPicker
          lines={drafts.filter((d) => !d.category)}
          chosen={chosen}
          categoryMapped={mapping.category !== null}
          onChoose={onChoose}
        />
      ) : null}

      {error ? <ImportError message={error} /> : null}

      <div className="grid gap-4 rounded-lg bg-surface p-4 sm:p-5">
        <div className="grid gap-1 text-body-sm" role="status" aria-live="polite">
          <p>
            {mapping.mpn === null ? (
              "Map the MPN column to see what Revuu will create."
            ) : (
              <>
                <span className="font-semibold">
                  {plural(drafts.length, "part")} will be created
                </span>
                : {electrical} electrical, {mechanical} mechanical
                {unresolved.length ? `, ${unresolved.length} not set` : ""}.
              </>
            )}
          </p>
          {skipped.length ? (
            <p className="text-ink-muted">
              {plural(skipped.length, "line")} will be skipped: missing MPN (
              {skipped
                .map((s) => `row ${s.row}${s.designator ? `, ${s.designator}` : ""}`)
                .join("; ")}
              ).
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            icon="check"
            loading={creating}
            disabled={blocker !== null}
            onClick={onCreate}
            aria-describedby={blocker ? "create-blocker" : undefined}
          >
            {drafts.length ? `Create ${plural(drafts.length, "part")}` : "Create parts"}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={creating}>
            Choose another file
          </Button>
          {blocker ? (
            <p
              id="create-blocker"
              className="flex items-center gap-1.5 text-caption font-medium text-ink-muted"
            >
              <Icon name="info" className="size-3.5" />
              {blocker}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MappingRow({
  header,
  samples,
  field,
  onChange,
}: {
  header: string;
  samples: string[];
  field: PartField | null;
  onChange: (field: PartField | null) => void;
}) {
  const id = useId();
  const name = header || "Unnamed column";
  return (
    <li className="grid gap-2 px-4 py-3 sm:px-5 md:grid-cols-[minmax(10rem,1fr)_minmax(12rem,1.4fr)_minmax(12rem,1fr)] md:items-center md:gap-4">
      <label htmlFor={id} className={cn("text-label", !header && "text-ink-subtle italic")}>
        {name}
      </label>
      <p className="min-w-0 truncate text-ui text-ink-muted" title={samples.join(" · ")}>
        <span className="sr-only md:hidden">First values: </span>
        {samples.length ? samples.join(" · ") : <span className="text-ink-subtle">Empty</span>}
      </p>
      <Select
        id={id}
        value={field ?? ""}
        onChange={(e) => onChange((e.target.value || null) as PartField | null)}
        className="max-lg:h-11"
      >
        <option value="">Not mapped</option>
        {partFields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
            {f.required ? " (required)" : ""}
          </option>
        ))}
      </Select>
    </li>
  );
}

function RequiredStatus({ mapping, headers }: { mapping: ColumnMapping; headers: string[] }) {
  const items: { field: PartField; note: string | null }[] = [
    { field: "mpn", note: mapping.mpn === null ? "Not mapped. Map a column to MPN." : null },
    {
      field: "category",
      note:
        mapping.category === null
          ? "Not mapped. Revuu reads the category words in the description, and you set the rest."
          : null,
    },
  ];
  return (
    <ul className="grid gap-1.5 border-t border-hairline px-4 py-3 text-ui sm:px-5">
      {items.map(({ field, note }) => {
        const column = mapping[field];
        return (
          <li key={field} className="flex items-start gap-2">
            <Icon
              name={column === null ? "info" : "check-circle"}
              className={cn(
                "mt-0.5 size-3.5",
                column === null ? "text-ink-subtle" : "text-status-approved",
              )}
            />
            <span>
              <span className="font-semibold">{fieldLabel[field]}</span>{" "}
              {column === null ? (
                <span className="text-ink-muted">{note}</span>
              ) : (
                <span className="text-ink-muted">from “{headers[column] || "Unnamed column"}”</span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function CategoryPicker({
  lines,
  chosen,
  categoryMapped,
  onChoose,
}: {
  lines: DraftLine[];
  chosen: Record<string, Category>;
  categoryMapped: boolean;
  onChoose: (lineId: string, category: Category) => void;
}) {
  return (
    <section aria-labelledby="category-title" className={panel}>
      <div className="grid gap-1 border-b border-hairline px-4 py-3 sm:px-5">
        <h2 id="category-title" className="text-[0.9375rem] font-bold">
          Set the category
        </h2>
        <p className="text-caption font-medium text-ink-subtle">
          {categoryMapped ? "The category cell is blank" : "There is no category column"}, and the
          description has no category word. Choose Electrical or Mechanical.
        </p>
      </div>
      <ul className="divide-y divide-hairline">
        {lines.map((line) => (
          <li
            key={line.id}
            className="grid gap-3 px-4 py-3 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
          >
            <div className="grid min-w-0 gap-0.5">
              <p className="flex flex-wrap items-baseline gap-x-2 text-ui">
                <span className="mpn">{line.designator ?? `Row ${line.row}`}</span>
                <span className="mpn text-ink-muted">{line.mpn}</span>
              </p>
              <p className="truncate text-caption font-medium text-ink-subtle">
                {line.description ?? "No description"}
              </p>
            </div>
            <fieldset className="flex gap-1 rounded-pill bg-surface p-1">
              <legend className="sr-only">
                Category for {line.designator ?? `row ${line.row}`}, {line.mpn}
              </legend>
              {(["electrical", "mechanical"] as const).map((category) => {
                const checked = chosen[line.id] === category;
                return (
                  <label
                    key={category}
                    className={cn(
                      "relative inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-pill px-3 text-ui font-semibold transition-colors duration-120 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus max-lg:h-11",
                      checked ? "bg-primary text-on-primary" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    <input
                      type="radio"
                      name={`category-${line.id}`}
                      value={category}
                      checked={checked}
                      onChange={() => onChoose(line.id, category)}
                      className="sr-only"
                    />
                    <Icon name={category === "electrical" ? "zap" : "nut"} className="size-3.5" />
                    {category === "electrical" ? "Electrical" : "Mechanical"}
                  </label>
                );
              })}
            </fieldset>
          </li>
        ))}
      </ul>
    </section>
  );
}
