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
      appliedDate: new Date().toISOString().split("T")[0],
    };

    addApplication(newApplication);
    onNext();
  };

  const selectedJobData = jobs.find((j) => j.id === selectedJob);

  return (
    <div className="min-h-full px-6 py-10 md:px-12 lg:px-16 xl:px-24 font-sans bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-10 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white mb-4">
            Submit Application
          </h1>
          <p className="text-[14px] text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Please fill out the form below to apply for your desired role.
            Ensure your document is properly formatted before submitting.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16"
        >
          {/* LEFT COLUMN: Position Select Panel */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-transparent border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2rem] p-8 lg:p-10 flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-6">
                1. Select Position
              </label>

              <div className="relative">
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  required
                  className="w-full appearance-none bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl px-8 py-5 text-[14px] font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors pr-14"
                >
                  <option value="" disabled>
                    Choose a position...
                  </option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.company}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-200/50 dark:bg-zinc-800 flex items-center justify-center pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </div>
              </div>

              {/* Job Details Expansion */}
              {selectedJobData && (
                <div className="mt-10 pt-10 border-t border-zinc-200/50 dark:border-zinc-800/50 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      selectedJobData.type,
                      selectedJobData.department,
                      selectedJobData.location,
                    ].map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono tracking-widest uppercase border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 px-4 py-2 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                    {selectedJobData.title}
                  </h3>
                  <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-8">
                    {selectedJobData.company}
                  </p>

                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-3xl">
                    {selectedJobData.description}
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {selectedJobData.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 px-4 py-2 rounded-full font-bold uppercase tracking-widest"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Upload CV & Submit */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            <div className="bg-transparent border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2rem] p-8 lg:p-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                  2. Upload Document
                </label>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  Max 5MB
                </span>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`group relative flex-1 w-full border ${
                  isDragging
                    ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900/50 border-solid"
                    : cvFile
                      ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 border-solid"
                      : "border-zinc-300 dark:border-zinc-700 bg-transparent border-dashed hover:border-zinc-400 dark:hover:border-zinc-500"
                } rounded-[24px] p-12 min-h-[320px] flex flex-col items-center justify-center transition-all duration-300`}
              >
                {cvFile ? (
                  <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center mb-6">
                      <CheckCircle className="w-8 h-8 text-white dark:text-zinc-900" />
                    </div>
                    <p className="text-[15px] font-bold text-zinc-900 dark:text-white mb-2">
                      {cvFile.name}
                    </p>
                    <p className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-8">
                      {(cvFile.size / 1024).toFixed(1)} KB
                    </p>
                    <label className="inline-flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                      Replace File
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
                    <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
                    </div>
                    <p className="text-[15px] font-bold text-zinc-900 dark:text-white mb-3">
                      Drag & drop your CV here
                    </p>
                    <p className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-8">
                      PDF, DOC, DOCX
                    </p>
                    <label className="inline-flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity cursor-pointer">
                      Browse Files
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
              className="group flex items-center justify-center gap-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-6 rounded-full text-[12px] font-bold uppercase tracking-widest hover:opacity-80 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed w-full"
            >
              <FileText className="w-5 h-5" />
              <span>Continue to Validation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
