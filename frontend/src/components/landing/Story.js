"use client";

import { useRef, useState } from "react";
import HalftoneField from "../HalftoneField";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "../../lib/motion";

const STEPS = [
  {
    key: "Ingest",
    title: "Drop in a ledger",
    body: "A CSV of transfers with five columns: transaction id, sender, receiver, amount and timestamp. There's nothing to configure.",
  },
  {
    key: "Model",
    title: "See it as a graph",
    body: "Every account becomes a node and every transfer a directed, timestamped edge. A flat list of payments becomes a shape you can inspect.",
  },
  {
    key: "Detect",
    title: "Isolate the rings",
    body: "Four detectors walk the graph for cycles, fan-in, fan-out and shell layering. Each account they touch gets a suspicion score and a ring id.",
  },
];

export default function Story() {
  const root = useRef(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const update = (self) => {
        progress.current = self.progress;
        const step = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length * 0.999 + 0.0001));
        if (step !== activeRef.current) {
          activeRef.current = step;
          setActive(step);
        }
        gsap.set("[data-story-bar]", { scaleY: self.progress });
      };

      // Desktop: pin the frame and let scroll drive the graph.
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: "[data-story-frame]",
          start: "top top+=80",
          end: "+=220%",
          pin: true,
          scrub: true,
          onUpdate: update,
        });
      });
      // Small screens: no pin, the story plays as the section passes.
      mm.add("(max-width: 1023px)", () => {
        ScrollTrigger.create({
          trigger: "[data-story-canvas]",
          start: "top 75%",
          end: "bottom 15%",
          onUpdate: update,
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="how" className="scroll-mt-16 bg-graphite pb-24 text-fog lg:pb-32">
      <div className="shell">
        <div data-story-frame className="overflow-hidden rounded-[var(--radius-lg)] border border-fog/10 bg-graphite-2 lg:h-[calc(100vh-112px)]">
          <div className="hatch h-3 border-b border-fog/10" />
          <div className="grid h-full lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Steps */}
            <div className="flex flex-col justify-between gap-10 border-fog/10 p-6 sm:p-8 lg:border-r lg:p-10 lg:pb-14">
              <div>
                <p className="eyebrow text-fog-muted">How it works</p>
                <h2 className="mt-4 max-w-[14ch] text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1] tracking-heading">
                  From spreadsheet to suspect in three moves.
                </h2>
              </div>
              <ol className="relative space-y-7 pl-6">
                <span className="absolute bottom-1 left-0 top-1 w-px bg-fog/10" />
                <span data-story-bar className="absolute bottom-1 left-0 top-1 w-px origin-top scale-y-0 bg-ember" />
                {STEPS.map((s, i) => (
                  <li
                    key={s.key}
                    className={`transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-35"}`}
                    aria-current={i === active ? "step" : undefined}
                  >
                    <p className="eyebrow text-fog-muted">
                      0{i + 1} · {s.key}
                    </p>
                    <h3 className="mt-1.5 text-[20px] font-medium tracking-[-0.02em]">{s.title}</h3>
                    <p className="mt-1.5 max-w-[40ch] text-[15px] leading-[1.55] text-fog/70">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Figure */}
            <div data-story-canvas className="relative h-[380px] border-t border-fog/10 sm:h-[460px] lg:h-full lg:border-t-0">
              <div className="absolute inset-x-0 bottom-12 top-12 lg:inset-0">
                <HalftoneField variant="network" progressRef={progress} spacing={10} />
              </div>
              <span className="eyebrow pointer-events-none absolute left-5 top-5 text-fog-muted">Fig. 01 — Ledger as graph</span>
              <span className="eyebrow pointer-events-none absolute bottom-5 right-5 text-fog-muted">
                Stage 0{active + 1} / {STEPS[active].key}
              </span>
              <span className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-fog-muted">
                <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${active === 2 ? "bg-ember" : "bg-fog/40"}`} />
                {active === 2 ? "Ring isolated · 4 accounts" : "Scanning"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
