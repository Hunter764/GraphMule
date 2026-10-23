/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: token("--paper"), 2: token("--paper-2"), 3: token("--paper-3") },
        ink: { DEFAULT: token("--ink"), soft: token("--ink-soft"), muted: token("--ink-muted") },
        graphite: { DEFAULT: token("--graphite"), 2: token("--graphite-2"), 3: token("--graphite-3") },
        fog: { DEFAULT: token("--fog"), muted: token("--fog-muted") },
        cobalt: { DEFAULT: token("--cobalt"), deep: token("--cobalt-deep") },
        ember: token("--ember"),
        amber: token("--amber"),
        moss: token("--moss"),
        danger: token("--danger"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      maxWidth: {
        shell: "1280px",
      },
      letterSpacing: {
        display: "-0.045em",
        heading: "-0.03em",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        scan: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(260%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        scan: "scan 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite",
      },
    },
  },
  plugins: [],
};
