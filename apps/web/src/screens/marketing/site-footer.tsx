import Link from "next/link";
import { RevuuLogo } from "@revuu/ui/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#why", label: "Why Revuu" },
      { href: "/#import", label: "BOM import" },
      { href: "/#compare", label: "Alternate comparison" },
      { href: "/#mechanical", label: "Mechanical parts" },
      { href: "/#vendors", label: "Vendor contacts" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Workspace",
    links: [
      { href: "/app", label: "Sign in" },
      { href: "/app", label: "Start free" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto grid max-w-content gap-12 px-6 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-12">
        <div className="grid content-start gap-4">
          <RevuuLogo />
          <p className="max-w-[34ch] text-body-sm text-ink-muted">
            BOM import and alternate part comparison for hardware teams.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="grid content-start gap-3">
            <h2 className="font-sans text-label text-ink">{column.title}</h2>
            <ul className="grid gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-ink-muted hover:text-ink hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="grid content-start gap-3">
          <h2 className="font-sans text-label text-ink">Parts lists</h2>
          <ul className="grid gap-2 text-body-sm text-ink-muted">
            <li>CSV, XLSX and XLS</li>
            <li>Electrical and mechanical</li>
            <li>Altium, KiCad, OrCAD exports</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 border-t border-hairline px-6 py-6 lg:px-12">
        <p className="text-caption font-medium text-ink-subtle">
          © 2026 Revuu. Altium, KiCad and OrCAD are trademarks of their owners.
        </p>
        <ThemeToggle />
      </div>
    </footer>
  );
}
