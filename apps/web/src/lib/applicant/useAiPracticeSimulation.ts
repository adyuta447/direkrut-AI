import { useState, useEffect, useRef } from "react";
import { useTimer } from "../shared/useTimer";
import { AI_PRACTICE_QUESTIONS } from "./aiPracticeQuestions";

export interface PracticeMessage {
  role: "ai" | "user";
  text: string;
}

export function useAiPracticeSimulation() {
  const [phase, setPhase] = useState<"lobby" | "call" | "done">("lobby");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [messages, setMessages] = useState<PracticeMessage[]>([]);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const [callRunning, setCallRunning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timer = useTimer(callRunning);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping, chatOpen]);

  const startCall = () => {
    setPhase("call");
    setCallRunning(true);
    setTimeout(() => {
      const q = AI_PRACTICE_QUESTIONS[0];
      setMessages([{ role: "ai", text: q }]);
      setCurrentCaption(q);
      setAiSpeaking(true);
      setTimeout(() => setAiSpeaking(false), 3500);
    }, 1200);
  };

  const sendAnswer = () => {
    if (!input.trim() || aiTyping) return;
    const answer = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    setAiTyping(true);
    setCurrentCaption("");

    setTimeout(() => {
      if (currentQ < AI_PRACTICE_QUESTIONS.length - 1) {
        const next = currentQ + 1;
        const nextQ = AI_PRACTICE_QUESTIONS[next];
        setMessages((prev) => [...prev, { role: "ai", text: nextQ }]);
        setCurrentQ(next);
        setCurrentCaption(nextQ);
        setAiSpeaking(true);
        setTimeout(() => setAiSpeaking(false), 3000);
      } else {
        const closing =
          "Terima kasih telah menyelesaikan wawancara. Tanggapan Anda telah direkam dan akan ditinjau oleh tim rekrutmen kami. Anda akan menerima kabar lanjutan dalam 2-3 hari kerja. Semoga sukses!";
        setMessages((prev) => [...prev, { role: "ai", text: closing }]);
        setCurrentCaption("Latihan selesai.");
        setCallRunning(false);
        setTimeout(() => setPhase("done"), 2000);
      }
      setAiTyping(false);
    }, 2000);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAnswer();
    }
  };

  const reset = () => {
    setPhase("lobby");
    setCurrentQ(0);
    setMessages([]);
    setCurrentCaption("");
    setInput("");
    setAiTyping(false);
    setAiSpeaking(false);
    setCallRunning(false);
  };

  const progress = Math.min(((currentQ + 1) / AI_PRACTICE_QUESTIONS.length) * 100, 100);

  return {
    phase, micOn, setMicOn, camOn, setCamOn, chatOpen, setChatOpen,
    currentQ, messages, input, setInput, aiTyping, aiSpeaking, currentCaption,
    chatEndRef, timer, startCall, sendAnswer, handleKey, reset, progress,
    setPhase,
  };
}
