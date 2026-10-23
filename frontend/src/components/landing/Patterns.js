"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import PatternDiagram from "../PatternDiagram";
import HalftoneField from "../HalftoneField";
import { gsap, useIsomorphicLayoutEffect } from "../../lib/motion";

const PATTERNS = [
  {
    type: "cycle",
    title: "Circular flow",
    body: "Money leaves an account and returns to it through three to five hops. This is the signature of a muling ring laundering its own funds.",
    specs: ["3–5 hops", "Score 95"],
    featured: true,
  },
  {
    type: "fanIn",
    title: "Fan-in smurfing",
    body: "Ten or more senders feed a single account within 72 hours. A large sum gets broken into deposits that each stay under reporting thresholds.",
    specs: ["≥10 senders", "72h", "Score 88.5"],
  },
  {
    type: "fanOut",
    title: "Fan-out smurfing",
    body: "One account pays out to ten or more receivers inside 72 hours, scattering the trail before anyone can follow it.",
    specs: ["≥10 receivers", "72h", "Score 88.5"],
  },
  {
    type: "shell",
    title: "Layered shells",
    body: "Funds pass through a chain of low-activity accounts, each with only two or three transactions. Their only job is to put distance between source and destination.",
    specs: ["3 hops", "2–3 tx each", "Score 92"],
  },
];

export default function Patterns() {
  const root = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current.querySelector("[data-track]");
        const viewport = root.current.querySelector("[data-viewport]");
        gsap.set(viewport, { overflowX: "hidden" });
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-patterns-pin]",
            start: "top top+=64",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (PATTERNS.length - 1));
              root.current.querySelectorAll("[data-dash]").forEach((d, i) => {
                d.style.backgroundColor = i === idx ? "rgb(var(--ink))" : "";
                d.style.width = i === idx ? "40px" : "";
              });
            },
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="patterns" className="scroll-mt-16 bg-paper">
      <div data-patterns-pin className="shell py-24 lg:flex lg:min-h-[calc(100vh-64px)] lg:flex-col lg:justify-center lg:py-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-12">
          <h2 data-reveal className="display flex items-start gap-3 text-[clamp(2.6rem,6.4vw,5.2rem)]">
            What it looks for
            <svg viewBox="0 0 24 24" className="mt-[0.25em] h-[0.5em] w-[0.5em] shrink-0" aria-hidden="true">
              <path d="M5 4v11h13m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </h2>
          <p data-reveal className="max-w-[30ch] text-[15px] leading-[1.55] text-ink-muted">
            Four detectors, each tuned to a laundering typology. Every match is returned as a ring with
            its member accounts and a risk score.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-6">
          <div className="hidden flex-col justify-between lg:flex">
            <Link href="/analyze" className="btn btn-outline btn-sm w-max rounded-full">
              Open workspace <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
            <p className="text-[13px] leading-[1.5] text-ink-muted">
              Thresholds mirror the backend detectors exactly. Nothing here is a mock-up.
            </p>
          </div>

          <div data-viewport className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:[mask-image:linear-gradient(90deg,transparent,black_28px)] lg:pl-7">
            <ol data-track className="grid gap-4 sm:grid-cols-2 lg:flex lg:w-max lg:gap-5">
              {PATTERNS.map((p, i) => (
                <li
                  key={p.type}
                  data-reveal
                  className="flex flex-col rounded-[var(--radius-lg)] border border-ink/[0.06] bg-paper-3 p-4 lg:h-[460px] lg:w-[400px]"
                >
                  <div
                    className={`relative grid h-[180px] place-items-center overflow-hidden rounded-[14px] ${
                      p.featured ? "bg-cobalt text-white" : "bg-paper-2 text-ink"
                    }`}
                  >
                    {p.featured && (
                      <div className="absolute inset-0 opacity-40">
                        <HalftoneField color="255 255 255" spacing={9} originX={1} originY={0} />
                      </div>
                    )}
                    <PatternDiagram type={p.type} className="relative h-[150px] w-[250px]" />
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[22px] font-medium tracking-[-0.02em]">{p.title}</h3>
                      <span className="eyebrow text-ink-muted">0{i + 1}/04</span>
                    </div>
                    <span className="my-4 block h-px w-6 bg-ink/40" />
                    <p className="text-[14.5px] leading-[1.55] text-ink-muted">{p.body}</p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                      {p.specs.map((s) => (
                        <span key={s} className="pill border-ink/10 text-ink-soft">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 hidden justify-end gap-2 lg:flex" aria-hidden="true">
          {PATTERNS.map((p, i) => (
            <span
              key={p.type}
              data-dash
              className="h-px w-6 bg-ink/20 transition-all duration-300"
              style={i === 0 ? { backgroundColor: "rgb(var(--ink))", width: 40 } : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
