// Analysis API client. Point NEXT_PUBLIC_API_URL at a local backend
// (e.g. http://localhost:8000) during development.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://graphmule.onrender.com").replace(/\/$/, "");

export const REQUIRED_COLUMNS = [
  { name: "transaction_id", type: "String", desc: "Unique transaction identifier" },
  { name: "sender_id", type: "String", desc: "Account that sends funds — becomes a node" },
  { name: "receiver_id", type: "String", desc: "Account that receives funds — becomes a node" },
  { name: "amount", type: "Float", desc: "Transaction amount in currency units" },
  { name: "timestamp", type: "DateTime", desc: "YYYY-MM-DD HH:MM:SS" },
];

export const SAMPLE_LEDGER_URL = "/sample-ledger.csv";

// Builds the node/link structure for the force graph straight from the CSV,
// so the visual matches exactly what was uploaded.
export function parseLedger(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = String(event.target.result).split(/\r?\n/);
      const headers = lines[0].split(",").map((h) => h.trim());
      const senderIdx = headers.indexOf("sender_id");
      const receiverIdx = headers.indexOf("receiver_id");

      const missing = REQUIRED_COLUMNS.map((c) => c.name).filter((c) => !headers.includes(c));
      if (missing.length) {
        reject(new Error(`Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`));
        return;
      }

      const nodes = new Set();
      const links = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = lines[i].split(",");
        const source = row[senderIdx]?.trim();
        const target = row[receiverIdx]?.trim();
        if (source && target) {
          nodes.add(source);
          nodes.add(target);
          links.push({ source, target });
        }
      }

      if (!links.length) {
        reject(new Error("The file has headers but no transactions."));
        return;
      }

      resolve({ nodes: Array.from(nodes).map((id) => ({ id })), links });
    };
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsText(file);
  });
}

export async function analyzeLedger(file, { signal } = {}) {
  const formData = new FormData();
  formData.append("file", file);

  let response;
  try {
    response = await fetch(`${API_URL}/analyze`, { method: "POST", body: formData, signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Couldn't reach the analysis server. Check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON responses fall through to the generic error below.
  }

  if (!response.ok) {
    throw new Error(data?.error || `Analysis failed (HTTP ${response.status}).`);
  }
  return data;
}

export async function loadSampleLedger() {
  const res = await fetch(SAMPLE_LEDGER_URL);
  if (!res.ok) throw new Error("Sample ledger is unavailable.");
  const blob = await res.blob();
  return new File([blob], "sample-ledger.csv", { type: "text/csv" });
}

export function downloadReport(results) {
  const json = JSON.stringify(
    {
      suspicious_accounts: results.suspicious_accounts,
      fraud_rings: results.fraud_rings,
      summary: results.summary,
    },
    null,
    2
  );
  const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "fraud_report.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const PATTERN_LABELS = {
  cycle: "Circular flow",
  fan_in_smurfing: "Fan-in smurfing",
  fan_out_smurfing: "Fan-out smurfing",
  layered_shell: "Layered shells",
};

export function patternLabel(p) {
  if (PATTERN_LABELS[p]) return PATTERN_LABELS[p];
  const cycle = /^cycle_length_(\d+)$/.exec(p);
  if (cycle) return `Cycle · ${cycle[1]} hops`;
  return p.replace(/_/g, " ");
}

export function riskTier(score) {
  if (score > 80) return { label: "Critical", tone: "ember" };
  if (score > 50) return { label: "Elevated", tone: "amber" };
  if (score > 0) return { label: "Low", tone: "moss" };
  return { label: "No signals", tone: "muted" };
}
