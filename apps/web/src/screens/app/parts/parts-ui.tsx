import { Icon, type IconName } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import type { Fit } from "@/lib/parts/compare";
import { categoryLabel, type Category } from "@/lib/parts/types";

export const panel = "rounded-lg bg-raised shadow-[inset_0_0_0_1px_var(--color-hairline)]";

export const number = new Intl.NumberFormat("en-US");
export const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

/** Labels every screen that shows fixture data. */
export function DemoTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[1.375rem] shrink-0 items-center gap-1 rounded-xs bg-sunken px-2 text-label text-ink-muted",
        className,
      )}
    >
      <Icon name="info" className="size-3.5" />
      Demo data
    </span>
  );
}

const categoryIcon: Record<Category, IconName> = { electrical: "zap", mechanical: "nut" };

export function CategoryTag({ category }: { category: Category }) {
  return (
    <span className="inline-flex items-center gap-1 text-ui text-ink">
      <Icon name={categoryIcon[category]} className="size-3.5 text-ink-subtle" />
      {categoryLabel[category]}
    </span>
  );
}

export function FitTag({ fit }: { fit: Fit }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded-xs px-1.5 text-[0.75rem] font-semibold whitespace-nowrap",
        "bg-raised text-ink shadow-[inset_0_0_0_1px_var(--color-hairline-strong)]",
      )}
    >
      <Icon name={fit === "Drop-in" ? "check" : "git-compare"} className="size-3" />
      {fit}
    </span>
  );
}

/** Splits "First sentence. The rest." so an error can use the first sentence as its title. */
export function splitMessage(message: string) {
  const end = message.indexOf(". ");
  return end === -1
    ? { title: message, description: "" }
    : { title: message.slice(0, end + 1), description: message.slice(end + 2) };
}
