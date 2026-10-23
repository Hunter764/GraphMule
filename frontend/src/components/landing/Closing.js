import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HalftoneField from "../HalftoneField";
import Logo from "../Logo";

export function ClosingCTA() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="shell">
        <div data-reveal className="relative isolate overflow-hidden rounded-[28px] bg-graphite text-fog">
          <div className="absolute inset-0 -z-10">
            <HalftoneField color="61 92 255" spacing={10} originX={1} originY={1} />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-graphite via-graphite/80 to-transparent" />
          <div className="flex min-h-[460px] flex-col justify-between gap-12 p-7 sm:p-10 md:min-h-[520px] md:p-14">
            <Logo className="text-fog" />
            <div>
              <h2 className="max-w-[16ch] font-serif text-[clamp(2.6rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.01em]">
                See the network behind the numbers.
              </h2>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.55] text-fog/70">
                Upload your own ledger or start with the bundled sample. It holds seven planted rings and takes
                under a second to analyze.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/analyze" className="btn btn-light group">
                  Analyze a ledger
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.8} />
                </Link>
                <Link href="/analyze?sample=1" className="btn btn-outline-dark">
                  Try the sample ledger
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[36ch] text-[14.5px] leading-[1.55] text-ink-muted">
            A graph-based engine for detecting money-muling rings, smurfing and shell accounts in transaction ledgers.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow text-ink-muted">Explore</p>
          <ul className="mt-4 space-y-2.5 text-[14.5px]">
            <li><a href="#how" className="link-underline">How it works</a></li>
            <li><a href="#patterns" className="link-underline">Patterns</a></li>
            <li><a href="#output" className="link-underline">Output</a></li>
            <li><Link href="/analyze" className="link-underline">Workspace</Link></li>
          </ul>
        </nav>
        <div>
          <p className="eyebrow text-ink-muted">Project</p>
          <ul className="mt-4 space-y-2.5 text-[14.5px] text-ink-soft">
            <li>RIFT 2026 hackathon finalist</li>
            <li>FastAPI + NetworkX engine</li>
            <li>Next.js client</li>
          </ul>
        </div>
      </div>
      <div className="shell flex flex-wrap justify-between gap-3 border-t border-ink/10 py-6 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
        <span>© 2026 GraphMule</span>
        <span>Research prototype · not a certified compliance product</span>
      </div>
    </footer>
  );
}
