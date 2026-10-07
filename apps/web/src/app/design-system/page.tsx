import type { Metadata } from "next";
import { color } from "@revuu/ui/tokens";
import { Avatar, AvatarStack } from "@revuu/ui/components/avatar";
import { Button, IconButton } from "@revuu/ui/components/button";
import { Card, CardHeader } from "@revuu/ui/components/card";
import { Field, Input, Select, Textarea } from "@revuu/ui/components/field";
import { RevuuLogo, RevuuMark } from "@revuu/ui/components/logo";
import { EmptyState, ErrorState, LoadingRegion, Skeleton } from "@revuu/ui/components/states";
import { LifecycleBadge, StatusChip, type Status } from "@revuu/ui/components/status-chip";
import { BomTable } from "@/components/bom-table";
import { ThemeToggle } from "@/components/theme-toggle";
import { bomLines } from "@/fixtures/bom";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const statuses: Status[] = [
  "approved",
  "pending",
  "proposed",
  "warning",
  "nrnd",
  "restricted",
  "eol",
  "obsolete",
  "rejected",
];

const typeScale = [
  { token: "display-lg", sample: "Review the board" },
  { token: "headline", sample: "Rev C is ready for sign-off" },
  { token: "page-title", sample: "Power board, Rev C" },
  { token: "title", sample: "Parts review" },
  { token: "body-lg", sample: "Every line on the BOM gets checked before release." },
  { token: "body", sample: "Three reviewers signed off. One line is still open." },
  { token: "body-sm", sample: "Lifecycle from DigiKey, checked 2 h ago." },
  { token: "ui", sample: "Assign reviewer" },
  { token: "caption", sample: "Last synced 09:41" },
] as const;

const typeClass: Record<(typeof typeScale)[number]["token"], string> = {
  "display-lg": "text-display-lg",
  headline: "text-headline",
  "page-title": "text-page-title",
  title: "text-title",
  "body-lg": "text-body-lg",
  body: "text-body",
  "body-sm": "text-body-sm",
  ui: "text-ui",
  caption: "text-caption",
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="sticky top-0 z-20 border-b border-hairline bg-canvas/95">
        <div className="mx-auto flex h-14 max-w-wide items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <RevuuLogo className="h-6" />
            <span className="text-ui text-ink-muted">Design system</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto grid max-w-wide gap-16 px-6 py-12">
        <section aria-labelledby="ds-intro" className="grid max-w-prose gap-3">
          <h1 id="ds-intro" className="text-headline">
            Revuu design system
          </h1>
          <p className="text-body-lg text-ink-muted">
            Every primitive in one place, in the theme you pick above. Tokens live in{" "}
            <code className="mpn">packages/ui/src/tokens.css</code>, and DESIGN.md explains when to
            use each one.
          </p>
        </section>

        <Section id="color" title="Color">
          <div className="grid gap-6 lg:grid-cols-2">
            <SwatchGrid keys={Object.keys(color.light)} />
          </div>
        </Section>

        <Section
          id="status"
          title="Status chips"
          description="Status always pairs a word and an icon with the color. Switch the theme above to check the dark set."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(["canvas", "raised"] as const).map((surface) => (
              <div
                key={surface}
                className={`grid gap-4 rounded-lg p-5 shadow-[inset_0_0_0_1px_var(--color-hairline)] ${surface === "canvas" ? "bg-canvas" : "bg-raised"}`}
              >
                <p className="text-label">On {surface}</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <StatusChip key={s} status={s} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <StatusChip key={s} status={s} size="sm" />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <LifecycleBadge lifecycle="active" source="DigiKey" age="2 h ago" />
                  <LifecycleBadge lifecycle="ltb" source="Mouser" age="5 h ago" />
                  <LifecycleBadge lifecycle="unknown" />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="type" title="Type">
          <div className="grid divide-y divide-hairline">
            {typeScale.map(({ token, sample }) => (
              <div
                key={token}
                className="grid gap-1 py-3 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-6"
              >
                <span className="mpn text-ink-subtle">{token}</span>
                <span className={typeClass[token]}>{sample}</span>
              </div>
            ))}
            <div className="grid gap-1 py-3 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-6">
              <span className="mpn text-ink-subtle">mpn</span>
              <span className="mpn text-[0.9375rem]">
                GRM155R71C104KA88D · TPS62133RGTR · 10118194-0001LF
              </span>
            </div>
          </div>
        </Section>

        <Section id="buttons" title="Buttons">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" icon="file-check">
                Sign off revision
              </Button>
              <Button>Assign reviewer</Button>
              <Button variant="accent" icon="upload">
                Upload BOM
              </Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="danger" icon="x-circle">
                Reject part
              </Button>
              <Button variant="link">View audit log</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg" variant="primary">
                Start a review
              </Button>
              <Button loading>Syncing parts</Button>
              <Button disabled>Disabled</Button>
              <IconButton icon="settings" label="Settings" />
              <IconButton icon="filter" label="Filter" variant="secondary" />
            </div>
          </div>
        </Section>

        <Section id="fields" title="Fields">
          <div className="grid max-w-3xl gap-5 md:grid-cols-2">
            <Field label="Revision name" hint="Shown on the release report.">
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  defaultValue="Rev C"
                />
              )}
            </Field>
            <Field
              label="Manufacturer part number"
              error="No match at Mouser or DigiKey. Check the MPN for typos."
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  className="font-mono"
                  defaultValue="TPS62133RGTX"
                />
              )}
            </Field>
            <Field label="Review type">
              {({ id }) => (
                <Select id={id} defaultValue="parts">
                  <option value="schematic">Schematic</option>
                  <option value="layout">PCB layout</option>
                  <option value="parts">Parts</option>
                </Select>
              )}
            </Field>
            <Field label="Disabled">
              {({ id }) => <Input id={id} disabled defaultValue="Locked after sign-off" />}
            </Field>
            <Field label="Comment" className="md:col-span-2">
              {({ id }) => <Textarea id={id} placeholder="What should the designer change?" />}
            </Field>
          </div>
        </Section>

        <Section id="cards" title="Cards and people">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader
                title="Parts review"
                description="Rev C, 42 lines"
                action={<StatusChip status="pending" size="sm" />}
              />
              <div className="flex items-center justify-between">
                <AvatarStack names={["Mara Lin", "Theo Okafor", "Ana Reyes", "Sam Patel"]} />
                <span className="text-ui text-ink-muted tabular-nums">3 of 4 signed</span>
              </div>
            </Card>
            <Card className="bg-block-fr4 shadow-none">
              <CardHeader
                title="Schematic review"
                description="Rev C, 6 sheets"
                action={<StatusChip status="approved" size="sm" />}
              />
              <p className="text-ink-muted">Signed off by Mara Lin, 14:02.</p>
            </Card>
            <Card>
              <CardHeader title="Avatars" />
              <div className="flex items-center gap-3">
                <Avatar name="Mara Lin" size="sm" />
                <Avatar name="Theo Okafor" />
                <Avatar name="Ana Reyes" size="lg" />
                <RevuuMark className="size-8 text-ink" />
              </div>
            </Card>
          </div>
        </Section>

        <Section id="states" title="Empty, loading and error">
          <div className="grid gap-4 lg:grid-cols-3">
            <EmptyState
              title="No BOM yet"
              description="Upload a CSV or XLSX export from your EDA tool. Revuu maps the columns and checks every line."
              action={
                <Button variant="primary" icon="upload">
                  Upload BOM
                </Button>
              }
            />
            <LoadingRegion
              label="Loading parts"
              className="grid content-start gap-3 rounded-lg bg-raised p-5 shadow-[inset_0_0_0_1px_var(--color-hairline)]"
            >
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="w-full" />
              <Skeleton className="w-5/6" />
              <Skeleton className="w-2/3" />
            </LoadingRegion>
            <ErrorState
              title="Mouser didn't respond"
              description="Lifecycle and stock show the last good values. We'll retry in 5 minutes."
              detail="Last good data: 09:41 · req 7f3a91"
              action={
                <Button size="sm" icon="refresh-cw">
                  Retry now
                </Button>
              }
            />
          </div>
        </Section>

        <Section
          id="table"
          title="Data table"
          description="Arrow keys, Home and End, Page Up and Page Down. Press / to filter."
        >
          <BomTable rows={bomLines} label="Demo BOM, power board Rev C" />
        </Section>
      </main>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`ds-${id}`} className="grid gap-6">
      <div className="grid gap-1 border-b border-hairline pb-3">
        <h2 id={`ds-${id}`} className="text-title">
          {title}
        </h2>
        {description ? <p className="text-body-sm text-ink-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function SwatchGrid({ keys }: { keys: string[] }) {
  return (
    <ul className="col-span-full grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {keys.map((key) => (
        <li key={key} className="grid gap-2">
          <span
            aria-hidden
            className="h-14 rounded-md shadow-[inset_0_0_0_1px_var(--color-hairline)]"
            style={{ backgroundColor: `var(--color-${key})` }}
          />
          <span className="truncate mpn text-ink-muted">{key}</span>
        </li>
      ))}
    </ul>
  );
}
