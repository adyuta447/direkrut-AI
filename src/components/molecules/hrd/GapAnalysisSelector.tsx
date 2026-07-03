import { ChevronDown, Target } from "lucide-react";
import { Application } from "../../../types";

interface GapAnalysisSelectorProps {
  applications: Application[];
  selectedCandidate: string;
  onSelectCandidate: (id: string) => void;
  onAnalyze: () => void;
}

export function GapAnalysisSelector({ applications, selectedCandidate, onSelectCandidate, onAnalyze }: GapAnalysisSelectorProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <label className="block text-[14px] text-ink font-semibold mb-3">Pilih Lamaran Kandidat</label>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <select
            value={selectedCandidate}
            onChange={(e) => onSelectCandidate(e.target.value)}
            className="input-field appearance-none w-full pr-10 cursor-pointer"
          >
            <option value="">Pilih lamaran...</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.applicantName} — {app.jobTitle}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>
        <button
          onClick={onAnalyze}
          disabled={!selectedCandidate}
          className="btn-primary flex items-center justify-center gap-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Target className="w-4 h-4" />
          Analisis CV
        </button>
      </div>
    </div>
  );
}
