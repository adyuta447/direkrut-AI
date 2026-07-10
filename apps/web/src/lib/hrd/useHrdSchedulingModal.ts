"use client";

import { useState } from "react";
import { getDaysInMonth, getFirstDayOfMonth } from "../shared/calendar";

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];

export const INTERVIEW_TYPES = [
  { id: "hr", label: "HR Interview", description: "Culture fit & behavioral", duration: "30 min" },
  { id: "technical", label: "Technical Interview", description: "Skills & system design", duration: "60 min" },
  { id: "case", label: "Case Study", description: "Problem-solving scenario", duration: "45 min" },
  { id: "panel", label: "Panel Interview", description: "Multi-stakeholder session", duration: "60 min" },
];

export type HrdSchedulingStep = "type" | "date" | "details" | "done";

export function useHrdSchedulingModal() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [interviewers, setInterviewers] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<HrdSchedulingStep>("type");

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
    const d = new Date(currentYear, currentMonth, day);
    return d <= today || d.getDay() === 0 || d.getDay() === 6;
  };

  const formattedDate = selectedDate
    ? new Date(currentYear, currentMonth, selectedDate).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : "";

  const selectedTypeMeta = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  return {
    currentYear, currentMonth, selectedDate, setSelectedDate, selectedTime, setSelectedTime,
    selectedType, setSelectedType, interviewers, setInterviewers, notes, setNotes,
    step, setStep, daysInMonth, firstDay, prevMonth, nextMonth, isDisabled, formattedDate, selectedTypeMeta,
  };
}
