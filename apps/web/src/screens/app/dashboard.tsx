import Link from "next/link";
import { Avatar } from "@revuu/ui/components/avatar";
import { Button } from "@revuu/ui/components/button";
import { Icon } from "@revuu/ui/components/icon";
import { EmptyState, ErrorState, LoadingRegion, Skeleton } from "@revuu/ui/components/states";
import { LifecycleBadge, StatusChip } from "@revuu/ui/components/status-chip";
import { cn } from "@revuu/ui/lib/cn";
import { EmptyBoardIllustration } from "@/components/illustrations";
import { LinkButton } from "@/components/link-button";
import { activity, assignments, partAlerts, revisions } from "@/fixtures/dashboard";

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
              ? "Nothing to review yet."
              : state === "default" || state === "stale"
                ? "3 reviews are waiting on you. 3 parts changed lifecycle this week."
                : "\u00a0"}
          </p>
        </div>
        {state === "loading" ? (
          <div className="flex gap-2">
            <Button icon="upload" disabled>
              Import BOM
            </Button>
            <Button variant="primary" icon="plus" disabled>
              New project
            </Button>
          </div>
        ) : state !== "empty" ? (
          <div className="flex gap-2">
            <LinkButton href="/app/projects" icon="upload">
              Import BOM
            </LinkButton>
            <LinkButton href="/app/projects" variant="primary" icon="plus">
              New project
            </LinkButton>
          </div>
        ) : null}
      </div>

      {state === "empty" ? <DashboardEmpty /> : null}
      {state === "loading" ? <DashboardLoading /> : null}
      {state === "error" ? (
        <ErrorState
          title="The dashboard didn't load"
          description="Revuu lost contact with the workspace database. Your reviews and sign-offs are safe. Revuu retries in 30 seconds."
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
        <section aria-labelledby="waiting-title" className={panel}>
          <PanelHeader
            id="waiting-title"
            title="Waiting on you"
            meta={`${assignments.length} reviews`}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-ui">
              <thead>
                <tr className="border-y border-hairline bg-surface text-left text-caption text-ink-muted">
                  <th scope="col" className="h-8 px-4 font-semibold">
                    Review
                  </th>
                  <th scope="col" className="h-8 px-3 font-semibold">
                    Requested by
                  </th>
                  <th scope="col" className="h-8 px-3 font-semibold">
                    Due
                  </th>
                  <th scope="col" className="h-8 px-3 text-right font-semibold">
                    Open items
                  </th>
                  <th scope="col" className="h-8 px-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-hairline last:border-0 hover:bg-surface"
                  >
                    <td className="h-12 px-4">
                      <Link href="/app/reviews" className="grid hover:underline">
                        <span className="font-semibold text-ink">{a.review}</span>
                        <span className="text-[0.75rem] text-ink-subtle">
                          {a.project} · {a.revision}
                        </span>
                      </Link>
                    </td>
                    <td className="px-3">
                      <span className="flex items-center gap-2">
                        <Avatar name={a.requestedBy} size="sm" />
                        {a.requestedBy}
                      </span>
                    </td>
                    <td className="px-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5",
                          a.overdue && "font-semibold text-status-rejected",
                        )}
                      >
                        {a.overdue ? <Icon name="clock" className="size-3.5" /> : null}
                        {a.overdue ? `Overdue, was due ${a.due.toLowerCase()}` : a.due}
                      </span>
                    </td>
                    <td className="px-3 text-right tabular-nums">{a.openItems}</td>
                    <td className="px-4">
                      <StatusChip status={a.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="revisions-title" className={panel}>
          <PanelHeader
            id="revisions-title"
            title="Revisions in progress"
            meta="4 revisions"
            action={
              <Link
                href="/app/projects"
                className="text-ui font-semibold text-accent hover:underline"
              >
                All projects
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-ui">
              <thead>
                <tr className="border-y border-hairline bg-surface text-left text-caption text-ink-muted">
                  <th scope="col" className="h-8 px-4 font-semibold">
                    Revision
                  </th>
                  <th scope="col" className="h-8 px-3 font-semibold">
                    Schematic
                  </th>
                  <th scope="col" className="h-8 px-3 font-semibold">
                    PCB layout
                  </th>
                  <th scope="col" className="h-8 px-3 font-semibold">
                    Parts
                  </th>
                  <th scope="col" className="h-8 px-3 font-semibold">
                    Sign-off
                  </th>
                  <th scope="col" className="h-8 px-4 text-right font-semibold">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {revisions.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-hairline last:border-0 hover:bg-surface"
                  >
                    <th scope="row" className="h-10 px-4 text-left font-semibold">
                      <Link href="/app/projects" className="hover:underline">
                        {r.project}{" "}
                        <span className="mpn font-normal text-ink-muted">{r.revision}</span>
                      </Link>
                    </th>
                    <td className="px-3">
                      <StatusChip status={r.schematic} size="sm" />
                    </td>
                    <td className="px-3">
                      <StatusChip status={r.layout} size="sm" />
                    </td>
                    <td className="px-3">
                      <StatusChip status={r.parts} size="sm" />
                    </td>
                    <td className="px-3">
                      <StatusChip status={r.signoff} size="sm" />
                    </td>
                    <td className="px-4 text-right whitespace-nowrap text-ink-subtle">
                      {r.updated}
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
          <PanelHeader id="alerts-title" title="Part alerts" meta="This week" />
          {stale ? (
            <div className="px-4 pb-3">
              <p
                role="status"
                className="flex items-start gap-2 rounded-md bg-status-warning-bg px-3 py-2 text-caption font-medium text-status-warning"
              >
                <Icon name="wifi-off" className="mt-px size-3.5" />
                DigiKey didn’t respond. Lifecycle below is from 06:40. Revuu retries in 2 minutes.
              </p>
            </div>
          ) : null}
          <ul className="divide-y divide-hairline border-t border-hairline">
            {partAlerts.map((alert) => (
              <li key={alert.id} className="grid gap-1.5 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate mpn">{alert.mpn}</span>
                  <span className="text-caption font-medium whitespace-nowrap text-ink-subtle">
                    {alert.revisions} {alert.revisions === 1 ? "revision" : "revisions"}
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
      className="py-16"
      illustration={<EmptyBoardIllustration className="h-24 w-auto" />}
      title="Start with a project"
      description="A project holds every revision of one board. Create one, then import its BOM to start the first review."
      action={
        <div className="grid justify-items-center gap-3">
          <LinkButton href="/app/projects" variant="primary" icon="plus">
            New project
          </LinkButton>
          <LinkButton href="/#how-it-works" variant="link" size="sm">
            See a sample review
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
