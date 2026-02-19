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
     let sortableAccs = [...suspiciousAccounts];
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
    <div className="w-full space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex justify-between items-end">
          <p className="text-zinc-400 text-sm max-w-sm">
             Analysis complete. Review the detected fraud rings and high-risk accounts below.
          </p>
          <button 
            onClick={onDownload}
            className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 hover:border-[#df7afe]/50 transition-all shadow-lg min-w-[200px]"
          >
             <FileJson className="w-4 h-4 text-[#df7afe] group-hover:scale-110 transition-transform" />
             <span className="font-semibold text-sm">Download JSON Report</span>
             <Download className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors ml-1" />
          </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
        {[
            { label: 'Analyzed', value: summary.total_accounts_analyzed.toLocaleString(), color: 'zinc', highlight: '' },
            { label: 'Fraud Rings', value: summary.fraud_rings_detected, color: 'red', highlight: 'text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-500/5 border-red-500/20' },
            { label: 'High Risk', value: summary.suspicious_accounts_flagged, color: 'orange', highlight: 'text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)] bg-orange-500/5 border-orange-500/20' },
            { label: 'Time', value: `${summary.processing_time_seconds}s`, color: 'teal', highlight: 'text-teal-400' }
        ].map((stat, i) => (
            <div key={i} className={`p-4 sm:p-5 min-h-[100px] rounded-2xl border border-white/5 bg-[#0a0a0a]/60 backdrop-blur-md relative overflow-hidden flex flex-col justify-center ${stat.highlight || ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-1 sm:mb-2">{stat.label}</p>
                <p className={`text-2xl sm:text-3xl font-bold ${stat.color === 'zinc' ? 'text-white' : ''}`}>{stat.value}</p>
            </div>
        ))}
      </div>

      {/* Fraud Rings Table */}
      <div className="bg-[#0a0a0a]/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent flex justify-between items-center">
           <h3 className="font-bold text-lg text-white flex items-center gap-2">
               <div className="w-1.5 h-5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>
               Detected Fraud Rings
           </h3>
           <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-full items-center gap-1.5 hidden md:flex">
               <AlertCircle className="w-3.5 h-3.5" /> High Priority
           </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/20 text-zinc-500 uppercase text-xs tracking-wider">
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
       <div className="bg-[#0a0a0a]/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
           <h3 className="font-bold text-lg text-white flex items-center gap-2">
               <div className="w-1.5 h-5 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></div>
               Top Suspicious Accounts
           </h3>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/20 text-zinc-500 uppercase text-xs tracking-wider">
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
              {sortedAccounts.slice(0, 10).map((acc) => (
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
