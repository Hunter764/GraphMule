"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import GraphVisualizer from '../components/GraphVisualizer';
import ResultsDashboard from '../components/ResultsDashboard';
import LandingPage from '../components/LandingPage';
import Background3D from '../components/Background3D'; // New 3D Background
import { UploadCloud, Play, AlertTriangle, CheckCircle, ArrowLeft, Share2, X, Activity, ShieldAlert, Network } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState('landing'); // 'landing' | 'app'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [error, setError] = useState(null);
  
  // Dashboard Interaction State
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRingId, setSelectedRingId] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const parseCSV = async (file) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
              const text = event.target.result;
              const lines = text.split('\n');
              const headers = lines[0].split(',').map(h => h.trim());
              
              const nodes = new Set();
              const links = [];
              
              // Simple CSV parser assuming standard format
              // sender_id, receiver_id, amount...
              const senderIdx = headers.indexOf('sender_id');
              const receiverIdx = headers.indexOf('receiver_id');
              
              if (senderIdx === -1 || receiverIdx === -1) {
                  reject("Invalid CSV format: Missing sender_id or receiver_id");
                  return;
              }

              for (let i = 1; i < lines.length; i++) {
                  if (!lines[i].trim()) continue;
                  const row = lines[i].split(','); // Naive split, assumes no commas in fields
                  const source = row[senderIdx]?.trim();
                  const target = row[receiverIdx]?.trim();
                  
                  if (source && target) {
                      nodes.add(source);
                      nodes.add(target);
                      links.push({ source, target });
                  }
              }
              
              const graphNodes = Array.from(nodes).map(id => ({ id }));
              resolve({ nodes: graphNodes, links });
          };
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
      });
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    // Reset state
    setSelectedNode(null);
    setSelectedRingId(null);
    setResults(null);

    try {
      // 1. Parse CSV locally for Graph Visualization
      const localGraphData = await parseCSV(file);
      setGraphData(localGraphData);

      // 2. Send to Backend for Analysis
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResults(data);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJSON = () => {
      if (!results) return;
      const jsonString = JSON.stringify({
          suspicious_accounts: results.suspicious_accounts,
          fraud_rings: results.fraud_rings,
          summary: results.summary
      }, null, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fraud_report.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Render Landing Page
  if (view === 'landing') {
    return <LandingPage onStart={() => setView('app')} />;
  }

  // Render Main App
  return (
    <main className="min-h-screen relative text-white font-sans selection:bg-[#814ac8]/30 selection:text-[#df7afe] overflow-hidden">
      
      {/* 3D Background */}
      <Background3D />
      
      <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10 space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setView('landing')}
                className="group p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 backdrop-blur-md"
                title="Back to Home"
             >
                <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
             </button>
             <div className="flex items-center gap-3">
                 <div className="relative w-10 h-10 flex items-center justify-center hidden md:flex">
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#814ac8] to-[#df7afe] rounded-xl blur opacity-20" />
                     <div className="relative w-full h-full bg-[#0d0d0d]/80 border border-white/10 rounded-xl flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-[#df7afe]" />
                     </div>
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        GraphMule <span className="text-[#df7afe] text-lg font-normal opacity-70">App</span>
                    </h1>
                 </div>
             </div>
          </div>
          <div className="flex gap-4">
             {/* RIFT Hackathon Badge */}
             <div className="px-3 py-1 bg-[#814ac8]/10 border border-[#814ac8]/20 text-[#df7afe] rounded-full text-xs font-mono font-semibold tracking-wider backdrop-blur-md">
                RIFT 2026
             </div>
          </div>
        </header>

        {/* Upload Container (Collapses slightly when results exist) */}
        <div className={`relative group transition-all duration-700 ${results ? 'max-w-4xl mx-auto' : ''}`}>
            {/* ... Background glow ... */}
            <div className={`absolute inset-0 bg-gradient-to-b from-[#814ac8]/20 to-transparent rounded-3xl blur-xl opacity-0 transition-opacity duration-1000 ${results ? 'opacity-10' : 'group-hover:opacity-50'}`} />
            
            <section className={`relative bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:border-[#814ac8]/30 ${results ? 'p-6' : 'p-8 md:p-12'}`}>
               
               {/* Inner Highlight */}
               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

               {!results && (
                   <div className="text-center mb-10">
                       <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-3">
                           Upload Transaction Data
                       </h2>
                       <p className="text-zinc-400 max-w-lg mx-auto">
                           Upload your transaction CSV to detect cycles, smurfing, and money laundering patterns in real-time.
                       </p>
                   </div>
               )}

               <div className={`flex flex-col md:flex-row items-stretch justify-center mx-auto ${results ? 'gap-4 max-w-2xl' : 'gap-6 max-w-4xl'}`}>
                  <div className="flex-1 w-full">
                      <label 
                        htmlFor="file-upload" 
                        className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group/drop
                            ${file ? 'border-[#df7afe]/50 bg-[#df7afe]/5' : 'border-zinc-700 hover:border-[#814ac8]/50 hover:bg-[#814ac8]/5 bg-black/20'}
                            ${results ? 'h-20' : 'h-40'}
                        `}
                      >
                          <div className={`flex items-center justify-center ${results ? 'flex-row gap-4' : 'flex-col pt-5 pb-6'}`}>
                              {file ? (
                                  <>
                                    <div className={`bg-[#df7afe]/10 rounded-full flex items-center justify-center text-[#df7afe] ${results ? 'w-8 h-8' : 'w-12 h-12 mb-3'}`}>
                                        <CheckCircle className={results ? 'w-4 h-4' : 'w-6 h-6'} />
                                    </div>
                                    <div className={results ? 'text-left' : 'text-center'}>
                                        <p className="text-white font-medium text-sm md:text-base truncate max-w-[200px]">{file.name}</p>
                                        {!results && <p className="text-xs text-[#df7afe] mt-1">Ready for analysis</p>}
                                    </div>
                                  </>
                              ) : (
                                  <>
                                    <div className={`bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-400 group-hover/drop:text-[#df7afe] group-hover/drop:scale-110 transition-all ${results ? 'w-8 h-8' : 'w-12 h-12 mb-3'}`}>
                                        <UploadCloud className={results ? 'w-4 h-4' : 'w-6 h-6'} />
                                    </div>
                                    <div className={results ? 'text-left' : 'text-center'}>
                                        <p className="text-sm text-zinc-400 font-medium group-hover/drop:text-zinc-200">Click to upload CSV</p>
                                        {!results && <p className="text-xs text-zinc-500 mt-1">or drag and drop</p>}
                                    </div>
                                  </>
                              )}
                          </div>
                          <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                      </label>
                  </div>
                  
                  <button 
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    className={`flex items-center justify-center gap-2 rounded-2xl font-bold shadow-lg transition-all duration-300
                        ${results ? 'px-6 py-2 text-sm min-w-[140px]' : 'px-8 py-4 text-lg min-w-[200px]'}
                        ${!file || loading 
                            ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-white/5' 
                            : 'bg-[#814ac8] hover:bg-[#6d28d9] text-white shadow-[#814ac8]/25 hover:shadow-[#814ac8]/40 hover:-translate-y-1 border border-[#814ac8]'}
                    `}
                  >
                     {loading ? (
                         <div className="flex items-center gap-2">
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             <span>{results ? 'Scanning' : 'Scanning...'}</span>
                         </div>
                     ) : (
                         <>
                             <Play className={results ? 'w-4 h-4 fill-white' : 'w-5 h-5 fill-white'} />
                             {results ? 'Re-Analyze' : 'Analyze'} 
                         </>
                     )}
                  </button>
               </div>
               
               {error && (
                   <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl flex items-center gap-3 max-w-2xl mx-auto backdrop-blur-md">
                       <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                       <span className="text-sm">{error}</span>
                   </div>
               )}
            </section>
        </div>

        {/* Results Section */}
        {results && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Visualizer & Side Panel (Takes up 2 cols on large screens) */}
                <div className="lg:col-span-2 space-y-4 relative flex flex-col">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <div className="w-2 h-6 bg-[#df7afe] rounded-full shadow-[0_0_8px_#df7afe]"></div>
                            Network Visualization
                        </h2>
                        {selectedRingId && (
                            <button 
                                onClick={() => setSelectedRingId(null)}
                                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors border border-zinc-700"
                            >
                                <X className="w-3 h-3" /> Clear Ring Selection
                            </button>
                        )}
                    </div>
                    
                    <div className="bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex-1 min-h-[500px] lg:min-h-[600px] flex">
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
                        
                        <div className="flex-1 relative">
                            <GraphVisualizer 
                                data={graphData} 
                                suspiciousAccounts={results.suspicious_accounts} 
                                fraudRings={results.fraud_rings} 
                                selectedRingId={selectedRingId}
                                onNodeClick={setSelectedNode}
                            />
                        </div>

                        {/* Slide-out Node Details Panel */}
                        <div className={`absolute top-0 right-0 bottom-0 w-80 bg-[#121212]/95 backdrop-blur-3xl border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-20 flex flex-col ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
                            {selectedNode && (
                                <>
                                    <div className="p-5 border-b border-white/10 flex justify-between items-start bg-gradient-to-b from-white/[0.05] to-transparent">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-[#df7afe]" />
                                                Account Details
                                            </h3>
                                            <p className="font-mono text-zinc-400 text-sm truncate max-w-[200px]">{selectedNode.account_id}</p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedNode(null)}
                                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="p-5 flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                                        
                                        {/* Score Ring */}
                                        <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-2xl border border-white/5">
                                            <div className="relative w-24 h-24 mb-3">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                    {/* Background Circle */}
                                                    <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                                    {/* Progress Circle */}
                                                    <path 
                                                        className={selectedNode.suspicion_score > 80 ? 'text-red-500' : selectedNode.suspicion_score > 50 ? 'text-orange-500' : 'text-teal-500'} 
                                                        strokeDasharray={`${selectedNode.suspicion_score}, 100`} 
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" 
                                                        style={{ transition: 'stroke-dasharray 1s ease-out' }}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-bold">{Math.round(selectedNode.suspicion_score)}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                                                <ShieldAlert className="w-3.5 h-3.5" />
                                                Suspicion Score
                                            </span>
                                        </div>

                                        {/* Risk Level Badge */}
                                        <div className="flex justify-center">
                                            {selectedNode.suspicion_score > 80 ? (
                                                <span className="px-4 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Critical Risk
                                                </span>
                                            ) : selectedNode.suspicion_score > 50 ? (
                                                <span className="px-4 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm font-semibold flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span> Medium Risk
                                                </span>
                                            ) : (
                                                <span className="px-4 py-1.5 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full text-sm font-semibold flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-teal-500"></span> Low Risk
                                                </span>
                                            )}
                                        </div>

                                        {/* Details List */}
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            {selectedNode.ring_id && selectedNode.ring_id !== "N/A" && (
                                                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                                                    <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5">
                                                        <Network className="w-3.5 h-3.5" /> Associated Ring
                                                    </p>
                                                    <p className="font-mono text-red-400 font-medium">
                                                        {selectedNode.ring_id}
                                                    </p>
                                                    <button 
                                                        onClick={() => setSelectedRingId(selectedNode.ring_id)}
                                                        className="mt-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300 px-3 py-1.5 rounded-lg transition-colors w-full"
                                                    >
                                                        Highlight Ring
                                                    </button>
                                                </div>
                                            )}
                                            
                                            <div>
                                                <p className="text-xs text-zinc-500 mb-2">Detected Patterns</p>
                                                {selectedNode.detected_patterns && selectedNode.detected_patterns.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedNode.detected_patterns.map((p, i) => (
                                                            <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-zinc-300 font-medium capitalize">
                                                                {p.replace(/_/g, ' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-zinc-500 italic">No specific patterns flagged.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard / Stats (Takes up 1 col) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <div className="w-2 h-6 bg-[#814ac8] rounded-full shadow-[0_0_8px_#814ac8]"></div>
                        Risk Assessment
                    </h2>
                    <ResultsDashboard 
                        summary={results.summary}
                        suspiciousAccounts={results.suspicious_accounts}
                        fraudRings={results.fraud_rings}
                        onDownload={handleDownloadJSON}
                        selectedRingId={selectedRingId}
                        onRingClick={setSelectedRingId}
                    />
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
