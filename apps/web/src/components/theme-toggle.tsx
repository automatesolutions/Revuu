"use client";

import { useSyncExternalStore } from "react";
import { Icon, type IconName } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import {
  applyThemePreference,
  readThemePreference,
  subscribeTheme,
  type ThemePreference,
} from "@/lib/theme";

const options: { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const preference = useSyncExternalStore<ThemePreference>(
    subscribeTheme,
    readThemePreference,
    () => "light",
  );

  function choose(value: ThemePreference) {
    applyThemePreference(value);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn("inline-flex items-center gap-0.5 rounded-md bg-surface p-0.5", className)}
      onKeyDown={(event) => {
        const index = options.findIndex((o) => o.value === preference);
        const delta =
          event.key === "ArrowRight" || event.key === "ArrowDown"
            ? 1
            : event.key === "ArrowLeft" || event.key === "ArrowUp"
              ? -1
              : 0;
        if (!delta) return;
        event.preventDefault();
        const next = options[(index + delta + options.length) % options.length]!;
        choose(next.value);
        (
          event.currentTarget.querySelector(`[data-value="${next.value}"]`) as HTMLElement | null
        )?.focus();
      }}
    >
      {options.map((option) => {
        const checked = preference === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.label}
            title={option.label}
            data-value={option.value}
            tabIndex={checked ? 0 : -1}
            onClick={() => choose(option.value)}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-sm transition-colors duration-120 ease-standard",
              checked ? "bg-raised text-ink shadow-popover" : "text-ink-muted hover:text-ink",
            )}
          >
            <Icon name={option.icon} />
          </button>
        );
      })}
    </div>
  );
}
