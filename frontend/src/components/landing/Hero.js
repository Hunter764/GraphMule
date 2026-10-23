"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { ArrowDownRight, ArrowRight, FileJson, Zap } from "lucide-react";
import HalftoneField from "../HalftoneField";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, useIsomorphicLayoutEffect } from "../../lib/motion";

// Real rows from public/sample-ledger.csv, and the figures the backend returns for it.
const STREAM = [
  ["TX_00151", "RING1_A", "RING1_B", "5,000.00"],
  ["TX_00159", "SMURF_IN_0", "SMURF_AGG", "900.00"],
  ["TX_00152", "RING1_B", "RING1_C", "5,000.00"],
  ["TX_00185", "SHELL_SOURCE", "SHELL_A", "50,000.00"],
  ["TX_00160", "SMURF_IN_1", "SMURF_AGG", "900.00"],
  ["TX_00153", "RING1_C", "RING1_A", "5,000.00"],
  ["TX_00186", "SHELL_A", "SHELL_B", "50,000.00"],
  ["TX_00001", "GEN_0", "GEN_50", "150.00"],
];

const SUMMARY = [
  ["Accounts analyzed", "243"],
  ["Accounts flagged", "140"],
  ["Fraud rings", "7", true],
  ["Processing", "0.076 s"],
];

const FACTS = [
  "Circular flows · 3–5 hops",
  "Fan-in · ≥10 senders in 72h",
  "Fan-out · ≥10 receivers in 72h",
  "Layered shells · 3-hop chains",
  "Per-account suspicion scores",
  "fraud_report.json export",
];

function LedgerStream() {
  const [head, setHead] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setHead((h) => (h + 1) % STREAM.length), 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!head) return;
    const rows = listRef.current.children;
    animate(rows[0], { opacity: [0, 1], translateY: [-14, 0], duration: 700, ease: "outExpo" });
    animate(Array.from(rows).slice(1), { translateY: [-14, 0], duration: 700, ease: "outExpo" });
  }, [head]);

  const rows = [0, 1, 2].map((i) => STREAM[(head - i + STREAM.length * 2) % STREAM.length]);

  return (
    <div className="rounded-[12px] bg-graphite p-3.5 text-fog shadow-[0_24px_50px_-20px_rgb(0_0_0/0.45)]">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[13px] font-medium">Ledger stream</span>
        <span className="eyebrow flex items-center gap-1.5 text-fog-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-moss" /> sample
        </span>
      </div>
      <ul ref={listRef} className="space-y-2 overflow-hidden">
        {rows.map(([id, from, to, amount], i) => (
          <li key={`${id}-${head}-${i}`} className="rounded-md bg-fog/[0.04] px-2 py-1.5 font-mono text-[10.5px] leading-tight">
            <div className="flex justify-between text-fog-muted">
              <span>{id}</span>
              <span className="text-fog">${amount}</span>
            </div>
            <div className="mt-0.5 truncate">
              {from} <span className="text-cobalt">→</span> {to}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RingCard() {
  return (
    <div className="relative h-[300px] overflow-hidden rounded-[12px] bg-graphite text-fog shadow-[0_30px_60px_-24px_rgb(0_0_0/0.55)] sm:h-[340px]">
      <div className="absolute inset-0">
        <HalftoneField color="61 92 255" spacing={8} originX={0.85} originY={0.15} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-graphite from-15% via-graphite/40 to-transparent" />
      <span className="pill absolute left-3 top-3 border-ember/40 bg-ember/90 text-white">Risk 95</span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="eyebrow mb-1.5 text-fog-muted">RING_002 · cycle</p>
        <p className="text-[17px] font-medium leading-tight tracking-[-0.02em] sm:text-[19px]">Circular flow detected</p>
        <p className="mt-1.5 text-[12px] leading-snug text-fog-muted">
          RING1_A → B → C → A. Three transfers of $5,000 in two hours.
        </p>
      </div>
    </div>
  );
}

function SummaryCard() {
  return (
    <div className="rounded-[12px] border border-ink/[0.06] bg-paper-3 p-4 shadow-[0_24px_50px_-24px_rgb(0_0_0/0.25)]">
      <p className="text-[14px] font-medium">Case summary</p>
      <p className="eyebrow mt-0.5 text-ink-muted">sample-ledger.csv</p>
      <dl className="mt-3 divide-y divide-ink/[0.07] text-[12px]">
        {SUMMARY.map(([k, v, accent]) => (
          <div key={k} className="flex items-center justify-between gap-2 py-2">
            <dt className={accent ? "text-cobalt" : "text-ink-muted"}>{k}</dt>
            <dd className={`font-mono ${accent ? "font-semibold text-cobalt" : ""}`}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-paper-2 py-2 text-[12px] font-medium text-ink-soft">
        <FileJson className="h-3.5 w-3.5" /> fraud_report.json
      </div>
    </div>
  );
}

export default function Hero() {
  const root = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {}, root);
    let cancelled = false;

    if (prefersReducedMotion()) {
      gsap.set("[data-intro]", { visibility: "visible" });
      return () => ctx.revert();
    }

    // Split once webfonts are in so line breaks match what the reader sees.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        const split = SplitText.create("[data-hero-title]", { type: "lines", mask: "lines" });
        const tl = gsap.timeline({ delay: 0.1 });
        tl.set("[data-intro]", { visibility: "visible" })
          .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.1 })
          .fromTo("[data-hero-fade]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.35)
          .fromTo("[data-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.4, stagger: 0.12, ease: "expo.inOut" }, 0.1)
          .fromTo("[data-node-pill]", { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: "back.out(2)" }, 0.5)
          .fromTo("[data-hero-card]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.6);

        // Cards drift at different rates as the hero scrolls away.
        gsap.utils.toArray("[data-depth]").forEach((el) => {
          gsap.to(el, {
            yPercent: -Number(el.dataset.depth),
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        });
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden pt-16">
      <div className="shell grid gap-12 pb-16 pt-10 lg:min-h-[calc(100svh-64px-72px)] lg:grid-cols-[1.08fr_1fr] lg:gap-6 lg:pb-14 lg:pt-14">
        {/* Copy */}
        <div className="flex flex-col justify-end lg:pb-6">
          <h1 data-hero-title data-intro className="display max-w-[11ch] text-[clamp(3rem,8.4vw,6.6rem)]">
            Follow the money. Find the ring.
          </h1>
          <p data-hero-fade data-intro className="mt-7 max-w-[34rem] text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">
            GraphMule turns a transaction ledger into a network and searches its shape for money-muling
            cycles, smurfing bursts and layered shell accounts — the structures rule-based checks walk
            straight past.
          </p>
          <div data-hero-fade data-intro className="mt-9 flex flex-wrap gap-3">
            <Link href="/analyze" className="btn btn-primary group">
              Analyze a ledger
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.8} />
            </Link>
            <a href="#how" className="btn btn-outline group">
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={1.8} />
              See how it works
            </a>
          </div>
        </div>

        {/* Pipeline visual */}
        <div aria-hidden="true">
          <p data-hero-fade data-intro className="eyebrow mb-3 text-ink-muted/80 lg:mb-4">
            sample-ledger.csv · 188 rows · 243 accounts
          </p>
          <div className="relative">
            {/* Connector line: grey from the page edge, cobalt between stages */}
            <div data-line className="absolute hidden sm:block right-[83.34%] top-[13px] h-px w-[100vw] origin-right bg-ink/15" />
            <div data-line className="absolute hidden sm:block left-[16.66%] right-[-50vw] top-[13px] h-px origin-left bg-cobalt" />

            <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {[
                ["Ingest", <LedgerStream key="a" />, "hidden sm:block", 6],
                ["Model", <RingCard key="b" />, "", 14],
                ["Detect", <SummaryCard key="c" />, "", 9],
              ].map(([label, card, cls, depth]) => (
                <div key={label} className={cls}>
                  <div className="flex justify-center">
                    <span data-node-pill data-intro className="pill border-ink/15 bg-paper text-ink-soft">
                      <Zap className="h-3 w-3 fill-cobalt text-cobalt" /> {label}
                    </span>
                  </div>
                  <div data-depth={depth} className="mt-5">
                    <div data-hero-card data-intro>
                      {card}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detector ticker */}
      <div className="border-y border-ink/10">
        <div className="shell flex h-[72px] items-center gap-8">
          <span className="eyebrow hidden shrink-0 text-ink-muted md:block">Detectors</span>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
              {[...FACTS, ...FACTS].map((f, i) => (
                <span key={i} className="flex items-center gap-12 text-[15px] font-medium tracking-[-0.01em] text-ink-soft">
                  {f}
                  <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
