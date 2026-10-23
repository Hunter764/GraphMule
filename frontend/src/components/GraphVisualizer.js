"use client";

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

// Dynamically import specific ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false
});

// Ring hues are tuned to read on the graphite panel and stay distinct from each other.
export const RING_COLORS = [
    '#ff5c26', '#5b7bff', '#f5a623', '#b57bff',
    '#2ec4b6', '#ff4d8d', '#9be15d', '#5ac8fa'
];

export const generateRingColors = (rings) => {
    const map = new Map();
    rings.forEach((r, i) => {
        map.set(r.ring_id, RING_COLORS[i % RING_COLORS.length]);
    });
    return map;
};

const SAFE = 'rgba(237, 235, 230, 0.38)';
const SUSPICIOUS = '#f5a623';

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const tooltip = (title, lines) => `
  <div style="background:#1a1a19;padding:8px 10px;border-radius:8px;border:1px solid rgba(237,235,230,0.12);font-family:var(--font-mono),monospace;font-size:11px;line-height:1.5;color:#edebe6;box-shadow:0 12px 30px rgba(0,0,0,0.4)">
    <div style="font-weight:600;margin-bottom:2px">${escapeHtml(title)}</div>
    ${lines.map(l => `<div style="color:#928f89">${l}</div>`).join('')}
  </div>`;

const GraphVisualizer = forwardRef(function GraphVisualizer({ data, suspiciousAccounts, fraudRings, selectedRingId, selectedNodeId, onNodeClick }, ref) {
  const fgRef = useRef();

  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [hoverNode, setHoverNode] = useState(null);
  const fitted = useRef(false);

  // Custom container dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    fit: () => fgRef.current?.zoomToFit(600, 60),
  }));

  useEffect(() => {
    const el = containerRef.current;
    const observer = new ResizeObserver(() => {
        setDimensions({ width: el.clientWidth, height: el.clientHeight });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (data) {
        fitted.current = false;
        setGraphData(data);
    }
  }, [data]);

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

  // Frame the selected ring so it's visible without manual zooming
  useEffect(() => {
      if (!selectedRingMembers || !fgRef.current) return;
      fgRef.current.zoomToFit(700, 140, node => selectedRingMembers.has(node.id));
  }, [selectedRingMembers]);

  // Node Label for Hover
  const getNodeLabel = useCallback((node) => {
      const acc = suspiciousMap.get(node.id);
      if (acc) {
          const patterns = acc.detected_patterns.length > 0 ? acc.detected_patterns.join(', ') : 'none';
          return tooltip(node.id, [`score ${Math.round(acc.suspicion_score)} · ${escapeHtml(acc.ring_id)}`, escapeHtml(patterns)]);
      }
      return tooltip(node.id, ['no risk signals']);
  }, [suspiciousMap]);

  // Custom Node Styling
  const paintNode = useCallback((node, ctx, globalScale) => {
    const isSuspicious = suspiciousMap.has(node.id);
    const ringId = ringMembers.get(node.id);
    const isRingMember = !!ringId;
    const isHovered = node === hoverNode;
    const isSelected = node.id === selectedNodeId;
    const isSelectedRing = selectedRingMembers ? selectedRingMembers.has(node.id) : false;
    const dimNode = selectedRingMembers && !isSelectedRing && !isSelected;

    // Focus mode modifications
    if (dimNode) {
        ctx.fillStyle = 'rgba(237, 235, 230, 0.08)';
        ctx.beginPath(); ctx.arc(node.x, node.y, 2, 0, 2 * Math.PI, false); ctx.fill();
        return;
    }

    // Node size
    let r = 2.6;
    if (isSuspicious) r = 3.6;
    if (isRingMember) r = 5;
    if (isHovered || isSelected) r += 1.5;

    // Base Colors
    let color = SAFE;
    if (isSuspicious) color = SUSPICIOUS;
    if (isRingMember) color = ringColorMap.get(ringId);

    // Halo for flagged accounts
    if (isRingMember || isHovered || isSelected) {
        ctx.fillStyle = (isRingMember ? color : '#edebe6') + '22';
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.1, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
    ctx.fill();

    if (isHovered || isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5 / globalScale;
        ctx.stroke();
    }

    // Labels appear once zoomed in enough to read them
    if (globalScale > 2.6 && (isRingMember || isHovered || isSelected)) {
        ctx.font = `${10 / globalScale}px ui-monospace, monospace`;
        ctx.fillStyle = 'rgba(237, 235, 230, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(node.id, node.x, node.y + r + 9 / globalScale);
    }

  }, [suspiciousMap, ringMembers, hoverNode, selectedNodeId, selectedRingMembers, ringColorMap]);

  // Custom Link Styling
  const linkColor = useCallback((link) => {
      const dimLink = selectedRingMembers && (!selectedRingMembers.has(link.source.id) || !selectedRingMembers.has(link.target.id));
      if (dimLink) return 'rgba(237, 235, 230, 0.04)';

      const sourceRing = ringMembers.get(link.source.id);
      const targetRing = ringMembers.get(link.target.id);
      const isRingEdge = sourceRing && targetRing && sourceRing === targetRing;

      if (isRingEdge) {
          return ringColorMap.get(sourceRing) + '99';
      }

      return 'rgba(237, 235, 230, 0.14)';
  }, [selectedRingMembers, ringMembers, ringColorMap]);

  const handleNodeClick = useCallback(node => {
     // Center camera on node
     fgRef.current.centerAt(node.x, node.y, 800);
     fgRef.current.zoom(Math.max(fgRef.current.zoom(), 3), 800);

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

  const handleEngineStop = useCallback(() => {
      if (fitted.current) return;
      fitted.current = true;
      fgRef.current?.zoomToFit(600, 60);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {dimensions.width > 0 && dimensions.height > 0 && (
         <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            nodeRelSize={4}
            nodeCanvasObject={paintNode}
            nodeLabel={getNodeLabel}
            linkColor={linkColor}
            linkWidth={link => (hoverNode === link.source || hoverNode === link.target) ? 1.8 : 0.8}
            linkDirectionalArrowLength={link => (hoverNode === link.source || hoverNode === link.target) ? 4.5 : 3}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.18}
            onNodeHover={node => {
                setHoverNode(node);
                if (containerRef.current) containerRef.current.style.cursor = node ? 'pointer' : '';
            }}
            onNodeClick={handleNodeClick}
            onEngineStop={handleEngineStop}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            cooldownTicks={120}
            maxZoom={5}
            minZoom={0.3}
         />
      )}
    </div>
  );
});

export default GraphVisualizer;
