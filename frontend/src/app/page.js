"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import GraphVisualizer from '../components/GraphVisualizer';
import ResultsDashboard from '../components/ResultsDashboard';
import LandingPage from '../components/LandingPage';
import { UploadCloud, Play, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

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
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setView('landing')}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                title="Back to Home"
             >
                <ArrowLeft className="w-5 h-5" />
             </button>
             <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    GraphMule
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">Financial Crime Detection Engine</p>
             </div>
          </div>
          <div className="flex gap-4">
             {/* RIFT Hackathon Badge or similar */}
             <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-xs font-mono border border-zinc-200 dark:border-zinc-800">
                RIFT 2026
             </div>
          </div>
        </header>

        {/* Upload Section */}
        <section className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
           <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex-1 w-full">
                  <label 
                    htmlFor="file-upload" 
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                        ${file ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-zinc-300 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'}
                    `}
                  >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {file ? (
                              <>
                                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                                <p className="text-sm text-green-600 font-medium">{file.name}</p>
                              </>
                          ) : (
                              <>
                                <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                                <p className="text-sm text-zinc-500"><span className="font-semibold">Click to upload</span> or drag and drop CSV</p>
                              </>
                          )}
                      </div>
                      <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                  </label>
              </div>
              
              <button 
                onClick={handleAnalyze}
                disabled={!file || loading}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                    ${!file || loading 
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5'}
                `}
              >
                 {loading ? (
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 ) : (
                     <Play className="w-5 h-5" fill="currentColor" />
                 )}
                 {loading ? 'Processing...' : 'Analyze Network'}
              </button>
           </div>
           {error && (
               <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5" />
                   {error}
               </div>
           )}
        </section>

        {/* Results Section */}
        {results && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Visualizer (Takes up 2 cols on large screens) */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                        Network Visualization
                    </h2>
                    <GraphVisualizer 
                        data={graphData} 
                        suspiciousAccounts={results.suspicious_accounts} 
                        fraudRings={results.fraud_rings} 
                    />
                </div>

                {/* Dashboard / Stats (Takes up 1 col) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
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
