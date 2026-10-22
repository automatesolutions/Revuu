"use client";

import { useSyncExternalStore } from "react";
import type { ImportResult } from "./types";

/**
 * The imported parts list for this browser tab. There is no database in this milestone, so the
 * list lives in sessionStorage and is gone when the tab closes.
 */
const key = "revuu-parts";
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedValue: ImportResult | null = null;

function read(): ImportResult | null {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(key);
  } catch {
    return cachedValue;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as ImportResult) : null;
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

export function saveImport(result: ImportResult | null) {
  try {
    if (result) sessionStorage.setItem(key, JSON.stringify(result));
    else sessionStorage.removeItem(key);
  } catch {
    // Storage can be blocked; the list then lasts until the page reloads.
  }
  cachedRaw = result ? JSON.stringify(result) : null;
  cachedValue = result;
  listeners.forEach((l) => l());
}

/** `undefined` while the server renders, `null` when nothing is imported yet. */
export function useImport(): ImportResult | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}
