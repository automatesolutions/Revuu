"use client";

import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";

/** Short rise on scroll for below-the-fold sections. Content is visible without JS and under reduced motion. */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    let mm: gsap.MatchMedia | undefined;
    let cancelled = false;

    // Load GSAP a viewport ahead of the section, while it is still off screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        loadGsap().then((gsap) => {
          if (cancelled) return;
          mm = gsap.matchMedia();
          mm.add("(prefers-reduced-motion: no-preference)", () => {
            if (el.getBoundingClientRect().top < window.innerHeight) return;
            gsap.from(el.querySelectorAll("[data-reveal]"), {
              y: 20,
              autoAlpha: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            });
          });
        });
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      mm?.revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
