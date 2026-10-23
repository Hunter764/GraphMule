"use client";

import { useRef } from "react";
import { gsap, SplitText, prefersReducedMotion, useIsomorphicLayoutEffect } from "../../lib/motion";

export default function Statement() {
  const root = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create("[data-statement]", { type: "words" });
      // Words light up as the reader scrolls through the argument.
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-statement]", start: "top 78%", end: "bottom 42%", scrub: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-graphite text-fog">
      <div className="shell grid gap-12 py-24 md:py-32 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:py-40">
        <h2 data-statement className="text-[clamp(2.4rem,5.6vw,4.6rem)] font-medium leading-[1] tracking-heading">
          <span className="text-fog-muted">Rules check transactions.</span>{" "}
          <span>Launderers design networks.</span>
        </h2>
        <div className="space-y-6 self-end text-[17px] leading-[1.6] text-fog/80 md:text-[18px]">
          <p data-reveal>
            A $900 deposit looks clean. So do the eleven others that land in the same account before
            the day is out. On its own, no single transfer crosses a threshold.
          </p>
          <p data-reveal>
            GraphMule reads the ledger the way an investigator would. It maps accounts as nodes and
            transfers as edges, then looks at the shape of the whole.
          </p>
        </div>
      </div>
    </section>
  );
}
