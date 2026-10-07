import Link from "next/link";
import { RevuuLogo } from "@revuu/ui/components/logo";
import { artboards, themes, widths } from "@/artboards/registry";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ArtboardsIndex() {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-14 max-w-wide items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <RevuuLogo />
            <span className="text-ui text-ink-muted">Artboards</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto grid max-w-wide gap-8 px-6 py-10">
        <div className="grid max-w-prose gap-2">
          <h1 className="text-headline">Artboards</h1>
          <p className="text-body text-ink-muted">
            Real screens with fixture data at {widths.join(", ")} px in {themes.join(" and ")}{" "}
            themes. What you approve here is what ships.
          </p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {artboards.map((board) => (
            <li key={board.id}>
              <Link
                href={`/artboards/${board.id}`}
                className="grid gap-2 rounded-lg bg-raised p-5 shadow-[inset_0_0_0_1px_var(--color-hairline)] hover:shadow-[inset_0_0_0_1px_var(--color-hairline-strong)]"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-title">{board.title}</span>
                  <span className="text-caption font-medium text-ink-subtle capitalize">
                    {board.mode}
                  </span>
                </span>
                <span className="text-body-sm text-ink-muted">{board.brief}</span>
                <span className="text-caption font-medium text-ink-subtle">
                  States: {board.states.join(", ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
