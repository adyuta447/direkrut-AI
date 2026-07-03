import { useState } from "react";

export interface ScheduleDate {
  dateObj: Date;
  dayName: string;
  dateNum: number;
  monthName: string;
  isWeekend: boolean;
  id: string;
}

const generateDates = (): ScheduleDate[] => {
  const dates: ScheduleDate[] = [];
  const today = new Date();
  for (let i = 0; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dateObj: d,
      dayName: d.toLocaleDateString("id-ID", { weekday: "short" }),
      dateNum: d.getDate(),
      monthName: d.toLocaleDateString("id-ID", { month: "short" }),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      id: `date-${i}`,
    });
  }
  return dates;
};

export const timeSlots = ["09:00", "10:30", "11:00", "13:00", "14:30", "15:00", "16:30"];

export function useScheduling() {
  const [availableDates] = useState<ScheduleDate[]>(generateDates);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSchedule = () => {
    if (selectedDate && selectedTime) setIsScheduled(true);
  };

  return {
    availableDates, selectedDate, setSelectedDate, selectedTime, setSelectedTime,
    isScheduled, handleSchedule,
  };
}
