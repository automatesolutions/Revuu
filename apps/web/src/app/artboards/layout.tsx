import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { artboardsEnabled } from "@/artboards/registry";

export const instant = false;

export const metadata: Metadata = {
  title: "Artboards",
  robots: { index: false, follow: false },
};

export default function ArtboardsLayout({ children }: { children: React.ReactNode }) {
  if (!artboardsEnabled()) notFound();
  return children;
}
