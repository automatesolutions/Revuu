import type { Metadata } from "next";
import { DesignOverview } from "@/screens/app/design/design-overview";

export const metadata: Metadata = { title: "Design" };

export default function DesignPage() {
  return <DesignOverview />;
}
