import { cn } from "../lib/cn";

const tones = ["bg-block-solder", "bg-block-fr4", "bg-block-silk", "bg-block-copper"] as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")
  ).toUpperCase();
}

function toneFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return tones[hash % tones.length];
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-ink select-none",
        size === "sm" && "size-5 text-[0.5625rem]",
        size === "md" && "size-6 text-[0.625rem]",
        size === "lg" && "size-8 text-[0.75rem]",
        toneFor(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className="inline-flex items-center -space-x-1.5">
      {shown.map((name) => (
        <Avatar key={name} name={name} className="ring-2 ring-raised" />
      ))}
      {rest > 0 ? (
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-sunken text-[0.625rem] font-semibold text-ink-muted ring-2 ring-raised">
          +{rest}
        </span>
      ) : null}
    </span>
  );
}
