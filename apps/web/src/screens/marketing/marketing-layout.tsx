import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function MarketingLayout({
  current,
  children,
}: {
  current?: "home" | "pricing";
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-label text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader current={current} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
