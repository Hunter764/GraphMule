import { Suspense } from "react";
import Workspace from "../../components/workspace/Workspace";

export const metadata = {
  title: "Workspace — GraphMule",
  description: "Upload a transaction ledger and inspect detected fraud rings.",
};

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <Workspace />
    </Suspense>
  );
}
