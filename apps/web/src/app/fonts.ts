import localFont from "next/font/local";

export const cabinetGrotesk = localFont({
  src: "./fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-cabinet",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    { path: "./fonts/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable-latin.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
});

export const fontVariables = [
  cabinetGrotesk.variable,
  satoshi.variable,
  jetbrainsMono.variable,
].join(" ");
