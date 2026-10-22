"use client";

import { Button } from "@revuu/ui/components/button";
import { DiffCell } from "@revuu/ui/components/diff-cell";
import { Icon, type IconName } from "@revuu/ui/components/icon";
import { EmptyState, ErrorState, LoadingRegion, Skeleton } from "@revuu/ui/components/states";
import { LifecycleBadge } from "@revuu/ui/components/status-chip";
import { cn } from "@revuu/ui/lib/cn";
import { EmptyBoardIllustration } from "@/components/illustrations";
import { LinkButton } from "@/components/link-button";
import {
  fitKeys,
  specRows,
  type Comparison,
  type ContactField,
  type PartRecord,
  type VendorBlock,
} from "@/lib/parts/compare";
import { categoryLabel, type Part } from "@/lib/parts/types";
import type { SpecValue } from "@/lib/parts/units";
import { drawingExtent, OutlineDrawing } from "./outline-drawing";
import { CategoryTag, DemoTag, FitTag, money, number, panel } from "./parts-ui";

export type CompareState = "ready" | "loading" | "error";

export function PartCompare({
  part,
  record,
  comparison,
  state = "ready",
  onRetry,
}: {
  part: Part;
  record: PartRecord | null;
  comparison: Comparison | null;
  state?: CompareState;
  onRetry?: () => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid gap-3">
        <LinkButton
          href="/app/parts"
          variant="ghost"
          size="sm"
          icon="arrow-left"
          className="-ml-2.5 w-fit max-lg:h-11"
        >
          Parts
        </LinkButton>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-page-title text-balance">
            Alternates for{" "}
            <span className="font-mono text-[0.85em] tracking-normal">{part.mpn}</span>
          </h1>
          <DemoTag />
        </div>
      </div>

      <PartHeader part={part} record={state === "ready" ? record : undefined} />

      {state === "loading" ? <CompareLoading /> : null}
      {state === "error" ? (
        <ErrorState
          headingLevel="h2"
          title="Alternates did not load."
          description="Revuu could not read the part records. Your imported list is safe. Try again."
          action={
            <Button size="sm" icon="refresh-cw" onClick={onRetry}>
              Try again
            </Button>
          }
        />
      ) : null}
      {state === "ready" && !comparison ? (
        <EmptyState
          headingLevel="h2"
          illustration={<EmptyBoardIllustration className="h-20 w-auto" />}
          title="No alternates for this MPN yet."
          description={`Revuu has no alternate parts on record for ${part.mpn}. Pick another line, or keep this part and check its lifecycle with the vendor.`}
          action={
            <LinkButton href="/app/parts" icon="arrow-left">
              Back to parts
            </LinkButton>
          }
        />
      ) : null}
      {state === "ready" && comparison ? <ComparisonTable comparison={comparison} /> : null}
    </div>
  );
}

function PartHeader({ part, record }: { part: Part; record: PartRecord | null | undefined }) {
  const items: { term: string; value: React.ReactNode }[] = [
    { term: "Designator", value: <span className="mpn">{part.designator ?? "None"}</span> },
    { term: "MPN", value: <span className="mpn">{part.mpn}</span> },
    { term: "Manufacturer", value: part.manufacturer ?? "Not in this list" },
    { term: "Category", value: <CategoryTag category={part.category} /> },
    {
      term: "Lifecycle",
      value:
        record === undefined ? (
          <Skeleton className="h-5 w-32" />
        ) : record ? (
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <LifecycleBadge lifecycle={record.lifecycle} size="sm" />
            <span className="text-caption font-medium text-ink-subtle">
              {record.source}
              {record.age ? `, ${record.age}` : ""}
            </span>
          </span>
        ) : (
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <LifecycleBadge lifecycle="unknown" size="sm" />
            <span className="text-caption font-medium text-ink-subtle">Not checked</span>
          </span>
        ),
    },
    { term: "Vendor", value: part.vendor ?? "No vendor in this list." },
    {
      term: "Vendor email",
      value: part.vendorEmail ? (
        <a
          href={`mailto:${part.vendorEmail}`}
          className="break-all text-accent underline-offset-4 hover:underline"
        >
          {part.vendorEmail}
        </a>
      ) : (
        <span className="text-ink-muted">No vendor email in this list.</span>
      ),
    },
  ];
  return (
    <section aria-label="Baseline part" className={cn(panel, "px-4 py-4 sm:px-5")}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))]">
        {items.map((item) => (
          <div key={item.term} className="grid min-w-0 content-start gap-1">
            <dt className="text-caption text-ink-muted">{item.term}</dt>
            <dd className="min-w-0 text-ui text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CompareLoading() {
  return (
    <LoadingRegion label="Loading alternates." className={cn(panel, "grid gap-3 p-5")}>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
      {Array.from({ length: 7 }, (_, i) => (
        <Skeleton key={i} className="h-6" />
      ))}
    </LoadingRegion>
  );
}

function display(value: SpecValue) {
  return value === null ? <span className="text-ink-subtle">Not listed</span> : String(value);
}

function ComparisonTable({ comparison }: { comparison: Comparison }) {
  const { baseline, rows, alternates } = comparison;
  const category = baseline.category;
  const fitWords = fitKeys[category]
    .map((key) => specRows[category].find((s) => s.key === key)!.label.toLowerCase())
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1");
  const groups = [...new Set(rows.map((row) => row.group))];
  // One scale for the whole row, so a 12 mm part is drawn longer than a 10 mm one.
  const widest = Math.max(...[baseline, ...alternates].map(drawingExtent), 1);
  const pxPerMm = Math.min(32, 90 / widest);
  const head =
    "sticky left-0 z-10 border-b border-r border-hairline bg-surface px-3 py-2 text-left align-top text-caption text-ink-muted";

  return (
    <section aria-labelledby="compare-title" className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="compare-title" className="text-title">
          {alternates.length} {alternates.length === 1 ? "alternate" : "alternates"} side by side
        </h2>
        <p className="text-caption font-medium text-ink-subtle">
          {categoryLabel[category]} · Drop-in means the same {fitWords}.
        </p>
      </div>

      <div
        role="region"
        aria-labelledby="compare-title"
        tabIndex={0}
        className={cn(panel, "relative overflow-x-auto")}
      >
        <table className="w-full min-w-[46rem] table-fixed border-separate border-spacing-0 text-ui break-words">
          <caption className="sr-only">
            {baseline.mpn} compared with {alternates.map((a) => a.mpn).join(", ")}. Cells marked
            differs from baseline do not match the baseline after unit normalization.
          </caption>
          <colgroup>
            <col className="w-36" />
            <col />
            {alternates.map((a) => (
              <col key={a.mpn} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <td className={cn(head, "rounded-tl-lg")} />
              <PartHead
                record={baseline}
                badge={
                  <span className="inline-flex h-5 items-center rounded-xs bg-sunken px-1.5 text-[0.75rem] font-semibold text-ink-muted">
                    Baseline
                  </span>
                }
              />
              {alternates.map((alt) => (
                <PartHead key={alt.mpn} record={alt} badge={<FitTag fit={alt.fit} />} />
              ))}
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group}>
              <tr>
                <th
                  scope="rowgroup"
                  colSpan={alternates.length + 2}
                  className="border-b border-hairline bg-canvas px-3 pt-3 pb-1.5 text-left text-label text-ink"
                >
                  <span className="sticky left-3">{group}</span>
                </th>
              </tr>
              {rows
                .filter((row) => row.group === group)
                .map((row) => (
                  <tr key={row.key}>
                    <th scope="row" className={head}>
                      {row.label}
                    </th>
                    <td className="border-r border-b border-hairline px-3 py-2 align-top tabular-nums">
                      {display(row.baseline)}
                    </td>
                    {row.alternates.map((cell, i) => (
                      <DiffCell key={i} differs={cell.differs} className="border-r last:border-r-0">
                        {display(cell.value)}
                      </DiffCell>
                    ))}
                  </tr>
                ))}
            </tbody>
          ))}
          <tbody>
            <tr>
              <th scope="row" className={head}>
                {category === "electrical" ? "Outline, top view" : "Outline, side view"}
              </th>
              <td className="border-r border-b border-hairline px-3 py-3 align-top">
                <OutlineDrawing record={baseline} pxPerMm={pxPerMm} />
              </td>
              {alternates.map((alt) => (
                <DiffCell
                  key={alt.mpn}
                  differs={alt.dimensionsDiffer}
                  className="border-r py-3 last:border-r-0"
                >
                  <OutlineDrawing record={alt} pxPerMm={pxPerMm} />
                </DiffCell>
              ))}
            </tr>
            <tr>
              <th scope="row" className={head}>
                Lifecycle
              </th>
              {[baseline, ...alternates].map((r) => (
                <Plain key={r.mpn}>
                  <span className="grid justify-items-start gap-0.5">
                    <LifecycleBadge lifecycle={r.lifecycle} size="sm" />
                    <span className="text-[0.75rem] text-ink-subtle">
                      {r.source}
                      {r.age ? `, ${r.age}` : ""}
                    </span>
                  </span>
                </Plain>
              ))}
            </tr>
            <tr>
              <th scope="row" className={head}>
                Stock
              </th>
              {[baseline, ...alternates].map((r) => (
                <Plain key={r.mpn}>
                  {r.stock === null ? display(null) : number.format(r.stock)}
                </Plain>
              ))}
            </tr>
            <tr>
              <th scope="row" className={head}>
                Unit price
              </th>
              {[baseline, ...alternates].map((r) => (
                <Plain key={r.mpn}>
                  {r.unitPrice === null ? display(null) : money.format(r.unitPrice)}
                </Plain>
              ))}
            </tr>
            <tr>
              <th scope="row" className={head}>
                Datasheet
              </th>
              {[baseline, ...alternates].map((r) => (
                <Plain key={r.mpn}>
                  {r.datasheet ? (
                    <span className="mpn break-all">{r.datasheet}</span>
                  ) : (
                    <span className="text-ink-subtle">No datasheet on record</span>
                  )}
                </Plain>
              ))}
            </tr>
            <tr>
              <th scope="row" className={head}>
                Remark
              </th>
              <Plain>
                <span className="text-ink-muted">Baseline from the imported list.</span>
              </Plain>
              {alternates.map((alt) => (
                <Plain key={alt.mpn}>
                  <p data-remark className="max-w-[30ch] text-body-sm text-pretty">
                    {alt.remark}
                  </p>
                </Plain>
              ))}
            </tr>
            <tr>
              <th scope="row" className={cn(head, "rounded-bl-lg border-b-0")}>
                Vendor
              </th>
              <Plain last>
                <span className="text-ink-muted">Shown above, from the imported list.</span>
              </Plain>
              {alternates.map((alt) => (
                <Plain key={alt.mpn} last>
                  <VendorDetails block={alt.vendorBlock} />
                </Plain>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption font-medium text-ink-subtle">
        <span className="inline-flex items-center gap-1 rounded-xs bg-status-warning-bg px-1.5 py-0.5 text-status-warning">
          <Icon name="differs" className="size-3" />
          Differs
        </span>
        Value does not match the baseline after unit normalization. Outlines are drawn to one scale
        from the record&rsquo;s dimensions, not from the manufacturer&rsquo;s drawing. Check the
        datasheet before layout. Lifecycle, stock, and price are shown, not compared.
      </p>
    </section>
  );
}

function PartHead({ record, badge }: { record: PartRecord; badge: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="border-r border-b border-hairline bg-surface px-3 py-2.5 text-left align-top font-normal last:border-r-0"
    >
      <span className="grid justify-items-start gap-1">
        {badge}
        <span className="mpn font-semibold break-all text-ink">{record.mpn}</span>
        <span className="text-caption font-medium text-ink-subtle">{record.manufacturer}</span>
      </span>
    </th>
  );
}

function Plain({ children, last = false }: { children: React.ReactNode; last?: boolean }) {
  return (
    <td
      className={cn(
        "border-r border-hairline px-3 py-2 align-top tabular-nums last:border-r-0",
        !last && "border-b",
      )}
    >
      {children}
    </td>
  );
}

const contactIcon: Record<"email" | "phone" | "url", IconName> = {
  email: "mail",
  phone: "phone",
  url: "globe",
};

function VendorDetails({ block }: { block: VendorBlock }) {
  if (!block.name) {
    return <span className="text-ink-subtle">No vendor on record.</span>;
  }
  return (
    <div className="grid gap-2">
      <p className="font-semibold">{block.name}</p>
      <ul className="grid gap-1.5">
        {(["email", "phone", "url"] as const).map((field) => (
          <ContactLine key={field} field={field} value={block[field]} />
        ))}
      </ul>
    </div>
  );
}

function ContactLine({ field, value }: { field: "email" | "phone" | "url"; value: ContactField }) {
  const label = { email: "Email", phone: "Phone", url: "URL" }[field];
  return (
    <li className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-1.5">
      <Icon name={contactIcon[field]} className="mt-0.5 size-3.5 text-ink-subtle" />
      <span className="sr-only">{label}: </span>
      {value.value ? (
        <span className="grid min-w-0">
          {field === "email" ? (
            <a
              href={`mailto:${value.value}`}
              className="break-all text-accent underline-offset-4 hover:underline"
            >
              {value.value}
            </a>
          ) : field === "url" ? (
            <a
              href={value.value}
              target="_blank"
              rel="noreferrer"
              className="break-all text-accent underline-offset-4 hover:underline"
            >
              {value.value.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            <span className="tabular-nums">{value.value}</span>
          )}
          <span className="text-[0.75rem] text-ink-subtle">{value.source}</span>
        </span>
      ) : (
        <span className="text-[0.75rem] text-ink-subtle">{value.missing}</span>
      )}
    </li>
  );
}
