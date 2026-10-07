import { cn } from "../lib/cn";
import { Icon, type IconName } from "./icon";

export type Status =
  | "approved"
  | "pending"
  | "warning"
  | "nrnd"
  | "eol"
  | "obsolete"
  | "rejected"
  | "restricted"
  | "proposed";

const statusStyle: Record<Status, { label: string; icon: IconName; tone: string }> = {
  approved: {
    label: "Approved",
    icon: "check-circle",
    tone: "bg-status-approved-bg text-status-approved",
  },
  pending: {
    label: "Pending",
    icon: "circle-dashed",
    tone: "bg-status-pending-bg text-status-pending",
  },
  warning: {
    label: "Warning",
    icon: "triangle-alert",
    tone: "bg-status-warning-bg text-status-warning",
  },
  nrnd: { label: "NRND", icon: "triangle-alert", tone: "bg-status-warning-bg text-status-warning" },
  eol: { label: "EOL", icon: "hourglass", tone: "bg-status-eol-bg text-status-eol" },
  obsolete: { label: "Obsolete", icon: "hourglass", tone: "bg-status-eol-bg text-status-eol" },
  rejected: {
    label: "Rejected",
    icon: "x-circle",
    tone: "bg-status-rejected-bg text-status-rejected",
  },
  restricted: {
    label: "Restricted",
    icon: "lock",
    tone: "bg-status-warning-bg text-status-warning",
  },
  proposed: {
    label: "Proposed",
    icon: "circle-dot",
    tone: "bg-status-pending-bg text-status-pending",
  },
};

export interface StatusChipProps {
  status: Status;
  /** Overrides the default word, e.g. "2 EOL". Keep the fixed status vocabulary. */
  children?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
  title?: string;
}

export function StatusChip({ status, children, size = "md", className, title }: StatusChipProps) {
  const style = statusStyle[status];
  return (
    <span
      title={title}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-xs font-semibold whitespace-nowrap",
        size === "sm" ? "h-5 px-1.5 text-[0.75rem]" : "h-[1.375rem] px-2 text-label",
        style.tone,
        className,
      )}
    >
      <Icon name={style.icon} className={size === "sm" ? "size-3" : "size-3.5"} />
      {children ?? style.label}
    </span>
  );
}

export type Lifecycle = "active" | "nrnd" | "ltb" | "eol" | "obsolete" | "unknown";

const lifecycleMap: Record<Lifecycle, { status: Status; label: string }> = {
  active: { status: "approved", label: "Active" },
  nrnd: { status: "nrnd", label: "NRND" },
  ltb: { status: "warning", label: "Last time buy" },
  eol: { status: "eol", label: "EOL" },
  obsolete: { status: "obsolete", label: "Obsolete" },
  unknown: { status: "pending", label: "Unknown" },
};

export interface LifecycleBadgeProps {
  lifecycle: Lifecycle;
  /** Distributor the value came from, e.g. "DigiKey". */
  source?: string;
  /** Human age of the data, e.g. "3 h ago". */
  age?: string;
  size?: "sm" | "md";
}

export function LifecycleBadge({ lifecycle, source, age, size }: LifecycleBadgeProps) {
  const entry = lifecycleMap[lifecycle];
  const provenance = source ? `${entry.label} · ${source}${age ? `, ${age}` : ""}` : undefined;
  return (
    <StatusChip status={entry.status} size={size} title={provenance}>
      {entry.label}
      {provenance ? (
        <span className="sr-only">
          , from {source}
          {age ? `, ${age}` : ""}
        </span>
      ) : null}
    </StatusChip>
  );
}
