"use client";

import { useEffect, useRef } from "react";

// Deterministic PRNG so the field is identical on every visit.
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function segmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = clamp01(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1));
  const x = ax + t * dx - px;
  const y = ay + t * dy - py;
  return Math.sqrt(x * x + y * y);
}

// A small transaction network in normalised space, with one 4-account ring.
function buildNetwork() {
  const rand = seeded(7);
  const ring = [
    [0.6, 0.3],
    [0.75, 0.48],
    [0.62, 0.68],
    [0.47, 0.5],
  ];
  const others = [];
  while (others.length < 20) {
    const x = 0.12 + rand() * 0.8;
    const y = 0.1 + rand() * 0.8;
    const nearRing = Math.hypot(x - 0.61, y - 0.49) < 0.26;
    const crowded = others.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 0.12);
    if (!nearRing && !crowded) others.push([x, y]);
  }
  const nodes = [...ring, ...others];
  const edges = [];
  const seen = new Set();
  const addEdge = (i, j) => {
    const key = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (i === j || seen.has(key)) return;
    seen.add(key);
    edges.push([i, j]);
  };
  // Connect each account to its nearest neighbours so the graph reads as one web.
  nodes.forEach(([x, y], i) => {
    if (i < ring.length) return;
    const nearest = nodes
      .map(([nx, ny], j) => [j, Math.hypot(nx - x, ny - y)])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1]);
    addEdge(i, nearest[0][0]);
    if (rand() > 0.35) addEdge(i, nearest[1][0]);
  });
  const ringEdges = ring.map((_, i) => [i, (i + 1) % ring.length]);
  return { nodes, edges, ringEdges, ringCount: ring.length };
}

/**
 * Dot-matrix canvas.
 *  - variant "network": noise → transaction graph → isolated ring, driven by
 *    `progressRef.current` (0..1), typically from a ScrollTrigger.
 *  - variant "wave": an ambient halftone gradient that drifts slowly.
 */
export default function HalftoneField({
  variant = "wave",
  progressRef,
  color = "237 235 230",
  accent = "255 92 38",
  spacing = 11,
  originX = 1,
  originY = 0,
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const network = variant === "network" ? buildNetwork() : null;

    let width = 0;
    let height = 0;
    let dots = []; // [x, y, noise, graph, ring, mask, phase]
    let raf = 0;
    let visible = false;
    let pitch = spacing;
    let shown = 0; // eased copy of progress so scrubbing feels weighted

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = seeded(11);
      // Keep roughly 56+ columns so narrow canvases stay fine-grained.
      pitch = Math.max(6, Math.min(spacing, width / 56));
      const cols = Math.ceil(width / pitch) + 1;
      const rows = Math.ceil(height / pitch) + 1;
      const offX = (width - (cols - 1) * pitch) / 2;
      const offY = (height - (rows - 1) * pitch) / 2;
      const unit = Math.min(width, height);
      const toPx = ([x, y]) => [x * width, y * height];
      const nodePx = network ? network.nodes.map(toPx) : [];

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offX + c * pitch;
          const y = offY + r * pitch;
          let graph = 0;
          let ring = 0;
          let mask = 1;

          if (network) {
            const nodeR = pitch * 2.4;
            const edgeW = pitch * 0.95;
            nodePx.forEach(([nx, ny], i) => {
              const v = 1 - smooth(nodeR * 0.4, nodeR, Math.hypot(x - nx, y - ny));
              graph = Math.max(graph, v);
              if (i < network.ringCount) ring = Math.max(ring, v);
            });
            network.edges.forEach(([a, b]) => {
              const d = segmentDistance(x, y, ...nodePx[a], ...nodePx[b]);
              graph = Math.max(graph, (1 - smooth(edgeW * 0.3, edgeW, d)) * 0.5);
            });
            network.ringEdges.forEach(([a, b]) => {
              const d = segmentDistance(x, y, ...nodePx[a], ...nodePx[b]);
              const v = (1 - smooth(edgeW * 0.3, edgeW * 1.2, d)) * 0.75;
              graph = Math.max(graph, v);
              ring = Math.max(ring, v);
            });
            // Soft sphere vignette keeps the field from reading as a flat rectangle.
            const dc = Math.hypot((x - width / 2) / (unit * 0.5), (y - height / 2) / (unit * 0.5));
            mask = 1 - smooth(0.7, 1.45, dc);
          } else {
            const dx = (x / width - originX) * (width / unit);
            const dy = (y / height - originY) * (height / unit);
            mask = 1 - smooth(0.05, 1.35, Math.hypot(dx, dy));
          }

          dots.push([x, y, rand() ** 2, graph, ring, mask, rand() * Math.PI * 2]);
        }
      }
    };

    const draw = (time) => {
      const t = reduced ? 0 : time / 1000;
      ctx.clearRect(0, 0, width, height);
      const maxR = pitch * 0.42;

      if (network) {
        const target = progressRef?.current ?? 0;
        shown += (target - shown) * (reduced ? 1 : 0.08);
        const form = smooth(0.08, 0.5, shown);
        const isolate = smooth(0.58, 0.88, shown);

        const base = new Path2D();
        const hot = new Path2D();
        for (const [x, y, noise, graph, ring, mask, phase] of dots) {
          const flicker = noise * (0.55 + 0.45 * Math.sin(t * 1.6 + phase));
          let v = (flicker * 0.5 * (1 - form) + graph * form) * mask;
          v *= 1 - 0.7 * isolate * (1 - ring);
          const heat = ring * isolate;
          if (heat > 0.25) {
            // A pulse runs around the ring so the loop reads as moving money.
            const pulse = 0.82 + 0.18 * Math.sin(t * 3 - (x + y) / 40);
            const r = maxR * Math.max(v, heat) * pulse;
            hot.moveTo(x + r, y);
            hot.arc(x, y, r, 0, Math.PI * 2);
          } else if (v > 0.05) {
            const r = maxR * v;
            base.moveTo(x + r, y);
            base.arc(x, y, r, 0, Math.PI * 2);
          }
        }
        ctx.fillStyle = `rgb(${color} / 0.85)`;
        ctx.fill(base);
        ctx.fillStyle = `rgb(${accent})`;
        ctx.fill(hot);
      } else {
        const path = new Path2D();
        for (const [x, y, noise, , , mask, phase] of dots) {
          const wave = 0.72 + 0.28 * Math.sin(x / 70 + y / 110 + t * 0.7) * Math.cos(y / 90 - t * 0.4);
          const v = mask * wave * (0.85 + 0.15 * Math.sin(t + phase)) + noise * 0.04;
          if (v < 0.06) continue;
          const r = maxR * Math.min(1, v);
          path.moveTo(x + r, y);
          path.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgb(${color})`;
        ctx.fill(path);
      }
    };

    const loop = (time) => {
      draw(time);
      raf = visible && !reduced ? requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    layout();
    draw(0);

    const resize = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    resize.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    // Reduced motion: redraw only when the scroll position changes the story.
    const onScroll = () => reduced && network && draw(0);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [variant, progressRef, color, accent, spacing, originX, originY]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
