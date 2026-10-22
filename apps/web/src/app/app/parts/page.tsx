import type { Metadata } from "next";
import { PartsScreen } from "@/screens/app/parts/parts-screen";

export const metadata: Metadata = { title: "Parts" };

export default function PartsPage() {
  return <PartsScreen />;
}
