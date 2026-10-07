"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { tweakableTokens, type TweakableToken, type TweakValues } from "@revuu/ui/tweakable";

type Theme = "light" | "dark";

const STYLE_ID = "revuu-tweaks";
const EMPTY: TweakValues = { light: {}, dark: {} };

function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function readComputed(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function toHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe)
    .color.match(/\d+(\.\d+)?/g)
    ?.slice(0, 3)
    .map(Number) ?? [0, 0, 0];
  probe.remove();
  return `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

function parseLength(value: string, unit: "px" | "rem"): number {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return 0;
  if (unit === "rem" && value.endsWith("px")) return n / 16;
  return n;
}

function writeStyle(values: TweakValues) {
  const toRules = (vars: Record<string, string>) =>
    Object.entries(vars)
      .map(([k, v]) => `${k}: ${v};`)
      .join(" ");
  const shared = tweakableTokens.filter((t) => !t.themed).map((t) => t.name);
  const sharedVars = Object.fromEntries(
    Object.entries(values.light).filter(([k]) => shared.includes(k as TweakableToken["name"])),
  );
  const themedLight = Object.fromEntries(
    Object.entries(values.light).filter(([k]) => !(k in sharedVars)),
  );
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = [
    `:root:root { ${toRules(sharedVars)} }`,
    `:root[data-theme="light"] { ${toRules(themedLight)} }`,
    `:root[data-theme="dark"] { ${toRules(values.dark)} }`,
  ].join("\n");
}

export function TweakPanel() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [values, setValues] = useState<TweakValues>(EMPTY);
  const [baseline, setBaseline] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>("");

  const refreshBaseline = useCallback(() => {
    setTheme(currentTheme());
    setBaseline(Object.fromEntries(tweakableTokens.map((t) => [t.name, readComputed(t.name)])));
  }, []);

  useEffect(() => {
    fetch("/api/dev/tweaks")
      .then((r) => r.json() as Promise<TweakValues>)
      .then((saved) => {
        setValues(saved);
        writeStyle(saved);
      })
      .catch(() => undefined);

    const onKey = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        refreshBaseline();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    const observer = new MutationObserver(refreshBaseline);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      window.removeEventListener("keydown", onKey);
      observer.disconnect();
    };
  }, [refreshBaseline]);

  const groups = useMemo(() => {
    const map = new Map<string, TweakableToken[]>();
    for (const token of tweakableTokens)
      map.set(token.group, [...(map.get(token.group) ?? []), token]);
    return [...map.entries()];
  }, []);

  function update(token: TweakableToken, value: string) {
    const bucket: Theme = token.themed ? theme : "light";
    const next: TweakValues = { ...values, [bucket]: { ...values[bucket], [token.name]: value } };
    setValues(next);
    writeStyle(next);
    setStatus("");
  }

  function reset() {
    setValues(EMPTY);
    writeStyle(EMPTY);
    requestAnimationFrame(refreshBaseline);
    setStatus("Cleared unsaved tweaks.");
  }

  async function save() {
    const response = await fetch("/api/dev/tweaks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response.json()) as { saved?: number; error?: string };
    setStatus(
      result.error ??
        `Saved ${result.saved} value(s) to tweaks.json. Run pnpm tweak:bake to write them to tokens.css.`,
    );
  }

  const count = Object.keys(values.light).length + Object.keys(values.dark).length;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          refreshBaseline();
          setOpen(true);
        }}
        className="fixed right-4 bottom-4 z-[100] inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-label text-on-primary shadow-popover"
        aria-keyshortcuts="Alt+T"
      >
        <span className="icon-[lucide--sliders-horizontal] size-4" aria-hidden />
        Tweak{count ? ` (${count})` : ""}
      </button>
    );
  }

  return (
    <aside
      aria-label="Design token tweaks"
      className="fixed right-4 bottom-4 z-[100] flex max-h-[min(78dvh,720px)] w-[340px] flex-col overflow-hidden rounded-lg bg-raised text-ui text-ink shadow-dialog"
    >
      <header className="flex items-center justify-between gap-2 border-b border-hairline px-4 py-3">
        <div>
          <h2 className="font-display text-title">Tweak tokens</h2>
          <p className="text-caption text-ink-subtle">Editing {theme} theme · Alt+T to close</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex size-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface"
          aria-label="Close tweak panel"
        >
          <span className="icon-[lucide--x] size-4" aria-hidden />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {groups.map(([group, tokens]) => (
          <details
            key={group}
            className="border-b border-hairline py-2 last:border-0"
            open={group === "Color"}
          >
            <summary className="cursor-pointer py-1 text-label">{group}</summary>
            <div className="mt-2 grid gap-2">
              {tokens.map((token) => {
                const bucket: Theme = token.themed ? theme : "light";
                const value = values[bucket][token.name] ?? baseline[token.name] ?? "";
                const id = `tweak-${token.name.slice(2)}`;
                return (
                  <div key={token.name} className="grid grid-cols-[1fr_auto] items-center gap-2">
                    <label htmlFor={id} className="truncate text-ink-muted">
                      {token.label}
                      {values[bucket][token.name] ? <span className="text-accent"> •</span> : null}
                    </label>
                    {token.control.kind === "color" ? (
                      <span className="flex items-center gap-2">
                        <code className="mpn text-ink-subtle">{value ? toHex(value) : ""}</code>
                        <input
                          id={id}
                          type="color"
                          value={value ? toHex(value) : "#000000"}
                          onChange={(e) => update(token, e.target.value)}
                          className="h-7 w-10 cursor-pointer rounded-xs border border-border-input bg-raised"
                        />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <input
                          id={id}
                          type="range"
                          min={token.control.min}
                          max={token.control.max}
                          step={token.control.step}
                          value={parseLength(value, token.control.unit)}
                          onChange={(e) =>
                            update(
                              token,
                              `${e.target.value}${(token.control as { unit: string }).unit}`,
                            )
                          }
                          className="w-28 accent-[var(--color-accent)]"
                        />
                        <code className="w-16 text-right mpn text-ink-subtle">
                          {parseLength(value, token.control.unit).toFixed(
                            token.control.unit === "rem" ? 3 : 0,
                          )}
                          {token.control.unit}
                        </code>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </div>

      <footer className="grid gap-2 border-t border-hairline px-4 py-3">
        {status ? (
          <p role="status" className="text-caption text-ink-muted">
            {status}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={reset}
            className="h-8 rounded-md px-3 text-label text-ink-muted hover:bg-surface"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={save}
            disabled={count === 0}
            className="h-8 rounded-md bg-primary px-3 text-label text-on-primary disabled:opacity-40"
          >
            Save {count || ""}
          </button>
        </div>
      </footer>
    </aside>
  );
}
