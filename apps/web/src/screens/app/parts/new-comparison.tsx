"use client";

import { useState } from "react";
import { Button } from "@revuu/ui/components/button";
import { Field, Input, Textarea } from "@revuu/ui/components/field";
import { Icon } from "@revuu/ui/components/icon";
import { ErrorState } from "@revuu/ui/components/states";
import { cn } from "@revuu/ui/lib/cn";
import { LinkButton } from "@/components/link-button";
import {
  emptyPart,
  emptyRequest,
  maxCandidates,
  validateRequest,
  type ComparisonRequest,
  type PartInput,
  type RequestErrors,
} from "@/lib/parts/request";
import { categories, categoryLabel } from "@/lib/parts/types";
import { categoryIcon, DemoTag, number, panel } from "./parts-ui";

/** Moves focus to the first field marked invalid, after React renders the errors. */
export function focusFirstError() {
  requestAnimationFrame(() =>
    document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus(),
  );
}

export type NewComparisonState = "form" | "checking" | "ready" | "error";

type Ready = { promptTokens: number; toFetch: string[] };

/** /app/parts/new: the original and 1 to 4 candidates, checked on the server before any run. */
export function NewComparison({
  initial = emptyRequest(),
  state: initialState = "form",
  ready: initialReady = null,
}: {
  initial?: ComparisonRequest;
  state?: NewComparisonState;
  ready?: Ready | null;
}) {
  const [request, setRequest] = useState(initial);
  const [errors, setErrors] = useState<RequestErrors>({});
  const [state, setState] = useState<NewComparisonState>(initialState);
  const [ready, setReady] = useState<Ready | null>(initialReady);

  const update = (next: Partial<ComparisonRequest>) => {
    setRequest({ ...request, ...next });
    if (state === "ready") setState("form");
  };
  const setCandidate = (i: number, part: PartInput) =>
    update({ candidates: request.candidates.map((c, j) => (j === i ? part : c)) });

  async function onCheck(event: React.FormEvent) {
    event.preventDefault();
    const found = validateRequest(request);
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirstError();
      return;
    }
    setState("checking");
    try {
      const response = await fetch("/api/parts/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const body = (await response.json()) as Ready & { errors?: RequestErrors };
      if (response.status === 422 && body.errors) {
        setErrors(body.errors);
        setState("form");
        focusFirstError();
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      setReady({ promptTokens: body.promptTokens, toFetch: body.toFetch });
      setState("ready");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid gap-3">
        <LinkButton
          href="/app/parts"
          variant="ghost"
          size="sm"
          icon="arrow-left"
          className="-ml-2.5 w-fit max-lg:h-11"
        >
          Parts
        </LinkButton>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid max-w-[60ch] gap-1">
            <h1 className="text-page-title">Compare parts</h1>
            <p className="text-body-sm text-ink-muted">
              The original is the part in your design today. Revuu checks whether each candidate can
              replace it, from the datasheets.
            </p>
          </div>
          <DemoTag />
        </div>
      </div>

      <form noValidate onSubmit={onCheck} className="grid max-w-[60rem] gap-6">
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-label">Category</legend>
          <div className="flex w-fit flex-wrap gap-0.5 rounded-pill bg-surface p-0.5">
            {categories.map((category) => {
              const checked = request.category === category;
              return (
                <label
                  key={category}
                  className={cn(
                    "relative inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-pill px-3 text-ui font-semibold transition-colors duration-120 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus max-lg:h-11",
                    checked ? "bg-primary text-on-primary" : "text-ink-muted hover:text-ink",
                  )}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={checked}
                    onChange={() => update({ category })}
                    className="sr-only"
                  />
                  <Icon name={categoryIcon[category]} className="size-3.5" />
                  {categoryLabel[category]}
                </label>
              );
            })}
          </div>
        </fieldset>

        <PartFields
          path="original"
          title="Original"
          pinned
          part={request.original}
          errors={errors}
          onChange={(original) => update({ original })}
        />

        {request.candidates.map((candidate, i) => (
          <PartFields
            key={i}
            path={`candidates.${i}`}
            title={`Candidate ${i + 1}`}
            part={candidate}
            errors={errors}
            onChange={(part) => setCandidate(i, part)}
            onRemove={
              request.candidates.length > 1
                ? () => update({ candidates: request.candidates.filter((_, j) => j !== i) })
                : undefined
            }
          />
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            icon="plus"
            disabled={request.candidates.length >= maxCandidates}
            aria-describedby="candidate-limit"
            onClick={() => update({ candidates: [...request.candidates, emptyPart()] })}
            className="max-lg:h-11"
          >
            Add candidate
          </Button>
          <p id="candidate-limit" className="text-caption font-medium text-ink-subtle">
            {request.candidates.length >= maxCandidates
              ? `${maxCandidates} candidates is the maximum: 5 parts in one comparison.`
              : `${request.candidates.length} of ${maxCandidates} candidates.`}
          </p>
          {errors.candidates ? (
            <p className="text-caption font-medium text-status-rejected">{errors.candidates}</p>
          ) : null}
        </div>

        <section aria-labelledby="context-title" className={cn(panel, "grid gap-4 p-4 sm:p-5")}>
          <h2 id="context-title" className="text-[0.9375rem] font-bold">
            Design context
          </h2>
          <Field
            label="The board or assembly the original sits on"
            hint="Supply voltage, gate drive, load current, switching frequency, hottest ambient, free space. Unknown values become scenarios in the report."
          >
            {({ id, describedBy }) => (
              <Textarea
                id={id}
                aria-describedby={describedBy}
                value={request.context}
                onChange={(e) => update({ context: e.target.value })}
                placeholder="12 V bus, 4.5 V gate drive, 2 A continuous, 85 °C ambient"
              />
            )}
          </Field>
          <label className="flex items-start gap-2.5 text-body-sm">
            <input
              type="checkbox"
              checked={request.costComparison}
              onChange={(e) => update({ costComparison: e.target.checked })}
              className="mt-0.5 size-4 accent-[var(--color-accent)]"
            />
            <span className="grid gap-0.5">
              <span className="font-semibold">Compare cost for value engineering</span>
              <span className="text-caption font-medium text-ink-subtle">
                Uses unit prices only where a record has them. Revuu never estimates a price.
              </span>
            </span>
          </label>
        </section>

        {state === "error" ? (
          <ErrorState
            headingLevel="h2"
            title="Revuu could not check the comparison."
            description="The server did not answer. Your entries are still in the form. Try again."
            action={
              <Button size="sm" icon="refresh-cw" type="submit">
                Try again
              </Button>
            }
          />
        ) : null}

        {state === "ready" && ready ? <ReadyPanel request={request} ready={ready} /> : null}

        {state !== "ready" ? (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              icon="list-checks"
              loading={state === "checking"}
              className="max-lg:h-11"
            >
              Check comparison
            </Button>
            <p className="text-caption font-medium text-ink-subtle">
              Revuu checks the parts on the server. No model is called.
            </p>
          </div>
        ) : null}
      </form>
    </div>
  );
}

function PartFields({
  path,
  title,
  part,
  errors,
  pinned = false,
  onChange,
  onRemove,
}: {
  path: string;
  title: string;
  part: PartInput;
  errors: RequestErrors;
  pinned?: boolean;
  onChange: (part: PartInput) => void;
  onRemove?: () => void;
}) {
  const [fileError, setFileError] = useState<string | null>(null);
  return (
    <fieldset className={cn(panel, "grid gap-4 p-4 sm:p-5")}>
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center justify-between gap-3">
        <p aria-hidden className="flex items-center gap-2 text-[0.9375rem] font-bold">
          {pinned ? (
            <span className="inline-flex h-5 items-center gap-1 rounded-xs bg-primary px-1.5 text-[0.75rem] font-semibold text-on-primary">
              <Icon name="pin" className="size-3" />
              Pinned
            </span>
          ) : null}
          {title}
        </p>
        {onRemove ? (
          <Button size="sm" variant="ghost" icon="x" onClick={onRemove} className="max-lg:h-11">
            Remove {title.toLowerCase()}
          </Button>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1.2fr]">
        <Field label="MPN" error={errors[`${path}.mpn`]}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              value={part.mpn}
              onChange={(e) => onChange({ ...part, mpn: e.target.value })}
              autoComplete="off"
              spellCheck={false}
              className="font-mono"
            />
          )}
        </Field>
        <Field label="Maker" error={errors[`${path}.maker`]}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              value={part.maker}
              onChange={(e) => onChange({ ...part, maker: e.target.value })}
            />
          )}
        </Field>
        <div className="grid content-start gap-1.5">
          <span className="text-label text-ink">Datasheet PDF</span>
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md bg-raised px-3 text-body-sm shadow-[inset_0_0_0_1px_var(--color-border-input)] hover:shadow-[inset_0_0_0_1px_var(--color-ink-muted)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus max-lg:h-11">
            <Icon name="file-text" className="text-ink-subtle" />
            <span className={cn("min-w-0 flex-1 truncate", !part.datasheet && "text-ink-subtle")}>
              {part.datasheet ?? "Choose a PDF"}
            </span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              aria-label={`Datasheet PDF for the ${title.toLowerCase()}`}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                if (!/\.pdf$/i.test(file.name)) {
                  setFileError("Choose a PDF datasheet.");
                  return;
                }
                setFileError(null);
                onChange({ ...part, datasheet: file.name });
              }}
            />
          </label>
          {fileError ? (
            <p className="flex items-center gap-1.5 text-caption font-medium text-status-rejected">
              <Icon name="x-circle" />
              {fileError}
            </p>
          ) : (
            <p className="text-caption font-medium text-ink-subtle">
              {part.datasheet
                ? "Only the file name is kept in the demo."
                : "No PDF? Revuu fetches the manufacturer's datasheet by MPN."}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}

function ReadyPanel({ request, ready }: { request: ComparisonRequest; ready: Ready }) {
  const parts = [request.original, ...request.candidates];
  return (
    <section
      aria-labelledby="ready-title"
      role="status"
      className={cn(panel, "grid gap-4 p-4 sm:p-5")}
    >
      <div className="grid gap-1">
        <h2 id="ready-title" className="flex items-center gap-2 text-[0.9375rem] font-bold">
          <Icon name="check-circle" className="text-status-approved" />
          The comparison is complete and ready to run
        </h2>
        <p className="text-caption font-medium text-ink-subtle">
          {parts.length} parts, {categoryLabel[request.category].toLowerCase()}.{" "}
          {request.original.mpn} is the original.
          {request.costComparison ? " Cost comparison on." : ""}
        </p>
      </div>
      <dl className="grid gap-x-6 gap-y-3 text-ui sm:grid-cols-2">
        <div className="grid gap-0.5">
          <dt className="text-caption text-ink-muted">Datasheets to fetch by MPN</dt>
          <dd className="mpn">{ready.toFetch.length ? ready.toFetch.join(", ") : "None"}</dd>
        </div>
        <div className="grid gap-0.5">
          <dt className="text-caption text-ink-muted">Prompt size, before datasheet pages</dt>
          <dd className="tabular-nums">About {number.format(ready.promptTokens)} tokens</dd>
        </div>
      </dl>
      <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-4">
        <Button variant="primary" icon="replace" disabled aria-describedby="run-blocked">
          Run comparison
        </Button>
        <LinkButton href="/app/settings" size="sm" variant="link">
          Open settings
        </LinkButton>
      </div>
      <p id="run-blocked" className="text-caption font-medium text-ink-muted">
        Runs need your Anthropic key and datasheet reading, which are not built yet. Revuu called no
        model and read no datasheet.
      </p>
    </section>
  );
}
