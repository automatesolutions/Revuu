"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@revuu/ui/components/states";
import { EmptyBoardIllustration } from "@/components/illustrations";
import { LinkButton } from "@/components/link-button";
import type { Comparison, PartRecord } from "@/lib/parts/compare";
import { vendorsFromParts } from "@/lib/parts/lines";
import { useImport } from "@/lib/parts/store";
import type { ImportResult, Part } from "@/lib/parts/types";
import { PartCompare } from "./part-compare";
import { PartsLoading } from "./parts-screen";

type Loaded = { record: PartRecord | null; comparison: Comparison | null };

/** /app/parts/[lineId]: one imported line against its alternates. */
export function PartCompareScreen({ lineId }: { lineId: string }) {
  const imported = useImport();
  const part = imported?.parts.find((p) => p.id === lineId);

  if (imported === undefined) return <PartsLoading />;
  if (!imported || !part) {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <h1 className="text-page-title">Alternates</h1>
        <EmptyState
          headingLevel="h2"
          illustration={<EmptyBoardIllustration className="h-20 w-auto" />}
          title="This line is not in the imported list."
          description="The parts list lives in this browser tab only. Import it again, then open the line."
          action={
            <LinkButton href="/app/parts" variant="primary" icon="arrow-left">
              Go to parts
            </LinkButton>
          }
        />
      </div>
    );
  }
  return <LoadedCompare part={part} imported={imported} />;
}

function LoadedCompare({ part, imported }: { part: Part; imported: ImportResult }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    setLoaded(null);
    try {
      const response = await fetch("/api/parts/alternates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mpn: part.mpn, vendors: vendorsFromParts(imported.parts) }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setLoaded((await response.json()) as Loaded);
    } catch {
      setFailed(true);
    }
  }, [part.mpn, imported.parts]);

  useEffect(() => {
    // Fetching on mount is the data load for this client-only view.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <PartCompare
      part={part}
      record={loaded?.record ?? null}
      comparison={loaded?.comparison ?? null}
      state={failed ? "error" : loaded ? "ready" : "loading"}
      onRetry={() => void load()}
    />
  );
}
