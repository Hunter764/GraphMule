"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import GraphVisualizer from '../components/GraphVisualizer';
import ResultsDashboard from '../components/ResultsDashboard';
import LandingPage from '../components/LandingPage';
import Background3D from '../components/Background3D'; // New 3D Background
import { UploadCloud, Play, AlertTriangle, CheckCircle, ArrowLeft, Share2 } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState('landing'); // 'landing' | 'app'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [error, setError] = useState(null);

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
      const jsonString = JSON.stringify(results, null, 2);
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

        {/* Upload Container */}
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#814ac8]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />
            <section className="relative bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden transition-all duration-500 hover:border-[#814ac8]/30">
               
               {/* Inner Highlight */}
               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

               <div className="text-center mb-10">
                   <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-3">
                       Upload Transaction Data
                   </h2>
                   <p className="text-zinc-400 max-w-lg mx-auto">
                       Upload your transaction CSV to detect cycles, smurfing, and money laundering patterns in real-time.
                   </p>
               </div>

               <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center max-w-4xl mx-auto">
                  <div className="flex-1 w-full">
                      <label 
                        htmlFor="file-upload" 
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group/drop
                            ${file 
                                ? 'border-[#df7afe]/50 bg-[#df7afe]/5' 
                                : 'border-zinc-700 hover:border-[#814ac8]/50 hover:bg-[#814ac8]/5 bg-black/20'}
                        `}
                      >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {file ? (
                                  <>
                                    <div className="w-12 h-12 bg-[#df7afe]/10 rounded-full flex items-center justify-center mb-3 text-[#df7afe]">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <p className="text-white font-medium">{file.name}</p>
                                    <p className="text-xs text-[#df7afe] mt-1">Ready for analysis</p>
                                  </>
                              ) : (
                                  <>
                                    <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center mb-3 text-zinc-400 group-hover/drop:text-[#df7afe] group-hover/drop:scale-110 transition-all">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm text-zinc-400 font-medium group-hover/drop:text-zinc-200">
                                        Click to upload CSV
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-1">or drag and drop</p>
                                  </>
                              )}
                          </div>
                          <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                      </label>
                  </div>
                  
                  <button 
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 min-w-[200px]
                        ${!file || loading 
                            ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-white/5' 
                            : 'bg-[#814ac8] hover:bg-[#6d28d9] text-white shadow-[#814ac8]/25 hover:shadow-[#814ac8]/40 hover:-translate-y-1 border border-[#814ac8]'}
                    `}
                  >
                     {loading ? (
                         <div className="flex items-center gap-2">
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             <span>Scanning...</span>
                         </div>
                     ) : (
                         <>
                             <Play className="w-5 h-5 fill-white" />
                             Analyze 
                         </>
                     )}
                  </button>
               </div>
               
               {error && (
                   <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl flex items-center gap-3 max-w-4xl mx-auto backdrop-blur-md">
                       <AlertTriangle className="w-5 h-5 text-red-400" />
                       <span className="text-sm">{error}</span>
                   </div>
               )}
            </section>
        </div>

        {/* Results Section */}
        {results && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Visualizer (Takes up 2 cols on large screens) */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <div className="w-2 h-6 bg-[#df7afe] rounded-full shadow-[0_0_8px_#df7afe]"></div>
                        Network Visualization
                    </h2>
                    <div className="bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-[600px] shadow-2xl relative">
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
                        <GraphVisualizer 
                            data={graphData} 
                            suspiciousAccounts={results.suspicious_accounts} 
                            fraudRings={results.fraud_rings} 
                        />
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
                    />
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
