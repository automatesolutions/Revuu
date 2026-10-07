import { useId } from "react";
import { cn } from "../lib/cn";
import { Icon } from "./icon";

const control =
  "w-full rounded-md bg-raised px-3 text-body-sm text-ink placeholder:text-ink-subtle " +
  "shadow-[inset_0_0_0_1px_var(--color-border-input)] transition-shadow duration-120 ease-standard " +
  "hover:shadow-[inset_0_0_0_1px_var(--color-ink-muted)] " +
  "aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-status-rejected)] disabled:bg-surface disabled:text-ink-subtle";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, "h-9", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-24 py-2", className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select className={cn(control, "h-9 appearance-none pr-9", className)} {...props}>
        {children}
      </select>
      <Icon
        name="chevrons-up-down"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-subtle"
      />
    </span>
  );
}

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode;
}

/** Label, hint and error wiring for one control. */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className="text-label text-ink">
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error ? (
        <p id={hintId} className="text-caption font-medium text-ink-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="flex items-center gap-1.5 text-caption font-medium text-status-rejected"
        >
          <Icon name="x-circle" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
