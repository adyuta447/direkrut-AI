import { ChevronLeft, ChevronRight } from "lucide-react";
import { Job } from "@/lib/types";
import { JobListItem } from "../../molecules/jobs/JobListItem";

interface JobListProps {
  jobs: Job[];
  selectedJob: string | null;
  activeJobId: string | undefined;
  onSelect: (id: string) => void;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function JobList({
  jobs,
  selectedJob,
  activeJobId,
  onSelect,
  page,
  pageCount,
  onPageChange,
}: JobListProps) {
  return (
    <div className="w-full lg:w-2/5 lg:shrink-0 space-y-3">
      {jobs.map((job) => {
        const isActive = selectedJob === job.id || (!selectedJob && activeJobId === job.id);
        return (
          <JobListItem
            key={job.id}
            job={job}
            isActive={isActive}
            onSelect={() => onSelect(job.id)}
          />
        );
      })}

      {pageCount > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Halaman sebelumnya"
            className="flex items-center justify-center w-11 h-11 rounded-full border border-hairline text-ink hover:border-primary hover:text-primary transition-none disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <span className="text-[13px] text-ink-muted">
            Halaman <span className="text-ink font-medium">{page}</span> dari {pageCount}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
            aria-label="Halaman berikutnya"
            className="flex items-center justify-center w-11 h-11 rounded-full border border-hairline text-ink hover:border-primary hover:text-primary transition-none disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}
