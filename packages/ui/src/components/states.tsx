import { cn } from "../lib/cn";
import { Icon, type IconName } from "./icon";

export function EmptyState({
  title,
  description,
  action,
  illustration,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  illustration?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg bg-sunken px-6 py-12 text-center",
        className,
      )}
    >
      {illustration}
      <div className="grid max-w-[44ch] gap-2">
        <h3 className="text-title">{title}</h3>
        <p className="text-body-sm text-ink-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  detail,
  action,
  icon = "alert-octagon",
  className,
}: {
  title: string;
  description: string;
  /** Data age or request id, shown in mono. */
  detail?: string;
  action?: React.ReactNode;
  icon?: IconName;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-lg bg-status-rejected-bg/60 p-5 text-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-status-rejected)_25%,transparent)]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon name={icon} className="mt-0.5 size-5 text-status-rejected" />
        <div className="grid gap-1">
          <h3 className="font-sans text-[0.9375rem] font-bold">{title}</h3>
          <p className="text-body-sm text-ink-muted">{description}</p>
          {detail ? <p className="mpn text-ink-subtle">{detail}</p> : null}
        </div>
      </div>
      {action ? <div className="pl-8">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block h-4 skeleton", className)} />;
}

/** Wraps skeleton content so assistive tech hears one status message instead of empty boxes. */
export function LoadingRegion({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
