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
    [jobs]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.department.trim() || !form.description.trim()) {
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
    <div className="p-4 lg:p-5 space-y-4">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Management</p>
        <h2 className="text-2xl font-bold tracking-tight">Job Board</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Add or update job postings visible on the landing page and job board.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Jobs", value: jobs.length },
          { label: "Departments", value: totalDepartments },
          { label: "Latest Post", value: jobs[0]?.posted || "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4"
          >
            <p className="text-xs text-zinc-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {editingId ? "Edit Posting" : "New Posting"}
          </p>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm(initialForm); setMessage(""); }}
              className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              Cancel edit
            </button>
          )}
        </div>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">Job Title</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="label">Department</label>
            <input
              className="input-field"
              value={form.department}
              onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
              placeholder="Engineering"
            />
          </div>
          <div>
            <label className="label">Location</label>
            <input
              className="input-field"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="Jakarta / Remote"
            />
          </div>
          <div>
            <label className="label">Job Type</label>
            <div className="relative">
              <select
                className="appearance-none input-field pr-8"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="label">Required Skills <span className="normal-case text-zinc-300 dark:text-zinc-700">(comma separated)</span></label>
            <input
              className="input-field"
              value={form.requirementsText}
              onChange={(e) => setForm((p) => ({ ...p, requirementsText: e.target.value }))}
              placeholder="React, TypeScript, Tailwind"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input-field resize-none"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe the role and expectations..."
            />
          </div>
          <div>
            <label className="label">Company</label>
            <input
              className="input-field"
              value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
              placeholder="DirekrutAI"
            />
          </div>
          <div className="flex items-end justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 py-3"
            >
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Save Changes" : "Add Job"}
            </button>
          </div>
        </form>
        {message && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            {message}
          </p>
        )}
      </div>

      {/* Job List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">All Postings</p>
          <span className="text-xs text-zinc-400">{jobs.length} jobs</span>
        </div>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group flex items-start justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-lg">
                    {job.department}
                  </span>
                  <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-lg">
                    {job.type}
                  </span>
                </div>
                <h4 className="text-sm font-semibold">{job.title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                  {job.company}
                  <span>·</span>
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed line-clamp-2">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-lg"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleEdit(job)}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-4 flex-shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-sm text-zinc-400 text-center py-8">No jobs posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
