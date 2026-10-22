import { Icon, type IconName } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import { LinkButton } from "@/components/link-button";
import { AlternatesMock, MappingMock, MechanicalMock, VendorMock } from "./feature-mocks";
import { HeroScene } from "./hero-scene";
import { Reveal } from "./reveal";

const ecadTools = ["Altium Designer", "KiCad", "Cadence OrCAD", "Mechanical spreadsheets"];
const fileTypes = ["CSV", "XLSX", "XLS"];

const trust: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "file-spreadsheet",
    title: "You confirm the columns",
    body: "Revuu creates no part until you accept the column mapping.",
  },
  {
    icon: "history",
    title: "Source on every value",
    body: "Contacts, lifecycle, stock and price say where they came from and how old they are.",
  },
  {
    icon: "shield-check",
    title: "Nothing invented",
    body: "When a record has no email or price, Revuu says so instead of filling the gap.",
  },
];

const outcomes: {
  icon: IconName;
  title: string;
  body: string;
  example: string;
  note?: string;
}[] = [
  {
    icon: "hourglass",
    title: "Stop EOL parts reaching production.",
    body: "Every line shows its lifecycle with the source and age. EOL, NRND and Obsolete parts go to the top of the dashboard with their alternates, so you change the part before stock runs out, not after the line stops.",
    example: "Q3, IRLML6402TRPBF, is EOL. Three SOT-23 alternates are ready to compare.",
  },
  {
    icon: "shield-check",
    title: "Give QA the evidence to approve more alternates.",
    body: "A large team cannot approve a part on a hunch. Each comparison lists every rating, dimension, functional spec and outline difference, with the check to run and the source of every value. QA reviews the evidence once, and the part becomes an approved second source.",
    example: "DMP2035U-7 is Drop-in, with 2 ratings and 3 functional specs for QA to check.",
    note: "Approval on the Approved Parts List arrives in M3.",
  },
  {
    icon: "sliders-horizontal",
    title: "Find savings in legacy products.",
    body: "Import the parts list of a board you have built for years. Each part sits beside newer alternates with unit price and stock, so you see where a change cuts cost or supply risk, and what QA has to confirm first.",
    example: "AO3401A is $0.07 against a $0.38 baseline, with 212,000 in stock.",
  },
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
            Compare every part before you order.
          </h1>
          <div className="grid gap-6 lg:col-span-4 lg:pb-2">
            <p className="text-body-lg text-ink-muted">
              Import a CSV or Excel parts list. Revuu lines up each electrical and mechanical part
              with its alternates, spec by spec.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/app" variant="primary" size="lg" className="max-sm:w-full">
                Start free
              </LinkButton>
              <LinkButton href="#how-it-works" size="lg" className="max-sm:w-full">
                See a sample comparison
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <HeroScene />

      <section aria-labelledby="sources-title" className="mx-auto max-w-wide px-6 py-16 lg:px-12">
        <h2 id="sources-title" className="sr-only">
          Works with your parts lists
        </h2>
        <div className="grid gap-8 border-y border-hairline py-8 md:grid-cols-[auto_1fr] md:items-baseline md:gap-x-10">
          <p className="text-label text-ink-muted">Reads parts lists from</p>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {ecadTools.map((tool) => (
              <li key={tool} className="font-display text-title text-ink-muted">
                {tool}
              </li>
            ))}
          </ul>
          <p className="text-label text-ink-muted">File types</p>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {fileTypes.map((source) => (
              <li key={source} className="font-display text-title text-ink-muted">
                {source}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="why"
        aria-labelledby="why-title"
        className="mx-auto max-w-wide scroll-mt-4 px-6 pt-8 pb-16 lg:px-12 lg:pb-24"
      >
        <div className="grid max-w-[46rem] gap-4">
          <h2 id="why-title" className="text-headline lg:text-display-md">
            Find the EOL part before the build does.
          </h2>
          <p className="text-body-lg text-ink-muted">
            For component engineers, QA and purchasing teams that keep boards in production for
            years.
          </p>
        </div>
        <ol className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {outcomes.map((item) => (
            <li key={item.title} className="grid content-start gap-4 border-t border-ink pt-6">
              <Icon name={item.icon} className="size-6" />
              <h3 className="font-sans text-subtitle">{item.title}</h3>
              <p className="text-body text-ink-muted">{item.body}</p>
              <p className="rounded-md bg-surface px-4 py-3 text-body-sm">
                <span className="font-semibold">In the demo: </span>
                {item.example}
              </p>
              {item.note ? (
                <p className="text-caption font-medium text-ink-subtle">{item.note}</p>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-caption font-medium text-ink-subtle">
          Examples use the demo parts list. Demo data.
        </p>
      </section>

      <BlockSection
        id="import"
        tone="bg-block-fr4"
        title="Your parts list, read the way you wrote it."
        body="Revuu guesses each column from its header. You confirm the mapping before any part exists, and lines with no MPN are listed, not dropped."
        facts={[
          "CSV, XLSX and XLS from Altium, KiCad, OrCAD or a spreadsheet",
          "Electrical or Mechanical from the file, never a guess",
          "Skipped lines listed with the reason",
        ]}
        mock={<MappingMock />}
      />

      <CanvasSection
        id="compare"
        title="Every difference, marked cell by cell."
        body="Ratings, package dimensions and functional specs such as Vgs(th) and gate charge, compared after unit normalization: 35 mΩ and 0.035 Ω match, 8 mm and 10 mm do not. Each part gets an outline drawn to one scale."
        mock={<AlternatesMock />}
        flip
      />

      <BlockSection
        id="mechanical"
        tone="bg-block-silk"
        title="Screws and standoffs get the same comparison."
        body="Thread, length, material, hex size, thread depth and torque, side by side with the baseline. The side-view outline shows a longer standoff at a glance."
        facts={[
          "Mechanical drop-in: same thread, length and material",
          "Electrical drop-in: same package, pin count and polarity",
          "Up to three alternates per part",
        ]}
        mock={<MechanicalMock />}
      />

      <CanvasSection
        id="vendors"
        title="Vendor contacts, only where the file has them."
        body="Each email, phone number and URL says whether it came from your imported list or a vendor record. When neither has one, Revuu says so."
        mock={<VendorMock />}
      />

      <section aria-labelledby="close-title" className="px-0 py-16 md:px-6 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-wide grid-cols-[minmax(0,1fr)] gap-10 bg-block-board px-6 py-16 text-on-block-board md:rounded-xl md:px-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:px-16 lg:py-24">
          <div className="grid content-start gap-6">
            <h2 id="close-title" className="text-headline sm:text-display-lg">
              Compare your next parts list in Revuu.
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
