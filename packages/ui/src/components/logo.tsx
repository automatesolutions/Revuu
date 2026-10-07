import { cn } from "../lib/cn";

/** Revuu mark: a board outline with a check-shaped trace ending in a via, plus a mounting hole. */
export function RevuuMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="currentColor" />
      <path
        d="M7.5 16.5 12.75 21.75 21.25 10.75"
        fill="none"
        stroke="var(--rv-mark-trace, var(--color-canvas))"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.75" cy="10.25" r="3.6" fill="var(--rv-mark-trace, var(--color-canvas))" />
      <circle cx="21.75" cy="10.25" r="1.45" fill="currentColor" />
      <circle cx="24.6" cy="24.6" r="1.7" fill="var(--rv-mark-trace, var(--color-canvas))" />
    </svg>
  );
}

export function RevuuLogo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <RevuuMark className={markClassName} />
      <span className="font-display text-[1.375rem] leading-none font-bold tracking-[-0.03em]">
        Revuu
      </span>
    </span>
  );
}
