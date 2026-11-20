import { AppShellArtboard } from "./screens/app-shell";
import { DashboardArtboard } from "./screens/dashboard";
import {
  DesignArtboard,
  DesignWizardArtboard,
  designStates,
  NewComparisonArtboard,
  newComparisonStates,
  wizardStates,
} from "./screens/design";
import { MarketingHomeArtboard } from "./screens/marketing-home";
import {
  PartsCompareArtboard,
  PartsImportArtboard,
  PartsTableArtboard,
  partsCompareStates,
  partsImportStates,
} from "./screens/parts";
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
    brief:
      "Show an engineer an alternate judged against the original, then hardware design as the second job.",
    states: ["default"],
    render: () => <MarketingHomeArtboard />,
  },
  {
    id: "pricing",
    title: "Pricing",
    mode: "persuade",
    brief:
      "Say what each plan includes, that model usage is on the engineer's keys, and that paid prices are not set yet.",
    states: ["default"],
    render: () => <PricingArtboard />,
  },
  {
    id: "app-shell",
    title: "App shell",
    mode: "operate",
    brief: "Get anywhere in the workspace in one click or one Ctrl+K.",
    states: ["default", "command-palette", "settings"],
    render: (state) => <AppShellArtboard state={state} />,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    mode: "operate",
    brief:
      "Show open comparisons and the parts that still need an alternate, before anything else.",
    states: dashboardStates,
    render: (state) => <DashboardArtboard state={state} />,
  },
  {
    id: "parts-import",
    title: "Parts import and column mapping",
    mode: "operate",
    brief: "Get a CSV or Excel parts list in, and confirm its columns before any part exists.",
    states: partsImportStates,
    render: (state) => <PartsImportArtboard state={state} />,
  },
  {
    id: "parts-table",
    title: "Parts table",
    mode: "operate",
    brief: "Show every imported part, and open one to make it the original.",
    states: ["default"],
    render: () => <PartsTableArtboard />,
  },
  {
    id: "parts-compare",
    title: "Alternate comparison",
    mode: "operate",
    brief:
      "Show the original beside up to 4 alternates, each with a judgement, checks to run and cost.",
    states: partsCompareStates,
    render: (state) => <PartsCompareArtboard state={state} />,
  },
  {
    id: "parts-new",
    title: "New comparison",
    mode: "operate",
    brief: "Collect the original and 1 to 4 candidates with maker and datasheet, then check them.",
    states: newComparisonStates,
    render: (state) => <NewComparisonArtboard state={state} />,
  },
  {
    id: "design",
    title: "Design overview",
    mode: "operate",
    brief: "Say what one design run makes, and start one.",
    states: designStates,
    render: (state) => <DesignArtboard state={state} />,
  },
  {
    id: "design-wizard",
    title: "Design wizard",
    mode: "operate",
    brief: "Collect the whole brief, refuse to run until it is complete, then run once.",
    states: wizardStates,
    render: (state) => <DesignWizardArtboard state={state} />,
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
