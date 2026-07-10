"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../../context/AppContext";
import { StatusEmptyState } from "../../../components/molecules/applicant/StatusEmptyState";
import { AiInterviewCtaBanner } from "../../../components/organisms/applicant/AiInterviewCtaBanner";
import { ApplicationCard } from "../../../components/organisms/applicant/ApplicationCard";
import { ReschedulingModal } from "../../../components/organisms/applicant/ReschedulingModal";

export default function StatusPage() {
  const router = useRouter();
  const { currentUser, applications } = useApp();
  const [schedulingOpen, setSchedulingOpen] = useState(false);

  const userApplications = applications.filter((app) => app.applicantId === currentUser?.id);
  const hasInterviewStatus = userApplications.some((app) => app.status === "interview");

  return (
    <div className="min-h-full px-6 py-10 md:px-12 lg:px-16 xl:px-24 font-sans bg-canvas">
      {schedulingOpen && <ReschedulingModal onClose={() => setSchedulingOpen(false)} />}

      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-10 lg:mb-16">
          <h1 className="text-[42px] font-light tracking-[-0.5px] text-ink mb-4">Status Lamaran</h1>
          <p className="text-[16px] text-ink-muted max-w-xl leading-relaxed">
            Lacak dan kelola progres lamaran Anda. Tindakan yang perlu dilakukan
            akan muncul di sini apabila dibutuhkan.
          </p>
        </div>

        {userApplications.length === 0 ? (
          <StatusEmptyState />
        ) : (
          <div className="flex flex-col gap-8">
            {hasInterviewStatus && (
              <AiInterviewCtaBanner
                onStartSession={() => router.push("/applicant/status/ai-interview")}
                onSchedule={() => setSchedulingOpen(true)}
              />
            )}

            <div className="grid grid-cols-1 gap-6">
              {userApplications.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
