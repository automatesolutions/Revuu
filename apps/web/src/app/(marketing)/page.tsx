import type { Metadata } from "next";
import { MarketingHome } from "@/screens/marketing/home";

export const metadata: Metadata = {
  title: { absolute: "Revuu · Design reviews and sign-off for hardware teams" },
  description:
    "Schematic, layout and parts reviews with sign-off, for hardware teams that release on a schedule.",
};

export default function HomePage() {
  return <MarketingHome />;
}
