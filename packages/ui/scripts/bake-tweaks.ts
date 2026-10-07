import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { TweakValues } from "../src/tweakable.ts";

const tweaksPath = fileURLToPath(new URL("../../../apps/web/tweaks.json", import.meta.url));
const cssPath = fileURLToPath(new URL("../src/tokens.css", import.meta.url));
const tsPath = fileURLToPath(new URL("../src/tokens.ts", import.meta.url));

const tweaks = readTweaks();
const entries = Object.entries(tweaks.light).length + Object.entries(tweaks.dark).length;
if (entries === 0) {
  console.log("tweaks.json is empty. Nothing to bake.");
  process.exit(0);
}

let css = readFileSync(cssPath, "utf8");
let ts = readFileSync(tsPath, "utf8");

for (const [theme, values] of Object.entries(tweaks) as [
  keyof TweakValues,
  Record<string, string>,
][]) {
  const selector = theme === "light" ? "@theme {" : '[data-theme="dark"] {';
  for (const [name, value] of Object.entries(values)) {
    css = setCssVar(css, selector, name, value);
    if (theme === "light" && /^--(color|shadow)-/.test(name)) {
      css = setCssVar(css, '[data-theme="light"] {', name, value);
    }
    if (name.startsWith("--color-") && value.startsWith("#")) {
      ts = setTsColor(ts, theme, name.slice("--color-".length), value.toUpperCase());
    }
    console.log(`baked  ${theme.padEnd(5)} ${name}: ${value}`);
  }
}

writeFileSync(cssPath, css);
writeFileSync(tsPath, ts);
writeFileSync(tweaksPath, `${JSON.stringify({ light: {}, dark: {} }, null, 2)}\n`);
console.log(
  "\nUpdated tokens.css and tokens.ts. Run `pnpm check:contrast`, then update DESIGN.md.",
);

function readTweaks(): TweakValues {
  try {
    const parsed = JSON.parse(readFileSync(tweaksPath, "utf8")) as Partial<TweakValues>;
    return { light: parsed.light ?? {}, dark: parsed.dark ?? {} };
  } catch {
    return { light: {}, dark: {} };
  }
}

function setCssVar(source: string, selector: string, name: string, value: string): string {
  const start = source.indexOf(selector);
  if (start === -1) throw new Error(`Selector ${selector} not found in tokens.css`);
  const end = source.indexOf("\n}", start);
  const block = source.slice(start, end);
  const pattern = new RegExp(`(\\n\\s*${escape(name)}:\\s*)[^;]+;`);
  const next = pattern.test(block)
    ? block.replace(pattern, `$1${value.toLowerCase()};`)
    : `${block}\n  ${name}: ${value.toLowerCase()};`;
  return source.slice(0, start) + next + source.slice(end);
}

function setTsColor(source: string, theme: keyof TweakValues, key: string, value: string): string {
  const darkStart = source.indexOf("  dark: {");
  const [from, to] =
    theme === "light" ? [0, darkStart] : [darkStart, source.indexOf("} as const", darkStart)];
  const section = source.slice(from, to);
  const pattern = new RegExp(`(\\n\\s*"?${escape(key)}"?:\\s*")#[0-9A-Fa-f]{6}(")`);
  if (!pattern.test(section)) {
    console.warn(`warn   ${theme} color "${key}" not found in tokens.ts; add it by hand.`);
    return source;
  }
  return source.slice(0, from) + section.replace(pattern, `$1${value}$2`) + source.slice(to);
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
