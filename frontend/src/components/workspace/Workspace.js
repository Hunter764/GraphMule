"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { animate } from "animejs";
import { AlertTriangle, ArrowLeft, Download, FileText, Maximize2, RotateCcw, UploadCloud, X } from "lucide-react";
import Logo from "../Logo";
import GraphVisualizer from "../GraphVisualizer";
import ResultsDashboard from "../ResultsDashboard";
import CsvSpecModal from "./CsvSpecModal";
import NodeDrawer from "./NodeDrawer";
import {
  API_URL,
  REQUIRED_COLUMNS,
  analyzeLedger,
  downloadReport,
  formatBytes,
  loadSampleLedger,
  parseLedger,
} from "../../lib/api";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "../../lib/motion";

const SLOW_AFTER_MS = 6000;

function CountUp({ value, format = (n) => Math.round(n).toLocaleString() }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (prefersReducedMotion()) {
      el.textContent = format(value);
      return;
    }
    const state = { n: 0 };
    const anim = animate(state, {
      n: value,
      duration: 1400,
      ease: "outExpo",
      onUpdate: () => (el.textContent = format(state.n)),
    });
    return () => anim.pause();
  }, [value]);
  return <span ref={ref}>{format(value)}</span>;
}

function UploadCard({ file, rowCount, loading, phase, slow, error, onFile, onAnalyze, onCancel, onSample, onClear, onReject }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const takeFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) {
      onReject(`“${f.name}” isn't a CSV file.`);
      return;
    }
    onFile(f);
  };

  return (
    <div className="card overflow-hidden shadow-[0_30px_60px_-40px_rgb(0_0_0/0.35)]">
      <div className="hatch-ink h-3 border-b border-ink/10" />
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex min-h-[260px] flex-col justify-center rounded-[12px] border border-ink/10 bg-paper px-6 py-10" role="status" aria-live="polite">
            <p className="eyebrow text-cobalt">{phase === "parse" ? "Step 1 of 2" : "Step 2 of 2"}</p>
            <p className="mt-2 text-[22px] font-medium tracking-[-0.02em]">
              {phase === "parse" ? "Reading the ledger…" : "Running detectors…"}
            </p>
            <p className="mt-1.5 text-[14.5px] text-ink-muted">
              {phase === "parse"
                ? "Building the account graph in your browser."
                : "Searching for cycles, smurfing bursts and shell chains."}
            </p>
            <div className="mt-6 h-1 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full w-2/5 animate-scan rounded-full bg-cobalt" />
            </div>
            {slow && (
              <p className="mt-4 text-[13.5px] leading-[1.5] text-ink-muted">
                Still working. The analysis server sleeps when idle, so the first request can take up to a minute.
              </p>
            )}
            <button type="button" onClick={onCancel} className="btn btn-outline btn-sm mt-6 w-max">
              Cancel
            </button>
          </div>
        ) : (
          <label
            htmlFor="ledger-input"
            onDragEnter={(e) => (e.preventDefault(), setDragging(true))}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.currentTarget.contains(e.relatedTarget) || setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              takeFiles(e.dataTransfer.files);
            }}
            className={`group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed px-6 py-10 text-center transition-colors duration-200 ${
              dragging
                ? "border-cobalt bg-cobalt/[0.06]"
                : file
                ? "border-ink/20 bg-paper"
                : "border-ink/20 bg-paper hover:border-ink/40"
            }`}
          >
            {file ? (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-cobalt/10 text-cobalt">
                  <FileText className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <p className="mt-4 max-w-full truncate font-mono text-[15px]">{file.name}</p>
                <p className="mt-1 text-[13.5px] text-ink-muted">
                  {formatBytes(file.size)}
                  {rowCount != null && ` · ${rowCount.toLocaleString()} transactions`}
                </p>
                <p className="mt-4 text-[13px] text-ink-muted">
                  <span className="link-underline text-ink-soft">Choose a different file</span> or drop one here
                </p>
              </>
            ) : (
              <>
                <span className={`grid h-12 w-12 place-items-center rounded-full transition-colors ${dragging ? "bg-cobalt text-white" : "bg-ink/5 text-ink-soft group-hover:bg-ink/10"}`}>
                  <UploadCloud className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <p className="mt-4 text-[17px] font-medium">{dragging ? "Drop to load the ledger" : "Drop a CSV here"}</p>
                <p className="mt-1 text-[14px] text-ink-muted">
                  or <span className="link-underline text-ink-soft">browse your files</span>
                </p>
              </>
            )}
            <input
              ref={inputRef}
              id="ledger-input"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => {
                takeFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}

        {error && (
          <div role="alert" className="mt-4 flex items-start gap-3 rounded-[12px] border border-danger/25 bg-danger/[0.06] px-4 py-3 text-[14px] text-[#9f1d17]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {!loading && (
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button type="button" onClick={onSample} className="btn btn-outline btn-sm">
                Use sample ledger
              </button>
              {file && (
                <button type="button" onClick={onClear} className="btn btn-sm text-ink-muted hover:text-ink">
                  Clear
                </button>
              )}
            </div>
            <button type="button" onClick={onAnalyze} disabled={!file} className="btn btn-primary sm:min-w-[160px]">
              Analyze ledger
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Workspace() {
  const params = useSearchParams();
  const [file, setFile] = useState(null);
  const [rowCount, setRowCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("parse");
  const [slow, setSlow] = useState(false);
  const [results, setResults] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [error, setError] = useState(null);

  // Dashboard Interaction State
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRingId, setSelectedRingId] = useState(null);

  // Modal State
  const [showCSVModal, setShowCSVModal] = useState(false);

  const abortRef = useRef(null);
  const graphRef = useRef(null);
  const graphPanelRef = useRef(null);
  const resultsRef = useRef(null);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setError(null);
    setRowCount(null);
    try {
      const text = await f.text();
      setRowCount(Math.max(0, text.split(/\r?\n/).filter((l) => l.trim()).length - 1));
    } catch {
      // Row count is informational only.
    }
  }, []);

  const handleAnalyze = useCallback(async (target = file) => {
    if (!target) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setPhase("parse");
    setSlow(false);
    setError(null);
    // Reset state
    setSelectedNode(null);
    setSelectedRingId(null);
    setResults(null);

    const slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    try {
      // 1. Parse CSV locally for Graph Visualization
      const localGraphData = await parseLedger(target);
      setGraphData(localGraphData);

      // 2. Send to Backend for Analysis
      setPhase("analyze");
      const data = await analyzeLedger(target, { signal: controller.signal });
      setResults(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        setError(err.message || String(err));
      }
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      abortRef.current = null;
    }
  }, [file]);

  const handleSample = useCallback(async (autoRun = false) => {
    try {
      const sample = await loadSampleLedger();
      await handleFile(sample);
      if (autoRun) handleAnalyze(sample);
    } catch (err) {
      setError(err.message);
    }
  }, [handleFile, handleAnalyze]);

  // /analyze?sample=1 (linked from the landing page) loads and runs the sample immediately.
  const autoRan = useRef(false);
  useEffect(() => {
    if (params.get("sample") === "1" && !autoRan.current) {
      autoRan.current = true;
      handleSample(true);
    }
  }, [params, handleSample]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const reset = () => {
    setResults(null);
    setFile(null);
    setRowCount(null);
    setSelectedNode(null);
    setSelectedRingId(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const selectRing = (ringId) => {
    setSelectedRingId(ringId);
    if (!ringId) return;
    const rect = graphPanelRef.current?.getBoundingClientRect();
    if (rect && (rect.bottom < 120 || rect.top > window.innerHeight * 0.6)) {
      graphPanelRef.current.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    }
  };

  // Results arrive in sequence rather than all at once.
  useIsomorphicLayoutEffect(() => {
    if (!results || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-result]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09, ease: "expo.out" });
    }, resultsRef);
    return () => ctx.revert();
  }, [results]);

  const summary = results?.summary;
  const rings = summary?.fraud_rings_detected ?? 0;

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="Back to GraphMule home" className="rounded-md">
              <Logo />
            </Link>
            <span className="text-ink/25" aria-hidden="true">/</span>
            <span className="truncate text-[14px] text-ink-soft">Workspace</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowCSVModal(true)} className="btn btn-outline btn-sm">
              CSV format
            </button>
            <span className="pill hidden border-ink/15 text-ink-muted sm:inline-flex">RIFT 2026</span>
          </div>
        </div>
      </header>

      <main>
        {!results ? (
          <section className="shell grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-24">
            <div className="flex flex-col">
              <Link href="/" className="mb-8 inline-flex w-max items-center gap-1.5 text-[13.5px] text-ink-muted hover:text-ink">
                <ArrowLeft className="h-3.5 w-3.5" /> Home
              </Link>
              <p className="eyebrow text-ink-muted">New analysis</p>
              <h1 className="display mt-4 max-w-[12ch] text-[clamp(2.6rem,5.4vw,4.75rem)]">Upload a transaction ledger.</h1>
              <p className="mt-6 max-w-[44ch] text-[17px] leading-[1.55] text-ink-soft">
                GraphMule maps every transfer as an edge between accounts, then returns the rings, scores and
                network behind them.
              </p>
              <div className="mt-8">
                <p className="eyebrow text-ink-muted">Required columns</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {REQUIRED_COLUMNS.map((c) => (
                    <li key={c.name} className="rounded-md border border-ink/10 bg-paper-3 px-2 py-1 font-mono text-[12px] text-ink-soft">
                      {c.name}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setShowCSVModal(true)} className="link-underline mt-4 text-[14px] text-cobalt">
                  View the full specification
                </button>
              </div>
              <p className="mt-auto pt-10 text-[12.5px] leading-[1.5] text-ink-muted">
                Files are sent to the analysis API at <span className="font-mono">{API_URL.replace(/^https?:\/\//, "")}</span>{" "}
                and processed in memory. The API doesn&apos;t store them.
              </p>
            </div>

            <UploadCard
              file={file}
              rowCount={rowCount}
              loading={loading}
              phase={phase}
              slow={slow}
              error={error}
              onFile={handleFile}
              onAnalyze={() => handleAnalyze()}
              onCancel={() => abortRef.current?.abort()}
              onSample={() => handleSample(false)}
              onClear={() => (setFile(null), setRowCount(null), setError(null))}
              onReject={setError}
            />
          </section>
        ) : (
          <div ref={resultsRef} className="shell space-y-6 py-10 md:py-14">
            {/* Title & actions */}
            <div data-result className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow flex flex-wrap items-center gap-x-2 text-ink-muted">
                  Risk assessment <span aria-hidden="true">·</span>
                  <span className="max-w-[24ch] truncate normal-case tracking-normal">{file?.name}</span>
                </p>
                <h1 className="mt-3 max-w-[22ch] text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.02] tracking-heading">
                  {rings === 0
                    ? `No fraud rings across ${summary.total_accounts_analyzed.toLocaleString()} accounts.`
                    : `${rings} fraud ring${rings === 1 ? "" : "s"} across ${summary.total_accounts_analyzed.toLocaleString()} accounts.`}
                </h1>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={reset} className="btn btn-outline">
                  <RotateCcw className="h-4 w-4" strokeWidth={1.8} /> New analysis
                </button>
                <button type="button" onClick={() => downloadReport(results)} className="btn btn-primary">
                  <Download className="h-4 w-4" strokeWidth={1.8} /> Export report
                </button>
              </div>
            </div>

            {/* Summary */}
            <dl data-result className="card grid grid-cols-2 overflow-hidden lg:grid-cols-4">
              {[
                { label: "Accounts analyzed", value: summary.total_accounts_analyzed },
                { label: "Fraud rings", value: summary.fraud_rings_detected, accent: "text-ember" },
                { label: "Flagged accounts", value: summary.suspicious_accounts_flagged, accent: "text-amber" },
                { label: "Processing time", value: summary.processing_time_seconds, format: (n) => `${n.toFixed(3)} s` },
              ].map((s, i) => (
                <div key={s.label} className={`p-5 sm:p-6 ${i % 2 ? "border-l border-ink/10" : ""} ${i > 1 ? "border-t border-ink/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
                  <dt className="eyebrow flex items-center gap-2 text-ink-muted">
                    {s.accent && <span className={`h-1.5 w-1.5 rounded-full bg-current ${s.accent}`} />}
                    {s.label}
                  </dt>
                  <dd className="mt-4 text-[clamp(1.9rem,3.4vw,2.75rem)] font-medium leading-none tracking-heading">
                    <CountUp value={s.value} format={s.format} />
                  </dd>
                </div>
              ))}
            </dl>

            {/* Network */}
            <section
              data-result
              ref={graphPanelRef}
              aria-label="Transaction network"
              className="panel relative h-[520px] overflow-hidden lg:h-[660px]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{ backgroundImage: "radial-gradient(rgb(var(--fog) / 0.07) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              />
              <GraphVisualizer
                ref={graphRef}
                data={graphData}
                suspiciousAccounts={results.suspicious_accounts}
                fraudRings={results.fraud_rings}
                selectedRingId={selectedRingId}
                selectedNodeId={selectedNode?.account_id}
                onNodeClick={setSelectedNode}
              />

              <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
                <div className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] border border-fog/10 bg-graphite/85 px-3.5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-fog-muted backdrop-blur-md">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ember" /> Ring member</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber" /> Suspicious</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-fog/40" /> Standard</span>
                </div>
                <div className={`pointer-events-auto flex gap-2 transition-opacity duration-300 ${selectedNode ? "opacity-0 sm:opacity-100" : ""}`}>
                  {selectedRingId && (
                    <button type="button" onClick={() => setSelectedRingId(null)} className="btn btn-sm border border-fog/15 bg-graphite/85 text-fog backdrop-blur-md hover:bg-graphite-3">
                      <X className="h-3.5 w-3.5" /> {selectedRingId}
                    </button>
                  )}
                  <button type="button" onClick={() => graphRef.current?.fit()} className="btn btn-sm border border-fog/15 bg-graphite/85 text-fog backdrop-blur-md hover:bg-graphite-3" aria-label="Fit graph to view">
                    <Maximize2 className="h-3.5 w-3.5" /> Fit
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-4 bottom-3 flex justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.06em] text-fog-muted">
                <span>{graphData.nodes.length.toLocaleString()} accounts · {graphData.links.length.toLocaleString()} transfers</span>
                <span className="hidden sm:block">Click a node to inspect · scroll to zoom</span>
              </div>

              <NodeDrawer
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onHighlightRing={selectRing}
                selectedRingId={selectedRingId}
              />
            </section>

            {/* Tables */}
            <div data-result>
              <ResultsDashboard
                suspiciousAccounts={results.suspicious_accounts}
                fraudRings={results.fraud_rings}
                selectedRingId={selectedRingId}
                onRingClick={selectRing}
              />
            </div>
          </div>
        )}
      </main>

      <CsvSpecModal open={showCSVModal} onClose={() => setShowCSVModal(false)} />
    </div>
  );
}
