import { cn } from "../lib/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-raised p-6 text-body-sm text-ink shadow-[inset_0_0_0_1px_var(--color-hairline)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4", className)}>
      <div className="grid gap-1">
        <h3 className="text-title">{title}</h3>
        {description ? <p className="text-body-sm text-ink-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
