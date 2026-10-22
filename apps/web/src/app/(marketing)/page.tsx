import type { Metadata } from "next";
import { MarketingHome } from "@/screens/marketing/home";

export const metadata: Metadata = {
  title: { absolute: "Revuu · Compare every part before you order" },
  description:
    "Import a CSV or Excel parts list. Revuu lines up each electrical and mechanical part with its alternates, spec by spec.",
};

export default function HomePage() {
  return <MarketingHome />;
}
