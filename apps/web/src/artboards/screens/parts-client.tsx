"use client";

import { useState } from "react";
import { guessMapping } from "@/lib/parts/fields";
import type { Comparison, PartRecord } from "@/lib/parts/compare";
import { importFailedDescription, importFailedTitle, wrongFileMessage } from "@/lib/parts/messages";
import type { Category, ImportResult, ParsedSheet } from "@/lib/parts/types";
import { AppShell } from "@/screens/app/app-shell";
import { ColumnMapping } from "@/screens/app/parts/column-mapping";
import { ImportStart } from "@/screens/app/parts/import-start";
import { PartCompare } from "@/screens/app/parts/part-compare";
import { PartsTable } from "@/screens/app/parts/parts-table";

const noop = () => {};

export function PartsImportBoard({ state, sheet }: { state: string; sheet: ParsedSheet }) {
  const [mapping, setMapping] = useState(() => guessMapping(sheet.headers));
  const [chosen, setChosen] = useState<Record<string, Category>>(() =>
    state === "mapping-ready"
      ? { "row-9": "electrical" as const }
      : ({} as Record<string, Category>),
  );
  const body = state.startsWith("mapping") ? (
    <ColumnMapping
      sheet={sheet}
      mapping={mapping}
      chosen={chosen}
      onMappingChange={setMapping}
      onChoose={(id, c) => setChosen({ ...chosen, [id]: c })}
      onCreate={noop}
      onCancel={noop}
    />
  ) : (
    <ImportStart
      busy={state === "reading" ? "file" : null}
      error={
        state === "wrong-file"
          ? wrongFileMessage
          : state === "error"
            ? `${importFailedTitle} ${importFailedDescription}`
            : null
      }
      onFile={noop}
      onDemo={noop}
    />
  );
  return (
    <AppShell current="parts" title="Parts">
      {body}
    </AppShell>
  );
}

export function PartsTableBoard({ result }: { result: ImportResult }) {
  return (
    <AppShell current="parts" title="Parts">
      <PartsTable result={result} onOpen={noop} onFile={noop} />
    </AppShell>
  );
}

export function PartsCompareBoard({
  state,
  result,
  partId,
  record,
  comparison,
}: {
  state: string;
  result: ImportResult;
  partId: string;
  record: PartRecord | null;
  comparison: Comparison | null;
}) {
  const part = result.parts.find((p) => p.id === partId)!;
  return (
    <AppShell current="parts" title="Parts">
      <PartCompare
        part={part}
        record={record}
        comparison={comparison}
        state={state === "loading" ? "loading" : state === "error" ? "error" : "ready"}
        onRetry={noop}
      />
    </AppShell>
  );
}
