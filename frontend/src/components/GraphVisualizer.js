"use client";

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';

// Dynamically import specific ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false
});

export default function GraphVisualizer({ data, suspiciousAccounts, fraudRings }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Transform backend data to graph format
    // data.fraud_rings contains rings. data.suspicious_accounts contains scores.
    // data from API is passed here? No, 'data' prop is probably the full JSON response? 
    // Let's assume 'data' is the full JSON response or we pass nodes/links explicitly.
    
    // Actually, we need the raw transactions to build the graph edges for visualization, 
    // OR the backend should return the graph structure.
    // The current backend API returns `suspicious_accounts` and `fraud_rings`. 
    // It DOES NOT return the full graph (all nodes/edges).
    // The prompt says: "Interactive Graph Visualization... All account nodes... Directed edges".
    
    // WE NEED TO UPDATE BACKEND TO RETURN GRAPH DATA OR WE NEED TO PARSE CSV ON CLIENT TOO?
    // "Process transaction data and exposes money muling networks through graph analysis".
    // If we only send CSV to backend, backend does analysis. 
    // Output 1 says: "Interactive Graph Visualization... All account nodes".
    
    // CRITICAL: The backend JSON response specified in the prompt DOES NOT include the full graph edges.
    // "REQUIRED OUTPUTS ... 2. Downloadable JSON Output File ... { suspicious_accounts: [...], fraud_rings: [...] }"
    // But Output 1 is "Interactive Graph Visualization".
    
    // Strategy: We can parse the CSV on the client side just for visualization, 
    // OR we can add a 'graph' field to the API response which contains the edges/nodes.
    // Since the prompt requires specific JSON output for the "Download", 
    // we can add an EXTRA field to the API response that is used for UI but excluded from the downloaded file.
    
    // I will Assume the parent component passes the graph data (nodes/links) derived from the CSV 
    // or we update the backend to send it.
    // Parsing CSV on client is faster for "Local Preview" feel and saves bandwidth if we already have the file.
    // BUT the backend does the detection. We need to visualize the backend's FINDINGS on top of the graph.
    
    // Let's check the props. I'll assume `graphNodes` and `graphLinks` are passed, 
    // or I'll parse a `graphData` prop.
    // For now, I will use a placeholder and expect the parent to pass { nodes: [], links: [] }.
    
    if (data) {
        setGraphData(data);
    }
    
  }, [data]);

  // Determine suspicious nodes for highlighting
  const suspiciousIds = useMemo(() => {
    return new Set(suspiciousAccounts.map(a => a.account_id));
  }, [suspiciousAccounts]);

  const ringMembers = useMemo(() => {
      const members = new Set();
      fraudRings.forEach(ring => {
          ring.member_accounts.forEach(m => members.add(m));
      });
      return members;
  }, [fraudRings]);

  return (
    <div className="border rounded-xl overflow-hidden bg-slate-900 border-slate-700 shadow-2xl relative" style={{ height: '600px' }}>
      <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-white text-xs">
         <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Fraud Ring Member</div>
         <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Suspicious Account</div>
      </div>
      
      <ForceGraph2D
        graphData={graphData}
        width={containerDimensions.width}
        height={600}
        backgroundColor="#0f172a" // slate-900
        nodeLabel="id"
        nodeColor={node => {
            if (ringMembers.has(node.id)) return '#ef4444'; // red-500
            if (suspiciousIds.has(node.id)) return '#f97316'; // orange-500
            return '#1e293b'; // slate-800 (default)
        }}
        nodeVal={node => {
            if (ringMembers.has(node.id)) return 10;
            if (suspiciousIds.has(node.id)) return 5;
            return 2;
        }}
        linkColor={() => '#334155'} // slate-700
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        connectionMode="strict" // Directed
        onNodeClick={node => {
            // Handle node click (e.g., show details)
            console.log("Clicked", node);
        }}
      />
    </div>
  );
}
