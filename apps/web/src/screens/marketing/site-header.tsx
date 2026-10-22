"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { IconButton } from "@revuu/ui/components/button";
import { RevuuLogo } from "@revuu/ui/components/logo";
import { cn } from "@revuu/ui/lib/cn";
import { LinkButton } from "@/components/link-button";

const links = [
  { href: "/#why", label: "Why Revuu" },
  { href: "/#import", label: "Import" },
  { href: "/#compare", label: "Comparison" },
  { href: "/#vendors", label: "Vendor contacts" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader({ current: currentProp }: { current?: "home" | "pricing" }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const current = currentProp ?? (pathname === "/pricing" ? "pricing" : "home");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="relative z-30 bg-canvas">
      <div className="mx-auto flex h-16 max-w-content items-center gap-8 px-6 lg:px-12">
        <Link href="/" aria-label="Revuu home" className="rounded-sm">
          <RevuuLogo />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={
                    current === "pricing" && link.href === "/pricing" ? "page" : undefined
                  }
                  className="inline-flex h-9 items-center rounded-md px-3 text-[0.9375rem] font-medium text-ink-muted transition-colors duration-120 ease-standard hover:text-ink aria-[current=page]:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LinkButton href="/app" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </LinkButton>
          <LinkButton href="/app" variant="primary" className="rounded-pill px-4">
            Start free
          </LinkButton>
          <IconButton
            icon={open ? "x" : "menu"}
            label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
            className="size-11 md:hidden"
          />
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className={cn(
          "absolute inset-x-0 top-full border-y border-hairline bg-canvas px-6 pb-6 md:hidden",
        )}
      >
        <nav aria-label="Main">
          <ul className="grid">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={
                    current === "pricing" && link.href === "/pricing" ? "page" : undefined
                  }
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center border-b border-hairline text-body font-medium text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/app" className="flex h-12 items-center text-body font-medium text-ink">
                Sign in
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
