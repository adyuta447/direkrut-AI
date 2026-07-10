import { RefObject } from "react";
import { Sparkles } from "lucide-react";
import { ChatMessage } from "../../../lib/hrd/useHrdChatAssistant";
import { HrdChatMessageBubble } from "../../molecules/hrd/HrdChatMessageBubble";

interface HrdChatMessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  currentUserName?: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function HrdChatMessageList({ messages, isTyping, currentUserName, messagesEndRef }: HrdChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-36 pt-20 w-full">
      <div className="max-w-3xl mx-auto w-full px-6 flex flex-col gap-8">
        {messages.map((msg) => (
          <HrdChatMessageBubble key={msg.id} message={msg} currentUserName={currentUserName} />
        ))}

        {isTyping && (
          <div className="flex gap-6 animate-in fade-in w-full">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-ink font-semibold mb-1 text-[14px]">Direkrut AI</div>
              <div className="flex items-center gap-1.5 h-6">
                <div className="w-2 h-2 bg-ink-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-ink-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-ink-muted rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
