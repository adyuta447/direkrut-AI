"use client";

import { useJobManagement } from "../../../lib/hrd/useJobManagement";
import { JobStatsRow } from "../../../components/molecules/hrd/JobStatsRow";
import { JobFormPanel } from "../../../components/organisms/hrd/JobFormPanel";
import { JobListPanel } from "../../../components/organisms/hrd/JobListPanel";

export default function JobManagementPage() {
  const jm = useJobManagement();

  const stats = [
    { label: "Total Lowongan", value: jm.jobs.length },
    { label: "Departemen", value: jm.totalDepartments },
    { label: "Terakhir Dipasang", value: jm.jobs[0]?.posted || "—" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase tracking-widest">Manajemen</p>
        <h2 className="text-[32px] font-bold text-ink tracking-[-0.5px]">Manajemen Lowongan</h2>
        <p className="text-[14px] text-ink-muted mt-2">
          Tambah atau perbarui lowongan pekerjaan yang tampil di portal karir dan beranda.
        </p>
      </div>

      <JobStatsRow stats={stats} />

      <JobFormPanel
        form={jm.form}
        errors={jm.errors}
        editingId={jm.editingId}
        message={jm.message}
        onFieldChange={jm.setField}
        onCancelEdit={jm.cancelEdit}
        onSubmit={jm.handleSubmit}
      />

      <JobListPanel jobs={jm.jobs} onEdit={jm.handleEdit} />
    </div>
  );
}
