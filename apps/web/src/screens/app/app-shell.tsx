"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@revuu/ui/components/avatar";
import { IconButton } from "@revuu/ui/components/button";
import { Icon, type IconName } from "@revuu/ui/components/icon";
import { RevuuMark } from "@revuu/ui/components/logo";
import { cn } from "@revuu/ui/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";
import { currentUser, workspace } from "@/fixtures/dashboard";
import { CommandPalette } from "./command-palette";

export type AppSection =
  "dashboard" | "projects" | "reviews" | "parts" | "avl" | "integrations" | "settings";

const primaryNav: { id: AppSection; label: string; icon: IconName; href: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard", href: "/app" },
  { id: "projects", label: "Projects", icon: "folder-kanban", href: "/app/projects" },
  { id: "reviews", label: "Reviews", icon: "list-checks", href: "/app/reviews" },
  { id: "parts", label: "Parts", icon: "package", href: "/app/parts" },
  { id: "avl", label: "Approved Parts List", icon: "shield-check", href: "/app/avl" },
];

const secondaryNav: { id: AppSection; label: string; icon: IconName; href: string }[] = [
  { id: "integrations", label: "Integrations", icon: "plug", href: "/app/integrations" },
  { id: "settings", label: "Settings", icon: "settings", href: "/app/settings" },
];

const allNav = [...primaryNav, ...secondaryNav];

function sectionFromPath(pathname: string): AppSection {
  const slug = pathname.split("/")[2];
  return allNav.find((item) => item.id === slug)?.id ?? "dashboard";
}

export function AppShell({
  current: currentProp,
  title: titleProp,
  children,
  paletteOpen: paletteOpenProp = false,
  reviewCount = 3,
  notice,
}: {
  notice?: string;
  /** Defaults to the section in the URL. */
  current?: AppSection;
  title?: string;
  children: React.ReactNode;
  reviewCount?: number;
  /** Opens the palette on first render, for artboards. */
  paletteOpen?: boolean;
}) {
  const pathname = usePathname();
  const current = currentProp ?? sectionFromPath(pathname);
  const title = titleProp ?? allNav.find((item) => item.id === current)?.label ?? "Dashboard";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(paletteOpenProp);
  const drawerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (drawerOpen && !drawer.open) drawer.showModal();
    else if (!drawerOpen && drawer.open) drawer.close();
  }, [drawerOpen]);

  return (
    <div className="min-h-dvh bg-canvas text-ink lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-label text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh border-r border-hairline bg-surface lg:block">
        <Sidebar current={current} reviewCount={reviewCount} />
      </aside>

      <dialog
        ref={drawerRef}
        aria-label="Navigation"
        onClose={() => setDrawerOpen(false)}
        onClick={(event) => {
          if (event.target === drawerRef.current) setDrawerOpen(false);
        }}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-dvh w-[min(280px,85vw)] bg-surface p-0 text-ink shadow-dialog backdrop:bg-scrim lg:hidden"
      >
        <div className="flex justify-end px-2 pt-2">
          <IconButton
            icon="x"
            label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="size-11"
          />
        </div>
        <Sidebar
          current={current}
          reviewCount={reviewCount}
          onNavigate={() => setDrawerOpen(false)}
        />
      </dialog>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-hairline bg-canvas px-4 lg:px-6">
          <IconButton
            icon="panel-left"
            label="Open navigation"
            onClick={() => setDrawerOpen(true)}
            className="-ml-1 size-11 lg:hidden"
          />
          <p className="truncate text-label text-ink">{title}</p>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-keyshortcuts="Control+K Meta+K"
            className="ml-auto flex h-9 items-center gap-2 rounded-md bg-raised px-3 text-ui text-ink-subtle shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors duration-120 hover:text-ink max-sm:size-11 max-sm:justify-center max-sm:px-0 sm:w-64"
          >
            <Icon name="search" />
            <span className="max-sm:sr-only">Jump to</span>
            <kbd className="ml-auto rounded-xs bg-surface px-1.5 font-mono text-micro max-sm:hidden">
              Ctrl K
            </kbd>
          </button>

          <IconButton icon="bell" label="Notifications" className="max-sm:size-11" />
          <ThemeToggle className="max-md:hidden" />
          <button
            type="button"
            className="rounded-pill"
            aria-label={`Account: ${currentUser.name}`}
          >
            <Avatar name={currentUser.name} size="sm" />
          </button>
        </header>

        {notice ? (
          <p className="flex items-center gap-2 border-b border-hairline bg-surface px-4 py-2 text-caption font-medium text-ink-muted lg:px-6">
            <Icon name="help-circle" className="size-3.5" />
            {notice}
          </p>
        ) : null}

        <main id="main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

function Sidebar({
  current,
  reviewCount,
  onNavigate,
}: {
  current: AppSection;
  reviewCount: number;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 px-3 py-3">
      <button
        type="button"
        className="flex h-11 items-center gap-2.5 rounded-md px-2 text-left hover:bg-raised"
        aria-label={`Workspace: ${workspace.name}. Switch workspace`}
      >
        <RevuuMark className="size-7 text-ink" />
        <span className="grid min-w-0 flex-1">
          <span className="truncate text-label">{workspace.name}</span>
          <span className="text-caption font-medium text-ink-subtle">{workspace.plan} plan</span>
        </span>
        <Icon name="chevrons-up-down" className="text-ink-subtle" />
      </button>

      <nav aria-label="Workspace" className="grid gap-0.5">
        {primaryNav.map((item) => (
          <NavLink
            key={item.id}
            {...item}
            count={item.id === "reviews" ? reviewCount : undefined}
            active={current === item.id}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <nav aria-label="Admin" className="mt-auto grid gap-0.5">
        {secondaryNav.map((item) => (
          <NavLink key={item.id} {...item} active={current === item.id} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}

function NavLink({
  label,
  icon,
  href,
  count,
  active,
  onNavigate,
}: {
  label: string;
  icon: IconName;
  href: string;
  count?: number;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-ui font-medium transition-colors duration-120 ease-standard max-lg:h-11",
        active
          ? "bg-raised font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-hairline)]"
          : "text-ink-muted hover:bg-raised/70 hover:text-ink",
      )}
    >
      <Icon name={icon} className={active ? "text-ink" : "text-ink-subtle"} />
      <span className="flex-1 truncate">{label}</span>
      {count ? (
        <span className="rounded-xs bg-sunken px-1.5 text-caption text-ink-muted tabular-nums">
          {count}
          <span className="sr-only"> waiting on you</span>
        </span>
      ) : null}
    </Link>
  );
}
