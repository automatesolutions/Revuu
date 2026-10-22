"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingRegion, Skeleton } from "@revuu/ui/components/states";
import {
  hasAcceptedExtension,
  importFailedDescription,
  importFailedTitle,
  maxUploadBytes,
  tooLargeMessage,
  wrongFileMessage,
} from "@/lib/parts/messages";
import { saveImport, useImport } from "@/lib/parts/store";
import type {
  Category,
  ColumnMapping as Mapping,
  ImportResult,
  ParsedSheet,
} from "@/lib/parts/types";
import { ColumnMapping } from "./column-mapping";
import { ImportStart, type ImportBusy } from "./import-start";
import { PartsTable } from "./parts-table";

const importFailed = `${importFailedTitle} ${importFailedDescription}`;

type Draft = { sheet: ParsedSheet; mapping: Mapping; chosen: Record<string, Category> };

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  try {
    return (await response.json()) as T & { error?: string };
  } catch {
    return { error: importFailed } as T & { error?: string };
  }
}

/** /app/parts: import, confirm columns, then the parts table. */
export function PartsScreen() {
  const router = useRouter();
  const imported = useImport();
  const [busy, setBusy] = useState<ImportBusy>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function read(request: Promise<Response>, kind: Exclude<ImportBusy, null>) {
    setBusy(kind);
    setError(null);
    try {
      const response = await request;
      const body = await readJson<{ sheet: ParsedSheet; mapping: Mapping }>(response);
      if (!response.ok || body.error) setError(body.error ?? importFailed);
      else {
        setDraft({ sheet: body.sheet, mapping: body.mapping, chosen: {} });
        setCreateError(null);
      }
    } catch {
      setError(importFailed);
    } finally {
      setBusy(null);
    }
  }

  function onFile(file: File) {
    if (!hasAcceptedExtension(file.name)) return setError(wrongFileMessage);
    if (file.size > maxUploadBytes) return setError(tooLargeMessage);
    const form = new FormData();
    form.append("file", file);
    void read(fetch("/api/parts/import", { method: "POST", body: form }), "file");
  }

  function onDemo() {
    void read(fetch("/api/parts/import?demo=xlsx", { method: "POST" }), "demo");
  }

  async function onCreate() {
    if (!draft) return;
    setCreating(true);
    setCreateError(null);
    try {
      const response = await fetch("/api/parts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const body = await readJson<ImportResult>(response);
      if (!response.ok || body.error) setCreateError(body.error ?? importFailed);
      else {
        saveImport(body);
        setDraft(null);
      }
    } catch {
      setCreateError(importFailed);
    } finally {
      setCreating(false);
    }
  }

  if (draft) {
    return (
      <ColumnMapping
        sheet={draft.sheet}
        mapping={draft.mapping}
        chosen={draft.chosen}
        creating={creating}
        error={createError}
        onMappingChange={(mapping) => setDraft({ ...draft, mapping })}
        onChoose={(id, category) =>
          setDraft({ ...draft, chosen: { ...draft.chosen, [id]: category } })
        }
        onCreate={onCreate}
        onCancel={() => setDraft(null)}
      />
    );
  }

  if (imported === undefined) return <PartsLoading />;

  if (imported) {
    return (
      <PartsTable
        result={imported}
        busy={busy}
        error={error}
        onDismissError={() => setError(null)}
        onFile={onFile}
        onOpen={(part) => router.push(`/app/parts/${part.id}`)}
      />
    );
  }

  return (
    <ImportStart
      busy={busy}
      error={error}
      onFile={onFile}
      onDemo={onDemo}
      onDismissError={() => setError(null)}
    />
  );
}

export function PartsLoading() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="text-page-title">Parts</h1>
      <LoadingRegion label="Loading the parts list." className="grid gap-2">
        <Skeleton className="h-8 w-72" />
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-9" />
        ))}
      </LoadingRegion>
    </div>
  );
}
