import { useMemo, useState } from "react";
import { Edit3, Save, Plus, MapPin, ChevronDown, Info } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Job } from "../../types";

interface JobFormState {
  title: string;
  department: string;
  description: string;
  // REVISI 6: Pisahkan kualifikasi (admin) dan keahlian (teknis)
  qualificationsText: string;
  requirementsText: string;
  location: string;
  type: string;
  company: string;
}

const initialForm: JobFormState = {
  title: "",
  department: "",
  description: "",
  qualificationsText: "",
  requirementsText: "",
  location: "Jakarta",
  type: "Purna Waktu",
  company: "Direkrut AI",
};

export default function JobManagement() {
  const { jobs, addJob, updateJob } = useApp();
  const [form, setForm] = useState<JobFormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormState, string>>>({});

  const totalDepartments = useMemo(
    () => new Set(jobs.map((job) => job.department)).size,
    [jobs],
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormState, string>> = {};
    if (!form.title.trim()) newErrors.title = "Judul lowongan wajib diisi.";
    if (!form.department.trim()) newErrors.department = "Departemen wajib diisi.";
    if (!form.description.trim()) newErrors.description = "Deskripsi pekerjaan wajib diisi.";
    if (!form.qualificationsText.trim()) newErrors.qualificationsText = "Kualifikasi (administratif) wajib diisi.";
    if (!form.requirementsText.trim()) newErrors.requirementsText = "Keahlian yang dibutuhkan wajib diisi.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setMessage("");
      return;
    }

    const requirements = form.requirementsText
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const qualifications = form.qualificationsText
      .split(",")
      .map((q) => q.trim())
      .filter(Boolean);

    const existingJob = jobs.find((job) => job.id === editingId);
    const payload: Job = {
      id: editingId ?? Date.now().toString(),
      title: form.title.trim(),
      department: form.department.trim(),
      description: form.description.trim(),
      requirements: requirements.length ? requirements : ["Keahlian umum"],
      detailedQualifications: qualifications.length ? qualifications : [],
      location: form.location.trim() || "Jakarta",
      type: form.type.trim() || "Purna Waktu",
      company: form.company.trim() || "Direkrut AI",
      posted: editingId && existingJob ? existingJob.posted : "Hari ini",
    };

    if (editingId) {
      updateJob(payload.id, payload);
      setMessage("Lowongan berhasil diperbarui.");
    } else {
      addJob(payload);
      setMessage("Lowongan berhasil ditambahkan dan kini terlihat di portal karir.");
    }

    setForm(initialForm);
    setEditingId(null);
    setErrors({});
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department,
      description: job.description,
      qualificationsText: (job.detailedQualifications ?? []).join(", "),
      requirementsText: job.requirements.join(", "),
      location: job.location,
      type: job.type,
      company: job.company,
    });
    setErrors({});
    setMessage("");
  };

  const inputClass = (key: keyof JobFormState) =>
    `input-field w-full ${errors[key] ? "border-b-[#da1e28]" : ""}`;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase tracking-widest">
          Manajemen
        </p>
        <h2 className="text-[32px] font-light text-ink tracking-[-0.5px]">Manajemen Lowongan</h2>
        <p className="text-[14px] text-ink-muted mt-2">
          Tambah atau perbarui lowongan pekerjaan yang tampil di portal karir dan beranda.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Lowongan", value: jobs.length },
          { label: "Departemen", value: totalDepartments },
          { label: "Terakhir Dipasang", value: jobs[0]?.posted || "—" },
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
            {editingId ? "Edit Lowongan" : "Buat Lowongan Baru"}
          </p>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
                setErrors({});
                setMessage("");
              }}
              className="text-[14px] text-ink-muted hover:text-ink transition-none"
            >
              Batal edit
            </button>
          )}
        </div>
        <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[14px] text-ink mb-2 font-semibold">
              Judul Posisi <span className="text-[#da1e28]">*</span>
            </label>
            <input
              className={inputClass("title")}
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Contoh: Software Engineer"
            />
            {errors.title && <p className="text-[12px] text-[#da1e28] mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-[14px] text-ink mb-2 font-semibold">
              Departemen <span className="text-[#da1e28]">*</span>
            </label>
            <input
              className={inputClass("department")}
              value={form.department}
              onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
              placeholder="Contoh: Teknologi Informasi"
            />
            {errors.department && <p className="text-[12px] text-[#da1e28] mt-1">{errors.department}</p>}
          </div>
          <div>
            <label className="block text-[14px] text-ink mb-2 font-semibold">Lokasi</label>
            <input
              className="input-field w-full"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="Jakarta / WFH / Hybrid"
            />
          </div>
          <div>
            <label className="block text-[14px] text-ink mb-2 font-semibold">Jenis Pekerjaan</label>
            <div className="relative">
              <select
                className="appearance-none input-field w-full pr-10 cursor-pointer"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              >
                <option>Purna Waktu</option>
                <option>Paruh Waktu</option>
                <option>Kontrak</option>
                <option>Magang</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[14px] text-ink mb-2 font-semibold">Perusahaan</label>
            <input
              className="input-field w-full"
              value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
              placeholder="Direkrut AI"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[14px] text-ink mb-2 font-semibold">
              Deskripsi Pekerjaan <span className="text-[#da1e28]">*</span>
            </label>
            <textarea
              className={`${inputClass("description")} resize-none`}
              rows={4}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Jelaskan peran, tanggung jawab, dan ekspektasi posisi ini..."
            />
            {errors.description && <p className="text-[12px] text-[#da1e28] mt-1">{errors.description}</p>}
          </div>

          {/* REVISI 6: Field Kualifikasi (Administratif) */}
          <div className="md:col-span-2">
            <label className="block text-[14px] text-ink mb-2 font-semibold">
              Kualifikasi Administratif <span className="text-[#da1e28]">*</span>
            </label>
            <p className="text-[12px] text-ink-muted mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Kriteria administratif seperti rentang usia, jenis kelamin (opsional), ekspektasi gaji, dan persyaratan domisili. Pisahkan dengan koma.
            </p>
            <input
              className={inputClass("qualificationsText")}
              value={form.qualificationsText}
              onChange={(e) => setForm((p) => ({ ...p, qualificationsText: e.target.value }))}
              placeholder="Contoh: Usia 22-30 tahun, Domisili Jabodetabek, Gaji 8-15 juta"
            />
            {errors.qualificationsText && <p className="text-[12px] text-[#da1e28] mt-1">{errors.qualificationsText}</p>}
          </div>

          {/* REVISI 6: Field Keahlian yang Dibutuhkan (Teknis) */}
          <div className="md:col-span-2">
            <label className="block text-[14px] text-ink mb-2 font-semibold">
              Keahlian yang Dibutuhkan <span className="text-[#da1e28]">*</span>
            </label>
            <p className="text-[12px] text-ink-muted mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Semakin detail keahlian yang Anda isi, semakin akurat kandidat yang direkomendasikan sistem AI kami. Pisahkan dengan koma.
            </p>
            <input
              className={inputClass("requirementsText")}
              value={form.requirementsText}
              onChange={(e) => setForm((p) => ({ ...p, requirementsText: e.target.value }))}
              placeholder="Contoh: React.js, TypeScript, REST API, Git, Agile/Scrum"
            />
            {errors.requirementsText && <p className="text-[12px] text-[#da1e28] mt-1">{errors.requirementsText}</p>}
          </div>

          <div className="md:col-span-2 flex items-center justify-between border-t border-hairline pt-6">
            <p className="text-[12px] text-ink-muted">
              <span className="text-[#da1e28]">*</span> Kolom yang wajib diisi sebelum lowongan dapat dipublikasikan.
            </p>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-6"
            >
              {editingId ? (
                <Save className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {editingId ? "Simpan Perubahan" : "Publikasikan Lowongan"}
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
            Semua Lowongan Aktif
          </p>
          <span className="text-[14px] text-ink-muted">{jobs.length} lowongan</span>
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
                <div className="space-y-2">
                  <p className="text-[12px] font-semibold uppercase text-ink-muted">Keahlian yang Dibutuhkan</p>
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
              Belum ada lowongan yang dipasang.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
