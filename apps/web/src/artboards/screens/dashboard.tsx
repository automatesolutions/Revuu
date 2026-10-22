import { AppShell } from "@/screens/app/app-shell";
import { Dashboard, dashboardStates, type DashboardState } from "@/screens/app/dashboard";

export function DashboardArtboard({ state }: { state: string }) {
  const valid = (dashboardStates as readonly string[]).includes(state)
    ? (state as DashboardState)
    : "default";
  return (
    <AppShell current="dashboard" title="Dashboard">
      <Dashboard state={valid} />
    </AppShell>
  );
}
