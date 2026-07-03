import { RefObject } from "react";
import { TypingDots } from "../../atoms/shared/TypingDots";
import { ChatMessage } from "../../../lib/applicant/useValidationChat";

interface ValidationMessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function ValidationMessageList({ messages, isTyping, messagesEndRef }: ValidationMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, idx) => (
          <div key={idx} className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
            <span className="text-[12px] text-ink-muted mb-1 px-1">
              {message.role === "ai" ? "Sistem AI" : "Kandidat"}
            </span>
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 text-[14px] leading-[1.5] ${
                message.role === "ai" ? "bg-surface-1 border border-hairline text-ink" : "bg-ink text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <span className="text-[12px] text-ink-muted mb-1 px-1">Sistem AI</span>
            <div className="bg-surface-1 border border-hairline px-5 py-4">
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
}
