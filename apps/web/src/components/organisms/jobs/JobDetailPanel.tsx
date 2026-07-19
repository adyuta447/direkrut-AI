import { Job } from "@/lib/types";
import { cn } from "@/lib/utils";
import { JobDetailHeader } from "../../molecules/jobs/JobDetailHeader";
import { JobRequirements } from "../../molecules/jobs/JobRequirements";
import { JobQualifications } from "../../molecules/jobs/JobQualifications";
import { JobInterviewQuestions } from "../../molecules/jobs/JobInterviewQuestions";

interface JobDetailPanelProps {
  job: Job;
  applyHref?: string;
  className?: string;
}

export function JobDetailPanel({ job, applyHref, className }: JobDetailPanelProps) {
  return (
    <div
      className={cn(
        "hidden lg:flex flex-1 w-full border border-hairline rounded-3xl overflow-hidden bg-canvas sticky top-24 h-[calc(100vh-8rem)] flex-col",
        className
      )}
    >
      <JobDetailHeader job={job} applyHref={applyHref} />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h3 className="text-[20px] font-semibold mb-4 text-ink">Deskripsi Pekerjaan</h3>
          <p className="text-[16px] leading-[1.5] text-ink whitespace-pre-wrap">{job.description}</p>
        </div>

        <JobRequirements requirements={job.requirements} />
        <JobQualifications qualifications={job.detailedQualifications} />
        <JobInterviewQuestions questions={job.questions} />
      </div>
    </div>
  );
}
