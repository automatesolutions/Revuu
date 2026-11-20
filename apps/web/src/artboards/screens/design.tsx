import { deliverableFiles, emptyBrief, type DesignBrief, type DesignRun } from "@/lib/design/brief";
import type { ComparisonRequest } from "@/lib/parts/request";
import { AppShell } from "@/screens/app/app-shell";
import { DesignOverview } from "@/screens/app/design/design-overview";
import { DesignWizard, type WizardState } from "@/screens/app/design/design-wizard";
import { NewComparison, type NewComparisonState } from "@/screens/app/parts/new-comparison";

/** Demo brief for artboards. Every value is an example, not a real project. */
const sampleBrief: DesignBrief = {
  ...emptyBrief(),
  title: "Sensor hub Rev B",
  description: "Wall-mounted hub that reads 4 industrial sensors and reports over RS-485.",
  specification: "24 V DC input, 4 × 4–20 mA inputs, RS-485 half duplex, −20 to 60 °C.",
  referenceFiles: ["sensor-hub-rev-a.kicad_sch", "rs485-app-note.pdf"],
  pcbSize: "80 × 50 mm, 1.6 mm",
  layers: "4",
  focus: ["impedance", "safety"],
  partLimits: "No parts under 0402. 8 mm max height on top.",
  enclosureSize: "100 × 70 × 30 mm outside",
  outputs: ["schematic", "pcb", "enclosure", "document"],
  standards: ["IEC 62368-1", "IPC-2221"],
  provider: "openai",
};

const sampleRun: DesignRun = {
  id: "3f9c2a1e-demo",
  title: sampleBrief.title,
  createdAt: "2026-10-31T09:41:00.000Z",
  provider: "openai",
  promptTokens: 612,
  modelCalled: false,
  deliverables: sampleBrief.outputs.map((output) => ({ output, files: deliverableFiles[output] })),
};

export const designStates = ["empty", "last-run"] as const;
export const wizardStates = [
  "project",
  "board",
  "outputs",
  "confirm-blocked",
  "confirm-ready",
  "running",
  "error",
  "results",
] as const;
export const newComparisonStates = ["form", "ready", "error"] as const;

export function DesignArtboard({ state }: { state: string }) {
  return (
    <AppShell current="design" title="Design">
      <DesignOverview run={state === "last-run" ? sampleRun : null} />
    </AppShell>
  );
}

export function DesignWizardArtboard({ state }: { state: string }) {
  const step = { project: 0, board: 1, outputs: 2 }[state] ?? 3;
  const brief =
    state === "project"
      ? emptyBrief()
      : state === "confirm-blocked"
        ? { ...sampleBrief, stackup: "" }
        : { ...sampleBrief, stackup: "L1 signal, L2 GND, L3 power, L4 signal. 90 Ω USB pair." };
  const wizardState: WizardState =
    state === "running"
      ? "running"
      : state === "error"
        ? "error"
        : state === "results"
          ? "done"
          : "editing";
  return (
    <AppShell current="design" title="Design">
      <DesignWizard
        key={state}
        initialBrief={brief}
        initialStep={step}
        state={wizardState}
        run={state === "results" ? sampleRun : null}
      />
    </AppShell>
  );
}

const sampleRequest: ComparisonRequest = {
  category: "electronic",
  original: { mpn: "IRLML6402TRPBF", maker: "Infineon", datasheet: "IRLML6402PbF.pdf" },
  candidates: [
    { mpn: "DMP2035U-7", maker: "Diodes Inc.", datasheet: null },
    { mpn: "AO3401A", maker: "Alpha & Omega", datasheet: null },
  ],
  context: "Load switch on a 5 V rail, 3.3 V gate drive from the MCU, 1.5 A, 70 °C ambient.",
  costComparison: true,
};

export function NewComparisonArtboard({ state }: { state: string }) {
  const valid = (newComparisonStates as readonly string[]).includes(state)
    ? (state as NewComparisonState)
    : "form";
  return (
    <AppShell current="parts" title="Parts">
      <NewComparison
        key={state}
        initial={valid === "form" ? undefined : sampleRequest}
        state={valid}
        ready={valid === "ready" ? { promptTokens: 371, toFetch: ["DMP2035U-7", "AO3401A"] } : null}
      />
    </AppShell>
  );
}
