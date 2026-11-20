"use client";

import { useState } from "react";
import { Button } from "@revuu/ui/components/button";
import { Field, Input, Textarea } from "@revuu/ui/components/field";
import { Icon } from "@revuu/ui/components/icon";
import { ErrorState, LoadingRegion, Skeleton } from "@revuu/ui/components/states";
import { cn } from "@revuu/ui/lib/cn";
import { LinkButton } from "@/components/link-button";
import {
  emptyBrief,
  estimateBriefTokens,
  fieldStep,
  focusAreas,
  outputs,
  providers,
  standardOptions,
  validateBrief,
  type BriefErrors,
  type BriefField,
  type DesignBrief,
  type DesignRun,
} from "@/lib/design/brief";
import { saveRun } from "@/lib/design/store";
import { DemoTag, number, panel } from "../parts/parts-ui";
import { RunResults } from "./run-results";

export const steps = ["Project", "Board and enclosure", "Outputs and standards", "Confirm run"];

export type WizardState = "editing" | "running" | "done" | "error";

const fieldLabel: Record<BriefField, string> = {
  title: "Project title",
  description: "Project description",
  specification: "Product specification",
  referenceFiles: "Reference files",
  referenceLinks: "Reference links",
  pcbSize: "PCB size",
  layers: "Layer count",
  stackup: "Stack-up notes",
  focus: "Areas that matter",
  otherConstraints: "Other constraints",
  partLimits: "Part size limits",
  enclosureSize: "Enclosure size",
  outputs: "Outputs",
  standards: "Standards",
  standardsNotes: "Standards notes",
  provider: "Key for this run",
};

/** /app/design/new: inputs, then one confirmed run, then the results. */
export function DesignWizard({
  initialBrief = emptyBrief(),
  initialStep = 0,
  state: initialState = "editing",
  run: initialRun = null,
}: {
  initialBrief?: DesignBrief;
  initialStep?: number;
  state?: WizardState;
  run?: DesignRun | null;
}) {
  const [brief, setBrief] = useState(initialBrief);
  const [step, setStep] = useState(initialStep);
  const [state, setState] = useState<WizardState>(initialState);
  const [run, setRun] = useState<DesignRun | null>(initialRun);
  const [serverErrors, setServerErrors] = useState<BriefErrors | null>(null);
  // Errors show once the engineer reaches the confirm step, so blank fields do not shout early.
  const [showErrors, setShowErrors] = useState(initialStep === 3);

  const errors = serverErrors ?? validateBrief(brief);
  const shown = showErrors ? errors : {};
  const missing = Object.keys(errors) as BriefField[];
  const update = (next: Partial<DesignBrief>) => {
    setBrief({ ...brief, ...next });
    setServerErrors(null);
  };
  const go = (next: number) => {
    if (next === 3) setShowErrors(true);
    setStep(next);
    requestAnimationFrame(() => document.getElementById("step-title")?.focus());
  };

  async function onRun() {
    setState("running");
    try {
      const response = await fetch("/api/design/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      const body = (await response.json()) as { run?: DesignRun; errors?: BriefErrors };
      if (response.status === 422 && body.errors) {
        setServerErrors(body.errors);
        setState("editing");
        return;
      }
      if (!response.ok || !body.run) throw new Error(String(response.status));
      saveRun(body.run);
      setRun(body.run);
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done" && run) {
    return (
      <Page>
        <RunResults run={run} />
      </Page>
    );
  }

  return (
    <Page>
      <ol aria-label="Steps" className="flex flex-wrap gap-x-1 gap-y-2">
        {steps.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => go(i)}
              disabled={state === "running"}
              aria-current={step === i ? "step" : undefined}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-pill px-3 text-ui font-semibold transition-colors duration-120 max-lg:h-11",
                step === i ? "bg-primary text-on-primary" : "text-ink-muted hover:bg-surface",
              )}
            >
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-pill text-[0.6875rem] tabular-nums",
                  step === i ? "bg-on-primary text-primary" : "bg-surface text-ink",
                )}
              >
                {i + 1}
              </span>
              {label}
            </button>
          </li>
        ))}
      </ol>

      <section aria-labelledby="step-title" className={cn(panel, "grid gap-5 p-4 sm:p-6")}>
        <h2 id="step-title" tabIndex={-1} className="text-title outline-none">
          {steps[step]}
        </h2>
        {step === 0 ? <ProjectStep brief={brief} errors={shown} update={update} /> : null}
        {step === 1 ? <BoardStep brief={brief} errors={shown} update={update} /> : null}
        {step === 2 ? <OutputsStep brief={brief} errors={shown} update={update} /> : null}
        {step === 3 ? (
          <ConfirmStep
            brief={brief}
            missing={missing}
            errors={errors}
            running={state === "running"}
            onGo={go}
          />
        ) : null}
      </section>

      {state === "error" ? (
        <ErrorState
          headingLevel="h2"
          title="The run did not start."
          description="Revuu could not reach its server. No model was called and no key was charged. Your brief is still here."
          action={
            <Button size="sm" icon="refresh-cw" onClick={() => void onRun()}>
              Try again
            </Button>
          }
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? (
          <Button
            icon="arrow-left"
            onClick={() => go(step - 1)}
            disabled={state === "running"}
            className="max-lg:h-11"
          >
            Back to {steps[step - 1]!.toLowerCase()}
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button
            variant="primary"
            iconRight="arrow-right"
            onClick={() => go(step + 1)}
            className="max-lg:h-11"
          >
            Next: {steps[step + 1]!.toLowerCase()}
          </Button>
        ) : (
          <div className="flex flex-wrap items-center justify-end gap-3">
            {missing.length ? (
              <p id="run-blocker" className="text-ui text-ink-muted">
                Fill {missing.length} required {missing.length === 1 ? "field" : "fields"} to run.
              </p>
            ) : null}
            <Button
              variant="primary"
              icon="circuit-board"
              loading={state === "running"}
              disabled={missing.length > 0}
              aria-describedby={missing.length ? "run-blocker" : undefined}
              onClick={() => void onRun()}
              className="max-lg:h-11"
            >
              Run design once
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid gap-3">
        <LinkButton
          href="/app/design"
          variant="ghost"
          size="sm"
          icon="arrow-left"
          className="-ml-2.5 w-fit max-lg:h-11"
        >
          Design
        </LinkButton>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid max-w-[64ch] gap-1">
            <h1 className="text-page-title">Start a design</h1>
            <p className="text-body-sm text-ink-muted">
              One run on your own key, with no iteration. Fill the whole brief first, so the first
              output can go to production.
            </p>
          </div>
          <DemoTag />
        </div>
      </div>
      <div className="grid max-w-[60rem] grid-cols-[minmax(0,1fr)] gap-6">{children}</div>
    </div>
  );
}

type StepProps = {
  brief: DesignBrief;
  errors: BriefErrors;
  update: (next: Partial<DesignBrief>) => void;
};

function TextField({
  field,
  brief,
  errors,
  update,
  hint,
  placeholder,
  multiline = false,
  required = false,
}: StepProps & {
  field: BriefField;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const value = String(brief[field] ?? "");
  const label = required ? `${fieldLabel[field]} (required)` : fieldLabel[field];
  return (
    <Field label={label} hint={hint} error={errors[field]}>
      {({ id, describedBy, invalid }) =>
        multiline ? (
          <Textarea
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            value={value}
            placeholder={placeholder}
            onChange={(e) => update({ [field]: e.target.value })}
          />
        ) : (
          <Input
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            value={value}
            placeholder={placeholder}
            onChange={(e) => update({ [field]: e.target.value })}
          />
        )
      }
    </Field>
  );
}

function ProjectStep(props: StepProps) {
  const { brief, update } = props;
  return (
    <div className="grid gap-5">
      <TextField {...props} field="title" required placeholder="Sensor hub Rev B" />
      <TextField
        {...props}
        field="description"
        required
        multiline
        hint="What the product does, who uses it and where it is installed."
      />
      <TextField
        {...props}
        field="specification"
        required
        multiline
        hint="Supplies, interfaces, loads, ranges and tolerances. Paste the full product spec."
      />
      <div className="grid gap-1.5">
        <span className="text-label text-ink">Reference files</span>
        <label className="flex min-h-9 w-fit cursor-pointer items-center gap-2 rounded-md bg-raised px-3 text-[0.875rem] font-semibold shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] hover:bg-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus max-lg:h-11">
          <Icon name="upload" />
          Add reference files
          <input
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => {
              const names = [...(e.target.files ?? [])].map((f) => f.name);
              e.target.value = "";
              update({ referenceFiles: [...new Set([...brief.referenceFiles, ...names])] });
            }}
          />
        </label>
        {brief.referenceFiles.length ? (
          <ul className="grid gap-1">
            {brief.referenceFiles.map((name) => (
              <li key={name} className="flex items-center gap-2 text-ui">
                <Icon name="file-text" className="text-ink-subtle" />
                <span className="min-w-0 truncate mpn">{name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() =>
                    update({ referenceFiles: brief.referenceFiles.filter((f) => f !== name) })
                  }
                  className="inline-flex size-7 items-center justify-center rounded-sm text-ink-subtle hover:bg-surface hover:text-ink max-lg:size-11"
                >
                  <Icon name="x" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-caption font-medium text-ink-subtle">
          Schematics, layouts, app notes. Only file names are kept in the demo; nothing is uploaded.
        </p>
      </div>
      <TextField
        {...props}
        field="referenceLinks"
        multiline
        hint="One link per line: reference designs, evaluation boards, app notes."
      />
    </div>
  );
}

function BoardStep(props: StepProps) {
  const { brief, update, errors } = props;
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          {...props}
          field="pcbSize"
          placeholder="80 × 50 mm, 1.6 mm thick"
          hint="Required for a PCB or an enclosure."
        />
        <TextField {...props} field="layers" placeholder="4" hint="Required for a PCB." />
      </div>
      <TextField
        {...props}
        field="stackup"
        multiline
        placeholder="L1 signal, L2 GND, L3 power, L4 signal. 1 oz outer."
        hint="Required for a PCB with controlled impedance."
      />
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-label">Areas that matter</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {focusAreas.map((area) => (
            <Check
              key={area.id}
              label={area.label}
              checked={brief.focus.includes(area.id)}
              onChange={(on) =>
                update({
                  focus: on ? [...brief.focus, area.id] : brief.focus.filter((f) => f !== area.id),
                })
              }
            />
          ))}
        </div>
        {errors.focus ? <FieldError message={errors.focus} /> : null}
      </fieldset>
      <TextField
        {...props}
        field="otherConstraints"
        multiline
        hint="Anything else the design must respect: cost target, assembly house rules, keep-outs."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          {...props}
          field="partLimits"
          placeholder="No parts under 0402. 8 mm max height on top."
          hint="Required for a PCB."
        />
        <TextField
          {...props}
          field="enclosureSize"
          placeholder="100 × 70 × 30 mm outside"
          hint="Required for an enclosure."
        />
      </div>
    </div>
  );
}

function OutputsStep(props: StepProps) {
  const { brief, update, errors } = props;
  return (
    <div className="grid gap-6">
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-label">Outputs (required, choose at least 1)</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {outputs.map((o) => (
            <Check
              key={o.id}
              label={o.label}
              detail={o.detail}
              checked={brief.outputs.includes(o.id)}
              onChange={(on) =>
                update({
                  outputs: on ? [...brief.outputs, o.id] : brief.outputs.filter((x) => x !== o.id),
                })
              }
            />
          ))}
        </div>
        {errors.outputs ? <FieldError message={errors.outputs} /> : null}
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-label">Standards to consider</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {standardOptions.map((standard) => (
            <Check
              key={standard}
              label={standard}
              checked={brief.standards.includes(standard)}
              onChange={(on) =>
                update({
                  standards: on
                    ? [...brief.standards, standard]
                    : brief.standards.filter((s) => s !== standard),
                })
              }
            />
          ))}
        </div>
        {errors.standards ? <FieldError message={errors.standards} /> : null}
      </fieldset>
      <TextField
        {...props}
        field="standardsNotes"
        multiline
        hint="Clauses that apply, insulation class, pollution degree, overvoltage category, test house notes."
      />

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-label">Key for this run (required)</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {providers.map((p) => (
            <label
              key={p.id}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-body-sm shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                brief.provider === p.id && "bg-surface shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
              )}
            >
              <input
                type="radio"
                name="provider"
                checked={brief.provider === p.id}
                onChange={() => update({ provider: p.id })}
                className="size-4 accent-[var(--color-accent)]"
              />
              <Icon name="key" className="text-ink-subtle" />
              <span className="font-semibold">{p.label}</span>
            </label>
          ))}
        </div>
        {errors.provider ? <FieldError message={errors.provider} /> : null}
        <p className="text-caption font-medium text-ink-subtle">
          Your key pays the model. Revuu never runs a design on a key that Revuu owns. Keys connect
          in Settings.
        </p>
      </fieldset>
    </div>
  );
}

function ConfirmStep({
  brief,
  missing,
  errors,
  running,
  onGo,
}: {
  brief: DesignBrief;
  missing: BriefField[];
  errors: BriefErrors;
  running: boolean;
  onGo: (step: number) => void;
}) {
  if (running) {
    return (
      <LoadingRegion label="Starting the design run." className="grid gap-3">
        <p className="text-body-sm text-ink-muted">
          Checking the brief on the server and building the prompt.
        </p>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-6" />
        ))}
      </LoadingRegion>
    );
  }
  const chosen = outputs.filter((o) => brief.outputs.includes(o.id));
  const provider = providers.find((p) => p.id === brief.provider);
  return (
    <div className="grid gap-6">
      {missing.length ? (
        <div className="grid gap-2 rounded-md bg-status-warning-bg px-4 py-3 text-status-warning">
          <p className="flex items-center gap-2 text-ui font-semibold">
            <Icon name="triangle-alert" />
            Revuu will not run until these are filled
          </p>
          <ul className="grid gap-1 pl-6 text-ui">
            {missing.map((field) => (
              <li key={field}>
                <button
                  type="button"
                  onClick={() => onGo(fieldStep[field])}
                  className="text-left underline underline-offset-4 hover:no-underline max-lg:min-h-11"
                >
                  {errors[field]}
                </button>{" "}
                <span className="opacity-80">In {steps[fieldStep[field]]!.toLowerCase()}.</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="flex items-center gap-2 rounded-md bg-status-approved-bg px-4 py-3 text-ui font-semibold text-status-approved">
          <Icon name="check-circle" />
          Every field the chosen outputs need is filled.
        </p>
      )}

      <dl className="grid gap-x-8 gap-y-4 text-ui sm:grid-cols-2">
        <Summary term="Project">{brief.title || "Not given"}</Summary>
        <Summary term="Outputs">
          {chosen.length ? chosen.map((o) => o.label).join(", ") : "None chosen"}
        </Summary>
        <Summary term="PCB">
          {[brief.pcbSize, brief.layers && `${brief.layers} layers`].filter(Boolean).join(", ") ||
            "Not given"}
        </Summary>
        <Summary term="Enclosure">{brief.enclosureSize || "Not given"}</Summary>
        <Summary term="Standards">
          {brief.standards.length ? brief.standards.join(", ") : "None chosen"}
        </Summary>
        <Summary term="References">
          {brief.referenceFiles.length} files,{" "}
          {brief.referenceLinks.split(/\s+/).filter(Boolean).length} links
        </Summary>
      </dl>

      <section aria-labelledby="cost-title" className="grid gap-3 rounded-md bg-surface p-4">
        <h3 id="cost-title" className="text-ui font-bold">
          Size and risk of this run
        </h3>
        <ul className="grid gap-2 text-body-sm">
          <li className="flex items-start gap-2">
            <Icon name="key" className="mt-1 text-ink-subtle" />
            <span>
              Prompt of about{" "}
              <span className="font-semibold tabular-nums">
                {number.format(estimateBriefTokens(brief))} tokens
              </span>{" "}
              before reference files, billed to {provider ? `your ${provider.label}` : "your key"}{" "}
              at your provider&rsquo;s rates. Output size depends on the model. Revuu shows no price
              because model prices change.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="refresh-cw" className="mt-1 text-ink-subtle" />
            <span>
              One run. Revuu does not iterate on the result. To change the brief, start a new
              design.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="list-checks" className="mt-1 text-ink-subtle" />
            <span>
              Review every output before fabrication: run DRC and ERC in KiCad, check each BOM line
              for stock, and print one enclosure to check the fit.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="info" className="mt-1 text-ink-subtle" />
            <span>
              Demo workspace: no key is stored, so this run calls no model and makes no files.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Summary({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid content-start gap-0.5">
      <dt className="text-caption text-ink-muted">{term}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}

function Check({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail?: string;
  checked: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-3 py-2.5 text-body-sm shadow-[inset_0_0_0_1px_var(--color-hairline)] hover:bg-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-[var(--color-accent)]"
      />
      <span className="grid gap-0.5">
        <span className="font-semibold">{label}</span>
        {detail ? <span className="text-caption font-medium text-ink-subtle">{detail}</span> : null}
      </span>
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-caption font-medium text-status-rejected">
      <Icon name="x-circle" />
      {message}
    </p>
  );
}
