export type TweakControl =
  | { kind: "color" }
  | { kind: "length"; unit: "px" | "rem"; min: number; max: number; step: number };

export interface TweakableToken {
  name: `--${string}`;
  label: string;
  group: "Color" | "Material blocks" | "Status" | "Type" | "Radius" | "Spacing";
  control: TweakControl;
  /** Theme-independent tokens are written to the light (@theme) block only. */
  themed: boolean;
}

const color = (
  name: string,
  label: string,
  group: TweakableToken["group"] = "Color",
): TweakableToken => ({
  name: `--color-${name}`,
  label,
  group,
  control: { kind: "color" },
  themed: true,
});

const rem = (
  name: string,
  label: string,
  min: number,
  max: number,
  step = 0.0625,
): TweakableToken => ({
  name: `--${name}`,
  label,
  group: name.startsWith("text") ? "Type" : "Spacing",
  control: { kind: "length", unit: "rem", min, max, step },
  themed: false,
});

const px = (name: string, label: string, min: number, max: number, step = 1): TweakableToken => ({
  name: `--${name}`,
  label,
  group: "Radius",
  control: { kind: "length", unit: "px", min, max, step },
  themed: false,
});

export const tweakableTokens: TweakableToken[] = [
  color("canvas", "Canvas"),
  color("surface", "Surface"),
  color("raised", "Raised"),
  color("hairline", "Hairline"),
  color("ink", "Ink"),
  color("ink-muted", "Ink muted"),
  color("ink-subtle", "Ink subtle"),
  color("primary", "Primary"),
  color("accent", "Accent (copper)"),
  color("focus", "Focus ring"),
  color("block-solder", "Solder mask", "Material blocks"),
  color("block-fr4", "FR4", "Material blocks"),
  color("block-silk", "Silkscreen", "Material blocks"),
  color("block-copper", "Copper", "Material blocks"),
  color("block-board", "Board navy", "Material blocks"),
  color("status-approved", "Approved text", "Status"),
  color("status-approved-bg", "Approved fill", "Status"),
  color("status-warning", "Warning text", "Status"),
  color("status-warning-bg", "Warning fill", "Status"),
  color("status-eol", "EOL text", "Status"),
  color("status-eol-bg", "EOL fill", "Status"),
  color("status-rejected", "Rejected text", "Status"),
  color("status-rejected-bg", "Rejected fill", "Status"),
  color("status-pending", "Pending text", "Status"),
  color("status-pending-bg", "Pending fill", "Status"),
  rem("text-display-xl", "Display XL", 3, 7),
  rem("text-display-lg", "Display L", 2.25, 5),
  rem("text-headline", "Headline", 1.5, 3),
  rem("text-page-title", "Page title", 1.25, 2.25),
  rem("text-title", "Title", 1, 1.75),
  rem("text-body-lg", "Body L", 1, 1.5),
  rem("text-body", "Body", 0.875, 1.25),
  rem("text-body-sm", "Body S", 0.75, 1),
  rem("text-ui", "UI (tables)", 0.6875, 0.9375),
  rem("spacing", "Spacing unit", 0.1875, 0.3125, 0.015625),
  px("radius-xs", "Radius XS", 0, 8),
  px("radius-md", "Radius M", 2, 14),
  px("radius-lg", "Radius L", 8, 24),
  px("radius-xl", "Radius XL", 12, 40),
];

export type TweakValues = { light: Record<string, string>; dark: Record<string, string> };
