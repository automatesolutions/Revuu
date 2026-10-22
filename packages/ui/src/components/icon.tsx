import { cn } from "../lib/cn";

/**
 * Lucide icons rendered as CSS masks by @iconify/tailwind4. Class names must stay literal strings
 * so Tailwind can find them; add new icons to this map.
 */
const icons = {
  "alert-octagon": "icon-[lucide--octagon-alert]",
  "arrow-left": "icon-[lucide--arrow-left]",
  "arrow-right": "icon-[lucide--arrow-right]",
  "arrow-up-right": "icon-[lucide--arrow-up-right]",
  bell: "icon-[lucide--bell]",
  "book-open": "icon-[lucide--book-open]",
  check: "icon-[lucide--check]",
  "check-circle": "icon-[lucide--circle-check]",
  "chevron-down": "icon-[lucide--chevron-down]",
  "chevron-right": "icon-[lucide--chevron-right]",
  "chevrons-up-down": "icon-[lucide--chevrons-up-down]",
  "circle-dashed": "icon-[lucide--circle-dashed]",
  "circle-dot": "icon-[lucide--circle-dot]",
  "circuit-board": "icon-[lucide--circuit-board]",
  clock: "icon-[lucide--clock]",
  command: "icon-[lucide--command]",
  cpu: "icon-[lucide--cpu]",
  differs: "icon-[lucide--equal-not]",
  download: "icon-[lucide--download]",
  "external-link": "icon-[lucide--external-link]",
  "file-check": "icon-[lucide--file-check]",
  "file-spreadsheet": "icon-[lucide--file-spreadsheet]",
  "file-text": "icon-[lucide--file-text]",
  filter: "icon-[lucide--list-filter]",
  "folder-kanban": "icon-[lucide--folder-kanban]",
  "git-branch": "icon-[lucide--git-branch]",
  "git-compare": "icon-[lucide--git-compare-arrows]",
  globe: "icon-[lucide--globe]",
  "help-circle": "icon-[lucide--circle-help]",
  history: "icon-[lucide--history]",
  hourglass: "icon-[lucide--hourglass]",
  inbox: "icon-[lucide--inbox]",
  info: "icon-[lucide--info]",
  "layout-dashboard": "icon-[lucide--layout-dashboard]",
  "list-checks": "icon-[lucide--list-checks]",
  loader: "icon-[lucide--loader-circle]",
  lock: "icon-[lucide--lock]",
  mail: "icon-[lucide--mail]",
  menu: "icon-[lucide--menu]",
  "message-square": "icon-[lucide--message-square]",
  monitor: "icon-[lucide--monitor]",
  moon: "icon-[lucide--moon]",
  nut: "icon-[lucide--nut]",
  package: "icon-[lucide--package]",
  "panel-left": "icon-[lucide--panel-left]",
  phone: "icon-[lucide--phone]",
  plug: "icon-[lucide--plug]",
  plus: "icon-[lucide--plus]",
  "refresh-cw": "icon-[lucide--refresh-cw]",
  replace: "icon-[lucide--replace]",
  search: "icon-[lucide--search]",
  settings: "icon-[lucide--settings]",
  "shield-check": "icon-[lucide--shield-check]",
  "sliders-horizontal": "icon-[lucide--sliders-horizontal]",
  "sort-asc": "icon-[lucide--arrow-up-narrow-wide]",
  "sort-desc": "icon-[lucide--arrow-down-wide-narrow]",
  sun: "icon-[lucide--sun]",
  "triangle-alert": "icon-[lucide--triangle-alert]",
  upload: "icon-[lucide--upload]",
  users: "icon-[lucide--users]",
  "wifi-off": "icon-[lucide--wifi-off]",
  x: "icon-[lucide--x]",
  "x-circle": "icon-[lucide--circle-x]",
  zap: "icon-[lucide--zap]",
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  /** Accessible label. Omit for decorative icons next to visible text. */
  label?: string;
}

export function Icon({ name, label, className, ...props }: IconProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block size-4 shrink-0 align-[-0.125em]", icons[name], className)}
      {...props}
    />
  );
}
