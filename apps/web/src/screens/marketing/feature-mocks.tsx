import { Avatar } from "@revuu/ui/components/avatar";
import { Icon } from "@revuu/ui/components/icon";
import { LifecycleBadge, StatusChip, type Status } from "@revuu/ui/components/status-chip";
import { cn } from "@revuu/ui/lib/cn";

const panel =
  "rounded-lg bg-raised text-ink shadow-[0_0_0_1px_var(--color-hairline),0_16px_40px_-24px_rgb(15_17_21/0.3)]";

const checklist: { title: string; status: Status; who: string; comments: number }[] = [
  {
    title: "Decoupling caps within 2 mm of every VDD pin",
    status: "approved",
    who: "Mara Lin",
    comments: 0,
  },
  {
    title: "Feedback divider sets 3.3 V ±2% across tolerance",
    status: "approved",
    who: "Mara Lin",
    comments: 1,
  },
  { title: "ESD protection on USB D+ and D−", status: "warning", who: "Theo Okafor", comments: 3 },
  { title: "Test point on every power rail", status: "pending", who: "Theo Okafor", comments: 0 },
  {
    title: "Thermal relief on GND pours under U2",
    status: "pending",
    who: "Ana Reyes",
    comments: 0,
  },
];

export function ChecklistMock() {
  return (
    <div className={panel}>
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
        <div className="grid">
          <p className="text-[0.9375rem] font-bold">Schematic review</p>
          <p className="text-caption font-medium text-ink-subtle">
            Power board, Rev C · Template: Power supply v3
          </p>
        </div>
        <span className="text-ui text-ink-muted tabular-nums">2 of 5 done</span>
      </div>
      <ul className="divide-y divide-hairline">
        {checklist.map((item) => (
          <li key={item.title} className="flex items-center gap-3 px-5 py-3">
            <StatusChip status={item.status} size="sm" className="w-[5.75rem] justify-start" />
            <span className="min-w-0 flex-1 text-body-sm">{item.title}</span>
            {item.comments ? (
              <span className="flex items-center gap-1 text-caption text-ink-muted tabular-nums">
                <Icon name="message-square" className="size-3.5" />
                <span className="sr-only">Comments: </span>
                {item.comments}
              </span>
            ) : null}
            <Avatar name={item.who} size="sm" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ThreadMock() {
  return (
    <div className={cn(panel, "grid gap-0")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-hairline px-5 py-4">
        <span className="text-ui text-ink-muted">BOM line</span>
        <span className="mpn">U2 · TPS62133RGTR</span>
        <LifecycleBadge lifecycle="active" source="Mouser" age="5 h ago" size="sm" />
      </div>
      <ol className="grid gap-5 px-5 py-5">
        <Comment
          name="Theo Okafor"
          time="Tue 10:12"
          body={
            <>
              Load peaks at 1.1 A on this rail. Do we need the 3 A part, or can we drop to the 1 A{" "}
              <span className="mpn">TPS62132</span>?
            </>
          }
        />
        <Comment
          name="Mara Lin"
          time="Tue 11:40"
          body={
            <>
              <span className="font-semibold text-accent">@Theo Okafor</span> keep 3 A. Rev D adds
              the radio module and that pushes the rail to 2.4 A.
            </>
          }
        />
        <li className="flex items-center gap-2 pl-9 text-caption font-medium text-ink-subtle">
          <Icon name="check-circle" className="size-3.5 text-status-approved" />
          Resolved by Theo Okafor · Decision added to the audit log
        </li>
      </ol>
    </div>
  );
}

function Comment({ name, time, body }: { name: string; time: string; body: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[1.5rem_1fr] gap-3">
      <Avatar name={name} size="sm" />
      <div className="grid gap-1">
        <p className="text-caption">
          <span className="font-semibold text-ink">{name}</span>{" "}
          <span className="font-medium text-ink-subtle">{time}</span>
        </p>
        <p className="text-body-sm">{body}</p>
      </div>
    </li>
  );
}

const alternates = [
  {
    mpn: "DMP2035U-7",
    maker: "Diodes Inc.",
    vds: "−20 V",
    id: "−3.6 A",
    rds: "35 mΩ",
    stock: "61,200",
    differs: [] as string[],
  },
  {
    mpn: "SI2343CDS-T1-GE3",
    maker: "Vishay",
    vds: "−30 V",
    id: "−4.0 A",
    rds: "45 mΩ",
    stock: "18,450",
    differs: ["vds"],
  },
  {
    mpn: "AO3401A",
    maker: "Alpha & Omega",
    vds: "−30 V",
    id: "−4.0 A",
    rds: "50 mΩ",
    stock: "212,000",
    differs: ["vds", "rds"],
  },
];

export function AlternatesMock() {
  return (
    <div className={panel}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-5 py-4">
        <span className="mpn">Q3 · IRLML6402TRPBF</span>
        <LifecycleBadge lifecycle="eol" source="DigiKey" age="1 d ago" size="sm" />
        <span className="ml-auto text-caption font-medium text-ink-subtle">
          Baseline: −20 V, −3.7 A, 65 mΩ
        </span>
      </div>
      <div
        role="region"
        aria-label="Alternates comparison"
        tabIndex={0}
        className="overflow-x-auto"
      >
        <table className="w-full min-w-[34rem] text-ui">
          <caption className="sr-only">Alternate parts for IRLML6402TRPBF</caption>
          <thead>
            <tr className="border-b border-hairline bg-surface text-left text-caption text-ink-muted">
              <th scope="col" className="h-8 px-5 font-semibold">
                Alternate
              </th>
              <th scope="col" className="h-8 px-2 text-right font-semibold">
                Vds
              </th>
              <th scope="col" className="h-8 px-2 text-right font-semibold">
                Id
              </th>
              <th scope="col" className="h-8 px-2 text-right font-semibold">
                Rds(on)
              </th>
              <th scope="col" className="h-8 px-5 text-right font-semibold">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {alternates.map((alt, i) => (
              <tr
                key={alt.mpn}
                className={cn(
                  "border-b border-hairline last:border-0",
                  i === 0 && "bg-status-approved-bg/50",
                )}
              >
                <td className="h-12 px-5">
                  <span className="grid">
                    <span className="mpn">{alt.mpn}</span>
                    <span className="text-[0.75rem] text-ink-subtle">{alt.maker}</span>
                  </span>
                </td>
                <Spec value={alt.vds} differs={alt.differs.includes("vds")} />
                <Spec value={alt.id} differs={false} />
                <Spec value={alt.rds} differs={alt.differs.includes("rds")} />
                <td className="px-5 text-right tabular-nums">{alt.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="flex items-center gap-2 border-t border-hairline px-5 py-3 text-caption font-medium text-ink-subtle">
        <Icon name="triangle-alert" className="size-3.5 text-status-warning" />
        Highlighted values differ from the baseline part.
      </p>
    </div>
  );
}

function Spec({ value, differs }: { value: string; differs: boolean }) {
  return (
    <td className="px-2 text-right tabular-nums">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5",
          differs && "bg-status-warning-bg text-status-warning",
        )}
      >
        {differs ? (
          <Icon name="triangle-alert" className="size-3" label="Differs from baseline" />
        ) : null}
        {value}
      </span>
    </td>
  );
}

const gate: { review: string; who: string; when: string; status: Status }[] = [
  { review: "Schematic review", who: "Mara Lin", when: "Wed 14:02", status: "approved" },
  { review: "PCB layout review", who: "Theo Okafor", when: "Thu 09:15", status: "approved" },
  { review: "Parts review", who: "Ana Reyes", when: "Thu 16:48", status: "approved" },
];

export function SignoffMock() {
  return (
    <div className="grid gap-4">
      <div className={panel}>
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
          <p className="text-[0.9375rem] font-bold">Sign-off gate, Rev C</p>
          <StatusChip status="approved" size="sm">
            Ready
          </StatusChip>
        </div>
        <ul className="divide-y divide-hairline">
          {gate.map((row) => (
            <li key={row.review} className="flex items-center gap-3 px-5 py-3">
              <Avatar name={row.who} size="sm" />
              <span className="grid min-w-0 flex-1">
                <span className="text-body-sm font-semibold">{row.review}</span>
                <span className="text-caption font-medium text-ink-subtle">
                  Signed by {row.who}, {row.when}
                </span>
              </span>
              <StatusChip status={row.status} size="sm" />
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-5 py-4">
          <p className="text-caption font-medium text-ink-subtle">
            Releases Rev C to manufacturing.
          </p>
          <span className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-[0.875rem] font-semibold text-on-primary">
            <Icon name="file-check" />
            Sign off Rev C
          </span>
        </div>
      </div>
      <div className={cn(panel, "flex items-center gap-4 px-5 py-4")}>
        <span className="flex size-10 items-center justify-center rounded-md bg-block-copper">
          <Icon name="file-text" className="size-5" />
        </span>
        <span className="grid min-w-0 flex-1">
          <span className="text-body-sm font-semibold">Release report, Power board Rev C</span>
          <span className="text-caption font-medium text-ink-subtle">
            PDF · 14 pages · 3 reviews, 42 BOM lines, 18 comments, full audit log
          </span>
        </span>
      </div>
    </div>
  );
}
