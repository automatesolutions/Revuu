"use client";

import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";
import { Icon } from "@revuu/ui/components/icon";
import { LifecycleBadge } from "@revuu/ui/components/status-chip";
import { cn } from "@revuu/ui/lib/cn";
import { FitTag } from "@/screens/app/parts/parts-ui";

const steps = [
  {
    title: "Pick the original part",
    body: "Open a line from your parts list, or enter the MPN and maker of the part in your design.",
  },
  {
    title: "Add up to 4 candidates",
    body: "Electronic, mechanical or miscellaneous parts that could replace it.",
  },
  {
    title: "Get a judgement for each",
    body: "Drop-in, Rework or Not acceptable, with every spec difference marked and the checks to run.",
  },
  {
    title: "Brief a new design",
    body: "Fill one brief, and Revuu checks it is complete before a single schematic, PCB and enclosure run.",
  },
];

const candidates = [
  { mpn: "DMP2035U-7", maker: "Diodes Inc.", detail: "Rds(on) 35 mΩ, differs" },
  { mpn: "SI2343CDS-T1-GE3", maker: "Vishay", detail: "Vds −30 V, differs" },
  { mpn: "AO3401A", maker: "Alpha & Omega", detail: "Vds −30 V, differs" },
];

const brief = [
  { label: "Specification", value: "12 V to 3.3 V, 3 A buck" },
  { label: "PCB size", value: "50 × 30 mm, 4 layers" },
  { label: "Standards", value: "IEC 62368-1, IPC-2221" },
  { label: "Outputs", value: "KiCad schematic, KiCad PCB, Onshape enclosure" },
];

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

const pending = (
  <span className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-ink-subtle">
    <Icon name="circle-dashed" className="size-3" />
    To fill
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
        swap(tl, "original", 0.7);
        tl.to(q('[data-hs-reveal="candidates"]'), { autoAlpha: 1, y: 0, duration: 0.3 }, 1.2);
        swap(tl, "fit", 1.9);
        swap(tl, "brief", 2.7);
        swap(tl, "gate", 3.3);
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
            aria-label="How Revuu compares parts and briefs a design"
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
            aria-label="Revuu comparing the original part Q3 with three candidates, beside a hardware design brief"
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

              <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                <section
                  aria-label="Part comparison"
                  className="grid content-start gap-3 border-b border-hairline p-4 lg:border-r lg:border-b-0"
                >
                  <p className="flex items-center gap-2 text-label">
                    <Icon name="git-compare" className="size-4" />
                    Part comparison
                  </p>

                  <div className="grid gap-1.5 rounded-md bg-surface px-3 py-2.5">
                    <span className="text-[0.75rem] font-semibold text-ink-muted">Original</span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="grid min-w-0">
                        <span className="truncate mpn font-semibold">Q3 · IRLML6402TRPBF</span>
                        <span className="truncate text-[0.75rem] text-ink-subtle">
                          Infineon · P-channel, SOT-23, −20 V, 65 mΩ
                        </span>
                      </span>
                      <Swap
                        group="original"
                        before={checking}
                        after={<LifecycleBadge lifecycle="eol" size="sm" />}
                      />
                    </div>
                  </div>

                  <div data-hs-reveal="candidates" className="grid gap-2">
                    <span className="text-[0.75rem] font-semibold text-ink-muted">
                      3 of 4 candidates
                    </span>
                    <ul className="grid gap-2">
                      {candidates.map((c) => (
                        <li
                          key={c.mpn}
                          className="flex items-center gap-3 rounded-md bg-canvas px-3 py-2.5 shadow-[inset_0_0_0_1px_var(--color-hairline)]"
                        >
                          <div className="grid min-w-0 flex-1">
                            <span className="truncate mpn font-semibold">{c.mpn}</span>
                            <span className="truncate text-[0.75rem] text-ink-subtle">
                              {c.maker} · {c.detail}
                            </span>
                          </div>
                          <Swap group="fit" before={checking} after={<FitTag fit="Drop-in" />} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section
                  aria-label="Hardware design brief"
                  className="grid content-start gap-3 p-4"
                >
                  <p className="flex items-center gap-2 text-label">
                    <Icon name="circuit-board" className="size-4" />
                    Hardware design brief
                  </p>
                  <ul className="grid gap-2">
                    {brief.map((row) => (
                      <li
                        key={row.label}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 rounded-md bg-canvas px-3 py-2"
                      >
                        <span className="grid min-w-0">
                          <span className="text-[0.75rem] font-semibold text-ink-muted">
                            {row.label}
                          </span>
                          <Swap
                            group="brief"
                            className="justify-items-start"
                            before={<span className="text-ui text-ink-subtle">Not filled</span>}
                            after={<span className="text-ui">{row.value}</span>}
                          />
                        </span>
                        <Swap
                          group="brief"
                          before={pending}
                          after={
                            <Icon
                              name="check-circle"
                              label="Filled"
                              className="mt-0.5 size-4 text-status-approved"
                            />
                          }
                        />
                      </li>
                    ))}
                  </ul>

                  <div className="grid gap-2 rounded-md bg-block-copper p-3">
                    <Swap
                      group="gate"
                      before={
                        <span className="flex items-center gap-1.5 text-ui font-semibold">
                          <Icon name="circle-dashed" className="size-3.5 text-status-pending" />
                          Fill 4 required fields to run
                        </span>
                      }
                      after={
                        <span className="grid gap-1">
                          <span className="flex items-center gap-1.5 text-ui font-semibold">
                            <Icon name="check-circle" className="size-3.5 text-status-approved" />
                            Brief complete. Ready for one run.
                          </span>
                          <span className="text-[0.75rem] text-ink-muted">
                            Design runs are not live yet.
                          </span>
                        </span>
                      }
                    />
                  </div>
                </section>
              </div>
            </div>
            <figcaption className="mt-3 text-caption font-medium text-ink-subtle">
              Sample comparison and brief with demo data.
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
