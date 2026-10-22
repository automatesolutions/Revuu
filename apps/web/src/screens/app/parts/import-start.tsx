"use client";

import { useRef } from "react";
import { Button } from "@revuu/ui/components/button";
import { Icon } from "@revuu/ui/components/icon";
import { EmptyState, ErrorState } from "@revuu/ui/components/states";
import { EmptyBoardIllustration } from "@/components/illustrations";
import { acceptedExtensions } from "@/lib/parts/messages";
import { splitMessage } from "./parts-ui";

export type ImportBusy = "file" | "demo" | null;

/** Hidden file input plus the button that opens it. Shared by the empty state and the table. */
export function useFilePicker(onFile: (file: File) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const input = (
    <input
      ref={inputRef}
      type="file"
      aria-label="Parts list file"
      accept={acceptedExtensions.join(",")}
      className="sr-only"
      tabIndex={-1}
      onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) onFile(file);
      }}
    />
  );
  return { input, open: () => inputRef.current?.click() };
}

export function ImportError({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  const { title, description } = splitMessage(message);
  return (
    <ErrorState
      headingLevel="h2"
      title={title}
      description={description}
      action={
        onDismiss ? (
          <Button size="sm" variant="ghost" icon="x" onClick={onDismiss}>
            Dismiss
          </Button>
        ) : undefined
      }
    />
  );
}

export function ImportStart({
  busy = null,
  error,
  onFile,
  onDemo,
  onDismissError,
}: {
  busy?: ImportBusy;
  error?: string | null;
  onFile: (file: File) => void;
  onDemo: () => void;
  onDismissError?: () => void;
}) {
  const picker = useFilePicker(onFile);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid gap-1">
        <h1 className="text-page-title">Parts</h1>
        <p className="text-body-sm text-ink-muted">
          Import a parts list to compare each part with its alternates.
        </p>
      </div>

      {error ? <ImportError message={error} onDismiss={onDismissError} /> : null}

      <div role={busy ? "status" : undefined} aria-live="polite" className="sr-only">
        {busy ? "Reading the parts list." : ""}
      </div>

      <EmptyState
        headingLevel="h2"
        illustration={<EmptyBoardIllustration className="h-24 w-auto" />}
        title="No parts list yet."
        description="Import a CSV or Excel file from Altium, KiCad, OrCAD, or your mechanical spreadsheet. You confirm the columns before Revuu creates any part."
        action={
          <div className="grid justify-items-center gap-4">
            {picker.input}
            <Button
              variant="primary"
              icon="upload"
              loading={busy === "file"}
              disabled={busy !== null}
              onClick={picker.open}
            >
              Import parts list
            </Button>
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-caption font-medium text-ink-subtle">
              <span>No file at hand?</span>
              <button
                type="button"
                onClick={onDemo}
                disabled={busy !== null}
                className="inline-flex min-h-6 items-center gap-1 rounded-xs font-semibold text-accent underline-offset-4 hover:underline disabled:opacity-45 max-lg:min-h-11"
              >
                {busy === "demo" ? <Icon name="loader" className="size-3.5 animate-spin" /> : null}
                Load Power board Rev C, demo
              </button>
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-caption font-medium text-ink-subtle">
              <span>Download the demo file:</span>
              <a
                href="/api/parts/demo?format=csv"
                download
                className="inline-flex min-h-6 items-center gap-1 text-accent underline-offset-4 hover:underline max-lg:min-h-11"
              >
                <Icon name="download" className="size-3.5" />
                CSV
              </a>
              <a
                href="/api/parts/demo?format=xlsx"
                download
                className="inline-flex min-h-6 items-center gap-1 text-accent underline-offset-4 hover:underline max-lg:min-h-11"
              >
                <Icon name="download" className="size-3.5" />
                Excel
              </a>
            </p>
          </div>
        }
      />
    </div>
  );
}
