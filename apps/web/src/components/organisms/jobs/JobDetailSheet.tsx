"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Job } from "../../../types";
import { JobDetailHeader } from "../../molecules/jobs/JobDetailHeader";
import { JobRequirements } from "../../molecules/jobs/JobRequirements";
import { JobQualifications } from "../../molecules/jobs/JobQualifications";
import { JobInterviewQuestions } from "../../molecules/jobs/JobInterviewQuestions";

interface JobDetailSheetProps {
  job: Job | null;
  onClose: () => void;
}

/**
 * Detail lowongan versi mobile: bottom sheet full-screen yang muncul saat
 * kartu lowongan di-tap. Di desktop (lg+) tidak pernah tampil karena detail
 * sudah ada di panel samping.
 */
export function JobDetailSheet({ job, onClose }: JobDetailSheetProps) {
  // Sheet hanya berlaku di bawah breakpoint lg; di desktop, klik lowongan
  // mengisi selectedJob untuk panel samping dan sheet tidak boleh aktif
  // (termasuk kunci scroll body-nya).
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
        <div className="flex items-center justify-between px-5 h-14 border-b border-hairline flex-shrink-0">
          <span className="text-[14px] font-medium text-ink truncate pr-4">{job.title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-1 text-ink flex-shrink-0"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <JobDetailHeader job={job} />
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h3 className="text-[20px] font-normal mb-4 text-ink">Deskripsi Pekerjaan</h3>
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
