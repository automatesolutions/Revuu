import { Icon, type IconName } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import { LinkButton } from "@/components/link-button";
import { AlternatesMock, DesignMock, MappingMock, MechanicalMock } from "./feature-mocks";
import { HeroScene } from "./hero-scene";
import { Reveal } from "./reveal";

const jobs: { id: string; icon: IconName; title: string; body: string; note: string }[] = [
  {
    id: "#compare",
    icon: "git-compare",
    title: "1. Part comparison",
    body: "Original and up to 4 candidates, electronic, mechanical or miscellaneous, judged from their datasheets on your Anthropic key.",
    note: "Demo comparisons run today on sample part records.",
  },
  {
    id: "#design",
    icon: "circuit-board",
    title: "2. Hardware design",
    body: "One run on your own OpenAI or Astra key: KiCad schematic, KiCad PCB, Onshape enclosure and a design document.",
    note: "The brief wizard works today. Runs that make files come later.",
  },
];

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
    body: "When a record has no datasheet value, price or email, Revuu says so instead of filling the gap.",
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
    title: "Replace an EOL part without a redesign.",
    body: "Put the part in your design beside up to 4 candidates. Revuu says which ones fit the board as it is, which force a board or assembly change, and which cannot replace it at all.",
    example:
      "Q3, IRLML6402TRPBF, is EOL. DMP2035U-7, SI2343CDS-T1-GE3 and AO3401A are all Drop-in.",
  },
  {
    icon: "shield-check",
    title: "Approve second sources with evidence QA can check.",
    body: "A large team cannot approve a part on a hunch. Each judgement lists every spec difference against the original and the checks to run as tests, so QA reviews facts once and approves more alternates.",
    example:
      "DMP2035U-7 is Drop-in. Its checks start with the gate threshold at your drive voltage.",
    note: "Page citations for every number arrive with live datasheet reading.",
  },
  {
    icon: "sliders-horizontal",
    title: "Find savings in legacy products.",
    body: "Compare the parts of a board you have built for years with newer candidates. Unit price and stock sit beside each judgement, so you see the saving and what QA must confirm before you take it.",
    example: "AO3401A is $0.07 against a $0.38 original, with 212,000 in stock.",
  },
  {
    icon: "circuit-board",
    title: "Start a new board from one complete brief.",
    body: "Fill the specification, PCB size, stack-up, standards and outputs once. Revuu will not run until the fields your outputs need are filled, then makes one schematic, PCB and enclosure run on your own key.",
    example: "A 12 V to 3.3 V, 3 A buck on a 50 × 30 mm, 4-layer board, to IEC 62368-1.",
    note: "The brief works today. Design runs that make files come later.",
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
            Hardware design and parts comparison.
          </h1>
          <div className="grid gap-6 lg:col-span-4 lg:pb-2">
            <p className="text-body-lg text-ink-muted">
              Compare the part in your design with up to 4 candidates from their datasheets, and get
              a Drop-in, Rework or Not acceptable judgement for each. Or turn a complete brief into
              one schematic, PCB and enclosure run.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/app" variant="primary" size="lg" className="max-sm:w-full">
                Start free
              </LinkButton>
              <LinkButton href="#how-it-works" size="lg" className="max-sm:w-full">
                See a sample comparison
              </LinkButton>
            </div>
            <p className="text-caption font-medium text-ink-subtle">
              Demo today: comparisons run on sample part records. Datasheet reading on your own
              Anthropic key comes later.
            </p>
          </div>
        </div>
      </section>

      <HeroScene />

      <section aria-labelledby="jobs-title" className="mx-auto max-w-wide px-6 py-16 lg:px-12">
        <h2 id="jobs-title" className="sr-only">
          What Revuu does
        </h2>
        <ul className="grid gap-8 border-y border-hairline py-8 md:grid-cols-2 md:gap-12">
          {jobs.map((job) => (
            <li key={job.id} className="grid content-start gap-3">
              <p className="flex items-center gap-3 font-display text-title">
                <Icon name={job.icon} className="size-6" />
                <a href={job.id} className="hover:underline">
                  {job.title}
                </a>
              </p>
              <p className="max-w-[52ch] text-body text-ink-muted">{job.body}</p>
              <p className="text-caption font-medium text-ink-subtle">{job.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="why"
        aria-labelledby="why-title"
        className="mx-auto max-w-wide scroll-mt-4 px-6 pt-8 pb-16 lg:px-12 lg:pb-24"
      >
        <div className="grid max-w-[46rem] gap-4">
          <h2 id="why-title" className="text-headline lg:text-display-md">
            Change a part or start a board, with the evidence in hand.
          </h2>
          <p className="text-body-lg text-ink-muted">
            For hardware, component and QA engineers who replace parts in existing designs and start
            new ones.
          </p>
        </div>
        <ol className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12 xl:grid-cols-4 xl:gap-10">
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
        <p className="mt-6 text-caption font-medium text-ink-subtle">Examples use demo data.</p>
      </section>

      <BlockSection
        id="import"
        tone="bg-block-fr4"
        title="Pick the original from your parts list."
        body="Import the list the board was built from, then open a line to make it the original. Revuu guesses each column from its header, and you confirm the mapping before any part exists."
        facts={[
          "CSV, XLSX and XLS from Altium, KiCad, OrCAD or a spreadsheet",
          "Electronic, Mechanical or Miscellaneous from the file, never a guess",
          "Or enter the original and candidates by MPN and maker",
        ]}
        mock={<MappingMock />}
      />

      <CanvasSection
        id="compare"
        title="Every difference, marked cell by cell."
        body="Ratings, package dimensions and functional specs such as Vgs(th) and gate charge, compared with the original after unit normalization: 35 mΩ and 0.035 Ω match, 8 mm and 10 mm do not. Print the report or download the sheet, with the cost difference where prices exist."
        mock={<AlternatesMock />}
        flip
      />

      <CanvasSection
        id="mechanical"
        title="Screws and standoffs get the same judgement."
        body="Thread, length, material, hex size, thread depth and torque, side by side with the original. The side-view outline shows a longer standoff at a glance."
        facts={[
          "Drop-in: same package, pin count and polarity, or same thread, length and material",
          "Rework: the board or assembly must change first",
          "Not acceptable: it cannot replace the original, for example the wrong polarity",
        ]}
        mock={<MechanicalMock />}
      />

      <BlockSection
        id="design"
        tone="bg-block-copper"
        title="Hardware design: one run, on your keys."
        body="Fill the whole brief once: specification, reference designs, PCB size, stack-up, the areas that matter, enclosure size and standards. Revuu refuses to run until the fields your outputs need are filled, then shows the size and risk before you confirm."
        facts={[
          "Your OpenAI or Astra key pays the model, never a Revuu key",
          "Only the outputs you pick: KiCad schematic, KiCad PCB with BOM, POS and Gerber, Onshape enclosure, design document",
          "One run, no iteration: the prompt covers DRC, creepage, stack-up, thermal, EMI and enclosure fit",
        ]}
        mock={<DesignMock />}
      />

      <section aria-labelledby="close-title" className="px-0 py-16 md:px-6 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-wide grid-cols-[minmax(0,1fr)] gap-10 bg-block-board px-6 py-16 text-on-block-board md:rounded-xl md:px-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:px-16 lg:py-24">
          <div className="grid content-start gap-6">
            <h2 id="close-title" className="text-headline sm:text-display-lg">
              Check your next alternate in Revuu.
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
  facts,
  mock,
  flip = false,
}: {
  id?: string;
  title: string;
  body: string;
  facts?: string[];
  mock: React.ReactNode;
  flip?: boolean;
}) {
  const headingId = `${id ?? title.slice(0, 12).replace(/\W+/g, "-").toLowerCase()}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-4 py-24 lg:py-32">
      <Reveal className="mx-auto grid max-w-content grid-cols-[minmax(0,1fr)] gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
        <div className={cn(flip && "lg:order-2")}>
          <SectionCopy id={headingId} title={title} body={body} facts={facts} />
        </div>
        <div data-reveal className={cn(flip && "lg:order-1")}>
          {mock}
        </div>
      </Reveal>
    </section>
  );
}
