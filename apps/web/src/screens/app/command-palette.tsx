"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";

type Command = {
  id: string;
  label: string;
  group: "Go to" | "Actions";
  icon: IconName;
  href: string;
  hint?: string;
};

const commands: Command[] = [
  { id: "dashboard", label: "Dashboard", group: "Go to", icon: "layout-dashboard", href: "/app" },
  {
    id: "projects",
    label: "Projects",
    group: "Go to",
    icon: "folder-kanban",
    href: "/app/projects",
  },
  { id: "parts", label: "Parts", group: "Go to", icon: "package", href: "/app/parts" },
  {
    id: "avl",
    label: "Approved Parts List",
    group: "Go to",
    icon: "shield-check",
    href: "/app/avl",
  },
  {
    id: "import-parts",
    label: "Import parts list",
    group: "Actions",
    icon: "upload",
    href: "/app/parts",
    hint: "CSV, XLSX or XLS",
  },
  { id: "settings", label: "Settings", group: "Actions", icon: "settings", href: "/app/settings" },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function run(command: Command | undefined) {
    if (!command) return;
    onClose();
    router.push(command.href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[active]);
    }
  }

  const groups = (["Go to", "Actions"] as const)
    .map((group) => ({ group, items: results.filter((r) => r.group === group) }))
    .filter((g) => g.items.length);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="fixed inset-x-0 top-[12dvh] mx-auto w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-lg bg-raised p-0 text-ink shadow-dialog backdrop:bg-scrim"
    >
      <div className="flex items-center gap-3 border-b border-hairline px-4">
        <Icon name="search" className="size-4 text-ink-subtle" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
          aria-autocomplete="list"
          placeholder="Jump to a page or run a command"
          className="h-12 flex-1 bg-transparent text-body outline-none placeholder:text-ink-subtle focus-visible:outline-none"
        />
        <kbd className="rounded-xs bg-surface px-1.5 font-mono text-micro text-ink-subtle">Esc</kbd>
      </div>

      <div
        id={listId}
        role="listbox"
        aria-label="Commands"
        className="max-h-[50dvh] overflow-y-auto p-2"
      >
        {groups.length === 0 ? (
          <p className="px-3 py-6 text-center text-body-sm text-ink-muted">
            No command matches “{query}”.
          </p>
        ) : (
          groups.map(({ group, items }) => (
            <div key={group} role="group" aria-label={group} className="pb-1">
              <p aria-hidden className="px-3 pt-2 pb-1 text-caption text-ink-subtle">
                {group}
              </p>
              {items.map((command) => {
                const index = results.indexOf(command);
                const selected = index === active;
                return (
                  <div
                    key={command.id}
                    id={`${listId}-${command.id}`}
                    role="option"
                    aria-selected={selected}
                    onMouseMove={() => setActive(index)}
                    onClick={() => run(command)}
                    className={cn(
                      "flex h-9 cursor-pointer items-center gap-3 rounded-md px-3 text-ui",
                      selected ? "bg-surface text-ink" : "text-ink-muted",
                    )}
                  >
                    <Icon name={command.icon} />
                    <span className="flex-1">{command.label}</span>
                    {command.hint ? (
                      <span className="text-caption text-ink-subtle">{command.hint}</span>
                    ) : null}
                    {selected ? (
                      <Icon name="arrow-right" className="size-3.5 text-ink-subtle" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      <p className="border-t border-hairline px-4 py-2.5 text-caption font-medium text-ink-subtle">
        MPN search arrives in a later release. Open Parts to compare a line with its alternates.
      </p>
    </dialog>
  );
}
