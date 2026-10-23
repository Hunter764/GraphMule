"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

const METRICS = [
  { value: 4, suffix: "", label: "Detectors", body: "Cycles, fan-in, fan-out and layered shells run on every upload." },
  { value: 72, suffix: "h", label: "Smurfing window", body: "Bursts only count when they land inside 72 hours." },
  { value: null, display: "3–5", label: "Hop cycles", body: "Short loops are where muling rings hand funds back to themselves." },
  { value: 1, suffix: "", label: "Click export", body: "Every ring, account and score in one fraud_report.json." },
];

// An excerpt of the real response for public/sample-ledger.csv.
const JSON_LINES = [
  ["{", ""],
  ['  "fraud_rings": [{', ""],
  ['    "ring_id": ', '"RING_002"', ","],
  ['    "member_accounts": ', '["RING1_A", "RING1_B", "RING1_C"]', ","],
  ['    "pattern_type": ', '"cycle"', ","],
  ['    "risk_score": ', "95.0"],
  ["  }, …],", ""],
  ['  "summary": {', ""],
  ['    "total_accounts_analyzed": ', "243", ","],
  ['    "suspicious_accounts_flagged": ', "140", ","],
  ['    "fraud_rings_detected": ', "7", ","],
  ['    "processing_time_seconds": ', "0.076"],
  ["  }", ""],
  ["}", ""],
];

function Counter({ value, suffix, display }) {
  const ref = useRef(null);

  useEffect(() => {
    if (value === null) return;
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = `0${suffix}`;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const state = { n: 0 };
        animate(state, {
          n: value,
          duration: 1600,
          ease: "outExpo",
          onUpdate: () => (el.textContent = `${Math.round(state.n)}${suffix}`),
        });
        io.disconnect();
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix]);

  return <span ref={ref}>{display ?? `${value}${suffix}`}</span>;
}

export default function Output() {
  return (
    <section id="output" className="scroll-mt-16 bg-graphite py-24 text-fog md:py-32">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="eyebrow text-fog-muted">Output</p>
          <h2 data-reveal className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1] tracking-heading">
            One upload. A complete case file.
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-[46ch] text-[17px] leading-[1.55] text-fog/70">
            You get an interactive network, ranked rings and accounts, and a structured report that
            downstream compliance tooling can read.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[var(--radius-lg)] border border-fog/10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <dl className="grid grid-cols-2">
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                data-reveal
                className={`border-fog/10 p-5 sm:p-8 ${i > 1 ? "border-t" : ""} ${i % 2 === 1 ? "border-l" : ""}`}
              >
                <dt className="eyebrow text-fog-muted">{m.label}</dt>
                <dd>
                  <span className="mt-6 block text-[clamp(2.25rem,5vw,4rem)] font-medium leading-none tracking-display">
                    <Counter value={m.value} suffix={m.suffix} display={m.display} />
                  </span>
                  <span className="mt-4 block max-w-[30ch] text-[13.5px] sm:text-[14.5px] leading-[1.5] text-fog/65">{m.body}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="flex flex-col border-t border-fog/10 bg-graphite-2 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between border-b border-fog/10 px-5 py-3">
              <span className="font-mono text-[12px] text-fog-muted">fraud_report.json</span>
              <span className="eyebrow text-fog-muted">sample run</span>
            </div>
            <pre className="scroll-thin-dark flex-1 overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.75] text-fog/60 sm:p-6">
              <code>
                {JSON_LINES.map(([key, val, comma], i) => (
                  <div key={i}>
                    {key}
                    {val && <span className={val.startsWith('"') || val.startsWith("[") ? "text-[#8fa2ff]" : "text-ember"}>{val}</span>}
                    {comma}
                  </div>
                ))}
              </code>
            </pre>
            <div className="hatch h-3 border-t border-fog/10" />
          </div>
        </div>

        <p data-reveal className="mt-8 text-center font-mono text-[11.5px] uppercase tracking-[0.06em] text-fog-muted">
          FastAPI · NetworkX · Pandas · Next.js
        </p>
      </div>
    </section>
  );
}
