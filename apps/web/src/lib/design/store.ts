"use client";

import { useSyncExternalStore } from "react";
import type { DesignRun } from "./brief";

/**
 * The last design run for this browser tab. There is no database in this milestone, so the run
 * lives in sessionStorage and is gone when the tab closes. The brief itself is not stored.
 */
const key = "revuu-design-run";
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedValue: DesignRun | null = null;

function read(): DesignRun | null {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(key);
  } catch {
    return cachedValue;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as DesignRun) : null;
    } catch {
      cachedValue = null;
    }
  }
  return cachedValue;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function saveRun(run: DesignRun | null) {
  try {
    if (run) sessionStorage.setItem(key, JSON.stringify(run));
    else sessionStorage.removeItem(key);
  } catch {
    // Storage can be blocked; the run then lasts until the page reloads.
  }
  cachedRaw = run ? JSON.stringify(run) : null;
  cachedValue = run;
  listeners.forEach((l) => l());
}

/** `undefined` while the server renders, `null` when there is no run yet. */
export function useLastRun(): DesignRun | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}
