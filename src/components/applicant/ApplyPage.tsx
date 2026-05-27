import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface ApplyPageProps {
  onNext: () => void;
}

export default function ApplyPage({ onNext }: ApplyPageProps) {
  const { currentUser, addApplication, jobs } = useApp();
  const [selectedJob, setSelectedJob] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCvFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !cvFile) return;

    const job = jobs.find((j) => j.id === selectedJob);
    if (!job) return;

    const newApplication = {
      id: Math.random().toString(36).substr(2, 9),
      applicantId: currentUser!.id,
      applicantName: currentUser!.name,
      jobId: job.id,
      jobTitle: job.title,
      cvFile: cvFile,
      validationStatus: "pending" as const,
      status: "submitted" as const,
      appliedDate: "Hari ini",
      cvViewed: false,
    };

    addApplication(newApplication);
    onNext();
  };

  const selectedJobData = jobs.find((j) => j.id === selectedJob);

  return (
    <div className="min-h-full px-6 py-10 md:px-12 lg:px-16 xl:px-24 font-sans bg-surface-1">
      <div className="max-w-[1584px] mx-auto w-full">
        <div className="mb-10 lg:mb-16">
          <h1 className="text-[42px] font-light tracking-[-0.5px] text-ink mb-4">
            Kirim Lamaran
          </h1>
          <p className="text-[16px] text-ink max-w-2xl leading-[1.5]">
            Silakan isi formulir di bawah ini untuk melamar pada posisi yang Anda inginkan.
            Pastikan dokumen Anda telah diformat dengan benar sebelum mengirimkan.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* LEFT COLUMN: Position Select Panel */}
          <div className="lg:col-span-7 bg-canvas border border-hairline p-8 flex flex-col gap-6">
            <label className="block text-[14px] text-ink mb-2">
              1. Pilih Posisi Pekerjaan
            </label>

            <div className="relative">
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                required
                className="input-field appearance-none cursor-pointer pr-10"
              >
                <option value="" disabled>
                  Pilih posisi...
                </option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-ink-muted" />
              </div>
            </div>

            {/* Job Details Expansion */}
            {selectedJobData && (
              <div className="mt-8 pt-8 border-t border-hairline animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex flex-wrap gap-4 mb-4">
                  {[
                    selectedJobData.type,
                    selectedJobData.department,
                    selectedJobData.location,
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[14px] text-ink-muted bg-surface-1 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-[32px] font-light text-ink mb-2">
                  {selectedJobData.title}
                </h3>
                <p className="text-[16px] text-ink-muted mb-8">
                  {selectedJobData.company}
                </p>

                <p className="text-[16px] text-ink leading-[1.5] mb-8 max-w-3xl whitespace-pre-wrap">
                  {selectedJobData.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedJobData.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="text-[14px] border border-hairline text-ink bg-surface-1 px-3 py-1"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Upload CV & Submit */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-canvas border border-hairline p-8 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-[14px] text-ink">
                  2. Unggah Dokumen CV
                </label>
                <span className="text-[12px] text-ink-muted">
                  Maksimal 5MB
                </span>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
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
                    <p className="text-[16px] font-semibold text-ink mb-2">
                      {cvFile.name}
                    </p>
                    <p className="text-[12px] text-ink-muted mb-8">
                      {(cvFile.size / 1024).toFixed(1)} KB
                    </p>
                    <label className="border border-primary text-primary px-4 py-2 text-[14px] hover:bg-primary hover:text-white transition-none cursor-pointer">
                      Ganti File
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-surface-1 flex items-center justify-center mb-6 border border-hairline">
                      <Upload className="w-8 h-8 text-ink" />
                    </div>
                    <p className="text-[16px] text-ink mb-2">
                      Tarik & letakkan CV Anda di sini
                    </p>
                    <p className="text-[12px] text-ink-muted mb-8">
                      Mendukung PDF, DOC, DOCX
                    </p>
                    <label className="btn-primary cursor-pointer">
                      Pilih File
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!selectedJob || !cvFile}
              className="flex items-center justify-center gap-2 btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              <span>Lanjut ke Evaluasi Awal AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
