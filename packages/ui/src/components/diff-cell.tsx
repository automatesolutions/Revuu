import { cn } from "../lib/cn";
import { Icon } from "./icon";

export interface DiffCellProps {
  children: React.ReactNode;
  /** True when the value differs from the baseline part. */
  differs: boolean;
  align?: "start" | "end";
  className?: string;
}

/**
 * Comparison table cell. A differing value gets the warning background and a "differs" icon with
 * an accessible name, so the difference never relies on color alone.
 */
export function DiffCell({ children, differs, align = "start", className }: DiffCellProps) {
  return (
    <td
      className={cn(
        "border-b border-hairline px-3 py-2 align-top tabular-nums",
        align === "end" && "text-right",
        differs && "bg-status-warning-bg",
        className,
      )}
    >
      <span
        className={cn("inline-flex items-start gap-1.5", align === "end" && "flex-row-reverse")}
      >
        {differs ? (
          <Icon
            name="differs"
            label="Differs from baseline"
            className="mt-0.5 size-3.5 text-status-warning"
          />
        ) : null}
        <span>{children}</span>
      </span>
    </td>
  );
}
