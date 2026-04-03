import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
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
    <div className="min-h-full p-4 lg:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Position Select */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6">
          <label className="label">Select Position</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Choose a position...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.company}
              </option>
            ))}
          </select>

          {selectedJobData && (
            <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-lg">
                  {selectedJobData.type}
                </span>
                <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-lg">
                  {selectedJobData.department}
                </span>
                <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-lg">
                  {selectedJobData.location}
                </span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{selectedJobData.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{selectedJobData.company}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                {selectedJobData.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedJobData.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-lg font-medium"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload CV */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6">
          <label className="label">Upload Your CV</label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
              isDragging
                ? "border-zinc-400 bg-zinc-50 dark:bg-zinc-800"
                : cvFile
                ? "border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            {cvFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-10 h-10 text-zinc-400 mb-3" />
                <p className="font-medium text-sm mb-1">{cvFile.name}</p>
                <p className="text-xs text-zinc-400 mb-4">
                  {(cvFile.size / 1024).toFixed(1)} KB
                </p>
                <label className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer underline underline-offset-2 transition-colors">
                  Change file
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-3" />
                <p className="font-medium text-sm mb-1">
                  Drag & drop your CV here
                </p>
                <p className="text-xs text-zinc-400 mb-5">
                  PDF, DOC, DOCX up to 5MB
                </p>
                <label className="btn-primary cursor-pointer">
                  Select File
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!selectedJob || !cvFile}
            className="inline-flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed py-3 px-7"
          >
            <FileText className="w-4 h-4" />
            Continue to Validation
          </button>
        </div>
      </form>
    </div>
  );
}
