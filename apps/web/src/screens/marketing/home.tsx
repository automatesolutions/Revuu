import { Icon, type IconName } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import { LinkButton } from "@/components/link-button";
import { AlternatesMock, ChecklistMock, SignoffMock, ThreadMock } from "./feature-mocks";
import { HeroScene } from "./hero-scene";
import { Reveal } from "./reveal";

const ecadTools = ["Altium Designer", "KiCad", "Cadence OrCAD", "Autodesk Fusion"];
const partSources = ["DigiKey", "Mouser", "LCSC (CSV)"];

const trust: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "lock",
    title: "Keys stay server-side",
    body: "Distributor API keys never reach the browser.",
  },
  {
    icon: "shield-check",
    title: "Isolated workspaces",
    body: "Row-level security on every table, per workspace.",
  },
  { icon: "history", title: "Audit log", body: "Every decision has a name, a time and a reason." },
];

export function MarketingHome() {
  return (
    <>
      <section
        aria-labelledby="hero-title"
        className="mx-auto max-w-wide px-6 pt-12 pb-4 lg:px-12 lg:pt-20"
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h1
            id="hero-title"
            className="text-display-md sm:text-display-lg lg:col-span-8 xl:text-display-xl"
          >
            Review the board before it ships.
          </h1>
          <div className="grid gap-6 lg:col-span-4 lg:pb-2">
            <p className="text-body-lg text-ink-muted">
              Schematic, layout and parts reviews with sign-off, for hardware teams that release on
              a schedule.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/app" variant="primary" size="lg" className="max-sm:w-full">
                Start free
              </LinkButton>
              <LinkButton href="#how-it-works" size="lg" className="max-sm:w-full">
                See a sample review
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <HeroScene />

      <section aria-labelledby="sources-title" className="mx-auto max-w-wide px-6 py-16 lg:px-12">
        <h2 id="sources-title" className="sr-only">
          Works with your tools and distributors
        </h2>
        <div className="grid gap-8 border-y border-hairline py-8 md:grid-cols-[auto_1fr] md:items-baseline md:gap-x-10">
          <p className="text-label text-ink-muted">Reads BOM exports from</p>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {ecadTools.map((tool) => (
              <li key={tool} className="font-display text-title text-ink-muted">
                {tool}
              </li>
            ))}
          </ul>
          <p className="text-label text-ink-muted">Part data from</p>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {partSources.map((source) => (
              <li key={source} className="font-display text-title text-ink-muted">
                {source}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BlockSection
        id="reviews"
        tone="bg-block-solder"
        title="Every review runs from a checklist your team owns."
        body="Write checklists for schematic, layout and parts reviews once. Each revision gets a fresh copy, a named reviewer and a due date."
        facts={[
          "Templates per board type",
          "Comments on any checklist item",
          "One reviewer accountable for each review",
        ]}
        mock={<ChecklistMock />}
      />

      <CanvasSection
        title="Comments stay on the line they're about."
        body="Ask about a part on its BOM line, or a net on its schematic sheet. Each decision goes to the audit log with a name and a time."
        mock={<ThreadMock />}
        flip
      />

      <BlockSection
        id="parts"
        tone="bg-block-fr4"
        title="Every EOL part, flagged before layout freezes."
        body="Revuu checks each MPN against DigiKey and Mouser. You see lifecycle, stock and price with the source and age, and alternates lined up spec by spec."
        facts={[
          "NRND and EOL alerts on every open revision",
          "Approved Parts List: Proposed, Approved, Restricted, Rejected",
          "LCSC data through CSV import",
        ]}
        mock={<AlternatesMock />}
      />

      <CanvasSection
        id="signoff"
        title="Sign-off opens when every review is approved."
        body="No spreadsheet of approvals. The gate shows what is still open, and Revuu builds the release report from the record."
        mock={<SignoffMock />}
      />

      <section aria-labelledby="close-title" className="px-0 py-16 md:px-6 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-wide grid-cols-[minmax(0,1fr)] gap-10 bg-block-board px-6 py-16 text-on-block-board md:rounded-xl md:px-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:px-16 lg:py-24">
          <div className="grid content-start gap-6">
            <h2 id="close-title" className="text-headline sm:text-display-lg">
              Review your next revision in Revuu.
            </h2>
            <p className="max-w-[46ch] text-body-lg opacity-85">
              Free for small teams. Pricing for larger teams is set before launch.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton
                href="/app"
                size="lg"
                className="bg-on-block-board text-block-board shadow-none hover:bg-raised max-sm:w-full"
              >
                Start free
              </LinkButton>
              <LinkButton
                href="/pricing"
                size="lg"
                variant="ghost"
                className="text-on-block-board shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-on-block-board)_45%,transparent)] hover:bg-on-block-board/10 max-sm:w-full"
              >
                See pricing
              </LinkButton>
            </div>
          </div>
          <ul className="grid content-start gap-5">
            {trust.map((item) => (
              <li key={item.title} className="grid grid-cols-[1.5rem_1fr] gap-x-3 gap-y-1">
                <Icon name={item.icon} className="mt-1 size-5" />
                <p className="text-subtitle">{item.title}</p>
                <p className="col-start-2 text-body-sm opacity-85">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function SectionCopy({
  id,
  title,
  body,
  facts,
}: {
  id: string;
  title: string;
  body: string;
  facts?: string[];
}) {
  return (
    <div className="grid content-center gap-5" data-reveal>
      <h2 id={id} className="text-headline lg:text-display-md">
        {title}
      </h2>
      <p className="max-w-[46ch] text-body-lg text-ink-muted">{body}</p>
      {facts ? (
        <ul className="grid gap-2.5 pt-2">
          {facts.map((fact) => (
            <li key={fact} className="flex items-start gap-2.5 text-body">
              <Icon name="check" className="mt-1 size-4 text-ink" />
              {fact}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function BlockSection({
  id,
  tone,
  title,
  body,
  facts,
  mock,
}: {
  id: string;
  tone: string;
  title: string;
  body: string;
  facts: string[];
  mock: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-4 py-8 md:px-6 lg:px-12">
      <Reveal
        className={cn(
          "mx-auto grid max-w-wide grid-cols-[minmax(0,1fr)] gap-10 px-6 py-16 md:rounded-xl md:px-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-16 lg:py-24",
          tone,
        )}
      >
        <SectionCopy id={`${id}-title`} title={title} body={body} facts={facts} />
        <div data-reveal>{mock}</div>
      </Reveal>
    </section>
  );
}

function CanvasSection({
  id,
  title,
  body,
  mock,
  flip = false,
}: {
  id?: string;
  title: string;
  body: string;
  mock: React.ReactNode;
  flip?: boolean;
}) {
  const headingId = `${id ?? title.slice(0, 12).replace(/\W+/g, "-").toLowerCase()}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-4 py-24 lg:py-32">
      <Reveal className="mx-auto grid max-w-content grid-cols-[minmax(0,1fr)] gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
        <div className={cn(flip && "lg:order-2")}>
          <SectionCopy id={headingId} title={title} body={body} />
        </div>
        <div data-reveal className={cn(flip && "lg:order-1")}>
          {mock}
        </div>
      </Reveal>
    </section>
  );
}
