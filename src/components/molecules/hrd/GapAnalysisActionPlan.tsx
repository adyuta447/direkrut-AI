export function GapAnalysisActionPlan() {
  return (
    <div className="bg-surface-1 border border-hairline p-6">
      <p className="text-[18px] font-normal text-ink mb-4">Langkah Selanjutnya</p>
      <div className="flex flex-wrap gap-4">
        {["Buat Panduan Wawancara", "Bagikan Laporan ke Manajer", "Ekspor PDF"].map((action) => (
          <button
            key={action}
            className="px-4 py-2 text-[14px] font-normal border border-primary text-primary hover:bg-primary hover:text-white transition-none"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
