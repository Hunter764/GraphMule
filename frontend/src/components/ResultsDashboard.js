import { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { patternLabel, riskTier } from '../lib/api';
import { generateRingColors } from './GraphVisualizer';

const TONE_CLASSES = {
  ember: 'bg-ember/10 text-[#c2410c] ring-ember/25',
  amber: 'bg-amber/15 text-[#92400e] ring-amber/30',
  moss: 'bg-moss/10 text-[#166534] ring-moss/25',
  muted: 'bg-ink/5 text-ink-muted ring-ink/10',
};

export function ScoreBadge({ score }) {
  const tier = riskTier(score);
  return (
    <span className={`inline-flex min-w-[2.75rem] justify-center rounded-md px-2 py-0.5 font-mono text-[12px] font-semibold ring-1 ring-inset ${TONE_CLASSES[tier.tone]}`}>
      {Math.round(score)}
    </span>
  );
}

function SortHeader({ label, sortKey, config, onSort }) {
  const active = config?.key === sortKey;
  const Icon = !active ? ArrowUpDown : config.direction === 'asc' ? ChevronUp : ChevronDown;
  return (
    <th scope="col" aria-sort={active ? (config.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-5 py-3 font-medium">
      <button type="button" onClick={() => onSort(sortKey)} className={`inline-flex items-center gap-1 rounded transition-colors hover:text-ink ${active ? 'text-ink' : ''}`}>
        {label}
        <Icon className={`h-3.5 w-3.5 ${active ? '' : 'opacity-40'}`} />
      </button>
    </th>
  );
}

function TablePanel({ title, meta, children }) {
  return (
    <div className="card flex h-[460px] flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-4">
        <h3 className="text-[17px] font-medium tracking-[-0.02em]">{title}</h3>
        <span className="eyebrow text-ink-muted">{meta}</span>
      </div>
      <div className="scroll-thin flex-1 overflow-auto">{children}</div>
    </div>
  );
}

const theadClass = 'sticky top-0 z-10 bg-paper-3 text-left font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-muted shadow-[inset_0_-1px_0_rgb(var(--ink)/0.1)]';

export default function ResultsDashboard({ suspiciousAccounts, fraudRings, selectedRingId, onRingClick }) {
  // Sorting State for Rings Table
  const [ringSortConfig, setRingSortConfig] = useState({ key: 'risk_score', direction: 'desc' });

  // Sorting State for Accounts Table
  const [accSortConfig, setAccSortConfig] = useState({ key: 'suspicion_score', direction: 'desc' });

  const ringColorMap = useMemo(() => generateRingColors(fraudRings), [fraudRings]);

  // Sorted Rings
  const sortedRings = useMemo(() => {
    let sortableRings = [...fraudRings];
    if (ringSortConfig !== null) {
      sortableRings.sort((a, b) => {
        let aVal = a[ringSortConfig.key];
        let bVal = b[ringSortConfig.key];

        if (ringSortConfig.key === 'member_accounts') {
            aVal = a.member_accounts.length;
            bVal = b.member_accounts.length;
        }

        if (aVal < bVal) return ringSortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return ringSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableRings;
  }, [fraudRings, ringSortConfig]);

  // Sorted Accounts
  const sortedAccounts = useMemo(() => {
     // 1. First always extract the true Top 10 Highest Suspicion Score accounts
     const top10 = [...suspiciousAccounts].sort((a, b) => b.suspicion_score - a.suspicion_score).slice(0, 10);

     // 2. Apply explicit user column sorting to ONLY those 10 accounts
     let sortableAccs = [...top10];
     if (accSortConfig !== null) {
         sortableAccs.sort((a,b) => {
             const aVal = a[accSortConfig.key];
             const bVal = b[accSortConfig.key];
             if (aVal < bVal) return accSortConfig.direction === 'asc' ? -1 : 1;
             if (aVal > bVal) return accSortConfig.direction === 'asc' ? 1 : -1;
             return 0;
         });
     }
     return sortableAccs;
  }, [suspiciousAccounts, accSortConfig]);

  const requestRingSort = (key) => {
    let direction = 'asc';
    if (ringSortConfig && ringSortConfig.key === key && ringSortConfig.direction === 'asc') direction = 'desc';
    setRingSortConfig({ key, direction });
  };

  const requestAccSort = (key) => {
      let direction = 'asc';
      if (accSortConfig && accSortConfig.key === key && accSortConfig.direction === 'asc') direction = 'desc';
      setAccSortConfig({ key, direction });
  };

  return (
    <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Fraud Rings Table */}
        <TablePanel title="Detected fraud rings" meta={`${fraudRings.length} found`}>
          {fraudRings.length === 0 ? (
            <div className="grid h-full place-items-center px-6 text-center">
              <div>
                <p className="font-medium">No rings in this ledger</p>
                <p className="mt-1 text-sm text-ink-muted">None of the four detectors matched. Accounts still appear in the graph above.</p>
              </div>
            </div>
          ) : (
            <table className="w-full whitespace-nowrap text-sm">
              <thead className={theadClass}>
                <tr>
                  <SortHeader label="Ring" sortKey="ring_id" config={ringSortConfig} onSort={requestRingSort} />
                  <SortHeader label="Pattern" sortKey="pattern_type" config={ringSortConfig} onSort={requestRingSort} />
                  <SortHeader label="Members" sortKey="member_accounts" config={ringSortConfig} onSort={requestRingSort} />
                  <SortHeader label="Risk" sortKey="risk_score" config={ringSortConfig} onSort={requestRingSort} />
                  <th scope="col" className="px-5 py-3 font-medium">Accounts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.07]">
                {sortedRings.map((ring) => {
                  const selected = selectedRingId === ring.ring_id;
                  return (
                    <tr
                      key={ring.ring_id}
                      onClick={() => onRingClick(selected ? null : ring.ring_id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onRingClick(selected ? null : ring.ring_id))}
                      tabIndex={0}
                      aria-selected={selected}
                      className={`group cursor-pointer transition-colors focus-visible:outline-none focus-visible:bg-cobalt/[0.06] ${selected ? 'bg-cobalt/[0.07]' : 'hover:bg-ink/[0.025]'}`}
                    >
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-2.5 font-mono text-[13px]">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ringColorMap.get(ring.ring_id) }} />
                          {ring.ring_id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft">{patternLabel(ring.pattern_type)}</td>
                      <td className="px-5 py-3.5 font-mono text-[13px]">{ring.member_accounts.length}</td>
                      <td className="px-5 py-3.5"><ScoreBadge score={ring.risk_score} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {ring.member_accounts.slice(0, 3).map(id => (
                            <span key={id} className="rounded bg-ink/[0.05] px-1.5 py-0.5 font-mono text-[10.5px] text-ink-soft">{id}</span>
                          ))}
                          {ring.member_accounts.length > 3 && (
                            <span className="font-mono text-[10.5px] text-ink-muted">+{ring.member_accounts.length - 3}</span>
                          )}
                          <ArrowUpRight className={`ml-1 h-4 w-4 transition-opacity ${selected ? 'text-cobalt opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </TablePanel>

        {/* Suspicious Accounts Table */}
        <TablePanel title="Top suspicious accounts" meta={`Top ${sortedAccounts.length} of ${suspiciousAccounts.length}`}>
          {sortedAccounts.length === 0 ? (
            <div className="grid h-full place-items-center px-6 text-center">
              <div>
                <p className="font-medium">No accounts flagged</p>
                <p className="mt-1 text-sm text-ink-muted">Every account in this ledger came back clean.</p>
              </div>
            </div>
          ) : (
            <table className="w-full whitespace-nowrap text-sm">
              <thead className={theadClass}>
                <tr>
                  <SortHeader label="Account" sortKey="account_id" config={accSortConfig} onSort={requestAccSort} />
                  <SortHeader label="Score" sortKey="suspicion_score" config={accSortConfig} onSort={requestAccSort} />
                  <th scope="col" className="px-5 py-3 font-medium">Patterns</th>
                  <SortHeader label="Ring" sortKey="ring_id" config={accSortConfig} onSort={requestAccSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.07]">
                {sortedAccounts.map((acc) => (
                  <tr key={acc.account_id} className="transition-colors hover:bg-ink/[0.025]">
                    <td className="px-5 py-3.5 font-mono text-[13px]">{acc.account_id}</td>
                    <td className="px-5 py-3.5"><ScoreBadge score={acc.suspicion_score} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {acc.detected_patterns.map(p => (
                          <span key={p} className="rounded bg-ink/[0.05] px-1.5 py-0.5 text-[12px] text-ink-soft">{patternLabel(p)}</span>
                        ))}
                        {acc.detected_patterns.length === 0 && <span className="text-xs text-ink-muted">None</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {acc.ring_id && acc.ring_id !== "N/A" ? (
                        <button
                          type="button"
                          onClick={() => onRingClick(acc.ring_id)}
                          className="link-underline font-mono text-[12.5px] text-cobalt"
                        >
                          {acc.ring_id}
                        </button>
                      ) : (
                        <span className="text-xs text-ink-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TablePanel>
      </div>
  );
}
