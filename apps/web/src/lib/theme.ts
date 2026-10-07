export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "revuu-theme";

export const themeInitScript = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`;

export function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "dark" || value === "system" ? value : "light";
  } catch {
    return "light";
  }
}

const THEME_EVENT = "revuu-theme-change";

export function applyThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {}
  document.documentElement.setAttribute("data-theme", resolveTheme(preference));
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** For useSyncExternalStore. Also follows OS changes while the preference is "system". */
export function subscribeTheme(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    if (readThemePreference() === "system") applyThemePreference("system");
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    document.documentElement.setAttribute("data-theme", resolveTheme(readThemePreference()));
    onChange();
  };
  media.addEventListener("change", onMedia);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onMedia);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}
