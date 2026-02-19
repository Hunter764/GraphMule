import { useState, useMemo } from 'react';
import { Download, ArrowUpDown, ChevronDown, ChevronUp, AlertCircle, FileJson, ArrowRightCircle } from 'lucide-react';

export default function ResultsDashboard({ summary, suspiciousAccounts, fraudRings, onDownload, selectedRingId, onRingClick }) {
  // Sorting State for Rings Table
  const [ringSortConfig, setRingSortConfig] = useState({ key: 'risk_score', direction: 'desc' });
  
  // Sorting State for Accounts Table
  const [accSortConfig, setAccSortConfig] = useState({ key: 'suspicion_score', direction: 'desc' });

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

  const getSortIcon = (config, key) => {
      if (!config || config.key !== key) return <ArrowUpDown className="w-3.5 h-3.5 text-zinc-600 ml-1" />;
      if (config.direction === 'asc') return <ChevronUp className="w-3.5 h-3.5 text-white ml-1" />;
      return <ChevronDown className="w-3.5 h-3.5 text-white ml-1" />;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {/* Fraud Rings Table */}
        <div className="bg-[#13141b] rounded-[1.5rem] border border-[#27272a] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] relative flex flex-col h-[450px]">
          <div className="p-4 md:p-5 border-b border-[#27272a] bg-gradient-to-b from-white/[0.02] to-transparent flex justify-between items-center shrink-0">
             <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
                 <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                 Detected Fraud Rings
             </h3>
             <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-full items-center gap-1.5 hidden md:flex shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                 <AlertCircle className="w-3.5 h-3.5" /> High Priority
             </span>
          </div>
          <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700/50 scrollbar-track-transparent">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#18181f] text-zinc-400 font-semibold uppercase text-[11px] tracking-wider sticky top-0 z-10 border-b border-[#27272a]">
                <tr>
                  <th onClick={() => requestRingSort('ring_id')} className="px-6 py-4 cursor-pointer hover:text-zinc-300 transition-colors group">
                      <div className="flex items-center">Ring ID {getSortIcon(ringSortConfig, 'ring_id')}</div>
                  </th>
                  <th onClick={() => requestRingSort('pattern_type')} className="px-6 py-4 cursor-pointer hover:text-zinc-300 transition-colors group">
                      <div className="flex items-center">Pattern Type {getSortIcon(ringSortConfig, 'pattern_type')}</div>
                  </th>
                  <th onClick={() => requestRingSort('member_accounts')} className="px-6 py-4 cursor-pointer hover:text-zinc-300 transition-colors group">
                      <div className="flex items-center">Members {getSortIcon(ringSortConfig, 'member_accounts')}</div>
                  </th>
                  <th onClick={() => requestRingSort('risk_score')} className="px-6 py-4 cursor-pointer hover:text-zinc-300 transition-colors group">
                      <div className="flex items-center">Risk Score {getSortIcon(ringSortConfig, 'risk_score')}</div>
                  </th>
                  <th className="px-6 py-4">Associated Accounts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {sortedRings.map((ring) => (
                  <tr 
                      key={ring.ring_id} 
                      onClick={() => onRingClick(ring.ring_id)}
                      className={`transition-all duration-200 cursor-pointer group hover:bg-white/[0.03] ${selectedRingId === ring.ring_id ? 'bg-[#df7afe]/5 border-l-2 border-[#df7afe]' : 'border-l-2 border-transparent'}`}
                  >
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className={`font-mono font-medium ${selectedRingId === ring.ring_id ? 'text-[#df7afe]' : 'text-zinc-300 group-hover:text-white'}`}>
                                {ring.ring_id}
                            </span>
                            <ArrowRightCircle className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${selectedRingId === ring.ring_id ? 'text-[#df7afe] opacity-100' : 'text-zinc-500'}`} />
                        </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{ring.pattern_type}</td>
                    <td className="px-6 py-4 font-mono">{ring.member_accounts.length}</td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center rounded-md bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs font-bold text-red-400">
                          {Math.round(ring.risk_score)}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[250px] md:max-w-sm truncate">
                            {ring.member_accounts.slice(0, 3).map(id => (
                                <span key={id} className="font-mono text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-400">
                                    {id}
                                </span>
                            ))}
                            {ring.member_accounts.length > 3 && (
                                <span className="font-mono text-[10px] text-zinc-500 px-1 py-0.5">+{ring.member_accounts.length - 3} more</span>
                            )}
                        </div>
                    </td>
                  </tr>
                ))}
                {fraudRings.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 bg-white/[0.01]">
                          No fraud rings detected in this dataset.
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Suspicious Accounts Table */}
         <div className="bg-[#13141b] rounded-[1.5rem] border border-[#27272a] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] relative flex flex-col h-[450px]">
          <div className="p-4 md:p-5 border-b border-[#27272a] bg-gradient-to-b from-white/[0.02] to-transparent shrink-0">
             <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
                 <div className="w-1 h-6 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                 Top 10 Suspicious Accounts
             </h3>
          </div>
          <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700/50 scrollbar-track-transparent">
             <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#18181f] text-zinc-400 font-semibold uppercase text-[11px] tracking-wider sticky top-0 z-10 border-b border-[#27272a]">
                <tr>
                   <th onClick={() => requestAccSort('account_id')} className="px-6 py-4 cursor-pointer hover:text-zinc-300 transition-colors group">
                       <div className="flex items-center">Account ID {getSortIcon(accSortConfig, 'account_id')}</div>
                   </th>
                   <th onClick={() => requestAccSort('suspicion_score')} className="px-6 py-4 cursor-pointer hover:text-zinc-300 transition-colors group">
                       <div className="flex items-center">Score {getSortIcon(accSortConfig, 'suspicion_score')}</div>
                   </th>
                   <th className="px-6 py-4">Detected Patterns</th>
                   <th onClick={() => requestAccSort('ring_id')} className="px-6 py-4 cursor-pointer hover:text-zinc-300 transition-colors group">
                       <div className="flex items-center">Ring {getSortIcon(accSortConfig, 'ring_id')}</div>
                   </th>
                </tr>
              </thead>
               <tbody className="divide-y divide-white/5 text-zinc-300">
                {sortedAccounts.map((acc) => (
                  <tr key={acc.account_id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{acc.account_id}</td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border ${
                          acc.suspicion_score > 80 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          acc.suspicion_score > 50 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                          'bg-teal-500/10 border-teal-500/20 text-teal-400'
                       }`}>
                          {Math.round(acc.suspicion_score)}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex gap-1.5 flex-wrap">
                       {acc.detected_patterns.map(p => (
                           <span key={p} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[11px] font-medium text-zinc-300">
                               {p.replace(/_/g, ' ')}
                           </span>
                       ))}
                       {acc.detected_patterns.length === 0 && (
                           <span className="text-zinc-600 italic text-xs">None</span>
                       )}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                        {acc.ring_id !== "N/A" ? (
                            <button 
                               onClick={() => onRingClick(acc.ring_id)}
                               className="font-mono text-xs text-[#df7afe] hover:text-white hover:underline transition-all"
                            >
                                {acc.ring_id}
                            </button>
                        ) : (
                            <span className="text-zinc-600 text-xs">-</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        </div>
      </div>
  );
}
