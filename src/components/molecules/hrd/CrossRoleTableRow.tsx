import { Fragment } from "react";
import { ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { CrossRoleItem } from "../../../lib/hrd/crossRoleRecommendations";

interface CrossRoleTableRowProps {
  item: CrossRoleItem;
  expanded: boolean;
  onToggle: () => void;
}

export function CrossRoleTableRow({ item, expanded, onToggle }: CrossRoleTableRowProps) {
  return (
    <Fragment>
      <tr className="hover:bg-surface-1 transition-none">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ink text-white flex items-center justify-center font-semibold text-[12px]">
              {item.candidateName.charAt(0)}
            </div>
            <span className="text-[14px] font-semibold text-ink">{item.candidateName}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-[14px] text-ink">{item.originalRole}</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-[14px] font-semibold text-primary">{item.suggestedRole}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`text-[11px] font-semibold px-2 py-1 border uppercase tracking-wide inline-block ${item.labelClass}`}>
            {item.label}
          </span>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={onToggle}
            className="text-[12px] font-normal text-primary hover:underline transition-none flex items-center gap-1"
          >
            {expanded ? "Tutup Detail" : "Lihat Detail"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </td>
      </tr>

      {/* Expanded Slug / View Detail */}
      {expanded && (
        <tr className="bg-[#e5f6ff] border-b border-primary">
          <td colSpan={5} className="px-6 py-6">
            <div className="animate-in slide-in-from-top-2 flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-white border border-[#0f62fe] p-5">
                <h4 className="text-[14px] font-semibold text-primary mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <BarChart3 className="w-4 h-4" />
                  Alasan Rekomendasi
                </h4>
                <p className="text-[14px] text-ink leading-[1.5] mb-4">{item.reason}</p>

                <div className="bg-surface-1 border border-hairline p-4">
                  <p className="text-[12px] font-semibold uppercase text-ink-muted mb-2 flex items-center gap-1.5">
                    Bukti Transparansi AI
                  </p>
                  <p className="text-[13px] text-ink leading-[1.5] italic border-l-4 border-primary pl-3">{item.evidence}</p>
                </div>
              </div>

              <div className="w-full md:w-64 flex flex-col justify-between border border-hairline bg-white p-5">
                <div>
                  <p className="text-[12px] font-semibold text-ink-muted uppercase mb-1">Aksi Lanjutan</p>
                  <p className="text-[13px] text-ink leading-[1.5] mb-4">
                    Anda dapat mengirimkan undangan penawaran role alternatif ini ke kandidat.
                  </p>
                </div>
                <button className="btn-primary w-full text-center py-2 px-4 text-[13px]">
                  Tawarkan Posisi Ini
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
