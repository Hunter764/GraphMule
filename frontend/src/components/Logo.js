// Three accounts closing a loop — the simplest money-muling ring.
export function LogoMark({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
      <path d="M6 21.5 14 6.5l8 15Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="14" cy="6.5" r="3.3" fill="rgb(var(--cobalt))" />
      <circle cx="6" cy="21.5" r="3.3" fill="currentColor" />
      <circle cx="22" cy="21.5" r="3.3" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="text-[19px] font-semibold tracking-[-0.03em]">graphmule</span>
    </span>
  );
}
