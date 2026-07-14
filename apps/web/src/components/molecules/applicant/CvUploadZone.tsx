import { Upload, CheckCircle } from "lucide-react";

interface CvUploadZoneProps {
  cvFile: File | null;
  isDragging: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CvUploadZone({
  cvFile, isDragging, onDragOver, onDragLeave, onDrop, onFileChange,
}: CvUploadZoneProps) {
  return (
    <div className="bg-canvas border border-hairline p-8 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-[14px] text-ink">3. Unggah Dokumen CV</label>
        <span className="text-[12px] text-ink-muted">Maksimal 5MB</span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`group relative w-full border ${
          isDragging
            ? "border-primary bg-surface-1 border-solid"
            : cvFile
              ? "border-hairline bg-surface-1 border-solid"
              : "border-hairline bg-canvas border-dashed hover:border-primary"
        } p-12 min-h-[320px] flex flex-col items-center justify-center transition-none`}
      >
        {cvFile ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-surface-1 border border-hairline flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="text-[16px] font-semibold text-ink mb-2">{cvFile.name}</p>
            <p className="text-[12px] text-ink-muted mb-8">{(cvFile.size / 1024).toFixed(1)} KB</p>
            <label className="border border-primary text-primary px-4 py-2 text-[14px] hover:bg-primary hover:text-white transition-none cursor-pointer">
              Ganti File
              <input type="file" accept=".pdf,.doc,.docx" onChange={onFileChange} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-surface-1 flex items-center justify-center mb-6 border border-hairline">
              <Upload className="w-8 h-8 text-ink" />
            </div>
            <p className="text-[16px] text-ink mb-2">Tarik & letakkan CV Anda di sini</p>
            <p className="text-[12px] text-ink-muted mb-8">Mendukung PDF, DOC, DOCX</p>
            <label className="btn-primary cursor-pointer">
              Pilih File
              <input type="file" accept=".pdf,.doc,.docx" onChange={onFileChange} className="hidden" required />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
