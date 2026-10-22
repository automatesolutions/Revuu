import type { PartRecord } from "@/lib/parts/compare";
import { parseMeasure, type SpecValue } from "@/lib/parts/units";

/** Millimetres from a spec value such as "2.9 mm", or null when it is missing or not a length. */
export function mm(value: SpecValue | undefined) {
  if (typeof value !== "string") return null;
  const m = parseMeasure(value);
  return m?.unit === "m" ? m.value * 1000 : null;
}

function threadDiameter(thread: SpecValue | undefined) {
  const match = typeof thread === "string" ? thread.match(/M\s*(\d+(?:\.\d+)?)/i) : null;
  return match ? Number(match[1]) : null;
}

/** The longest outline dimension in mm, so every drawing in a row can share one scale. */
export function drawingExtent(record: PartRecord) {
  if (record.category === "electrical") return mm(record.specs.bodyLength) ?? 0;
  return mm(record.specs.length) ?? 0;
}

const fmt = (n: number) => `${Number(n.toFixed(2))} mm`;

// Labels and gaps are in px, so text stays crisp at any scale.
const TEXT = 11;
const GAP = 6;

/**
 * An outline drawn from the record's dimensions at `pxPerMm`. Electrical parts get a top view
 * with body size and lead pitch; mechanical parts get a side view with length, hex across flats
 * and thread depth. It is not the manufacturer's drawing.
 */
export function OutlineDrawing({ record, pxPerMm }: { record: PartRecord; pxPerMm: number }) {
  return record.category === "electrical" ? (
    <PackageTopView record={record} k={pxPerMm} />
  ) : (
    <StandoffSideView record={record} k={pxPerMm} />
  );
}

function Missing() {
  return <span className="text-ink-subtle">No dimensions on record</span>;
}

function PackageTopView({ record, k }: { record: PartRecord; k: number }) {
  const lengthMm = mm(record.specs.bodyLength);
  const widthMm = mm(record.specs.bodyWidth);
  const pitchMm = mm(record.specs.pitch);
  const pins = typeof record.specs.pins === "number" ? record.specs.pins : null;
  if (!lengthMm || !widthMm || !pitchMm || !pins) return <Missing />;

  const length = lengthMm * k;
  const width = widthMm * k;
  const pitch = pitchMm * k;
  // Leads are drawn schematically; their length is not in the record.
  const lead = Math.max(6, 0.5 * k);
  const leadW = Math.min(0.4 * k, pitch * 0.5);
  const bottom = Math.ceil(pins / 2);
  const top = pins - bottom;
  const xs = (count: number) =>
    Array.from({ length: count }, (_, i) => length / 2 + (i - (count - 1) / 2) * pitch);

  const ox = 4;
  const oy = TEXT + GAP * 2;
  const w = ox + length + GAP * 2 + TEXT * 4;
  const h = oy + lead * 2 + width + GAP + TEXT + 4;
  const label = `Top view outline of ${record.mpn}: ${record.specs.package ?? "package"}, body ${fmt(lengthMm)} by ${fmt(widthMm)}, ${pins} leads at ${fmt(pitchMm)} pitch.`;
  const bodyY = oy + lead;
  const bx = xs(bottom);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className="block overflow-visible"
    >
      <DimLine x1={ox} x2={ox + length} y={oy - GAP} label={fmt(lengthMm)} />
      {xs(top).map((x) => (
        <rect
          key={`t${x}`}
          x={ox + x - leadW / 2}
          y={bodyY - lead}
          width={leadW}
          height={lead}
          className="fill-hairline-strong"
        />
      ))}
      {bx.map((x) => (
        <rect
          key={`b${x}`}
          x={ox + x - leadW / 2}
          y={bodyY + width}
          width={leadW}
          height={lead}
          className="fill-hairline-strong"
        />
      ))}
      <rect
        x={ox}
        y={bodyY}
        width={length}
        height={width}
        rx={2}
        className="fill-sunken stroke-ink"
        strokeWidth={1}
      />
      <circle cx={ox + 5} cy={bodyY + width - 5} r={2} className="fill-ink-muted" />
      <line
        x1={ox + length + GAP}
        x2={ox + length + GAP}
        y1={bodyY}
        y2={bodyY + width}
        className="stroke-ink-subtle"
      />
      <text
        x={ox + length + GAP * 2}
        y={bodyY + width / 2 + TEXT * 0.35}
        fontSize={TEXT}
        className="fill-ink-muted"
      >
        {fmt(widthMm)}
      </text>
      {bottom > 1 ? (
        <text
          x={ox + (bx[0]! + bx[1]!) / 2}
          y={bodyY + width + lead + GAP + TEXT * 0.8}
          fontSize={TEXT}
          textAnchor="middle"
          className="fill-ink-subtle"
        >
          {fmt(pitchMm)} pitch
        </text>
      ) : null}
    </svg>
  );
}

function StandoffSideView({ record, k }: { record: PartRecord; k: number }) {
  const lengthMm = mm(record.specs.length);
  const flatsMm = mm(record.specs.acrossFlats);
  const depthMm = mm(record.specs.threadDepth);
  const threadMm = threadDiameter(record.specs.thread);
  if (!lengthMm || !flatsMm) return <Missing />;

  const length = lengthMm * k;
  const flats = flatsMm * k;
  const ox = 4;
  const oy = TEXT + GAP * 2;
  const w = ox + length + GAP * 2 + TEXT * 4.5;
  const h = oy + flats + 4;
  const label = `Side view outline of ${record.mpn}: length ${fmt(lengthMm)}, hex ${fmt(flatsMm)} across flats${depthMm ? `, thread depth ${fmt(depthMm)} at each end` : ""}.`;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className="block overflow-visible"
    >
      <DimLine x1={ox} x2={ox + length} y={oy - GAP} label={fmt(lengthMm)} />
      <rect
        x={ox}
        y={oy}
        width={length}
        height={flats}
        className="fill-sunken stroke-ink"
        strokeWidth={1}
      />
      {/* Hex faces seen from the side. */}
      {[0.25, 0.75].map((f) => (
        <line
          key={f}
          x1={ox}
          x2={ox + length}
          y1={oy + flats * f}
          y2={oy + flats * f}
          className="stroke-hairline-strong"
        />
      ))}
      {/* Female threads at both ends, as hidden lines. */}
      {depthMm && threadMm
        ? [ox, ox + length - depthMm * k].map((x) => (
            <rect
              key={x}
              x={x}
              y={oy + (flats - threadMm * k) / 2}
              width={depthMm * k}
              height={threadMm * k}
              className="fill-none stroke-ink-muted"
              strokeDasharray="3 2"
            />
          ))
        : null}
      <text
        x={ox + length + GAP}
        y={oy + flats / 2 + TEXT * 0.35}
        fontSize={TEXT}
        className="fill-ink-muted"
      >
        {fmt(flatsMm)} AF
      </text>
    </svg>
  );
}

function DimLine({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g className="stroke-ink-subtle">
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <line x1={x1} x2={x1} y1={y - 3} y2={y + 3} />
      <line x1={x2} x2={x2} y1={y - 3} y2={y + 3} />
      <text
        x={(x1 + x2) / 2}
        y={y - 4}
        fontSize={TEXT}
        textAnchor="middle"
        stroke="none"
        className="fill-ink-muted"
      >
        {label}
      </text>
    </g>
  );
}
