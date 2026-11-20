import type { Metadata } from "next";
import { Settings } from "@/screens/app/settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <Settings />;
}
