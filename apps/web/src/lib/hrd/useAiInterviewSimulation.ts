"use client";

import { useState, useRef, useEffect } from "react";
import { Application } from "../../types";
import { generateQuestions, candidateResponses, getTime } from "./interviewSimulation";

export interface InterviewMessage {
  role: "ai" | "user";
  content: string;
  timestamp: string;
}

export function useAiInterviewSimulation(candidate: Application) {
  const questions = generateQuestions(candidate.jobTitle);
  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      role: "ai",
      content: `Hello ${candidate.applicantName}! I'm the DirekrutAI Interviewer. This is your first-round interview for the ${candidate.jobTitle} position. Let's get started — please answer each question naturally and thoroughly. Ready?`,
      timestamp: getTime(),
    },
    { role: "ai", content: questions[0], timestamp: getTime() },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const simulateNextAnswer = () => {
    if (currentQuestion >= questions.length || isTyping) return;

    const answer = candidateResponses[currentQuestion] || "I believe I have the right skills for this role and am eager to contribute to the team.";

    setMessages((prev) => [...prev, { role: "user", content: answer, timestamp: getTime() }]);
    setIsTyping(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        const next = currentQuestion + 1;
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Thank you for sharing that. Moving on:", timestamp: getTime() },
          { role: "ai", content: questions[next], timestamp: getTime() },
        ]);
        setCurrentQuestion(next);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: `Thank you, ${candidate.applicantName}! That concludes the AI interview session. Your responses will be reviewed by the hiring team within 2-3 business days. We'll be in touch soon. Good luck!`,
            timestamp: getTime(),
          },
        ]);
        setIsComplete(true);
        setIsAutoRunning(false);
      }
      setIsTyping(false);
    }, 2000);
  };

  const handleAutoRun = () => setIsAutoRunning(true);

  useEffect(() => {
    if (isAutoRunning && !isTyping && !isComplete) {
      const timer = setTimeout(simulateNextAnswer, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoRunning, isTyping, currentQuestion, isComplete]);

  const progress = isComplete ? 100 : ((currentQuestion + 1) / questions.length) * 100;

  return { questions, messages, currentQuestion, isTyping, isComplete, isAutoRunning, messagesEndRef, simulateNextAnswer, handleAutoRun, progress };
}
