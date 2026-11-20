import { Icon } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import { LinkButton } from "@/components/link-button";

type Tier = {
  name: string;
  price: string;
  priceNote: string;
  summary: string;
  cta: string;
  featured?: boolean;
  includes: string[];
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    priceNote: "No card needed",
    summary: "For an engineer checking alternates on a real parts list.",
    cta: "Start free",
    includes: [
      "3 members",
      "Part comparison on your Anthropic key",
      "Electronic, mechanical and miscellaneous parts",
      "Up to 4 candidates per comparison",
      "200 lines per parts list",
    ],
  },
  {
    name: "Team",
    price: "Per seat",
    priceNote: "Amount set before launch",
    summary: "For teams that replace parts in production boards every month.",
    cta: "Start free",
    featured: true,
    includes: [
      "Unlimited members",
      "2,000 lines per parts list",
      "Comparison sheet download (CSV)",
      "Cost comparison for value engineering",
      "Shared vendor records",
      "EOL and NRND alerts",
    ],
  },
  {
    name: "Business",
    price: "Per seat",
    priceNote: "Amount set before launch",
    summary: "For organizations with SSO, audits and many product lines.",
    cta: "Start free",
    includes: [
      "Everything in Team",
      "SAML single sign-on",
      "Custom column mappings saved per tool",
      "Audit log export",
      "Custom lines per parts list",
    ],
  },
];

type Cell = boolean | string;
const comparison: { group: string; rows: { label: string; values: [Cell, Cell, Cell] }[] }[] = [
  {
    group: "Part comparison",
    rows: [
      { label: "Electronic, mechanical and miscellaneous parts", values: [true, true, true] },
      { label: "Candidates per comparison", values: ["4", "4", "4"] },
      { label: "Replacement judgement with checks to run", values: [true, true, true] },
      { label: "Unit-normalized spec differences", values: [true, true, true] },
      { label: "Printable comparison report", values: [true, true, true] },
      { label: "Comparison sheet download (CSV)", values: [false, true, true] },
      { label: "Cost comparison", values: [false, true, true] },
      { label: "EOL and NRND alerts", values: [false, true, true] },
    ],
  },
  {
    group: "Parts lists",
    rows: [
      { label: "CSV, XLSX and XLS parts lists", values: [true, true, true] },
      { label: "Column mapping you confirm", values: [true, true, true] },
      { label: "Lines per parts list", values: ["200", "2,000", "Custom"] },
      { label: "Saved column mappings", values: [false, false, true] },
      { label: "Shared vendor records", values: [false, true, true] },
    ],
  },
  {
    group: "Hardware design",
    rows: [
      { label: "Design brief with required-field checks", values: [true, true, true] },
      { label: "Runs on your OpenAI or Astra key", values: [true, true, true] },
      {
        label: "Revuu fee per run",
        values: ["Set before launch", "Set before launch", "Set before launch"],
      },
    ],
  },
  {
    group: "Workspace and security",
    rows: [
      { label: "Members", values: ["3", "Unlimited", "Unlimited"] },
      { label: "Model keys stored server-side", values: [true, true, true] },
      { label: "Audit log", values: [true, true, true] },
      { label: "Audit log export", values: [false, false, true] },
      { label: "SAML single sign-on", values: [false, false, true] },
    ],
  },
];

const faqs = [
  {
    q: "When will Team and Business prices be set?",
    a: "Before public launch. Until then, every workspace runs on the Free limits, and we will tell you the price before anything is charged.",
  },
  {
    q: "Who pays for the model?",
    a: "You do, on your own key. Part comparison uses your Anthropic key. Hardware design uses your OpenAI or Astra key. Your provider bills you at its own rates; the plan price does not include model usage.",
  },
  {
    q: "What does a hardware design run cost?",
    a: "The model cost is on your OpenAI or Astra bill. Any Revuu fee per run is set before launch. Before you confirm a run, Revuu shows its prompt size and risks.",
  },
  {
    q: "Why does a design run only once?",
    a: "Runs are expensive. Revuu collects the whole brief and refuses to run until the fields your outputs need are filled, so the first result can be used. To change the brief, start a new design.",
  },
  {
    q: "Where do our keys go?",
    a: "To Secret Manager on Revuu's server. They never reach the browser and are never logged. Key storage is not live yet in the demo workspace.",
  },
];

export function PricingPage() {
  return (
    <>
      <section
        aria-labelledby="pricing-title"
        className="mx-auto max-w-content px-6 pt-12 pb-12 lg:px-12 lg:pt-20"
      >
        <div className="grid max-w-[44rem] gap-5">
          <h1 id="pricing-title" className="text-display-md sm:text-display-lg">
            Start free. Pay per seat when the team grows.
          </h1>
          <p className="text-body-lg text-ink-muted">
            Plans cover part comparison. Model usage is billed to your own keys. Team and Business
            prices are set before launch, and you will see them before anything is charged.
          </p>
        </div>
      </section>

      <section aria-label="Plans" className="mx-auto max-w-content px-6 lg:px-12">
        <ul className="grid gap-4 lg:grid-cols-3">
          {tiers.map((tier) => (
            <li
              key={tier.name}
              className={cn(
                "grid content-start gap-6 rounded-lg p-6 lg:p-8",
                tier.featured
                  ? "bg-block-copper"
                  : "bg-raised shadow-[inset_0_0_0_1px_var(--color-hairline)]",
              )}
            >
              <div className="grid gap-2">
                <h2 className="flex items-center gap-2 text-title">
                  {tier.name}
                  {tier.featured ? (
                    <span className="rounded-xs bg-primary px-1.5 py-0.5 font-sans text-[0.75rem] font-semibold text-on-primary">
                      Recommended
                    </span>
                  ) : null}
                </h2>
                <p className="text-body-sm text-ink-muted">{tier.summary}</p>
              </div>
              <div className="grid gap-1">
                <p className="font-display text-headline">{tier.price}</p>
                <p
                  className={cn(
                    "text-caption font-medium",
                    tier.featured ? "text-ink-muted" : "text-ink-subtle",
                  )}
                >
                  {tier.priceNote}
                </p>
              </div>
              <LinkButton
                href="/app"
                variant={tier.featured ? "primary" : "secondary"}
                size="lg"
                className="w-full"
              >
                {tier.cta}
              </LinkButton>
              <ul className="grid gap-2.5 border-t border-hairline-strong/60 pt-6">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-body-sm">
                    <Icon name="check" className="mt-0.5 size-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-caption font-medium text-ink-subtle">
          Limits are placeholders until launch. Prices exclude tax.
        </p>
      </section>

      <section
        aria-labelledby="compare-title"
        className="mx-auto max-w-content px-6 py-24 lg:px-12"
      >
        <h2 id="compare-title" className="mb-8 text-headline">
          Compare plans
        </h2>
        <div
          role="region"
          aria-label="Plan comparison, scrolls sideways on small screens"
          tabIndex={0}
          className="overflow-x-auto rounded-lg shadow-[inset_0_0_0_1px_var(--color-hairline)]"
        >
          <table className="w-full min-w-[40rem] text-body-sm">
            <caption className="sr-only">Features by plan</caption>
            <thead>
              <tr className="border-b border-hairline-strong bg-surface text-left">
                <th scope="col" className="h-12 px-5 text-label">
                  Feature
                </th>
                {tiers.map((tier) => (
                  <th key={tier.name} scope="col" className="h-12 w-[18%] px-5 text-label">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            {comparison.map((group) => (
              <tbody key={group.group}>
                <tr className="border-b border-hairline bg-canvas">
                  <th
                    scope="colgroup"
                    colSpan={4}
                    className="h-10 px-5 text-left text-caption text-ink-muted"
                  >
                    {group.group}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label} className="border-b border-hairline bg-raised last:border-0">
                    <th scope="row" className="h-11 px-5 text-left font-medium">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td key={i} className="px-5 tabular-nums">
                        <CellValue value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section
        aria-labelledby="faq-title"
        className="mx-auto grid max-w-content gap-8 px-6 pb-24 lg:grid-cols-[1fr_2fr] lg:px-12"
      >
        <h2 id="faq-title" className="text-headline">
          Questions about plans
        </h2>
        <div className="divide-y divide-hairline border-y border-hairline">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-body font-semibold [&::-webkit-details-marker]:hidden">
                {faq.q}
                <Icon
                  name="chevron-down"
                  className="size-5 text-ink-muted transition-transform duration-180 ease-standard group-open:rotate-180"
                />
              </summary>
              <p className="max-w-[60ch] pb-5 text-body-sm text-ink-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return <Icon name="check" className="size-4 text-status-approved" label="Included" />;
  if (value === false) return <span className="text-ink-subtle">Not included</span>;
  return <span>{value}</span>;
}
