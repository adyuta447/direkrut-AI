import { useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  ClipboardList,
  Edit3,
  Save,
  Plus,
  MapPin,
  CalendarClock,
} from "lucide-react";
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
  company: "TalentAI",
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
    if (
      !form.title.trim() ||
      !form.department.trim() ||
      !form.description.trim()
    ) {
      setMessage("Lengkapi minimal judul, department, dan deskripsi.");
      return;
    }

    const requirements = form.requirementsText
      .split(",")
      .map((req) => req.trim())
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
      company: form.company.trim() || "TalentAI",
      posted: editingId && existingJob ? existingJob.posted : "Today",
    };

    if (editingId) {
      updateJob(payload.id, payload);
      setMessage("Job updated.");
    } else {
      addJob(payload);
      setMessage("Job ditambahkan dan tampil di landing page.");
    }

    setForm(initialForm);
    setEditingId(null);
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
    setMessage("Editing mode - simpan untuk memperbarui.");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          <Plus className="w-5 h-5" />
          <span>{editingId ? "Edit Job" : "Add Job"}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Departments</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalDepartments}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Latest Posting</p>
            <p className="text-2xl font-bold text-gray-900">
              {jobs[0]?.posted || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          {editingId ? (
            <Edit3 className="w-5 h-5 text-blue-600" />
          ) : (
            <ClipboardList className="w-5 h-5 text-blue-600" />
          )}
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? "Edit Job Posting" : "Add Job Posting"}
          </h2>
        </div>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Software Engineer"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.department}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, department: e.target.value }))
              }
              placeholder="Engineering"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Jakarta / Remote"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, type: e.target.value }))
              }
              placeholder="Full-time / Contract"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.requirementsText}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  requirementsText: e.target.value,
                }))
              }
              placeholder="React, TypeScript, Tailwind"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pisahkan dengan koma, contoh: React, TypeScript, Tailwind.
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe the role and expectations"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.company}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, company: e.target.value }))
              }
              placeholder="TalentAI"
            />
          </div>
          <div className="md:col-span-1 flex items-end justify-end space-x-3">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                  setMessage("Beralih ke mode tambah.");
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Batal edit
              </button>
            )}
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingId ? (
                <Save className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{editingId ? "Simpan Perubahan" : "Tambah Job"}</span>
            </button>
          </div>
        </form>
        {message && <p className="text-sm text-blue-600 mt-3">{message}</p>}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Job</h3>
          <span className="text-sm text-gray-500">
            Klik edit untuk memperbarui.
          </span>
        </div>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      {job.department}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      {job.type}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {job.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>
                  <p className="text-gray-700 mt-2 mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(job)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-gray-500">Belum ada job.</p>}
        </div>
      </div>
    </div>
  );
}
