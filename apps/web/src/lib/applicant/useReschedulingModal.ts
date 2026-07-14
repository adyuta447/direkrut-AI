import { useState } from "react";
import { getDaysInMonth, getFirstDayOfMonth } from "../shared/calendar";

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30",
];

export const INTERVIEW_TYPES = [
  { id: "technical", label: "Wawancara Teknis", description: "Deep-dive coding & system design", duration: "60 mnt" },
  { id: "cultural", label: "Kecocokan Budaya", description: "Nilai tim & gaya bekerja", duration: "30 mnt" },
  { id: "case", label: "Studi Kasus", description: "Skenario pemecahan masalah", duration: "45 mnt" },
];

export type ReschedulingStep = "type" | "date" | "confirm" | "done";

export function useReschedulingModal() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState<ReschedulingStep>("type");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  const formatted = selectedDate
    ? new Date(currentYear, currentMonth, selectedDate).toLocaleDateString("id-ID", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : "";

  const selectedTypeMeta = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  return {
    currentYear, currentMonth, selectedDate, setSelectedDate, selectedTime, setSelectedTime,
    selectedType, setSelectedType, step, setStep, daysInMonth, firstDay,
    prevMonth, nextMonth, isDisabled, formatted, selectedTypeMeta,
  };
}
