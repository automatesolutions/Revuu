"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { readThemePreference, resolveTheme } from "@/lib/theme";
import { TweakPanel } from "./tweak-panel";

const noop = () => () => {};

export function DevTools() {
  // React's dev-mode remount resets <html> attributes set by the inline theme script.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", resolveTheme(readThemePreference()));
  }, []);

  // Artboard frames are iframes; the panel belongs to the top-level page only.
  const topLevel = useSyncExternalStore(
    noop,
    () => window.self === window.top,
    () => false,
  );

  return topLevel ? <TweakPanel /> : null;
}
