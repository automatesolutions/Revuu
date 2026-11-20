import { AppShell } from "@/screens/app/app-shell";
import { Dashboard } from "@/screens/app/dashboard";
import { Settings } from "@/screens/app/settings";

export function AppShellArtboard({ state }: { state: string }) {
  if (state === "settings") {
    return (
      <AppShell current="settings" title="Settings">
        <Settings />
      </AppShell>
    );
  }
  return (
    <AppShell current="dashboard" title="Dashboard" paletteOpen={state === "command-palette"}>
      <Dashboard />
    </AppShell>
  );
}
