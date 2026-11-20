import type { Metadata } from "next";
import { NewComparison } from "@/screens/app/parts/new-comparison";

export const metadata: Metadata = { title: "Compare parts" };

export default function NewComparisonPage() {
  return <NewComparison />;
}
