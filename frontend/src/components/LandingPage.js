"use client";

import { useRef } from "react";
import Nav from "./landing/Nav";
import Hero from "./landing/Hero";
import Statement from "./landing/Statement";
import Story from "./landing/Story";
import Patterns from "./landing/Patterns";
import Output from "./landing/Output";
import { ClosingCTA, Footer } from "./landing/Closing";
import { gsap, ScrollTrigger, prefersReducedMotion, useIsomorphicLayoutEffect } from "../lib/motion";

export default function LandingPage() {
  const root = useRef(null);

  // Shared entrance for anything marked data-reveal. It runs after the
  // sections' own effects, so pinned sections are already measured.
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-reveal]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="overflow-x-clip">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Statement />
        <Story />
        <Patterns />
        <Output />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
