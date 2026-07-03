import { Job } from "../../../types";
import { JobDetailHeader } from "../../molecules/jobs/JobDetailHeader";
import { JobRequirements } from "../../molecules/jobs/JobRequirements";
import { JobQualifications } from "../../molecules/jobs/JobQualifications";
import { JobInterviewQuestions } from "../../molecules/jobs/JobInterviewQuestions";

interface JobDetailPanelProps {
  job: Job;
}

export function JobDetailPanel({ job }: JobDetailPanelProps) {
  return (
    <div className="flex-1 w-full border border-hairline bg-canvas sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
      <JobDetailHeader job={job} />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h3 className="text-[20px] font-normal mb-4 text-ink">Deskripsi Pekerjaan</h3>
          <p className="text-[16px] leading-[1.5] text-ink whitespace-pre-wrap">{job.description}</p>
        </div>

        <JobRequirements requirements={job.requirements} />
        <JobQualifications qualifications={job.detailedQualifications} />
        <JobInterviewQuestions questions={job.questions} />
      </div>
    </div>
  );
}
