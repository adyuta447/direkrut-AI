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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Position
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a position...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>

          {selectedJob && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              {(() => {
                const job = jobs.find((j) => j.id === selectedJob);
                return job ? (
                  <>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-700 mb-2">{job.company}</p>
                    <p className="text-gray-600 text-sm mb-3">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Your CV
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : cvFile
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {cvFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-600 mb-3" />
                <p className="text-gray-900 font-semibold mb-1">
                  {cvFile.name}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {(cvFile.size / 1024).toFixed(2)} KB
                </p>
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
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
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium mb-1">
                  Drag and drop your CV here, or click to browse
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </p>
                <label className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition">
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

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={!selectedJob || !cvFile}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>Continue to Validation</span>
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
