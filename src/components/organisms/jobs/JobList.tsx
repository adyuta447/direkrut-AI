import { Job } from "../../../types";
import { JobListItem } from "../../molecules/jobs/JobListItem";

interface JobListProps {
  jobs: Job[];
  selectedJob: string | null;
  activeJobId: string | undefined;
  onSelect: (id: string) => void;
}

export function JobList({ jobs, selectedJob, activeJobId, onSelect }: JobListProps) {
  return (
    <div className="flex-1 w-full lg:max-w-md space-y-4">
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
    </div>
  );
}
