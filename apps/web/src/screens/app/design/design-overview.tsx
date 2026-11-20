"use client";

import { Icon } from "@revuu/ui/components/icon";
import { EmptyState, LoadingRegion, Skeleton } from "@revuu/ui/components/states";
import { cn } from "@revuu/ui/lib/cn";
import { EmptyBoardIllustration } from "@/components/illustrations";
import { LinkButton } from "@/components/link-button";
import { outputs, type DesignRun } from "@/lib/design/brief";
import { useLastRun } from "@/lib/design/store";
import { panel } from "../parts/parts-ui";
import { RunResults } from "./run-results";

const steps = [
  {
    icon: "file-text",
    title: "Brief",
    body: "Project, spec, references, board, enclosure, standards.",
  },
  {
    icon: "list-checks",
    title: "Confirm one run",
    body: "Required fields checked, size and risk shown.",
  },
  { icon: "download", title: "Results", body: "Only the outputs you chose, with their files." },
] as const;

/** /app/design: function 2. The last run in this tab, or how to start one. */
export function DesignOverview({ run: runProp }: { run?: DesignRun | null }) {
  const stored = useLastRun();
  const run = runProp === undefined ? stored : runProp;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid max-w-[64ch] gap-1">
          <h1 className="text-page-title">Design</h1>
          <p className="text-body-sm text-ink-muted">
            Turn a complete brief into a KiCad schematic, KiCad PCB, Onshape enclosure and design
            document, in one run on your own OpenAI or Astra key.
          </p>
        </div>
        {run ? (
          <LinkButton href="/app/design/new" variant="primary" icon="circuit-board">
            Start a design
          </LinkButton>
        ) : null}
      </div>

      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={cn(panel, "grid grid-cols-[1.5rem_1fr] gap-x-3 gap-y-1 p-4")}
          >
            <Icon name={s.icon} className="mt-0.5 size-5 text-ink-subtle" />
            <p className="text-ui font-semibold">
              {i + 1}. {s.title}
            </p>
            <p className="col-start-2 text-caption font-medium text-ink-subtle">{s.body}</p>
          </li>
        ))}
      </ol>

      {run === undefined ? (
        <LoadingRegion label="Loading design runs." className="grid gap-2">
          <Skeleton className="h-24" />
        </LoadingRegion>
      ) : run ? (
        <section aria-labelledby="last-run-title" className="grid gap-3">
          <h2 id="last-run-title" className="text-title">
            Last run in this tab
          </h2>
          <RunResults run={run} />
        </section>
      ) : (
        <EmptyState
          headingLevel="h2"
          illustration={<EmptyBoardIllustration className="h-24 w-auto" />}
          title="No design run yet."
          description={`A run is one model call on your key, with no iteration. Revuu collects the whole brief and refuses to run until the fields for your outputs are filled. Outputs: ${outputs.map((o) => o.label).join(", ")}.`}
          action={
            <LinkButton href="/app/design/new" variant="primary" icon="circuit-board">
              Start a design
            </LinkButton>
          }
        />
      )}
    </div>
  );
}
