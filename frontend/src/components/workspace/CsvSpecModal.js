"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { REQUIRED_COLUMNS, SAMPLE_LEDGER_URL } from "../../lib/api";

export default function CsvSpecModal({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="csv-spec-title"
      className="w-[min(720px,calc(100vw-32px))] rounded-[var(--radius-lg)] border border-ink/10 bg-paper-3 p-0 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)] backdrop:bg-graphite/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-6 border-b border-ink/10 px-6 py-5">
        <div>
          <p className="eyebrow text-ink-muted">Input format</p>
          <h2 id="csv-spec-title" className="mt-1.5 text-[22px] font-medium tracking-[-0.02em]">
            CSV specification
          </h2>
        </div>
        <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5" aria-label="Close">
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="px-6 py-5">
        <p className="text-[15px] leading-[1.55] text-ink-soft">
          One row per transfer, comma-separated, with a header row containing exactly these columns. Extra
          columns are ignored.
        </p>
        <div className="scroll-thin mt-5 overflow-x-auto rounded-[12px] border border-ink/10">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-paper-2/60 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Column</th>
                <th scope="col" className="px-4 py-3 font-medium">Type</th>
                <th scope="col" className="w-full px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.07]">
              {REQUIRED_COLUMNS.map((row) => (
                <tr key={row.name}>
                  <td className="px-4 py-3 font-mono text-[13px] text-cobalt">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-ink-muted">{row.type}</td>
                  <td className="px-4 py-3 text-ink-soft">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <pre className="scroll-thin mt-4 overflow-x-auto rounded-[12px] bg-graphite px-4 py-3 font-mono text-[12px] leading-[1.7] text-fog/80">
          {`transaction_id,sender_id,receiver_id,amount,timestamp
TX_00151,RING1_A,RING1_B,5000.0,2026-01-01 13:00:00`}
        </pre>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-6 py-4">
        <a href={SAMPLE_LEDGER_URL} download className="link-underline text-sm text-ink-soft">
          Download sample-ledger.csv
        </a>
        <button type="button" onClick={onClose} className="btn btn-dark btn-sm">
          Got it
        </button>
      </div>
    </dialog>
  );
}
