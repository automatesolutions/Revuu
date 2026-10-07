import { AppShell } from "@/screens/app/app-shell";
import { Dashboard } from "@/screens/app/dashboard";
import { PlaceholderPage } from "@/screens/app/placeholder-page";

export function AppShellArtboard({ state }: { state: string }) {
  if (state === "placeholder-page") {
    return (
      <AppShell current="parts" title="Parts">
        <PlaceholderPage section="parts" />
      </AppShell>
    );
  }
  return (
    <AppShell current="dashboard" title="Dashboard" paletteOpen={state === "command-palette"}>
      <Dashboard />
    </AppShell>
  );
}
