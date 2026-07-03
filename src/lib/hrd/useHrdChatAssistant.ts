"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { findCandidateId, getInitialMessageText, processResponse, wrapPlainText } from "./mockChatResponses";

export interface ChatMessage {
  id: string;
  sender: "ai" | "hrd";
  text: ReactNode;
  actions?: { label: string; onClick: () => void }[];
}

const DEFAULT_SUGGESTIONS = [
  "Analisis 3 kandidat teratas berdasarkan skor sistem",
  "Siapa kandidat dengan pengalaman kerja paling senior?",
  "Bandingkan kandidat paling senior vs skor tertinggi",
  "Adakah kandidat fresh graduate dengan inisiatif tinggi?",
  "Tampilkan statistik pelamar untuk posisi ini",
  "Kandidat mana yang sudah menunggu respons paling lama?",
];

export function useHrdChatAssistant() {
  const router = useRouter();
  const { applications, currentUser, jobs } = useApp();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [availableSuggestions, setAvailableSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages on mount or when job changes
  useEffect(() => {
    if (selectedJob) {
      setMessages([{ id: `welcome-${Date.now()}`, sender: "ai", text: getInitialMessageText(currentUser?.name, selectedJob.title) }]);
      setAvailableSuggestions(DEFAULT_SUGGESTIONS);
      setShowSuggestionsPanel(true);
      setInput("");
      setIsTyping(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJobId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleActionClick = (candidateName: string) => {
    const id = findCandidateId(applications, candidateName);
    if (id) router.push(`/hrd/candidates/${id}`);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setAvailableSuggestions((prev) => prev.filter((s) => s !== text));
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "hrd", text: wrapPlainText(text) }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => runResponse(text), 1500);
  };

  const runResponse = (text: string) => {
    const jobTitle = selectedJob?.title || "Posisi";
    const reqs = selectedJob?.requirements || ["Teknis", "Analisis", "Manajemen"];
    const { text: responseText, actions } = processResponse(text, jobTitle, reqs);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "ai",
        text: responseText,
        actions: actions?.map((a) => ({
          label: a.label,
          onClick: () => (a.kind === "candidate" ? handleActionClick(a.value) : handleSend(a.value)),
        })),
      },
    ]);
    setIsTyping(false);
  };

  return {
    jobs, selectedJobId, setSelectedJobId, selectedJob, currentUser,
    input, setInput, isTyping, messages,
    availableSuggestions, showSuggestionsPanel, setShowSuggestionsPanel,
    messagesEndRef, handleSend,
  };
}
