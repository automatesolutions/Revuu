import { Button } from "@revuu/ui/components/button";
import { Icon } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import { LinkButton } from "@/components/link-button";
import { outputs, providers, type DesignRun } from "@/lib/design/brief";
import { number, panel } from "../parts/parts-ui";

const when = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/**
 * One run's deliverables. Generation is not built yet, so each output shows where its files will
 * appear and offers no download. No file is faked.
 */
export function RunResults({ run }: { run: DesignRun }) {
  const provider = providers.find((p) => p.id === run.provider);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <section
        aria-labelledby="run-title"
        role="status"
        className="grid gap-2 rounded-lg bg-surface px-4 py-4 sm:px-5"
      >
        <h2 id="run-title" className="flex items-center gap-2 text-title">
          <Icon name="info" className="size-5 text-status-pending" />
          {run.title}: brief accepted, no files made
        </h2>
        <p className="max-w-[72ch] text-body-sm text-ink-muted">
          Revuu checked the brief and built a prompt of about {number.format(run.promptTokens)}{" "}
          tokens for {provider?.label ?? "your key"}. No model was called, because design generation
          is not built yet. When it is, the files below appear here once, from a single run.
        </p>
        <p className="text-caption font-medium text-ink-subtle">
          {when.format(new Date(run.createdAt))} · run{" "}
          <span className="mpn">{run.id.slice(0, 8)}</span>
        </p>
      </section>

      <ul className="grid gap-4 md:grid-cols-2">
        {run.deliverables.map((d) => {
          const output = outputs.find((o) => o.id === d.output)!;
          return (
            <li key={d.output} className={cn(panel, "grid content-start gap-3 p-4 sm:p-5")}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="grid gap-0.5">
                  <h3 className="text-[0.9375rem] font-bold">{output.label}</h3>
                  <p className="text-caption font-medium text-ink-subtle">{output.detail}</p>
                </div>
                <span className="inline-flex h-[1.375rem] items-center gap-1 rounded-xs bg-sunken px-2 text-label text-ink-muted">
                  <Icon name="circle-dashed" className="size-3.5" />
                  Not built yet
                </span>
              </div>
              <ul className="grid gap-1.5 border-t border-hairline pt-3">
                {d.files.map((file) => (
                  <li key={file} className="flex items-center gap-2 text-ui text-ink-muted">
                    <Icon name="file-text" className="text-ink-subtle" />
                    <span className="flex-1">{file}</span>
                    <span className="text-caption font-medium text-ink-subtle">No file</span>
                  </li>
                ))}
              </ul>
              <Button size="sm" icon="download" disabled className="w-fit">
                Download {output.label}
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-2">
        <LinkButton href="/app/design" icon="arrow-left">
          Back to design
        </LinkButton>
      </div>
    </div>
  );
}
