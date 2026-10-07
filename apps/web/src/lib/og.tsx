import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };

export async function ogFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [cabinet, satoshi] = await Promise.all([
    readFile(join(dir, "CabinetGrotesk-Bold.ttf")),
    readFile(join(dir, "Satoshi-Medium.ttf")),
  ]);
  return [
    { name: "Cabinet Grotesk", data: cabinet, weight: 700 as const, style: "normal" as const },
    { name: "Satoshi", data: satoshi, weight: 500 as const, style: "normal" as const },
  ];
}

export function OgMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="#0F1115" />
      <path
        d="M7.5 16.5 12.75 21.75 21.25 10.75"
        fill="none"
        stroke="#FBFAF7"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.75" cy="10.25" r="3.6" fill="#FBFAF7" />
      <circle cx="21.75" cy="10.25" r="1.45" fill="#0F1115" />
      <circle cx="24.6" cy="24.6" r="1.7" fill="#FBFAF7" />
    </svg>
  );
}

const chips = [
  { label: "Schematic", status: "Approved", fg: "#137137", bg: "#DDF3E4" },
  { label: "PCB layout", status: "Approved", fg: "#137137", bg: "#DDF3E4" },
  { label: "Parts", status: "2 EOL", fg: "#6235C2", bg: "#ECE5FB" },
];

/** Shared Open Graph card. Title is the only per-route variable. */
export function OgCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#FBFAF7",
        padding: 64,
        fontFamily: "Satoshi",
        color: "#0F1115",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <OgMark />
          <span style={{ fontFamily: "Cabinet Grotesk", fontSize: 40, letterSpacing: "-0.03em" }}>
            Revuu
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 660 }}>
          <div
            style={{
              fontFamily: "Cabinet Grotesk",
              fontSize: 76,
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#4A4F59" }}>{subtitle}</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 14,
          width: 380,
          padding: 32,
          borderRadius: 24,
          background: "#EFE6CC",
        }}
      >
        <div style={{ fontSize: 22, color: "#4A4F59", marginBottom: 6 }}>Rev C reviews</div>
        {chips.map((chip) => (
          <div
            key={chip.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "16px 18px",
              fontSize: 22,
            }}
          >
            <span>{chip.label}</span>
            <span
              style={{
                background: chip.bg,
                color: chip.fg,
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 18,
              }}
            >
              {chip.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
