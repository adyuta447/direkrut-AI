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

            <JobRequirements requirements={job.requirements} />
            <JobQualifications qualifications={job.detailedQualifications} />
            <JobInterviewQuestions questions={job.questions} />
          </div>
        </div>
      </div>
    </div>
  );
}
