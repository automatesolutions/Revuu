import Link from "next/link";
import { Avatar } from "@revuu/ui/components/avatar";
import { Button } from "@revuu/ui/components/button";
import { Icon } from "@revuu/ui/components/icon";
import { EmptyState, ErrorState, LoadingRegion, Skeleton } from "@revuu/ui/components/states";
import { LifecycleBadge, StatusChip } from "@revuu/ui/components/status-chip";
import { cn } from "@revuu/ui/lib/cn";
import { EmptyBoardIllustration } from "@/components/illustrations";
import { LinkButton } from "@/components/link-button";
import { activity, needsAlternate, partAlerts, partsLists } from "@/fixtures/dashboard";

export const dashboardStates = ["default", "empty", "loading", "error", "stale"] as const;
export type DashboardState = (typeof dashboardStates)[number];

const panel = "rounded-lg bg-raised shadow-[inset_0_0_0_1px_var(--color-hairline)]";

export function Dashboard({ state = "default" }: { state?: DashboardState }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-page-title">Dashboard</h1>
          <p className="text-body-sm text-ink-muted">
            {state === "empty"
              ? "No parts list yet."
              : state === "default" || state === "stale"
                ? "3 parts need an alternate. 3 parts changed lifecycle this week."
                : " "}
          </p>
        </div>
        {state === "loading" ? (
          <Button variant="primary" icon="upload" disabled>
            Import parts list
          </Button>
        ) : state !== "empty" ? (
          <LinkButton href="/app/parts" variant="primary" icon="upload">
            Import parts list
          </LinkButton>
        ) : null}
      </div>

      {state === "empty" ? <DashboardEmpty /> : null}
      {state === "loading" ? <DashboardLoading /> : null}
      {state === "error" ? (
        <ErrorState
          headingLevel="h2"
          title="The dashboard didn't load"
          description="Revuu lost contact with the workspace database. Your parts lists are safe. Revuu retries in 30 seconds."
          detail="503 · request 4c1e7a · 09:41"
          action={
            <Button size="sm" icon="refresh-cw">
              Retry now
            </Button>
          }
        />
      ) : null}
      {state === "default" || state === "stale" ? (
        <DashboardContent stale={state === "stale"} />
      ) : null}
    </div>
  );
}

function DashboardContent({ stale }: { stale: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6">
        <section aria-labelledby="alternates-title" className={panel}>
          <PanelHeader
            id="alternates-title"
            title="Parts that need an alternate"
            meta={`${needsAlternate.length} parts`}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] text-ui">
              <thead>
                <tr className="border-y border-hairline bg-surface text-left text-caption text-ink-muted">
                  <th scope="col" className="h-8 px-4 font-semibold">
                    Part
                  </th>
                  <th scope="col" className="h-8 px-3 font-semibold">
                    Lifecycle
                  </th>
                  <th scope="col" className="h-8 px-3 font-semibold">
                    Parts list
                  </th>
                  <th scope="col" className="h-8 px-4 text-right font-semibold">
                    Alternates
                  </th>
                </tr>
              </thead>
              <tbody>
                {needsAlternate.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-hairline last:border-0 hover:bg-surface"
                  >
                    <th scope="row" className="h-12 px-4 text-left font-normal">
                      <Link href="/app/parts" className="grid hover:underline">
                        <span className="mpn font-semibold text-ink">
                          {row.designator} · {row.mpn}
                        </span>
                        <span className="text-[0.75rem] text-ink-subtle">{row.manufacturer}</span>
                      </Link>
                    </th>
                    <td className="px-3">
                      <LifecycleBadge
                        lifecycle={row.lifecycle}
                        source="Vendor record"
                        age={row.age}
                        size="sm"
                      />
                    </td>
                    <td className="px-3 text-ink-muted">{row.list}</td>
                    <td className="px-4 text-right tabular-nums">
                      {row.alternates ? (
                        <Link
                          href="/app/parts"
                          className="font-semibold text-accent hover:underline"
                        >
                          Compare {row.alternates}
                        </Link>
                      ) : (
                        <span className="text-ink-subtle">None on record</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="lists-title" className={panel}>
          <PanelHeader
            id="lists-title"
            title="Parts lists"
            meta={`${partsLists.length} lists`}
            action={
              <Link href="/app/parts" className="text-ui font-semibold text-accent hover:underline">
                Open parts
              </Link>
            }
          />
          <div role="region" aria-labelledby="lists-title" tabIndex={0} className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-ui">
              <thead>
                <tr className="border-y border-hairline bg-surface text-left text-caption text-ink-muted">
                  <th scope="col" className="h-8 px-4 font-semibold">
                    List
                  </th>
                  <th scope="col" className="h-8 px-3 text-right font-semibold">
                    Electrical
                  </th>
                  <th scope="col" className="h-8 px-3 text-right font-semibold">
                    Mechanical
                  </th>
                  <th scope="col" className="h-8 px-3 text-right font-semibold">
                    Skipped
                  </th>
                  <th scope="col" className="h-8 px-3 text-right font-semibold">
                    Need an alternate
                  </th>
                  <th scope="col" className="h-8 px-4 text-right font-semibold">
                    Imported
                  </th>
                </tr>
              </thead>
              <tbody>
                {partsLists.map((list) => (
                  <tr
                    key={list.id}
                    className="border-b border-hairline last:border-0 hover:bg-surface"
                  >
                    <th scope="row" className="h-12 px-4 text-left font-normal">
                      <span className="grid">
                        <span className="font-semibold text-ink">{list.name}</span>
                        <span className="mpn text-[0.75rem] text-ink-subtle">{list.file}</span>
                      </span>
                    </th>
                    <td className="px-3 text-right tabular-nums">{list.electrical}</td>
                    <td className="px-3 text-right tabular-nums">{list.mechanical}</td>
                    <td className="px-3 text-right tabular-nums">
                      {list.skipped ? list.skipped : <span className="text-ink-subtle">0</span>}
                    </td>
                    <td className="px-3 text-right tabular-nums">
                      {list.needAlternate ? (
                        <StatusChip status="warning" size="sm">
                          {list.needAlternate}
                        </StatusChip>
                      ) : (
                        <span className="text-ink-subtle">0</span>
                      )}
                    </td>
                    <td className="px-4 text-right whitespace-nowrap text-ink-subtle">
                      {list.imported}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6">
        <section aria-labelledby="alerts-title" className={panel}>
          <PanelHeader id="alerts-title" title="Lifecycle changes" meta="This week" />
          {stale ? (
            <div className="px-4 pb-3">
              <p
                role="status"
                className="flex items-start gap-2 rounded-md bg-status-warning-bg px-3 py-2 text-caption font-medium text-status-warning"
              >
                <Icon name="wifi-off" className="mt-px size-3.5" />
                Vendor records didn’t refresh. Lifecycle below is from 06:40. Revuu retries in 2
                minutes.
              </p>
            </div>
          ) : null}
          <ul className="divide-y divide-hairline border-t border-hairline">
            {partAlerts.map((alert) => (
              <li key={alert.id} className="grid gap-1.5 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate mpn">{alert.mpn}</span>
                  <span className="text-caption font-medium whitespace-nowrap text-ink-subtle">
                    In {alert.lists} {alert.lists === 1 ? "list" : "lists"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <LifecycleBadge lifecycle={alert.from} size="sm" />
                  <Icon name="arrow-right" className="size-3 text-ink-subtle" label="changed to" />
                  <LifecycleBadge
                    lifecycle={alert.to}
                    source={alert.source}
                    age={alert.age}
                    size="sm"
                  />
                </div>
                <p
                  className={cn(
                    "text-[0.75rem]",
                    stale ? "text-status-warning" : "text-ink-subtle",
                  )}
                >
                  {alert.manufacturer} · {alert.source},{" "}
                  {stale ? "06:40, not refreshed" : alert.age}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="activity-title" className={panel}>
          <PanelHeader id="activity-title" title="Activity" />
          <ol className="grid gap-4 border-t border-hairline px-4 py-4">
            {activity.map((item) => (
              <li key={item.id} className="grid grid-cols-[1.5rem_1fr] gap-3">
                <Avatar name={item.who} size="sm" />
                <p className="text-ui text-ink-muted">
                  <span className="font-semibold text-ink">{item.who}</span> {item.action}{" "}
                  <span className="text-ink">{item.target}</span>
                  <span className="block text-[0.75rem] text-ink-subtle">{item.when}</span>
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function PanelHeader({
  id,
  title,
  meta,
  action,
}: {
  id: string;
  title: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-baseline gap-2">
        <h2 id={id} className="font-sans text-[0.9375rem] font-bold">
          {title}
        </h2>
        {meta ? <span className="text-caption font-medium text-ink-subtle">{meta}</span> : null}
      </div>
      {action}
    </div>
  );
}

function DashboardEmpty() {
  return (
    <EmptyState
      headingLevel="h2"
      className="py-16"
      illustration={<EmptyBoardIllustration className="h-24 w-auto" />}
      title="Start with a parts list"
      description="Import a CSV or Excel parts list. Revuu lines up each electrical and mechanical part with its alternates."
      action={
        <div className="grid justify-items-center gap-3">
          <LinkButton href="/app/parts" variant="primary" icon="upload">
            Import parts list
          </LinkButton>
          <LinkButton href="/#how-it-works" variant="link" size="sm">
            See a sample comparison
          </LinkButton>
        </div>
      }
    />
  );
}

function DashboardLoading() {
  return (
    <LoadingRegion
      label="Loading dashboard"
      className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <div className="grid content-start gap-6">
        {[3, 4].map((rows, i) => (
          <div key={i} className={cn(panel, "grid gap-0 overflow-hidden")}>
            <div className="px-4 py-3.5">
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="h-8 border-y border-hairline bg-surface" />
            {Array.from({ length: rows }, (_, r) => (
              <div
                key={r}
                className="flex items-center gap-6 border-b border-hairline px-4 py-3.5 last:border-0"
              >
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="ml-auto h-5 w-16" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="grid content-start gap-6">
        {[3, 5].map((rows, i) => (
          <div key={i} className={cn(panel, "grid gap-4 p-4")}>
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: rows }, (_, r) => (
              <div key={r} className="grid gap-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}
