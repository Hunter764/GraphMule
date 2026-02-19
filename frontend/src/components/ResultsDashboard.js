export default function ResultsDashboard({ summary, suspiciousAccounts, fraudRings, onDownload }) {
  return (
    <div className="w-full space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-zinc-500">Analyzed Accounts</p>
          <p className="text-2xl font-bold">{summary.total_accounts_analyzed.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-zinc-500">Fraud Rings</p>
          <p className="text-2xl font-bold text-red-500">{summary.fraud_rings_detected}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-zinc-500">High Risk Accounts</p>
          <p className="text-2xl font-bold text-orange-500">{summary.suspicious_accounts_flagged}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-zinc-500">Processing Time</p>
          <p className="text-2xl font-bold text-blue-500">{summary.processing_time_seconds}s</p>
        </div>
      </div>

      <div className="flex justify-end">
          <button 
            onClick={onDownload}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
             Download Full JSON Report
          </button>
      </div>

      {/* Fraud Rings Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
           <h3 className="font-semibold text-lg">Detected Fraud Rings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 uppercase">
              <tr>
                <th className="px-6 py-3">Ring ID</th>
                <th className="px-6 py-3">Pattern Type</th>
                <th className="px-6 py-3">Members</th>
                <th className="px-6 py-3">Risk Score</th>
                <th className="px-6 py-3">Accounts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {fraudRings.map((ring) => (
                <tr key={ring.ring_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-blue-500">{ring.ring_id}</td>
                  <td className="px-6 py-4">{ring.pattern_type}</td>
                  <td className="px-6 py-4 text-center">{ring.member_accounts.length}</td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        {ring.risk_score}
                     </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500 max-w-xs truncate">
                    {ring.member_accounts.join(', ')}
                  </td>
                </tr>
              ))}
              {fraudRings.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No fraud rings detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Suspicious Accounts Table (Top 10) */}
       <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
           <h3 className="font-semibold text-lg">Top Suspicious Accounts</h3>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 uppercase">
              <tr>
                 <th className="px-6 py-3">Account ID</th>
                 <th className="px-6 py-3">Score</th>
                 <th className="px-6 py-3">Patterns</th>
              </tr>
            </thead>
             <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {suspiciousAccounts.slice(0, 10).map((acc) => (
                <tr key={acc.account_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{acc.account_id}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        acc.suspicion_score > 80 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        acc.suspicion_score > 50 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-yellow-100 text-yellow-800'
                     }`}>
                        {acc.suspicion_score}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                     <div className="flex gap-2 flex-wrap">
                     {acc.detected_patterns.map(p => (
                         <span key={p} className="bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-600">
                             {p}
                         </span>
                     ))}
                     </div>
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
