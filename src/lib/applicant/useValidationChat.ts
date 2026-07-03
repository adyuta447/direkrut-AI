import { useState, useRef, useEffect } from "react";
import { validationQuestionsId } from "./validationQuestions";

export interface ChatMessage {
  role: "ai" | "user";
  content: string;
}

export function useValidationChat(onComplete: () => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "Halo! Saya telah meninjau CV Anda dan saya memiliki beberapa pertanyaan awal untuk memvalidasi keahlian Anda. Mari kita mulai:",
    },
    { role: "ai", content: validationQuestionsId[0] },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!currentInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setCurrentInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);

    setTimeout(() => {
      if (currentQuestion < validationQuestionsId.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Terima kasih. Pertanyaan selanjutnya:" },
          { role: "ai", content: validationQuestionsId[nextQuestion] },
        ]);
        setCurrentQuestion(nextQuestion);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "Terima kasih telah menyelesaikan proses validasi! Jawaban Anda telah kami rekam dan akan dianalisis secara mendalam oleh sistem. Anda sekarang bisa melihat status lamaran Anda.",
          },
        ]);
        setTimeout(onComplete, 3000);
      }
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const progress = ((currentQuestion + 1) / validationQuestionsId.length) * 100;
  const hasMoreQuestions = currentQuestion < validationQuestionsId.length - 1;

  return {
    messages, currentInput, setCurrentInput, currentQuestion, isTyping,
    messagesEndRef, textareaRef, autoResize, handleSend, handleKeyPress,
    progress, hasMoreQuestions, totalQuestions: validationQuestionsId.length,
  };
}
