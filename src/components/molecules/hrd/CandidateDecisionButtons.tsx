import { CheckCircle, XCircle } from "lucide-react";

interface CandidateDecisionButtonsProps {
  onInvite: () => void;
  onReject: () => void;
}

export function CandidateDecisionButtons({ onInvite, onReject }: CandidateDecisionButtonsProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <p className="text-[14px] font-semibold text-ink mb-2">Keputusan Perekrutan</p>
      <p className="text-[14px] text-ink-muted mb-6">Tinjau seluruh data kandidat dan ambil tindakan untuk tahap selanjutnya.</p>
      <div className="flex gap-4">
        <button
          onClick={onInvite}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#198038] bg-[#defbe6] text-[#198038] hover:bg-[#198038] hover:text-white text-[14px] font-normal transition-none"
        >
          <CheckCircle className="w-4 h-4" />
          Undang Wawancara
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#da1e28] bg-[#fff1f1] text-[#da1e28] hover:bg-[#da1e28] hover:text-white text-[14px] font-normal transition-none"
        >
          <XCircle className="w-4 h-4" />
          Tolak Lamaran
        </button>
      </div>
    </div>
  );
}
