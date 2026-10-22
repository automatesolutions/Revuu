import { EmptyState } from "@revuu/ui/components/states";
import { EmptyBoardIllustration } from "@/components/illustrations";
import { LinkButton } from "@/components/link-button";
import type { AppSection } from "./app-shell";

export const placeholderSections: Record<
  Exclude<AppSection, "dashboard" | "parts">,
  { title: string; milestone: string; description: string }
> = {
  projects: {
    title: "Projects",
    milestone: "M1",
    description: "Projects keep each board's parts lists together, one list per revision.",
  },
  avl: {
    title: "Approved Parts List",
    milestone: "M3",
    description: "Proposed, Approved, Restricted and Rejected parts for the whole workspace.",
  },
  integrations: {
    title: "Integrations",
    milestone: "M3",
    description:
      "Vendor records for contacts, stock and price. Any API keys stay on Revuu's servers.",
  },
  settings: {
    title: "Settings",
    milestone: "M1",
    description: "Members, roles and workspace details.",
  },
};

export function PlaceholderPage({
  section,
}: {
  section: Exclude<AppSection, "dashboard" | "parts">;
}) {
  const page = placeholderSections[section];
  return (
    <div className="grid gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="text-page-title">{page.title}</h1>
      <EmptyState
        illustration={<EmptyBoardIllustration className="h-24 w-auto" />}
        title={`${page.title} ${section === "avl" ? "arrives" : "arrive"} in ${page.milestone}`}
        description={page.description}
        action={
          <LinkButton href="/app" icon="layout-dashboard">
            Back to dashboard
          </LinkButton>
        }
      />
    </div>
  );
}
