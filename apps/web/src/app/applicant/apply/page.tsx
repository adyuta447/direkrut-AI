"use client";

import { useRouter } from "next/navigation";
import { FileText, ArrowRight } from "lucide-react";
import { useApplyForm } from "../../../lib/applicant/useApplyForm";
import { JobSelectPanel } from "../../../components/molecules/applicant/JobSelectPanel";
import { SkillsInput } from "../../../components/molecules/applicant/SkillsInput";
import { CvUploadZone } from "../../../components/molecules/applicant/CvUploadZone";

export default function ApplyPage() {
  const router = useRouter();
  const form = useApplyForm(() => router.push("/applicant/validation"));

  return (
    <div className="min-h-full px-6 py-10 md:px-12 lg:px-16 xl:px-24 font-sans bg-surface-1">
      <div className="max-w-[1584px] mx-auto w-full">
        <div className="mb-10 lg:mb-16">
          <h1 className="text-[42px] font-light tracking-[-0.5px] text-ink mb-4">Kirim Lamaran</h1>
          <p className="text-[16px] text-ink max-w-2xl leading-[1.5]">
            Silakan isi formulir di bawah ini untuk melamar pada posisi yang Anda inginkan.
            Pastikan dokumen Anda telah diformat dengan benar sebelum mengirimkan.
          </p>
        </div>

        <form onSubmit={form.handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <JobSelectPanel
            jobs={form.jobs}
            selectedJob={form.selectedJob}
            onSelectJob={form.setSelectedJob}
            selectedJobData={form.selectedJobData}
          />

          <div className="lg:col-span-5 flex flex-col gap-8">
            <SkillsInput
              skillInput={form.skillInput}
              onSkillInputChange={form.setSkillInput}
              skills={form.skills}
              onAddSkill={form.addSkill}
              onRemoveSkill={form.removeSkill}
              skillError={form.skillError}
            />
            <CvUploadZone
              cvFile={form.cvFile}
              isDragging={form.isDragging}
              onDragOver={() => form.setIsDragging(true)}
              onDragLeave={() => form.setIsDragging(false)}
              onDrop={form.handleDrop}
              onFileChange={form.handleFileChange}
            />

            <button
              type="submit"
              disabled={!form.selectedJob || !form.cvFile}
              className="flex items-center justify-center gap-2 btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              <span>Lanjut ke Evaluasi Awal AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
