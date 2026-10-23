"use client";

import { useEffect, useRef } from "react";
import { animate, createDrawable, stagger } from "animejs";

const fanY = [22, 42, 62, 82, 102, 122];

// Each diagram is the smallest honest picture of what its detector searches for.
const DIAGRAMS = {
  cycle: {
    edges: [
      "M120 22 A50 50 0 0 1 170 72",
      "M170 72 A50 50 0 0 1 120 122",
      "M120 122 A50 50 0 0 1 70 72",
      "M70 72 A50 50 0 0 1 120 22",
    ],
    nodes: [
      [120, 22, "hot"],
      [170, 72, "hot"],
      [120, 122, "hot"],
      [70, 72, "hot"],
    ],
  },
  fanIn: {
    edges: fanY.map((y) => `M38 ${y} C110 ${y} 130 72 196 72`),
    nodes: [...fanY.map((y) => [38, y, "solid"]), [196, 72, "hot"]],
  },
  fanOut: {
    edges: fanY.map((y) => `M44 72 C110 72 130 ${y} 202 ${y}`),
    nodes: [[44, 72, "hot"], ...fanY.map((y) => [202, y, "solid"])],
  },
  shell: {
    edges: ["M30 82 Q60 40 90 82", "M90 82 Q120 40 150 82", "M150 82 Q180 40 210 82"],
    nodes: [
      [30, 82, "solid"],
      [90, 82, "hollow"],
      [150, 82, "hollow"],
      [210, 82, "hot"],
    ],
  },
};

export default function PatternDiagram({ type, className = "" }) {
  const ref = useRef(null);
  const { edges, nodes } = DIAGRAMS[type];

  useEffect(() => {
    const svg = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paths = createDrawable(svg.querySelectorAll("[data-edge]"), 0, 0);
    const dots = svg.querySelectorAll("[data-node]");
    dots.forEach((d) => (d.style.transform = "scale(0)"));

    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        animate(dots, { scale: [0, 1], duration: 700, delay: stagger(60), ease: "outBack(2.2)" });
        animate(paths, {
          draw: ["0 0", "0 1"],
          duration: 1100,
          delay: stagger(110, { start: 250 }),
          ease: "inOutQuad",
        });
        io.disconnect();
      },
      { threshold: 0.45 }
    );
    io.observe(svg);
    return () => io.disconnect();
  }, [type]);

  return (
    <svg ref={ref} viewBox="0 0 240 144" className={className} aria-hidden="true">
      {edges.map((d, i) => (
        <path key={i} data-edge d={d} fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
      ))}
      {nodes.map(([cx, cy, kind], i) => (
        <circle
          key={i}
          data-node
          cx={cx}
          cy={cy}
          r={kind === "hot" ? 7 : 5.5}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          fill={kind === "hollow" ? "none" : kind === "hot" ? "rgb(var(--ember))" : "currentColor"}
          stroke={kind === "hollow" ? "currentColor" : "none"}
          strokeWidth="1.5"
          strokeDasharray={kind === "hollow" ? "2.5 2.5" : undefined}
        />
      ))}
    </svg>
  );
}
