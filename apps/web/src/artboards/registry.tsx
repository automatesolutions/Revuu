import { AppShellArtboard } from "./screens/app-shell";
import { DashboardArtboard } from "./screens/dashboard";
import { MarketingHomeArtboard } from "./screens/marketing-home";
import { PricingArtboard } from "./screens/pricing";
import { dashboardStates } from "@/screens/app/dashboard";

export interface Artboard {
  id: string;
  title: string;
  mode: "persuade" | "operate";
  /** One line: the screen's single job. */
  brief: string;
  states: readonly string[];
  render: (state: string) => React.ReactNode;
}

export const artboards: Artboard[] = [
  {
    id: "marketing-home",
    title: "Marketing home",
    mode: "persuade",
    brief: "Show an engineer what a Revuu review looks like, then get them to start free.",
    states: ["default"],
    render: () => <MarketingHomeArtboard />,
  },
  {
    id: "pricing",
    title: "Pricing",
    mode: "persuade",
    brief: "Say what each plan includes, and be honest that paid prices are not set yet.",
    states: ["default"],
    render: () => <PricingArtboard />,
  },
  {
    id: "app-shell",
    title: "App shell",
    mode: "operate",
    brief: "Get anywhere in the workspace in one click or one Ctrl+K.",
    states: ["default", "command-palette", "placeholder-page"],
    render: (state) => <AppShellArtboard state={state} />,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    mode: "operate",
    brief: "Show what is waiting on me and which parts changed, before anything else.",
    states: dashboardStates,
    render: (state) => <DashboardArtboard state={state} />,
  },
];

export const themes = ["light", "dark"] as const;
export const widths = [1440, 1024, 390] as const;

export function getArtboard(id: string) {
  return artboards.find((a) => a.id === id);
}

export function artboardsEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_ARTBOARDS === "1";
}
