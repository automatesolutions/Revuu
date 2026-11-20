import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import { themeInitScript } from "@/lib/theme";
import { DevTools } from "@/components/dev/dev-tools";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Revuu: BOM import and alternate part comparison",
    template: "%s · Revuu",
  },
  description:
    "Compare an original part with its alternates from their datasheets. Replacement judgement, checks to run and cost. Hardware design in one run on your own keys.",
  applicationName: "Revuu",
};

export const viewport: Viewport = {
  themeColor: "#FBFAF7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <DevTools /> : null}
      </body>
    </html>
  );
}
