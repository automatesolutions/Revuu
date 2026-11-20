import type { Metadata } from "next";
import { MarketingHome } from "@/screens/marketing/home";

export const metadata: Metadata = {
  title: { absolute: "Revuu · Hardware design and parts comparison" },
  description:
    "Compare an original part with up to 4 alternates from their datasheets, with a judgement and the checks to run. Hardware design in one run on your own keys.",
};

export default function HomePage() {
  return <MarketingHome />;
}
