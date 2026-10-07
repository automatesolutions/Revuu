import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Icon, type IconName } from "./icon";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-sans font-semibold transition-[background-color,color,box-shadow,transform] duration-120 ease-standard",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover",
        secondary:
          "bg-raised text-ink shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] hover:bg-surface",
        ghost: "bg-transparent text-ink hover:bg-surface",
        accent: "bg-accent text-on-accent hover:bg-accent-strong",
        danger: "bg-status-rejected text-raised hover:opacity-90",
        link: "h-auto bg-transparent px-0 text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-7 rounded-sm px-2.5 text-ui",
        md: "h-9 rounded-md px-3.5 text-[0.875rem]",
        lg: "h-12 rounded-pill px-6 text-button",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonBaseProps = ButtonVariants & {
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
};

export type ButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant,
  size,
  icon,
  iconRight,
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Icon name="loader" className="animate-spin" />
      ) : icon ? (
        <Icon name={icon} />
      ) : null}
      {children}
      {iconRight ? <Icon name={iconRight} /> : null}
    </button>
  );
}

export type ButtonLinkProps = ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/** Anchor styled as a button. Pass a framework Link through `render` if client navigation is needed. */
export function ButtonLink({
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {icon ? <Icon name={icon} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} /> : null}
    </a>
  );
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  variant?: "ghost" | "secondary";
  size?: "sm" | "md";
}

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors duration-120 ease-standard hover:text-ink disabled:opacity-45",
        variant === "ghost"
          ? "hover:bg-surface"
          : "bg-raised shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] hover:bg-surface",
        size === "sm" ? "size-7" : "size-8",
        className,
      )}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
