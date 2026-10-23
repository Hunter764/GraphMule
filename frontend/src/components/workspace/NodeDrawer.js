"use client";

import { Network, X } from "lucide-react";
import { patternLabel, riskTier } from "../../lib/api";

const TONE = {
  ember: "rgb(var(--ember))",
  amber: "rgb(var(--amber))",
  moss: "rgb(var(--moss))",
  muted: "rgb(var(--fog-muted))",
};

export default function NodeDrawer({ node, onClose, onHighlightRing, selectedRingId }) {
  const tier = node ? riskTier(node.suspicion_score) : null;
  const score = node ? Math.round(node.suspicion_score) : 0;
  const hasRing = node?.ring_id && node.ring_id !== "N/A";

  return (
    <aside
      aria-label="Account details"
      aria-hidden={!node}
      inert={!node || undefined}
      className={`absolute bottom-3 right-3 top-3 z-20 flex w-[min(320px,calc(100%-24px))] flex-col rounded-[16px] border border-fog/10 bg-graphite/95 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        node ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-[calc(100%+24px)] opacity-0"
      }`}
    >
      {node && (
        <>
          <div className="flex items-start justify-between gap-3 border-b border-fog/10 p-5">
            <div className="min-w-0">
              <p className="eyebrow text-fog-muted">Account</p>
              <p className="mt-1 truncate font-mono text-[15px] text-fog">{node.account_id}</p>
            </div>
            <button type="button" onClick={onClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-fog-muted hover:bg-fog/10 hover:text-fog" aria-label="Close account details">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="scroll-thin-dark flex-1 space-y-6 overflow-y-auto p-5">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgb(var(--fog) / 0.1)" strokeWidth="2.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={TONE[tier.tone]}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${score}, 100`}
                    style={{ transition: "stroke-dasharray 0.9s cubic-bezier(0.22,1,0.36,1)" }}
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center font-mono text-[20px] font-semibold text-fog">{score}</span>
              </div>
              <div>
                <p className="eyebrow text-fog-muted">Suspicion score</p>
                <p className="mt-1.5 flex items-center gap-2 text-[17px] font-medium text-fog">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TONE[tier.tone] }} />
                  {tier.label}
                </p>
              </div>
            </div>

            {hasRing && (
              <div className="rounded-[12px] border border-fog/10 bg-fog/[0.03] p-4">
                <p className="eyebrow flex items-center gap-1.5 text-fog-muted">
                  <Network className="h-3.5 w-3.5" /> Associated ring
                </p>
                <p className="mt-1.5 font-mono text-[15px] text-fog">{node.ring_id}</p>
                <button
                  type="button"
                  onClick={() => onHighlightRing(node.ring_id)}
                  disabled={selectedRingId === node.ring_id}
                  className="btn btn-light btn-sm mt-3 w-full"
                >
                  {selectedRingId === node.ring_id ? "Ring highlighted" : "Highlight ring"}
                </button>
              </div>
            )}

            <div>
              <p className="eyebrow text-fog-muted">Detected patterns</p>
              {node.detected_patterns?.length ? (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {node.detected_patterns.map((p) => (
                    <span key={p} className="rounded-md bg-fog/[0.07] px-2 py-1 text-[12.5px] text-fog/85">
                      {patternLabel(p)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[14px] leading-[1.5] text-fog-muted">No detector flagged this account.</p>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
