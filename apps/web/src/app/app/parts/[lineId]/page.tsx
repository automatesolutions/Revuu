import type { Metadata } from "next";
import { Suspense } from "react";
import { PartCompareScreen } from "@/screens/app/parts/part-compare-screen";
import { PartsLoading } from "@/screens/app/parts/parts-screen";

export const metadata: Metadata = { title: "Alternates" };

// Line ids exist only in the browser tab that imported the list, so this route renders on request.
export const instant = false;

export default function PartLinePage({ params }: PageProps<"/app/parts/[lineId]">) {
  return (
    <Suspense fallback={<PartsLoading />}>
      <Line params={params} />
    </Suspense>
  );
}

async function Line({ params }: Pick<PageProps<"/app/parts/[lineId]">, "params">) {
  const { lineId } = await params;
  return <PartCompareScreen lineId={lineId} />;
}
