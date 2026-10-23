"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "../Logo";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "../../lib/motion";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#patterns", label: "Patterns" },
  { href: "#output", label: "Output" },
];

export default function Nav() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide on scroll down, reveal on scroll up — keeps the reading area clear.
  useIsomorphicLayoutEffect(() => {
    const show = gsap.quickTo(ref.current, "yPercent", { duration: 0.45, ease: "power3.out" });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setScrolled(self.scroll() > 24);
        if (self.scroll() < 120) show(0);
        else show(self.direction === 1 ? -110 : 0);
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-ink/10 bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/" aria-label="GraphMule home" className="rounded-md">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="link-underline text-[14px] text-ink-soft hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/analyze" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Launch workspace
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="shell pb-6 md:hidden">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 text-lg">
                  {l.label}
                  <span className="eyebrow text-ink-muted">↘</span>
                </a>
              </li>
            ))}
          </ul>
          <Link href="/analyze" className="btn btn-primary mt-5 w-full">
            Launch workspace
          </Link>
        </div>
      )}
    </header>
  );
}
