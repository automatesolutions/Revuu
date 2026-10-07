import Link from "next/link";
import { buttonVariants, type ButtonVariants } from "@revuu/ui/components/button";
import { Icon, type IconName } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";

type LinkButtonProps = React.ComponentProps<typeof Link> &
  ButtonVariants & { icon?: IconName; iconRight?: IconName };

export function LinkButton({
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {icon ? <Icon name={icon} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} /> : null}
    </Link>
  );
}
