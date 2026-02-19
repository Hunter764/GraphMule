"use client";

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';

// Dynamically import specific ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false
});

// Helper for generating distinct colors for rings
const generateRingColors = (rings) => {
    const colors = [
        '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', 
        '#10b981', '#f59e0b', '#06b6d4', '#84cc16'
    ];
    const map = new Map();
    rings.forEach((r, i) => {
        map.set(r.ring_id, colors[i % colors.length]);
    });
    return map;
};

export default function GraphVisualizer({ data, suspiciousAccounts, fraudRings, selectedRingId, onNodeClick }) {
  const fgRef = useRef();
  
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [hoverNode, setHoverNode] = useState(null);
  
  // Custom container dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (data) {
        setGraphData(data);
    }
  }, [data]);

  // Center the graph when data loads
  useEffect(() => {
     if (fgRef.current && graphData.nodes.length > 0) {
        setTimeout(() => {
           fgRef.current.zoomToFit(400, 50);
        }, 300);
     }
  }, [graphData]);

  // Fast lookups
  const suspiciousMap = useMemo(() => {
    const map = new Map();
    suspiciousAccounts.forEach(a => map.set(a.account_id, a));
    return map;
  }, [suspiciousAccounts]);

  const ringMap = useMemo(() => {
      const map = new Map();
      fraudRings.forEach(ring => {
          map.set(ring.ring_id, ring);
      });
      return map;
  }, [fraudRings]);

  const ringMembers = useMemo(() => {
      const members = new Map();
      fraudRings.forEach(ring => {
          ring.member_accounts.forEach(m => members.set(m, ring.ring_id));
      });
      return members;
  }, [fraudRings]);
  
  const ringColorMap = useMemo(() => generateRingColors(fraudRings), [fraudRings]);

  // Determine which nodes belong to the currently selected ring
  const selectedRingMembers = useMemo(() => {
      if (!selectedRingId || !ringMap.has(selectedRingId)) return null;
      return new Set(ringMap.get(selectedRingId).member_accounts);
  }, [selectedRingId, ringMap]);

  // Node Label for Hover
  const getNodeLabel = useCallback((node) => {
      const acc = suspiciousMap.get(node.id);
      if (acc) {
          const patterns = acc.detected_patterns.length > 0 ? acc.detected_patterns.join(', ') : 'None';
          return `
            <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); font-family: sans-serif; font-size: 12px; color: white;">
                <strong>${node.id}</strong><br/>
                Score: ${Math.round(acc.suspicion_score)}<br/>
                Patterns: <span style="color:#df7afe">${patterns}</span>
            </div>
          `;
      }
      return `
        <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); font-family: sans-serif; font-size: 12px; color: white;">
            <strong>${node.id}</strong><br/>
            Safe Account
        </div>
      `;
  }, [suspiciousMap]);

  // Custom Node Styling
  const paintNode = useCallback((node, ctx, globalScale) => {
    const isSuspicious = suspiciousMap.has(node.id);
    const ringId = ringMembers.get(node.id);
    const isRingMember = !!ringId;
    const isHovered = node === hoverNode;
    const isSelectedRing = selectedRingMembers ? selectedRingMembers.has(node.id) : false;
    const dimNode = selectedRingMembers && !isSelectedRing;

    // Node size
    let r = 3;
    if (isSuspicious) r = 4;
    if (isRingMember) r = 6;
    if (isHovered) r += 2;

    // Base Colors
    let color = '#2dd4bf'; // Teal-400 for safe
    if (isSuspicious) color = '#f97316'; // Orange-500
    if (isRingMember) color = ringColorMap.get(ringId); // Unique ring color

    // Focus mode modifications
    if (dimNode) {
        ctx.fillStyle = 'rgba(71, 85, 105, 0.3)'; // Dimmed Slate
        ctx.beginPath(); ctx.arc(node.x, node.y, 2, 0, 2 * Math.PI, false); ctx.fill();
        return;
    }

    // Glow Effect
    if (isRingMember || isSuspicious || isHovered) {
        ctx.shadowBlur = isHovered ? 15 : 10;
        ctx.shadowColor = color;
    } else {
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
    ctx.fill();

    // Border for highly suspicious or hovered
    if (isHovered || isRingMember) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isHovered ? 1.5 / globalScale : 0.5 / globalScale;
        ctx.stroke();
    }
    
    // Clear shadow
    ctx.shadowBlur = 0;

  }, [suspiciousMap, ringMembers, hoverNode, selectedRingMembers, ringColorMap]);

  // Custom Link Styling
  const linkColor = useCallback((link) => {
      const dimLink = selectedRingMembers && (!selectedRingMembers.has(link.source.id) || !selectedRingMembers.has(link.target.id));
      if (dimLink) return 'rgba(51, 65, 85, 0.1)'; // Very faint slate-700
      
      const sourceRing = ringMembers.get(link.source.id);
      const targetRing = ringMembers.get(link.target.id);
      const isRingEdge = sourceRing && targetRing && sourceRing === targetRing;
      
      if (isRingEdge) {
          const hex = ringColorMap.get(sourceRing);
          // Return the hex color with 50% opacity hack
          return hex + '80'; // Add alpha
      }
      
      return 'rgba(148, 163, 184, 0.2)'; // Slate-400 with opacity
  }, [selectedRingMembers, ringMembers, ringColorMap]);

  const handleNodeClick = useCallback(node => {
     // Center camera on node
     fgRef.current.centerAt(node.x, node.y, 1000);
     fgRef.current.zoom(4, 1000);
     
     // Trigger callback
     if (onNodeClick) {
         const accInfo = suspiciousMap.get(node.id) || {
             account_id: node.id,
             suspicion_score: 0,
             detected_patterns: [],
             ring_id: null
         };
         onNodeClick(accInfo);
     }
  }, [fgRef, onNodeClick, suspiciousMap]);

  return (
    <div ref={containerRef} className="w-full h-full relative group">
      <div className="absolute top-4 left-4 z-10 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-3 rounded-xl text-white text-xs shadow-xl pointer-events-none transition-opacity duration-300">
         <div className="flex items-center gap-3 mb-2">
             <div className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
             </div>
             <span className="font-medium">Fraud Ring Member (Unique Colors)</span>
         </div>
         <div className="flex items-center gap-3 mb-2">
             <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span> 
             <span className="font-medium text-zinc-300">Suspicious Account</span>
         </div>
         <div className="flex items-center gap-3">
             <span className="w-3 h-3 rounded-full bg-teal-400/50"></span> 
             <span className="font-medium text-zinc-400">Standard Account</span>
         </div>
      </div>
      
      {dimensions.width > 0 && dimensions.height > 0 && (
         <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="transparent"
            nodeRelSize={4}
            nodeCanvasObject={paintNode}
            nodeLabel={getNodeLabel}
            linkColor={linkColor}
            linkWidth={link => (hoverNode === link.source || hoverNode === link.target) ? 2 : 1}
            linkDirectionalArrowLength={link => (hoverNode === link.source || hoverNode === link.target) ? 5 : 3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.2}
            onNodeHover={node => setHoverNode(node)}
            onNodeClick={handleNodeClick}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            cooldownTicks={100}
         />
      )}
    </div>
  );
}

