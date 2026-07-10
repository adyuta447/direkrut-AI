interface ValidationProgressHeaderProps {
  current: number;
  total: number;
  progress: number;
}

export function ValidationProgressHeader({ current, total, progress }: ValidationProgressHeaderProps) {
  return (
    <div className="bg-surface-1 border-b border-hairline px-6 py-4 flex-shrink-0">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold text-ink">Validasi Sistem</span>
          <span className="text-[12px] text-ink-muted">
            {Math.min(current, total)} / {total}
          </span>
        </div>
        <div className="w-full bg-[#e0e0e0] h-1 mt-2">
          <div className="bg-primary h-1 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
