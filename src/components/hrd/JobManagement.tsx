import { useMemo, useState } from "react";
import { Edit3, Save, Plus, MapPin, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Job } from "../../types";

interface JobFormState {
  title: string;
  department: string;
  description: string;
  requirementsText: string;
  location: string;
  type: string;
  company: string;
}

const initialForm: JobFormState = {
  title: "",
  department: "",
  description: "",
  requirementsText: "",
  location: "Jakarta",
  type: "Full-time",
  company: "DirekrutAI",
};

export default function JobManagement() {
  const { jobs, addJob, updateJob } = useApp();
  const [form, setForm] = useState<JobFormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const totalDepartments = useMemo(
    () => new Set(jobs.map((job) => job.department)).size,
    [jobs],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title.trim() ||
      !form.department.trim() ||
      !form.description.trim()
    ) {
      setMessage("Please fill in at least title, department, and description.");
      return;
    }

    const requirements = form.requirementsText
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const existingJob = jobs.find((job) => job.id === editingId);
    const payload: Job = {
      id: editingId ?? Date.now().toString(),
      title: form.title.trim(),
      department: form.department.trim(),
      description: form.description.trim(),
      requirements: requirements.length ? requirements : ["General skills"],
      location: form.location.trim() || "Jakarta",
      type: form.type.trim() || "Full-time",
      company: form.company.trim() || "DirekrutAI",
      posted: editingId && existingJob ? existingJob.posted : "Today",
    };

    if (editingId) {
      updateJob(payload.id, payload);
      setMessage("Job updated successfully.");
    } else {
      addJob(payload);
      setMessage("Job added and now visible on the job board.");
    }

    setForm(initialForm);
    setEditingId(null);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department,
      description: job.description,
      requirementsText: job.requirements.join(", "),
      location: job.location,
      type: job.type,
      company: job.company,
    });
    setMessage("");
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase">
          Management
        </p>
        <h2 className="text-[32px] font-light text-ink tracking-[-0.5px]">Job Board</h2>
        <p className="text-[14px] text-ink-muted mt-2">
          Add or update job postings visible on the landing page and job board.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Jobs", value: jobs.length },
          { label: "Departments", value: totalDepartments },
          { label: "Latest Post", value: jobs[0]?.posted || "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-1 border border-hairline p-6"
          >
            <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase">{stat.label}</p>
            <p className="text-[32px] font-light text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-canvas border border-hairline p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[18px] font-normal text-ink">
            {editingId ? "Edit Posting" : "New Posting"}
          </p>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
                setMessage("");
              }}
              className="text-[14px] text-ink-muted hover:text-ink transition-none"
            >
              Cancel edit
            </button>
          )}
        </div>
        <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[14px] text-ink mb-2">Job Title</label>
            <input
              className="input-field w-full"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="block text-[14px] text-ink mb-2">Department</label>
            <input
              className="input-field w-full"
              value={form.department}
              onChange={(e) =>
                setForm((p) => ({ ...p, department: e.target.value }))
              }
              placeholder="Engineering"
            />
          </div>
          <div>
            <label className="block text-[14px] text-ink mb-2">Location</label>
            <input
              className="input-field w-full"
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              placeholder="Jakarta / Remote"
            />
          </div>
          <div>
            <label className="block text-[14px] text-ink mb-2">Job Type</label>
            <div className="relative">
              <select
                className="appearance-none input-field w-full pr-10 cursor-pointer"
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[14px] text-ink mb-2">
              Required Skills{" "}
              <span className="text-ink-muted">
                (comma separated)
              </span>
            </label>
            <input
              className="input-field w-full"
              value={form.requirementsText}
              onChange={(e) =>
                setForm((p) => ({ ...p, requirementsText: e.target.value }))
              }
              placeholder="React, TypeScript, Tailwind"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[14px] text-ink mb-2">Description</label>
            <textarea
              className="input-field w-full resize-none"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Describe the role and expectations..."
            />
          </div>
          <div>
            <label className="block text-[14px] text-ink mb-2">Company</label>
            <input
              className="input-field w-full"
              value={form.company}
              onChange={(e) =>
                setForm((p) => ({ ...p, company: e.target.value }))
              }
              placeholder="DirekrutAI"
            />
          </div>
          <div className="flex items-end justify-end mt-4">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-6"
            >
              {editingId ? (
                <Save className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {editingId ? "Save Changes" : "Add Job"}
            </button>
          </div>
        </form>
        {message && (
          <div className="mt-6 p-4 bg-[#defbe6] border border-[#198038]">
            <p className="text-[14px] text-[#198038]">
              {message}
            </p>
          </div>
        )}
      </div>

      {/* Job List */}
      <div className="bg-canvas border border-hairline p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[18px] font-normal text-ink">
            All Postings
          </p>
          <span className="text-[14px] text-ink-muted">{jobs.length} jobs</span>
        </div>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-start justify-between p-6 border border-hairline hover:bg-surface-1 transition-none"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[12px] font-semibold uppercase bg-surface-1 border border-hairline text-ink px-2 py-1">
                    {job.department}
                  </span>
                  <span className="text-[12px] font-semibold uppercase bg-surface-1 border border-hairline text-ink px-2 py-1">
                    {job.type}
                  </span>
                </div>
                <h4 className="text-[20px] font-normal text-ink mb-1">{job.title}</h4>
                <p className="text-[14px] text-ink-muted flex items-center gap-2 mb-4">
                  {job.company}
                  <span>·</span>
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </p>
                <p className="text-[14px] text-ink leading-[1.5] mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="text-[12px] bg-canvas border border-hairline text-ink-muted px-2 py-1"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleEdit(job)}
                className="flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline transition-none ml-6 flex-shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-[14px] text-ink-muted text-center py-8">
              No jobs posted yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
