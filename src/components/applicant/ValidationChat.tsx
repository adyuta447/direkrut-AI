import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { validationQuestions } from "../../mockData";

interface ValidationChatProps {
  onComplete: () => void;
}

interface Message {
  role: "ai" | "user";
  content: string;
}

export default function ValidationChat({ onComplete }: ValidationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hello! I've reviewed your CV and I have a few questions to validate your skills and experience. Let's start with the first question:",
    },
    {
      role: "ai",
      content: validationQuestions[0],
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!currentInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setCurrentInput("");
    setIsTyping(true);

    setTimeout(() => {
      if (currentQuestion < validationQuestions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "Thank you for your response. Next question:",
          },
          { role: "ai", content: validationQuestions[nextQuestion] },
        ]);
        setCurrentQuestion(nextQuestion);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "Thank you for completing the validation process! Your responses have been recorded and will be analyzed. You can now view your submission status.",
          },
        ]);
        setTimeout(() => {
          onComplete();
        }, 2000);
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

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm p-6 border-b border-gray-200">
        <p className="text-gray-600">
          Question {Math.min(currentQuestion + 1, validationQuestions.length)}{" "}
          of {validationQuestions.length}
        </p>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${
                ((currentQuestion + 1) / validationQuestions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-3 max-w-2xl ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "ai" ? "bg-blue-100" : "bg-gray-200"
                  }`}
                >
                  {message.role === "ai" ? (
                    <Bot className="w-5 h-5 text-blue-600" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.role === "ai"
                      ? "bg-white shadow-md"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="bg-white shadow-md px-4 py-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto flex space-x-3">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            rows={3}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!currentInput.trim() || isTyping}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
