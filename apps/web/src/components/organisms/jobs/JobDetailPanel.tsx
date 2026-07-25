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
  applicationStatus?: string;
}

export function JobDetailPanel({ job, applyHref, className, applicationStatus }: JobDetailPanelProps) {
  return (
    <div
      className={cn(
        "hidden lg:flex flex-1 w-full border border-hairline rounded-3xl overflow-hidden bg-canvas sticky top-24 h-[calc(100vh-8rem)] flex-col",
        className
      )}
    >
      <JobDetailHeader job={job} applyHref={applyHref} applicationStatus={applicationStatus} />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h3 className="text-[20px] font-semibold mb-4 text-ink">Deskripsi Pekerjaan</h3>
          <p className="text-[16px] leading-[1.5] text-ink whitespace-pre-wrap">{job.description}</p>
        </div>

        {job.keyResponsibilities && (
          <div className="mb-8">
            <h3 className="text-[20px] font-semibold mb-4 text-ink">Tanggung Jawab Utama</h3>
            <p className="text-[16px] leading-[1.5] text-ink whitespace-pre-wrap">{job.keyResponsibilities}</p>
          </div>
        )}

        <JobRequirements requirements={job.requirements} />
        
        {((job.requiredSkills && job.requiredSkills.length > 0) || (job.preferredSkills && job.preferredSkills.length > 0)) && (
          <div className="mb-8">
            <h3 className="text-[20px] font-semibold mb-4 text-ink">Keahlian (Skills)</h3>
            
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="mb-4">
                <p className="text-[14px] font-medium text-ink-muted mb-2">Wajib Dimiliki (Required):</p>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="text-[14px] rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {job.preferredSkills && job.preferredSkills.length > 0 && (
              <div>
                <p className="text-[14px] font-medium text-ink-muted mb-2">Nilai Plus (Preferred):</p>
                <div className="flex flex-wrap gap-2">
                  {job.preferredSkills.map((skill, idx) => (
                    <span key={idx} className="text-[14px] rounded-full bg-surface-1 border border-hairline px-3 py-1 text-ink-muted">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(job.minExperienceYears! > 0 || job.educationRequirement) && (
          <div className="mb-8">
            <h3 className="text-[20px] font-semibold mb-4 text-ink">Syarat Spesifik</h3>
            <ul className="space-y-3">
              {job.minExperienceYears! > 0 && (
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-ink">Pengalaman Minimal</p>
                    <p className="text-[14px] text-ink-muted">{job.minExperienceYears} Tahun</p>
                  </div>
                </li>
              )}
              {job.educationRequirement && (
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-ink">Pendidikan Minimal</p>
                    <p className="text-[14px] text-ink-muted">{job.educationRequirement}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}

        {job.detailedQualifications && job.detailedQualifications.length > 0 && (
          <JobQualifications qualifications={job.detailedQualifications} />
        )}
        <JobInterviewQuestions questions={job.questions} />
      </div>
    </div>
  );
}
