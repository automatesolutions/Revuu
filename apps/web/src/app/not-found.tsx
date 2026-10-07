import type { Metadata } from "next";
import { RevuuLogo } from "@revuu/ui/components/logo";
import { EmptyBoardIllustration } from "@/components/illustrations";
import { LinkButton } from "@/components/link-button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="grid min-h-dvh content-center justify-items-center gap-6 bg-canvas px-6 py-16 text-center text-ink">
      <RevuuLogo />
      <EmptyBoardIllustration className="h-24 w-auto" />
      <div className="grid max-w-[44ch] gap-2">
        <h1 className="text-headline">This page doesn’t exist</h1>
        <p className="text-body text-ink-muted">
          The link may be old, or the page moved. Check the address, or start from the dashboard.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <LinkButton href="/app" variant="primary" icon="layout-dashboard">
          Go to dashboard
        </LinkButton>
        <LinkButton href="/">Revuu home</LinkButton>
      </div>
    </main>
  );
}
