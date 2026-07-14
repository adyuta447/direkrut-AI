"use client";

import { useRouter } from "next/navigation";
import { useScheduling, timeSlots } from "../../../lib/applicant/useScheduling";
import { SchedulingSuccessScreen } from "../../../components/molecules/applicant/SchedulingSuccessScreen";
import { DatePicker } from "../../../components/molecules/applicant/DatePicker";
import { TimeSlotPicker } from "../../../components/molecules/applicant/TimeSlotPicker";
import { ScheduleSummaryPanel } from "../../../components/molecules/applicant/ScheduleSummaryPanel";
import { StartNowPanel } from "../../../components/molecules/applicant/StartNowPanel";

export default function SchedulingPage() {
  const router = useRouter();
  const s = useScheduling();
  const goToPractice = () => router.push("/applicant/ai-practice");

  if (s.isScheduled) {
    return <SchedulingSuccessScreen onStartNow={goToPractice} />;
  }

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-12 font-sans flex flex-col max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-[32px] font-bold text-ink tracking-[-0.5px] mb-2">Jadwal Wawancara AI</h2>
        <p className="text-[16px] text-ink-muted leading-[1.5]">
          Pilih waktu luang Anda untuk melakukan sesi wawancara asinkron. Harap pastikan jadwal yang Anda pilih berada dalam rentang waktu seleksi yang kami sediakan.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-canvas border border-hairline p-6">
          <DatePicker dates={s.availableDates} selectedDate={s.selectedDate} onSelect={s.setSelectedDate} />
          <TimeSlotPicker
            timeSlots={timeSlots}
            selectedDate={s.selectedDate}
            selectedTime={s.selectedTime}
            onSelect={s.setSelectedTime}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ScheduleSummaryPanel
            selectedDate={s.selectedDate}
            selectedTime={s.selectedTime}
            availableDates={s.availableDates}
            onSchedule={s.handleSchedule}
          />
          <StartNowPanel onStartNow={goToPractice} />
        </div>
      </div>
    </div>
  );
}
