import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { color, contrastPairs, type Theme } from "../src/tokens.ts";
import { contrastRatio } from "../src/lib/contrast.ts";

const tokensCss = readFileSync(
  fileURLToPath(new URL("../src/tokens.css", import.meta.url)),
  "utf8",
);

let failures = 0;
let drift = 0;

const blocks: Record<Theme, string[]> = {
  light: ["@theme", '[data-theme="light"]'],
  dark: ['[data-theme="dark"]'],
};

for (const theme of ["light", "dark"] as Theme[]) {
  const palette = color[theme];

  for (const selector of blocks[theme]) {
    const block = extractBlock(tokensCss, selector);
    for (const [name, value] of Object.entries(palette)) {
      if (!value.startsWith("#")) continue;
      const cssValue = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(block)?.[1];
      if (cssValue?.toLowerCase() !== value.toLowerCase()) {
        drift++;
        console.error(
          `drift  ${theme.padEnd(5)} ${selector} --color-${name}: css=${cssValue ?? "missing"} ts=${value}`,
        );
      }
    }
  }

  for (const { fg, bg, min } of contrastPairs) {
    const ratio = contrastRatio(palette[fg], palette[bg]);
    const ok = ratio >= min;
    if (!ok) failures++;
    const line = `${ok ? "pass" : "FAIL"}  ${theme.padEnd(5)} ${fg} on ${bg}: ${ratio.toFixed(2)} (min ${min})`;
    if (ok) console.log(line);
    else console.error(line);
  }
}

if (failures || drift) {
  console.error(
    `\n${failures} contrast failure(s), ${drift} token drift(s) between tokens.ts and tokens.css`,
  );
  process.exit(1);
}
console.log("\nAll token pairs meet WCAG AA and tokens.css matches tokens.ts.");

function extractBlock(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return "";
  return css.slice(start, css.indexOf("}", start));
}
