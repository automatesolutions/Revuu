import { Icon, type IconName } from "@revuu/ui/components/icon";
import { LifecycleBadge } from "@revuu/ui/components/status-chip";
import { cn } from "@revuu/ui/lib/cn";
import type { PartRecord } from "@/lib/parts/compare";
import { OutlineDrawing } from "@/screens/app/parts/outline-drawing";

const panel =
  "rounded-lg bg-raised text-ink shadow-[0_0_0_1px_var(--color-hairline),0_16px_40px_-24px_rgb(15_17_21/0.3)]";

function DemoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 border-t border-hairline px-5 py-3 text-caption font-medium text-ink-subtle">
      {children}
    </p>
  );
}

function FitTag({ fit }: { fit: "Drop-in" | "Functional" }) {
  return (
    <span className="inline-flex h-5 items-center gap-1 rounded-xs bg-raised px-1.5 text-[0.75rem] font-semibold whitespace-nowrap text-ink shadow-[inset_0_0_0_1px_var(--color-hairline-strong)]">
      <Icon name={fit === "Drop-in" ? "check" : "git-compare"} className="size-3" />
      {fit}
    </span>
  );
}

const mapping: { header: string; sample: string; field: string | null }[] = [
  { header: "Designator", sample: "Q3", field: "Designator" },
  { header: "Manufacturer Part Number", sample: "IRLML6402TRPBF", field: "MPN" },
  { header: "Description", sample: "MOSFET P-ch 20 V 3.7 A SOT-23", field: "Description" },
  { header: "Category", sample: "Electrical", field: "Category" },
  { header: "Supplier Email", sample: "sales@diodes.example", field: "Vendor email" },
  { header: "Footprint", sample: "SOT-23", field: null },
];

export function MappingMock() {
  return (
    <div className={panel}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline px-5 py-4">
        <p className="text-[0.9375rem] font-bold">Confirm the columns</p>
        <p className="mpn text-ink-subtle">power-board-rev-c.xlsx</p>
      </div>
      <ul className="divide-y divide-hairline">
        {mapping.map((row) => (
          <li
            key={row.header}
            className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center gap-3 px-5 py-2.5"
          >
            <span className="grid min-w-0">
              <span className="truncate text-ui font-semibold">{row.header}</span>
              <span className="truncate text-[0.75rem] text-ink-subtle">{row.sample}</span>
            </span>
            <span
              className={cn(
                "flex h-8 items-center justify-between rounded-md px-2.5 text-ui shadow-[inset_0_0_0_1px_var(--color-border-input)]",
                row.field ? "bg-raised text-ink" : "bg-surface text-ink-subtle",
              )}
            >
              {row.field ?? "Not mapped"}
              <Icon name="chevrons-up-down" className="size-3.5 text-ink-subtle" />
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-5 py-4">
        <p className="text-caption font-medium text-ink-subtle">
          11 parts will be created. 1 line skipped: missing MPN.
        </p>
        <span className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-[0.875rem] font-semibold text-on-primary">
          <Icon name="check" />
          Create 11 parts
        </span>
      </div>
    </div>
  );
}

type Cell = { value: string; differs?: boolean };
type MockRow = { label: string; base: string; alts: Cell[] };
type MockGroup = { group: string; rows: MockRow[] };

const same = (value: string, count: number): Cell[] =>
  Array.from({ length: count }, () => ({ value }));

const mosfet = (mpn: string, manufacturer: string): PartRecord => ({
  mpn,
  manufacturer,
  category: "electrical",
  specs: {
    package: "SOT-23",
    pins: 3,
    bodyLength: "2.9 mm",
    bodyWidth: "1.3 mm",
    pitch: "0.95 mm",
  },
  lifecycle: "active",
  stock: null,
  unitPrice: null,
  datasheet: null,
  vendor: null,
  source: "Demo data",
  age: "",
});

const q3Alternates = [
  { mpn: "DMP2035U-7", maker: "Diodes Inc." },
  { mpn: "SI2343CDS-T1-GE3", maker: "Vishay" },
  { mpn: "AO3401A", maker: "Alpha & Omega" },
];

const q3Groups: MockGroup[] = [
  {
    group: "Ratings",
    rows: [
      {
        label: "Vds",
        base: "−20 V",
        alts: [
          { value: "−20 V" },
          { value: "−30 V", differs: true },
          { value: "−30 V", differs: true },
        ],
      },
      {
        label: "Id",
        base: "−3.7 A",
        alts: [
          { value: "−3.6 A", differs: true },
          { value: "−4.0 A", differs: true },
          { value: "−4.0 A", differs: true },
        ],
      },
      {
        label: "Rds(on)",
        base: "65 mΩ",
        alts: [
          { value: "35 mΩ", differs: true },
          { value: "0.045 Ω", differs: true },
          { value: "50 mΩ", differs: true },
        ],
      },
    ],
  },
  {
    group: "Package and dimensions",
    rows: [
      { label: "Package", base: "SOT-23", alts: same("SOT-23", 3) },
      { label: "Body", base: "2.9 × 1.3 mm", alts: same("2.9 × 1.3 mm", 3) },
      { label: "Lead pitch", base: "0.95 mm", alts: same("0.95 mm", 3) },
    ],
  },
  {
    group: "Functional",
    rows: [
      {
        label: "Vgs(th), max",
        base: "−1.2 V",
        alts: [
          { value: "−1.0 V", differs: true },
          { value: "−2.5 V", differs: true },
          { value: "−1.3 V", differs: true },
        ],
      },
      {
        label: "Gate charge",
        base: "8.0 nC",
        alts: [
          { value: "9.6 nC", differs: true },
          { value: "11 nC", differs: true },
          { value: "7.0 nC", differs: true },
        ],
      },
    ],
  },
];

function MockCell({ cell }: { cell: Cell }) {
  return (
    <td
      className={cn(
        "border-b border-hairline px-2 py-1.5 align-top tabular-nums",
        cell.differs && "bg-status-warning-bg",
      )}
    >
      <span className="inline-flex items-start gap-1">
        {cell.differs ? (
          <Icon
            name="differs"
            label="Differs from baseline"
            className="mt-0.5 size-3 shrink-0 text-status-warning"
          />
        ) : null}
        {cell.value}
      </span>
    </td>
  );
}

function MockGroups({ groups, columns }: { groups: MockGroup[]; columns: number }) {
  return groups.map((g) => (
    <tbody key={g.group}>
      <tr>
        <th
          scope="rowgroup"
          colSpan={columns}
          className="border-b border-hairline bg-canvas px-4 pt-2.5 pb-1 text-left text-caption text-ink"
        >
          {g.group}
        </th>
      </tr>
      {g.rows.map((row) => (
        <tr key={row.label}>
          <th
            scope="row"
            className="border-b border-hairline px-4 py-1.5 text-left align-top text-caption text-ink-muted"
          >
            {row.label}
          </th>
          <td className="border-b border-hairline px-2 py-1.5 align-top tabular-nums">
            {row.base}
          </td>
          {row.alts.map((cell, i) => (
            <MockCell key={i} cell={cell} />
          ))}
        </tr>
      ))}
    </tbody>
  ));
}

export function AlternatesMock() {
  const records = [
    mosfet("IRLML6402TRPBF", "Infineon"),
    ...q3Alternates.map((a) => mosfet(a.mpn, a.maker)),
  ];
  return (
    <div className={panel}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-3.5">
        <span className="mpn">Q3 · IRLML6402TRPBF</span>
        <LifecycleBadge lifecycle="eol" source="Vendor record" age="1 d ago" size="sm" />
        <span className="ml-auto text-caption font-medium text-ink-subtle">3 alternates</span>
      </div>
      <div
        role="region"
        aria-label="Alternates comparison"
        tabIndex={0}
        className="relative overflow-x-auto"
      >
        <table className="w-full min-w-[32rem] table-fixed text-[0.8125rem]">
          <caption className="sr-only">
            IRLML6402TRPBF compared with DMP2035U-7, SI2343CDS-T1-GE3 and AO3401A
          </caption>
          <colgroup>
            <col className="w-[22%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface text-left align-top">
              <td className="border-b border-hairline" />
              <th scope="col" className="border-b border-hairline px-2 py-2 font-normal">
                <span className="grid gap-1">
                  <span className="w-fit rounded-xs bg-sunken px-1.5 text-[0.6875rem] font-semibold text-ink-muted">
                    Baseline
                  </span>
                  <span className="mpn text-[0.6875rem] break-all">IRLML6402TRPBF</span>
                </span>
              </th>
              {q3Alternates.map((alt) => (
                <th
                  key={alt.mpn}
                  scope="col"
                  className="border-b border-hairline px-2 py-2 font-normal"
                >
                  <span className="grid gap-1">
                    <FitTag fit="Drop-in" />
                    <span className="mpn text-[0.6875rem] break-all">{alt.mpn}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <MockGroups groups={q3Groups} columns={5} />
          <tbody>
            <tr>
              <th scope="row" className="px-4 py-2 text-left align-top text-caption text-ink-muted">
                Outline
              </th>
              {records.map((r) => (
                <td key={r.mpn} className="px-1 py-2 align-top">
                  <OutlineDrawing record={r} pxPerMm={14} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <DemoNote>
        <Icon name="differs" className="size-3.5 text-status-warning" />
        Marked values differ after unit normalization. Outlines drawn to one scale. Demo data.
      </DemoNote>
    </div>
  );
}

const standoff = (mpn: string, length: string): PartRecord => ({
  mpn,
  manufacturer: "Calder Standoffs",
  category: "mechanical",
  specs: { thread: "M3 × 0.5", length, acrossFlats: "5.5 mm", threadDepth: "4 mm" },
  lifecycle: "active",
  stock: null,
  unitPrice: null,
  datasheet: null,
  vendor: null,
  source: "Demo data",
  age: "",
});

const standoffGroups: MockGroup[] = [
  {
    group: "Fit",
    rows: [
      { label: "Thread", base: "M3 × 0.5", alts: [{ value: "M3 × 0.5" }] },
      { label: "Length", base: "10 mm", alts: [{ value: "12 mm", differs: true }] },
      { label: "Material", base: "Brass", alts: [{ value: "Brass" }] },
    ],
  },
  {
    group: "Dimensions",
    rows: [
      { label: "Hex across flats", base: "5.5 mm", alts: [{ value: "5.5 mm" }] },
      { label: "Thread depth", base: "4 mm", alts: [{ value: "4 mm" }] },
    ],
  },
  {
    group: "Functional",
    rows: [
      { label: "Finish", base: "Nickel plated", alts: [{ value: "Nickel plated" }] },
      {
        label: "Drive or head",
        base: "Female-female, hex",
        alts: [{ value: "Female-female, hex" }],
      },
      { label: "Max torque", base: "0.6 N·m", alts: [{ value: "0.6 N·m" }] },
    ],
  },
];

export function MechanicalMock() {
  const records = [standoff("HSO-M3X10-BR-NI", "10 mm"), standoff("HSO-M3X12-BR-NI", "12 mm")];
  return (
    <div className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-4 py-3.5">
        <span className="mpn">SO1–SO4 · HSO-M3X10-BR-NI</span>
        <FitTag fit="Functional" />
      </div>
      <div
        role="region"
        aria-label="Standoff comparison"
        tabIndex={0}
        className="relative overflow-x-auto"
      >
        <table className="w-full min-w-[26rem] table-fixed text-[0.8125rem]">
          <caption className="sr-only">Standoff compared with HSO-M3X12-BR-NI</caption>
          <colgroup>
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface text-left text-caption text-ink-muted">
              <td className="border-b border-hairline" />
              <th scope="col" className="h-8 border-b border-hairline px-2 font-semibold">
                Baseline
              </th>
              <th scope="col" className="h-8 border-b border-hairline px-2 font-semibold">
                <span className="mpn">HSO-M3X12-BR-NI</span>
              </th>
            </tr>
          </thead>
          <MockGroups groups={standoffGroups} columns={3} />
          <tbody>
            <tr>
              <th
                scope="row"
                className="border-b border-hairline px-4 py-2 text-left align-top text-caption text-ink-muted"
              >
                Outline, side view
              </th>
              <td className="border-b border-hairline px-2 py-2 align-top">
                <OutlineDrawing record={records[0]!} pxPerMm={8} />
              </td>
              <td className="border-b border-hairline bg-status-warning-bg px-2 py-2 align-top">
                <OutlineDrawing record={records[1]!} pxPerMm={8} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="px-4 py-3.5 text-body-sm">
        Length is 12 mm against a 10 mm baseline. Confirm the stack height.
      </p>
    </div>
  );
}

const contacts: { icon: IconName; value: string | null; source: string }[] = [
  { icon: "mail", value: "sales@diodes.example", source: "Imported list" },
  { icon: "phone", value: "+1 555 0150", source: "Imported list" },
  { icon: "globe", value: "diodes.example", source: "Vendor record" },
];

export function VendorMock() {
  return (
    <div className="grid gap-4">
      <div className={panel}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-5 py-4">
          <p className="text-[0.9375rem] font-bold">Diodes Inc.</p>
          <span className="mpn text-ink-subtle">DMP2035U-7</span>
        </div>
        <ul className="grid gap-3 px-5 py-4">
          {contacts.map((c) => (
            <li key={c.icon} className="grid grid-cols-[1rem_1fr] gap-x-2">
              <Icon name={c.icon} className="mt-0.5 size-4 text-ink-subtle" />
              <span className="grid">
                <span className="text-body-sm text-accent">{c.value}</span>
                <span className="text-caption font-medium text-ink-subtle">{c.source}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={cn(panel, "flex items-start gap-3 px-5 py-4")}>
        <Icon name="mail" className="mt-0.5 size-4 text-ink-subtle" />
        <span className="grid">
          <span className="text-body-sm font-semibold">Alpha &amp; Omega</span>
          <span className="text-caption font-medium text-ink-subtle">
            No vendor email in this list or the vendor record.
          </span>
        </span>
      </div>
    </div>
  );
}
