import { Job } from "../../../types";
import { JobListItem } from "../../molecules/hrd/JobListItem";

interface JobListPanelProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
}

export function JobListPanel({ jobs, onEdit }: JobListPanelProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[18px] font-normal text-ink">Semua Lowongan Aktif</p>
        <span className="text-[14px] text-ink-muted">{jobs.length} lowongan</span>
      </div>
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobListItem key={job.id} job={job} onEdit={onEdit} />
        ))}
        {jobs.length === 0 && (
          <p className="text-[14px] text-ink-muted text-center py-8">Belum ada lowongan yang dipasang.</p>
        )}
      </div>
    </div>
  );
}
