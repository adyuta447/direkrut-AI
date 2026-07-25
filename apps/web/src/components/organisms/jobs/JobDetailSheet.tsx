"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Job } from "@/lib/types";
import { JobDetailHeader } from "../../molecules/jobs/JobDetailHeader";
import { JobRequirements } from "../../molecules/jobs/JobRequirements";
import { JobQualifications } from "../../molecules/jobs/JobQualifications";
import { JobInterviewQuestions } from "../../molecules/jobs/JobInterviewQuestions";

interface JobDetailSheetProps {
  job: Job | null;
  onClose: () => void;
  applyHref?: (job: Job) => string;
  applicationStatus?: string;
}

export function JobDetailSheet({ job, onClose, applyHref, applicationStatus }: JobDetailSheetProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const isOpen = job !== null && isMobile;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <button
        type="button"
        aria-label="Tutup detail lowongan"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-fade-in"
      />

      <div className="absolute inset-x-0 bottom-0 top-14 bg-canvas rounded-t-[28px] overflow-hidden flex flex-col animate-fade-up">
        <div className="absolute top-4 right-4 z-10 bg-canvas/80 backdrop-blur rounded-full">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-1 border border-hairline text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <JobDetailHeader job={job} applyHref={applyHref?.(job)} applicationStatus={applicationStatus} />
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h3 className="text-[20px] font-semibold mb-4 text-ink">Deskripsi Pekerjaan</h3>
              <p className="text-[16px] leading-[1.5] text-ink whitespace-pre-wrap">
                {job.description}
              </p>
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
      </div>
    </div>
  );
}
