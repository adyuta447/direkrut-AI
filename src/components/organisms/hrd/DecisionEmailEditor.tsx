import { Send } from "lucide-react";
import { DecisionType } from "../../../lib/hrd/useDecisionPanel";

interface DecisionEmailEditorProps {
  decision: DecisionType;
  emailSubject: string;
  onSubjectChange: (value: string) => void;
  emailBody: string;
  onBodyChange: (value: string) => void;
  interviewDate: string;
  interviewTime: string;
  interviewType: "teknis" | "hr";
  onSend: () => void;
}

export function DecisionEmailEditor({
  decision, emailSubject, onSubjectChange, emailBody, onBodyChange, interviewDate, interviewTime, interviewType, onSend,
}: DecisionEmailEditorProps) {
  return (
    <div className="bg-canvas border border-hairline p-5">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-4">Pratinjau Email</p>
      <div className="space-y-4">
        <div>
          <label className="block text-[14px] text-ink mb-2">Subjek</label>
          <input type="text" value={emailSubject} onChange={(e) => onSubjectChange(e.target.value)} className="input-field w-full" />
        </div>
        <div>
          <label className="block text-[14px] text-ink mb-2">Pesan</label>
          <textarea value={emailBody} onChange={(e) => onBodyChange(e.target.value)} rows={14} className="input-field resize-none w-full" />
        </div>

        {decision === "invite" && interviewDate && interviewTime && (
          <div className="p-3 bg-surface-1 border border-hairline text-[12px] text-ink-muted space-y-1">
            <p className="font-semibold text-ink">Ringkasan Wawancara</p>
            <p>Jenis: {interviewType === "hr" ? "Wawancara HRD" : "Wawancara Teknis"}</p>
            <p>Tanggal: {new Date(interviewDate).toLocaleDateString("id-ID")}</p>
            <p>Waktu: {interviewTime}</p>
          </div>
        )}

        <button
          onClick={onSend}
          className={`w-full flex items-center justify-center gap-2 py-3 text-[14px] font-normal transition-none ${
            decision === "invite" ? "bg-primary text-white hover:bg-[#0353e9]" : "border border-hairline bg-canvas text-ink hover:bg-surface-1"
          }`}
        >
          <Send className="w-4 h-4" />
          {decision === "invite" ? "Konfirmasi & Kirim Undangan" : "Kirim Pemberitahuan Penolakan"}
        </button>
      </div>
    </div>
  );
}
