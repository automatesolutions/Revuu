"use client";

import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";
import { Icon } from "@revuu/ui/components/icon";
import { LifecycleBadge, StatusChip } from "@revuu/ui/components/status-chip";
import { cn } from "@revuu/ui/lib/cn";

const steps = [
  {
    title: "Import the parts list",
    body: "Drop in a CSV or Excel export from Altium, KiCad, OrCAD or your mechanical spreadsheet.",
  },
  {
    title: "Confirm the columns",
    body: "Revuu guesses each column from its header. No part exists until you confirm.",
  },
  {
    title: "Compare alternates",
    body: "Up to three alternates per part, spec by spec. Every difference is marked, and each alternate is Drop-in or Functional.",
  },
  {
    title: "Contact the vendor",
    body: "Email, phone and URL with their source, only where your list or the vendor record has them.",
  },
];

const lines = [
  { refs: "C1, C4, C7–C12", mpn: "GRM155R71C104KA88D", lifecycle: "active", avl: "approved" },
  { refs: "U2", mpn: "TPS62133RGTR", lifecycle: "active", avl: "approved" },
  { refs: "L1", mpn: "XAL4020-222MEB", lifecycle: "active", avl: "approved" },
  { refs: "U5", mpn: "LM1117IMPX-3.3/NOPB", lifecycle: "nrnd", avl: "restricted" },
  { refs: "R4, R9", mpn: "RC0402FR-0710KL", lifecycle: "active", avl: "approved" },
] as const;

const alternates = [
  { mpn: "DMP2035U-7", maker: "Diodes Inc.", detail: "2 specs differ" },
  { mpn: "SI2343CDS-T1-GE3", maker: "Vishay", detail: "3 specs differ" },
  { mpn: "AO3401A", maker: "Alpha & Omega", detail: "3 specs differ" },
];

const fitTag = (
  <span className="inline-flex h-5 items-center gap-1 rounded-xs bg-raised px-1.5 text-[0.75rem] font-semibold whitespace-nowrap text-ink shadow-[inset_0_0_0_1px_var(--color-hairline-strong)]">
    <Icon name="check" className="size-3" />
    Drop-in
  </span>
);

/** Two layers in one grid cell. The "after" layer is the default, so no-JS and reduced motion see the final state. */
function Swap({
  before,
  after,
  group,
  className,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  group: string;
  className?: string;
}) {
  return (
    <span data-hs-group={group} className={cn("grid items-center *:[grid-area:1/1]", className)}>
      <span data-hs-before aria-hidden className="invisible opacity-0">
        {before}
      </span>
      <span data-hs-after>{after}</span>
    </span>
  );
}

const checking = (
  <span className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-ink-subtle">
    <Icon name="loader" className="size-3" />
    Checking
  </span>
);

const pinQuery = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function HeroScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let mm: gsap.MatchMedia | undefined;
    let cancelled = false;
    const arm = () => el.setAttribute("data-hs-armed", "");
    const media = window.matchMedia(pinQuery);

    const start = () => {
      media.removeEventListener("change", start);
      loadGsap().then(animate, arm);
    };
    if (media.matches) start();
    else media.addEventListener("change", start);

    function animate(gsap: typeof import("gsap").gsap) {
      if (!el || cancelled) return;
      mm = gsap.matchMedia();
      mm.add(pinQuery, () => {
        const q = gsap.utils.selector(el);
        const stepEls = q("[data-hs-step]");
        const setStep = (active: number) =>
          stepEls.forEach((s, i) => {
            s.setAttribute("data-state", i < active ? "done" : i === active ? "active" : "todo");
          });

        gsap.set(q("[data-hs-before]"), { autoAlpha: 1 });
        gsap.set(q("[data-hs-after]"), { autoAlpha: 0 });
        gsap.set(q("[data-hs-reveal]"), { autoAlpha: 0, y: 6 });
        setStep(0);

        const swap = (tl: gsap.core.Timeline, group: string, at: number) => {
          tl.to(
            q(`[data-hs-group="${group}"] > [data-hs-before]`),
            { autoAlpha: 0, duration: 0.2, stagger: 0.08 },
            at,
          );
          tl.to(
            q(`[data-hs-group="${group}"] > [data-hs-after]`),
            { autoAlpha: 1, duration: 0.25, stagger: 0.08 },
            at + 0.05,
          );
        };

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: q("[data-hs-pin]")[0],
            pin: true,
            start: "center center",
            end: "+=2200",
            scrub: 0.5,
            onUpdate: (self) =>
              setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))),
          },
        });

        tl.to({}, { duration: 0.6 });
        swap(tl, "lifecycle", 0.8);
        tl.to(q('[data-hs-reveal="eol"]'), { autoAlpha: 1, y: 0, duration: 0.3 }, 1.4);
        swap(tl, "alternate", 2.1);
        tl.to(q('[data-hs-reveal="eol"]'), { autoAlpha: 0, duration: 0.2 }, 2.1);
        swap(tl, "fit", 2.4);
        swap(tl, "vendor", 3.1);
        tl.to(q('[data-hs-reveal="report"]'), { autoAlpha: 1, y: 0, duration: 0.3 }, 3.3);
        tl.to({}, { duration: 0.6 });

        return () => setStep(-1);
      });
      arm();
    }

    return () => {
      cancelled = true;
      media.removeEventListener("change", start);
      mm?.revert();
    };
  }, []);

  return (
    <div ref={root} id="how-it-works" className="scroll-mt-4">
      <div data-hs-pin>
        <div className="mx-auto grid w-full max-w-wide grid-cols-[minmax(0,1fr)] gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] lg:items-center lg:gap-16 lg:px-12">
          <ol
            className="order-2 grid content-center gap-1 lg:order-1"
            aria-label="How a parts list moves through Revuu"
          >
            {steps.map((step, i) => (
              <li
                key={step.title}
                data-hs-step
                className="group relative grid grid-cols-[2rem_1fr] gap-x-3 py-3"
              >
                <span
                  aria-hidden
                  className="flex size-7 items-center justify-center rounded-pill bg-surface text-label text-ink-muted tabular-nums transition-colors duration-180 group-data-[state=active]:bg-primary group-data-[state=active]:text-on-primary group-data-[state=done]:bg-status-approved-bg group-data-[state=done]:text-status-approved"
                >
                  {i + 1}
                </span>
                <div className="grid gap-1">
                  <p className="font-sans text-subtitle transition-colors duration-180 ease-standard group-data-[state=todo]:text-ink-subtle">
                    {step.title}
                  </p>
                  <p className="text-body-sm text-ink-muted transition-colors duration-180 ease-standard group-data-[state=todo]:text-ink-subtle">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <figure
            className="order-1 lg:order-2"
            aria-label="Revuu showing the Rev C power board parts list, alternates for Q3 and the vendor contact"
          >
            <div className="overflow-hidden rounded-lg bg-raised shadow-[0_0_0_1px_var(--color-hairline),0_24px_48px_-24px_rgb(15_17_21/0.25)]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-hairline bg-surface px-4 py-3">
                <Icon name="circuit-board" className="size-5 text-ink-muted" />
                <div className="flex items-baseline gap-2">
                  <span className="text-[0.9375rem] font-bold">Power board</span>
                  <span className="mpn text-ink-muted">Rev C</span>
                </div>
                <span className="ml-auto text-caption font-medium text-ink-subtle">Demo data</span>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                <div className="border-b border-hairline lg:border-r lg:border-b-0">
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <p className="text-label">BOM lines</p>
                    <p className="flex items-center gap-1.5 text-caption font-medium text-ink-subtle">
                      <Icon name="file-spreadsheet" className="size-3.5" />
                      power-board-rev-c.xlsx
                    </p>
                  </div>
                  <table className="w-full text-ui">
                    <caption className="sr-only">BOM lines for Rev C</caption>
                    <thead>
                      <tr className="border-y border-hairline bg-surface text-left text-caption text-ink-muted">
                        <th scope="col" className="hidden h-8 px-4 font-semibold sm:table-cell">
                          Refs
                        </th>
                        <th scope="col" className="h-8 pr-2 pl-4 font-semibold sm:px-2">
                          MPN
                        </th>
                        <th scope="col" className="h-8 px-2 font-semibold">
                          Lifecycle
                        </th>
                        <th scope="col" className="hidden h-8 px-4 font-semibold sm:table-cell">
                          AVL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.slice(0, 3).map((line) => (
                        <BomRow key={line.mpn} {...line} />
                      ))}
                      <tr className="border-b border-hairline">
                        <td className="hidden h-11 px-4 whitespace-nowrap sm:table-cell">Q3</td>
                        <td className="h-11 pr-2 pl-4 sm:px-2">
                          <Swap
                            group="alternate"
                            before={
                              <span className="grid">
                                <span className="mpn">IRLML6402TRPBF</span>
                                <span
                                  data-hs-reveal="eol"
                                  className="invisible inline-flex items-center gap-1 text-micro font-semibold text-accent opacity-0"
                                >
                                  <Icon name="replace" className="size-3" />3 alternates found
                                </span>
                              </span>
                            }
                            after={
                              <span className="grid">
                                <span className="mpn">DMP2035U-7</span>
                                <span className="text-micro text-ink-subtle">
                                  Replaces <span className="sr-only">EOL part </span>IRLML6402TRPBF
                                </span>
                              </span>
                            }
                          />
                        </td>
                        <td className="px-2">
                          <Swap
                            group="alternate"
                            before={
                              <Swap
                                group="lifecycle"
                                before={checking}
                                after={<LifecycleBadge lifecycle="eol" size="sm" />}
                              />
                            }
                            after={<LifecycleBadge lifecycle="active" size="sm" />}
                          />
                        </td>
                        <td className="hidden px-4 sm:table-cell">
                          <StatusChip status="approved" size="sm" />
                        </td>
                      </tr>
                      {lines.slice(3).map((line) => (
                        <BomRow key={line.mpn} {...line} />
                      ))}
                    </tbody>
                  </table>
                  <p className="px-4 py-3 text-caption font-medium text-ink-subtle">
                    6 of 12 lines · Lifecycle from vendor records, 1 d ago
                  </p>
                </div>

                <div className="grid content-start gap-4 p-4">
                  <p className="text-label">
                    Alternates for <span className="mpn">IRLML6402TRPBF</span>
                  </p>
                  <ul className="grid gap-2">
                    {alternates.map((alt) => (
                      <li
                        key={alt.mpn}
                        className="flex items-center gap-3 rounded-md bg-canvas px-3 py-2.5"
                      >
                        <div className="grid min-w-0 flex-1">
                          <span className="truncate mpn font-semibold">{alt.mpn}</span>
                          <span className="truncate text-[0.75rem] text-ink-subtle">
                            {alt.maker} · {alt.detail}
                          </span>
                        </div>
                        <Swap group="fit" before={checking} after={fitTag} />
                      </li>
                    ))}
                  </ul>

                  <div className="grid gap-3 rounded-md bg-block-fr4 p-3">
                    <Swap
                      group="vendor"
                      before={
                        <span className="flex items-center gap-1.5 text-ui font-semibold">
                          <Icon name="circle-dashed" className="size-3.5 text-status-pending" />
                          Pick an alternate to see its vendor
                        </span>
                      }
                      after={
                        <span className="grid gap-1">
                          <span className="text-ui font-semibold">Diodes Inc.</span>
                          <span className="flex items-center gap-1.5 text-ui">
                            <Icon name="mail" className="size-3.5" />
                            sales@diodes.example
                          </span>
                          <span className="text-[0.75rem] text-ink-muted">
                            From the imported list
                          </span>
                        </span>
                      }
                    />
                  </div>

                  <p
                    data-hs-reveal="report"
                    className="flex items-center gap-2 text-ui text-ink-muted"
                  >
                    <Icon name="differs" className="size-4 text-ink" />
                    Specs compared after unit normalization
                  </p>
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-caption font-medium text-ink-subtle">
              Sample parts list with demo data.
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}

function BomRow({ refs, mpn, lifecycle, avl }: (typeof lines)[number]) {
  return (
    <tr className="border-b border-hairline">
      <td className="hidden h-9 max-w-[7rem] truncate px-4 whitespace-nowrap sm:table-cell">
        {refs}
      </td>
      <td className="h-9 max-w-[11rem] truncate pr-2 pl-4 mpn sm:px-2">{mpn}</td>
      <td className="px-2">
        <Swap
          group="lifecycle"
          before={checking}
          after={<LifecycleBadge lifecycle={lifecycle} size="sm" />}
        />
      </td>
      <td className="hidden px-4 sm:table-cell">
        <StatusChip status={avl} size="sm" />
      </td>
    </tr>
  );
}
