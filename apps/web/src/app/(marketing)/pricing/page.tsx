import type { Metadata } from "next";
import { PricingPage } from "@/screens/marketing/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free. Team and Business plans are priced per seat, with prices set before launch.",
};

export default function Pricing() {
  return <PricingPage />;
}
