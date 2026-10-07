import type { Metadata } from "next";
import { AppShell } from "@/screens/app/app-shell";

export const metadata: Metadata = {
  title: { template: "%s · Revuu", default: "Dashboard" },
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell notice="Demo workspace with sample data. Sign-up opens at launch.">
      {children}
    </AppShell>
  );
}
